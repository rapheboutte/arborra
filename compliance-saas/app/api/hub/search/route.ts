import { NextResponse } from 'next/server';

// Temporary mock data while API integration is being set up
const mockGDPRData = {
  status: 'success',
  data: {
    framework: 'GDPR',
    lastUpdated: new Date().toISOString(),
    complianceScore: 75,
    requirements: [
      {
        id: 'gdpr-1',
        title: 'Data Protection Officer',
        status: 'compliant',
        description: 'Appointment of a Data Protection Officer',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        id: 'gdpr-2',
        title: 'Data Processing Register',
        status: 'in_progress',
        description: 'Maintain records of processing activities',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        id: 'gdpr-3',
        title: 'Privacy Impact Assessment',
        status: 'non_compliant',
        description: 'Conduct Data Protection Impact Assessments',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      }
    ],
    recentUpdates: [
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'requirement_change',
        description: 'Updated requirements for cross-border data transfers'
      },
      {
        date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'deadline_update',
        description: 'New deadline for annual privacy impact assessments'
      }
    ],
    actionItems: [
      'Complete Data Protection Impact Assessment',
      'Update data processing register',
      'Review third-party data processing agreements'
    ]
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'demo';

    // For now, return mock data while we set up the API integrations
    return NextResponse.json(mockGDPRData);
    
  } catch (error) {
    console.error('Failed to fetch compliance data:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch compliance data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
