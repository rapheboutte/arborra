import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get framework from query params
    const searchParams = request.nextUrl.searchParams;
    const framework = searchParams.get('framework');

    if (!framework) {
      console.log('Missing framework parameter');
      return NextResponse.json({ error: 'Framework parameter is required' }, { status: 400 });
    }

    console.log(`Fetching compliance data for framework: ${framework}`);

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user) {
      console.log(`User not found: ${session.user.email}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.organization) {
      console.log(`Organization not found for user: ${session.user.email}`);
      return NextResponse.json({ error: 'User organization not found' }, { status: 404 });
    }

    // Get compliance framework data
    const complianceFramework = await prisma.complianceFramework.findFirst({
      where: {
        name: framework,
        organizationId: user.organization.id,
      },
      include: {
        requirements: {
          include: {
            tasks: true,
            documents: true,
          },
        },
        documents: {
          include: {
            uploadedBy: true,
          },
        },
      },
    });

    if (!complianceFramework) {
      console.log(`Framework not found: ${framework}`);
      // Instead of returning 404, return empty data structure
      return NextResponse.json({
        framework: framework,
        description: `${framework} Compliance Framework`,
        complianceScore: 0,
        requirements: [],
        documents: [],
        status: 'NOT_STARTED',
        lastUpdated: new Date(),
      });
    }

    // Calculate compliance score based on requirement status
    const totalRequirements = complianceFramework.requirements.length;
    const completedRequirements = complianceFramework.requirements.filter(
      req => req.status === 'COMPLETED'
    ).length;
    const complianceScore = totalRequirements > 0 
      ? Math.round((completedRequirements / totalRequirements) * 100) 
      : 0;

    console.log(`Successfully fetched compliance data for ${framework}`);

    // Return compliance data
    return NextResponse.json({
      framework: complianceFramework.name,
      description: complianceFramework.description,
      complianceScore,
      requirements: complianceFramework.requirements.map(req => ({
        id: req.id,
        title: req.title,
        description: req.description,
        status: req.status,
        priority: req.priority,
        dueDate: req.dueDate,
        tasks: req.tasks,
        documents: req.documents,
      })),
      documents: complianceFramework.documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
        uploadedBy: doc.uploadedBy.name || doc.uploadedBy.email,
        uploadedAt: doc.createdAt,
      })),
      enabled: complianceFramework.enabled,
      lastUpdated: complianceFramework.updatedAt,
    });

  } catch (error) {
    console.error('Error in compliance API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
