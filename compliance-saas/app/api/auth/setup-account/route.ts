import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Find and validate invitation
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { organization: true },
    });

    if (!invitation) {
      return new NextResponse('Invalid invitation token', { status: 400 });
    }

    if (invitation.expires < new Date()) {
      return new NextResponse('Invitation has expired', { status: 400 });
    }

    if (invitation.used) {
      return new NextResponse('Invitation has already been used', { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser) {
      return new NextResponse('User already exists', { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user account
    const user = await prisma.user.create({
      data: {
        email: invitation.email,
        name: invitation.name,
        password: hashedPassword,
        role: invitation.role,
        organizationId: invitation.organizationId,
      },
    });

    // Mark invitation as used
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { used: true },
    });

    return NextResponse.json({
      message: 'Account setup completed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organization: invitation.organization.name,
      },
    });
  } catch (error) {
    console.error('Error setting up account:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
