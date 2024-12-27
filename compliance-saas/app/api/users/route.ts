import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('No session or user email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user with role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        role: true,
        organization: true,
      },
    });

    if (!currentUser) {
      console.error('Current user not found:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!currentUser.role || currentUser.role.name !== 'Admin') {
      console.error('User not admin:', currentUser.email);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all users from the same organization
    const users = await prisma.user.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      include: {
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the expected format
    const transformedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role?.name || 'User',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        role: true,
        organization: true,
      },
    });

    if (!currentUser || !currentUser.role || currentUser.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, role: roleName } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Get or create role
    const role = await prisma.role.findFirst({
      where: {
        name: roleName || 'User',
        organizationId: currentUser.organizationId,
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        roleId: role.id,
        organizationId: currentUser.organizationId,
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role?.name || 'User',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        role: true,
        organization: true,
      },
    });

    if (!currentUser || !currentUser.role || currentUser.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user exists and belongs to same organization
    const userToDelete = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deleting the last admin
    const adminCount = await prisma.user.count({
      where: {
        organizationId: currentUser.organizationId,
        role: {
          name: 'Admin',
        },
      },
    });

    if (adminCount === 1 && userToDelete.id === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete the last admin user' },
        { status: 400 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        role: true,
        organization: true,
      },
    });

    if (!currentUser || !currentUser.role || currentUser.role.name !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { email, role: roleName } = body;

    // Check if user exists and belongs to same organization
    const userToUpdate = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get role
    const role = await prisma.role.findFirst({
      where: {
        name: roleName,
        organizationId: currentUser.organizationId,
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Prevent removing the last admin
    if (userToUpdate.roleId === role.id && role.name !== 'Admin') {
      const adminCount = await prisma.user.count({
        where: {
          organizationId: currentUser.organizationId,
          role: {
            name: 'Admin',
          },
        },
      });

      if (adminCount === 1 && userToUpdate.id === currentUser.id) {
        return NextResponse.json(
          { error: 'Cannot remove admin role from the last admin user' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role?.name || 'User',
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error in PATCH /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
