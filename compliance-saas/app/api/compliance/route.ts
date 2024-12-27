import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

const API_ENDPOINTS = {
  GDPR: 'https://www.federalregister.gov/api/v1/articles',
  HIPAA: 'https://ecfr.federalregister.gov/v1/title/45/part/160',
  CCPA: 'https://www.federalregister.gov/api/v1/articles',
  SOX: 'https://ecfr.federalregister.gov/v1/title/15/part/240',
  OSHA: 'https://api.dol.gov/V1/OSHA/Inspections',
};

const API_PARAMS = {
  GDPR: {
    conditions: {
      term: 'GDPR',
      agencies: ['health-and-human-services-department']
    },
    order: 'newest',
    per_page: 20
  },
  HIPAA: {
    part: '160',
    section: '103'
  },
  CCPA: {
    conditions: {
      term: 'CCPA',
      agencies: ['health-and-human-services-department']
    },
    order: 'newest',
    per_page: 20
  },
  SOX: {
    part: '240',
    section: '10A'
  },
  OSHA: {
    KEY: '' // Will be filled from settings
  }
};

async function fetchExternalUpdates(framework: string, apiKey: string) {
  try {
    let response;
    switch (framework) {
      case 'HIPAA':
        try {
          // Fetch HIPAA regulations from eCFR
          const hipaaResponse = await axios.get(API_ENDPOINTS.HIPAA);
          const hipaaData = hipaaResponse.data;
          
          // Also fetch recent HIPAA updates from Federal Register
          const hipaaUpdatesResponse = await axios.get('https://www.federalregister.gov/api/v1/articles', {
            params: {
              conditions: {
                term: 'HIPAA',
                agencies: ['health-and-human-services-department']
              },
              order: 'newest',
              per_page: 5
            }
          });
          
          return {
            regulations: hipaaData,
            recentUpdates: hipaaUpdatesResponse.data.results || []
          };
        } catch (error) {
          console.error('Error fetching HIPAA data:', error);
          return {
            regulations: null,
            recentUpdates: []
          };
        }

      case 'OSHA':
        try {
          // Fetch OSHA inspections data
          const oshaResponse = await axios.get(API_ENDPOINTS.OSHA, {
            params: { ...API_PARAMS.OSHA, KEY: apiKey }
          });
          
          // Also fetch recent OSHA updates from Federal Register
          const oshaUpdatesResponse = await axios.get('https://www.federalregister.gov/api/v1/articles', {
            params: {
              conditions: {
                term: 'OSHA',
                agencies: ['occupational-safety-and-health-administration']
              },
              order: 'newest',
              per_page: 5
            }
          });
          
          return {
            inspections: oshaResponse.data || [],
            recentUpdates: oshaUpdatesResponse.data.results || []
          };
        } catch (error) {
          console.error('Error fetching OSHA data:', error);
          return {
            inspections: [],
            recentUpdates: []
          };
        }

      default:
        try {
          // For other frameworks, fetch from Federal Register API
          response = await axios.get(API_ENDPOINTS[framework as keyof typeof API_ENDPOINTS], {
            params: API_PARAMS[framework as keyof typeof API_PARAMS]
          });
          return {
            results: response.data.results || []
          };
        } catch (error) {
          console.error(`Error fetching ${framework} data:`, error);
          return {
            results: []
          };
        }
    }
  } catch (error) {
    console.error(`Error in fetchExternalUpdates for ${framework}:`, error);
    return {
      results: [],
      recentUpdates: [],
      regulations: null,
      inspections: []
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user with organization
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!currentUser?.organizationId) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 404 }
      );
    }

    // Get framework from query params
    const { searchParams } = new URL(request.url);
    const framework = searchParams.get('framework');

    if (!framework) {
      return NextResponse.json(
        { error: 'Framework parameter is required' },
        { status: 400 }
      );
    }

    // Get settings for external API calls
    const settings = await prisma.organizationSettings.findUnique({
      where: { organizationId: currentUser.organizationId },
    });

    // Get framework data from database
    const frameworkData = await prisma.complianceFramework.findUnique({
      where: {
        name_organizationId: {
          name: framework.toUpperCase(),
          organizationId: currentUser.organizationId,
        },
      },
      include: {
        requirements: {
          include: {
            documents: true,
            tasks: {
              include: {
                assignedTo: true,
              },
            },
          },
        },
        documents: {
          include: {
            uploadedBy: true,
            requirements: true,
          },
        },
      },
    });

    // If framework doesn't exist, return empty data
    if (!frameworkData) {
      return NextResponse.json({
        complianceScore: 0,
        status: 'not_configured',
        requirements: [],
        documents: [],
        recentUpdates: [],
      });
    }

    // Calculate compliance score based on requirements
    let complianceScore = 0;
    if (frameworkData.requirements.length > 0) {
      const compliantReqs = frameworkData.requirements.filter(
        req => req.status === 'COMPLIANT'
      ).length;
      complianceScore = Math.round((compliantReqs / frameworkData.requirements.length) * 100);
    }

    // Get external updates if API key is available
    let recentUpdates = [];
    let externalData = null;
    const apiKey = settings?.[`${framework}ApiKey` as keyof typeof settings];
    
    if (apiKey || framework === 'HIPAA') {
      externalData = await fetchExternalUpdates(framework, apiKey || '');
      
      if (externalData) {
        if (framework === 'HIPAA') {
          recentUpdates = externalData.recentUpdates.map(update => ({
            date: update.publication_date,
            type: 'regulation_update',
            title: update.title,
            description: update.abstract || update.title,
            url: update.html_url
          }));
        } else if (framework === 'OSHA') {
          recentUpdates = [
            ...(externalData.recentUpdates || []).map(update => ({
              date: update.publication_date,
              type: 'regulation_update',
              title: update.title,
              description: update.abstract || update.title,
              url: update.html_url
            })),
            ...(externalData.inspections || []).map(inspection => ({
              date: inspection.openDate,
              type: 'inspection',
              title: `Inspection ${inspection.activityNr}`,
              description: `${inspection.estabName} - ${inspection.siteState}`,
              status: inspection.openClosed
            }))
          ];
        } else {
          recentUpdates = (externalData.results || []).map(update => ({
            date: update.publication_date,
            type: 'regulation_update',
            title: update.title,
            description: update.abstract || update.title,
            url: update.html_url
          }));
        }
      }
    }

    return NextResponse.json({
      complianceScore,
      status: frameworkData.enabled ? 'active' : 'inactive',
      requirements: frameworkData.requirements.map(req => ({
        id: req.id,
        title: req.title,
        description: req.description,
        status: req.status,
        priority: req.priority,
        dueDate: req.dueDate,
        documents: req.documents.map(doc => ({
          id: doc.id,
          title: doc.title,
          fileUrl: doc.fileUrl,
          fileType: doc.fileType,
          uploadedBy: doc.uploadedBy.email,
          uploadedAt: doc.createdAt,
        })),
        tasks: req.tasks.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          assignedTo: task.assignedTo?.email,
          dueDate: task.dueDate,
        })),
      })),
      documents: frameworkData.documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
        uploadedBy: doc.uploadedBy.email,
        uploadedAt: doc.createdAt,
        requirements: doc.requirements.map(req => ({
          id: req.id,
          title: req.title,
        })),
      })),
      recentUpdates,
      externalData: framework === 'HIPAA' ? externalData?.regulations : null,
    });
  } catch (error) {
    console.error('Error in compliance API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user with organization
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!currentUser || !currentUser.organizationId) {
      return NextResponse.json({ error: 'User not found or not in organization' }, { status: 404 });
    }

    const body = await request.json();
    const { framework, requirement, document } = body;

    if (!framework) {
      return NextResponse.json({ error: 'Framework is required' }, { status: 400 });
    }

    // Get or create framework
    let frameworkRecord = await prisma.complianceFramework.findUnique({
      where: {
        name_organizationId: {
          name: framework.toUpperCase(),
          organizationId: currentUser.organizationId,
        },
      },
    });

    if (!frameworkRecord) {
      frameworkRecord = await prisma.complianceFramework.create({
        data: {
          name: framework.toUpperCase(),
          organization: {
            connect: { id: currentUser.organizationId },
          },
          enabled: true,
        },
      });
    }

    // Handle requirement creation
    if (requirement) {
      const { title, description, priority, dueDate } = requirement;
      
      const newRequirement = await prisma.complianceRequirement.create({
        data: {
          title,
          description,
          priority: priority || 'MEDIUM',
          dueDate: dueDate ? new Date(dueDate) : null,
          framework: {
            connect: { id: frameworkRecord.id },
          },
        },
      });

      return NextResponse.json(newRequirement);
    }

    // Handle document upload
    if (document) {
      const { title, description, fileUrl, fileType, requirementIds } = document;
      
      const newDocument = await prisma.complianceDocument.create({
        data: {
          title,
          description,
          fileUrl,
          fileType,
          framework: {
            connect: { id: frameworkRecord.id },
          },
          uploadedBy: {
            connect: { id: currentUser.id },
          },
          requirements: {
            connect: requirementIds?.map(id => ({ id })) || [],
          },
        },
        include: {
          requirements: true,
          uploadedBy: true,
        },
      });

      return NextResponse.json(newDocument);
    }

    return NextResponse.json(frameworkRecord);
  } catch (error) {
    console.error('Error in compliance API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user with organization
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!currentUser || !currentUser.organizationId) {
      return NextResponse.json({ error: 'User not found or not in organization' }, { status: 404 });
    }

    const body = await request.json();
    const { framework, requirement, document } = body;

    if (!framework) {
      return NextResponse.json({ error: 'Framework is required' }, { status: 400 });
    }

    // Update requirement
    if (requirement) {
      const { id, status, priority, dueDate } = requirement;
      
      const updatedRequirement = await prisma.complianceRequirement.update({
        where: { id },
        data: {
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      });

      return NextResponse.json(updatedRequirement);
    }

    // Update document
    if (document) {
      const { id, title, description, requirementIds } = document;
      
      const updatedDocument = await prisma.complianceDocument.update({
        where: { id },
        data: {
          title,
          description,
          requirements: {
            set: requirementIds?.map(id => ({ id })) || [],
          },
        },
        include: {
          requirements: true,
          uploadedBy: true,
        },
      });

      return NextResponse.json(updatedDocument);
    }

    // Update framework
    const frameworkRecord = await prisma.complianceFramework.update({
      where: {
        name_organizationId: {
          name: framework.toUpperCase(),
          organizationId: currentUser.organizationId,
        },
      },
      data: {
        enabled: body.enabled,
      },
    });

    return NextResponse.json(frameworkRecord);
  } catch (error) {
    console.error('Error in compliance API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
