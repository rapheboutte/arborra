import { DocumentAnalysisResult, DocumentValidation, FrameworkRequirements } from "@/types/compliance";

const GDPR_REQUIREMENTS: FrameworkRequirements = {
  id: 'gdpr',
  name: 'GDPR',
  sections: [
    {
      id: 'data_processing',
      title: 'Data Processing Principles',
      requirements: [
        'Lawfulness, fairness, and transparency',
        'Purpose limitation',
        'Data minimization',
        'Accuracy',
        'Storage limitation',
        'Integrity and confidentiality',
      ],
      keywords: ['process', 'personal data', 'consent', 'legitimate interest', 'data subject']
    },
    {
      id: 'data_subject_rights',
      title: 'Data Subject Rights',
      requirements: [
        'Right to access',
        'Right to rectification',
        'Right to erasure',
        'Right to restrict processing',
        'Right to data portability',
        'Right to object',
      ],
      keywords: ['rights', 'access', 'rectification', 'erasure', 'restrict', 'portability', 'object']
    },
    {
      id: 'security',
      title: 'Security Measures',
      requirements: [
        'Technical measures',
        'Organizational measures',
        'Data protection by design',
        'Data protection by default',
      ],
      keywords: ['security', 'measures', 'technical', 'organizational', 'protection']
    }
  ]
};

const HIPAA_REQUIREMENTS: FrameworkRequirements = {
  id: 'hipaa',
  name: 'HIPAA',
  sections: [
    {
      id: 'privacy_rule',
      title: 'Privacy Rule Requirements',
      requirements: [
        'Notice of privacy practices',
        'Patient rights',
        'Use and disclosure of PHI',
        'Minimum necessary standard',
      ],
      keywords: ['privacy', 'PHI', 'protected health information', 'patient', 'disclosure']
    },
    {
      id: 'security_rule',
      title: 'Security Rule Requirements',
      requirements: [
        'Administrative safeguards',
        'Physical safeguards',
        'Technical safeguards',
        'Risk analysis',
        'Access controls',
      ],
      keywords: ['security', 'safeguards', 'administrative', 'physical', 'technical', 'risk']
    },
    {
      id: 'breach_notification',
      title: 'Breach Notification',
      requirements: [
        'Breach identification',
        'Notification timeline',
        'Notification content',
        'Documentation',
      ],
      keywords: ['breach', 'notification', 'incident', 'report']
    }
  ]
};

const SOX_REQUIREMENTS: FrameworkRequirements = {
  id: 'sox',
  name: 'SOX',
  sections: [
    {
      id: 'internal_controls',
      title: 'Internal Controls',
      requirements: [
        'Control environment',
        'Risk assessment',
        'Control activities',
        'Information and communication',
        'Monitoring',
      ],
      keywords: ['control', 'risk', 'assessment', 'monitoring', 'audit']
    },
    {
      id: 'financial_reporting',
      title: 'Financial Reporting',
      requirements: [
        'Accuracy of financial statements',
        'Disclosure controls',
        'Documentation of procedures',
        'Review process',
      ],
      keywords: ['financial', 'reporting', 'disclosure', 'statements', 'procedures']
    }
  ]
};

const ISO27001_REQUIREMENTS: FrameworkRequirements = {
  id: 'iso27001',
  name: 'ISO 27001',
  sections: [
    {
      id: 'isms',
      title: 'Information Security Management System',
      requirements: [
        'Security policy',
        'Risk assessment methodology',
        'Risk treatment',
        'Statement of applicability',
      ],
      keywords: ['ISMS', 'security', 'policy', 'risk', 'management']
    },
    {
      id: 'controls',
      title: 'Security Controls',
      requirements: [
        'Access control',
        'Cryptography',
        'Physical security',
        'Operations security',
        'Communications security',
      ],
      keywords: ['control', 'access', 'security', 'cryptography', 'physical']
    },
    {
      id: 'operations',
      title: 'Operations and Monitoring',
      requirements: [
        'Operational procedures',
        'Change management',
        'Capacity management',
        'Backup',
        'Logging and monitoring',
      ],
      keywords: ['operations', 'procedures', 'change', 'backup', 'monitoring']
    }
  ]
};

const FRAMEWORK_REQUIREMENTS = {
  gdpr: GDPR_REQUIREMENTS,
  hipaa: HIPAA_REQUIREMENTS,
  sox: SOX_REQUIREMENTS,
  iso27001: ISO27001_REQUIREMENTS,
};

function detectFramework(content: string): string {
  const frameworkScores = Object.entries(FRAMEWORK_REQUIREMENTS).map(([id, framework]) => {
    const score = framework.sections.reduce((total, section) => {
      const keywordMatches = section.keywords.filter(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      return total + keywordMatches;
    }, 0);
    return { id, score };
  });

  const bestMatch = frameworkScores.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return bestMatch.score > 0 ? bestMatch.id : 'gdpr'; // Default to GDPR if no clear match
}

function validateRequirements(content: string, framework: FrameworkRequirements): DocumentValidation[] {
  const validations: DocumentValidation[] = [];
  const contentLower = content.toLowerCase();

  framework.sections.forEach(section => {
    section.requirements.forEach((requirement, index) => {
      const keywordMatches = section.keywords.filter(keyword => 
        contentLower.includes(keyword.toLowerCase())
      );

      const validation: DocumentValidation = {
        id: `${section.id}_${index}`,
        requirement,
        description: `Checking for ${requirement} in ${section.title}`,
        status: keywordMatches.length >= 2 ? 'passed' : 'failed',
        severity: 'high',
        details: keywordMatches.length >= 2 
          ? `Found relevant content: ${keywordMatches.join(', ')}`
          : `Missing key elements for ${requirement}`
      };

      validations.push(validation);
    });
  });

  return validations;
}

function calculateComplianceScore(validations: DocumentValidation[]): number {
  const total = validations.length;
  const passed = validations.filter(v => v.status === 'passed').length;
  return Math.round((passed / total) * 100);
}

export async function analyzeDocument(content: string, fileName: string): Promise<DocumentAnalysisResult> {
  const framework = detectFramework(content);
  const frameworkReqs = FRAMEWORK_REQUIREMENTS[framework as keyof typeof FRAMEWORK_REQUIREMENTS];
  const validations = validateRequirements(content, frameworkReqs);
  const complianceScore = calculateComplianceScore(validations);

  const passedValidations = validations.filter(v => v.status === 'passed');
  const failedValidations = validations.filter(v => v.status === 'failed');

  // Set status based on compliance score
  let status: 'current' | 'needs_review' | 'expired';
  if (complianceScore >= 80) {
    status = 'current';
  } else if (complianceScore >= 60) {
    status = 'needs_review';
  } else {
    status = 'expired';
  }

  // Set next review date (90 days from now)
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + 90);

  return {
    framework,
    status,
    complianceScore,
    nextReviewDate: nextReviewDate.toISOString().split('T')[0],
    validationResults: {
      passed: passedValidations,
      failed: failedValidations,
    },
    metadata: {
      documentType: fileName.split('.').pop() || '',
      version: '1.0',
      lastModified: new Date().toISOString(),
      author: 'System',
    },
  };
}
