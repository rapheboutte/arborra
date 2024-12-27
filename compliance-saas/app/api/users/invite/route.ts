import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import { sendInvitationEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and has admin role
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the current user with their organization
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { organization: true },
    });

    if (!currentUser || currentUser.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, email, role } = await req.json();

    // Validate input
    if (!name || !email || !role) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('User already exists', { status: 400 });
    }

    // Check for existing invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        used: false,
        expires: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      return new NextResponse('User already has a pending invitation', { status: 400 });
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

    // Create invitation record
    const invitation = await prisma.invitation.create({
      data: {
        email,
        name,
        role,
        token,
        expires,
        invitedBy: session.user.email!,
        organizationId: currentUser.organizationId,
      },
    });

    // Send invitation email
    await sendInvitationEmail(
      email,
      token,
      session.user.name || session.user.email!,
      currentUser.organization.name
    );

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        expires: invitation.expires,
      },
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
