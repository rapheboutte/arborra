import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user with their organization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true }
    });

    if (!user?.organizationId) {
      return NextResponse.json(
        { error: 'User not associated with an organization' },
        { status: 404 }
      );
    }

    // Get all compliance frameworks for the user's organization
    const frameworks = await prisma.complianceFramework.findMany({
      where: {
        organizationId: user.organizationId
      },
      include: {
        requirements: true,
        tasks: {
          include: {
            assignedTo: true
          }
        }
      }
    }).catch(error => {
      console.error('Error fetching frameworks:', error);
      throw new Error('Failed to fetch frameworks');
    });

    // If no frameworks exist, return empty data structure
    if (!frameworks || frameworks.length === 0) {
      return NextResponse.json({
        scores: [],
        tasks: [],
        alerts: []
      });
    }

    // Get alerts for the organization
    const alerts = await prisma.alert.findMany({
      where: {
        OR: [
          { framework: { organizationId: user.organizationId } },
          { relatedTask: { organizationId: user.organizationId } }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        framework: true,
        relatedTask: true
      }
    }).catch(error => {
      console.error('Error fetching alerts:', error);
      return []; // Return empty array instead of throwing
    });

    // Process the data
    const dashboardData = {
      scores: frameworks.map(framework => ({
        id: framework.id,
        framework: framework.name,
        score: framework.requirements?.length > 0 
          ? Math.round((framework.requirements.filter(req => req.status === 'COMPLETED').length / framework.requirements.length) * 100)
          : 0,
        trend: 'stable',
        lastUpdated: framework.updatedAt.toISOString(),
        threshold: framework.requiredScore,
        historicalData: []
      })),

      tasks: frameworks.flatMap(framework => 
        (framework.tasks || []).map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate?.toISOString(),
          priority: task.priority,
          status: task.status,
          framework: framework.name,
          assignedTo: task.assignedTo?.name || task.assignedTo?.email || 'Unassigned'
        }))
      ),

      alerts: alerts.map(alert => ({
        id: alert.id,
        message: alert.message,
        type: alert.type,
        timestamp: alert.createdAt.toISOString(),
        framework: alert.framework?.name || 'General',
        relatedTaskId: alert.relatedTaskId
      }))
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        scores: [],
        tasks: [],
        alerts: []
      },
      { status: 500 }
    );
  }
}
