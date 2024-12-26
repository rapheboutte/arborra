export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  regulationId: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable';
  dueDate: string;
  lastAssessed: string;
  evidenceRequired: boolean;
  documentationRequired: string[];
  risks: {
    description: string;
    impact: 'high' | 'medium' | 'low';
    likelihood: 'high' | 'medium' | 'low';
  }[];
}

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  lastUpdated: string;
  requirements: ComplianceRequirement[];
  authority: string;
  jurisdiction: string[];
  scope: string[];
}

export interface ComplianceAudit {
  id: string;
  timestamp: string;
  userId: string;
  action: 'assessment' | 'update' | 'review' | 'approval';
  requirementId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  evidence?: {
    documentId: string;
    type: string;
    url: string;
  }[];
}

export interface ComplianceValidationResult {
  isValid: boolean;
  score: number;
  requirements: {
    requirementId: string;
    status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable';
    validationDetails: {
      isValid: boolean;
      message: string;
      evidenceVerified: boolean;
    };
  }[];
  lastValidated: string;
  validatedBy: string;
}
