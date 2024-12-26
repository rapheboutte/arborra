export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_started';
  dueDate?: string;
  lastUpdated: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  category: string;
  requirements: ComplianceRequirement[];
  overallScore: number;
  lastAssessment: string;
}

export interface ComplianceUpdate {
  id: string;
  frameworkId: string;
  type: 'requirement_change' | 'deadline_update' | 'new_regulation';
  description: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
}

export interface ComplianceStats {
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  inProgressCount: number;
  upcomingDeadlines: number;
  criticalIssues: number;
}

export interface ComplianceData {
  timestamp: string;
  authority: string;
  actionType: string;
  details: {
    citation: string;
    violationType: string;
    status: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
  };
}

export interface DocumentAnalysisResult {
  framework: string;
  status: 'current' | 'needs_review' | 'expired';
  complianceScore: number;
  nextReviewDate: string;
  validationResults: {
    passed: DocumentValidation[];
    failed: DocumentValidation[];
  };
  metadata: {
    documentType: string;
    version: string;
    lastModified: string;
    author: string;
  };
}

export interface DocumentValidation {
  id: string;
  requirement: string;
  description: string;
  status: 'passed' | 'failed';
  severity: 'high' | 'medium' | 'low';
  details?: string;
}

export interface FrameworkRequirements {
  id: string;
  name: string;
  sections: {
    id: string;
    title: string;
    requirements: string[];
    keywords: string[];
  }[];
}

export interface DocumentAnalysisRequest {
  content: string;
  fileName: string;
  framework?: string;
  metadata?: {
    author?: string;
    version?: string;
    documentType?: string;
  };
}
