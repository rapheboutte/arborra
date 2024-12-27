import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { taskIds, action } = body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { error: 'Task IDs must be provided as an array' },
        { status: 400 }
      );
    }

    if (!['complete', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get all tasks that belong to the organization
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
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

    if (tasks.length !== taskIds.length) {
      return NextResponse.json(
        { error: 'Some tasks were not found or you do not have access to them' },
        { status: 404 }
      );
    }

    if (action === 'complete') {
      // Complete tasks
      await prisma.$transaction(async (tx) => {
        // Update all tasks to completed
        await tx.task.updateMany({
          where: { id: { in: taskIds } },
          data: { status: 'COMPLETED' },
        });

        // Get all affected requirements
        const requirementIds = [...new Set(tasks.map(t => t.requirementId))];

        for (const requirementId of requirementIds) {
          // Check if all tasks for this requirement are completed
          const requirementTasks = await tx.task.findMany({
            where: { requirementId },
          });

          const allTasksCompleted = requirementTasks.every(
            t => taskIds.includes(t.id) || t.status === 'COMPLETED'
          );

          if (allTasksCompleted) {
            // Update requirement status
            await tx.requirement.update({
              where: { id: requirementId },
              data: { status: 'COMPLETED' },
            });

            // Get requirement details for the alert
            const requirement = tasks.find(t => t.requirementId === requirementId)?.requirement;
            if (requirement) {
              // Create completion alert
              await tx.alert.create({
                data: {
                  type: 'SUCCESS',
                  message: `All tasks completed for requirement: ${requirement.title}`,
                  framework: requirement.framework.name,
                  organizationId: user.organization.id,
                },
              });

              // Update compliance score
              const frameworkRequirements = await tx.requirement.findMany({
                where: { frameworkId: requirement.frameworkId },
              });

              const completedRequirements = frameworkRequirements.filter(
                req => req.status === 'COMPLETED'
              ).length;

              const newScore = Math.round(
                (completedRequirements / frameworkRequirements.length) * 100
              );

              await tx.complianceScore.create({
                data: {
                  frameworkId: requirement.frameworkId,
                  organizationId: user.organization.id,
                  score: newScore,
                },
              });
            }
          }
        }
      });

      return NextResponse.json({ success: true, action: 'completed' });
    } else {
      // Delete tasks
      await prisma.task.deleteMany({
        where: { id: { in: taskIds } },
      });

      return NextResponse.json({ success: true, action: 'deleted' });
    }
  } catch (error) {
    console.error('Error in bulk task operation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
