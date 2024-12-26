export const mockGDPRData = {
  gdpr: {
    complianceScore: 77,
    status: 'partially_compliant',
    requirements: [
      {
        id: 'gdpr-1',
        title: 'Data Protection Impact Assessment',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2025-01-02',
        description: 'Conduct a comprehensive Data Protection Impact Assessment (DPIA) for high-risk processing activities',
        actionItems: [
          'Identify high-risk processing activities',
          'Document data flows and processing purposes',
          'Assess necessity and proportionality',
          'Evaluate risks to individual rights',
          'Implement risk mitigation measures'
        ]
      },
      {
        id: 'gdpr-2',
        title: 'Data Processing Records Update',
        status: 'not_started',
        priority: 'medium',
        dueDate: '2025-02-15',
        description: 'Update and maintain comprehensive records of all data processing activities',
        actionItems: [
          'Review current processing activities',
          'Document legal basis for each process',
          'Update data retention periods',
          'Map data flows and transfers',
          'Document security measures'
        ]
      },
      {
        id: 'gdpr-3',
        title: 'Privacy Notice Review',
        status: 'compliant',
        priority: 'medium',
        dueDate: '2024-12-31',
        description: 'Annual review and update of privacy notices and consent mechanisms',
        actionItems: [
          'Review current privacy notices',
          'Update for new processing activities',
          'Verify consent mechanisms',
          'Translate for international users',
          'Implement updates on all platforms'
        ]
      }
    ],
    recentUpdates: [
      {
        date: '2024-12-26',
        type: 'enforcement',
        description: 'Recent GDPR update'
      },
      {
        date: '2024-12-20',
        type: 'guidance',
        description: 'New guidelines on AI and automated decision-making'
      }
    ]
  },
  hipaa: {
    complianceScore: 96,
    status: 'compliant',
    requirements: [
      {
        id: 'hipaa-1',
        title: 'Security Risk Assessment',
        status: 'compliant',
        priority: 'high',
        dueDate: '2025-03-01',
        description: 'Conduct annual security risk assessment of PHI systems',
        actionItems: [
          'Inventory PHI systems',
          'Identify potential threats',
          'Assess current safeguards',
          'Document findings',
          'Create action plan'
        ]
      }
    ],
    recentUpdates: [
      {
        date: '2024-12-15',
        type: 'update',
        description: 'Updated security standards for telehealth services'
      }
    ]
  },
  ccpa: {
    complianceScore: 96,
    status: 'compliant',
    requirements: [
      {
        id: 'ccpa-1',
        title: 'Consumer Rights Implementation',
        status: 'compliant',
        priority: 'high',
        dueDate: '2025-01-15',
        description: 'Implement and test consumer rights request system',
        actionItems: [
          'Set up request portal',
          'Document verification process',
          'Train support team',
          'Test request handling',
          'Monitor response times'
        ]
      }
    ],
    recentUpdates: [
      {
        date: '2024-12-10',
        type: 'update',
        description: 'New requirements for automated decision-making disclosures'
      }
    ]
  },
  sox: {
    complianceScore: 80,
    status: 'compliant',
    requirements: [
      {
        id: 'sox-1',
        title: 'Internal Controls Review',
        status: 'compliant',
        priority: 'medium',
        dueDate: '2025-02-28',
        description: 'Annual review of internal controls and documentation',
        actionItems: [
          'Review control documentation',
          'Test control effectiveness',
          'Update procedures',
          'Train staff',
          'Document results'
        ]
      }
    ],
    recentUpdates: [
      {
        date: '2024-12-05',
        type: 'guidance',
        description: 'Updated guidance on cybersecurity controls'
      }
    ]
  },
  osha: {
    complianceScore: 95,
    status: 'compliant',
    requirements: [
      {
        id: 'osha-1',
        title: 'Workplace Safety Assessment',
        status: 'compliant',
        priority: 'high',
        dueDate: '2025-01-30',
        description: 'Conduct comprehensive workplace safety assessment',
        actionItems: [
          'Inspect facilities',
          'Review safety procedures',
          'Update emergency plans',
          'Conduct training',
          'Document findings'
        ]
      }
    ],
    recentUpdates: [
      {
        date: '2024-12-01',
        type: 'update',
        description: 'New workplace safety guidelines for hybrid work environments'
      }
    ]
  }
};

export const mockComplianceData = {
  gdpr: mockGDPRData.gdpr,
  hipaa: mockGDPRData.hipaa,
  ccpa: mockGDPRData.ccpa,
  sox: mockGDPRData.sox,
  osha: mockGDPRData.osha,
};
