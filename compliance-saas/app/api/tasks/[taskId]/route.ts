import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const { taskId } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        organizationId: user.organization.id,
      },
      include: {
        requirement: {
          include: {
            framework: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        requirement: {
          include: {
            framework: true,
          },
        },
      },
    });

    // If task is completed, check if all tasks for the requirement are completed
    if (status === 'COMPLETED') {
      const requirementTasks = await prisma.task.findMany({
        where: { requirementId: task.requirementId },
      });

      const allTasksCompleted = requirementTasks.every(
        t => t.id === taskId ? status === 'COMPLETED' : t.status === 'COMPLETED'
      );

      if (allTasksCompleted) {
        // Update requirement status
        await prisma.requirement.update({
          where: { id: task.requirementId },
          data: { status: 'COMPLETED' },
        });

        // Create completion alert
        await prisma.alert.create({
          data: {
            type: 'SUCCESS',
            message: `All tasks completed for requirement: ${task.requirement.title}`,
            framework: task.requirement.framework.name,
            organizationId: user.organization.id,
          },
        });

        // Update compliance score
        const frameworkRequirements = await prisma.requirement.findMany({
          where: { frameworkId: task.requirement.frameworkId },
        });

        const completedRequirements = frameworkRequirements.filter(
          req => req.status === 'COMPLETED'
        ).length;

        const newScore = Math.round(
          (completedRequirements / frameworkRequirements.length) * 100
        );

        await prisma.complianceScore.create({
          data: {
            frameworkId: task.requirement.frameworkId,
            organizationId: user.organization.id,
            score: newScore,
          },
        });
      }
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const { taskId } = params;

    // Delete task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        organizationId: user.organization.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
