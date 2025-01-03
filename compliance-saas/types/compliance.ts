export interface ComplianceRequirement {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLIANT' | 'NON_COMPLIANT' | 'REQUIRES_REVIEW';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  documents?: ComplianceDocument[];
  tasks?: ComplianceTask[];
  lastUpdated: string;
}

export interface ComplianceDocument {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  requirements?: ComplianceRequirement[];
  tasks?: ComplianceTask[];
}

export interface ComplianceTask {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface ComplianceUpdate {
  date: string;
  type: 'requirement' | 'enforcement' | 'deadline' | 'other';
  description: string;
}

export interface ComplianceData {
  complianceScore: number;
  status: 'active' | 'inactive';
  requirements: ComplianceRequirement[];
  documents: ComplianceDocument[];
  recentUpdates: ComplianceUpdate[];
}

export interface ComplianceOverview {
  [framework: string]: ComplianceData;
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

export interface ComplianceHistoryEntry {
  orgId: string;
  framework: string;
  type: 'overview' | 'full' | 'requirement_update';
  data: ComplianceData | ComplianceOverview;
  timestamp: Date;
  requirementId?: string;
  status?: string;
  notes?: string;
}

export interface ComplianceOverview {
  framework: string;
  complianceScore: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
  totalRequirements: number;
  completedRequirements: number;
  criticalFindings: number;
  upcomingDeadlines: {
    requirement: string;
    dueDate: string;
  }[];
  recentUpdates: ComplianceUpdate[];
}

export interface ComplianceTrend {
  date: string;
  score: number;
  requirements: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

export interface ComplianceAnalytics {
  trends: ComplianceTrend[];
  riskAreas: {
    category: string;
    score: number;
    requirements: string[];
  }[];
  improvements: {
    requirement: string;
    impact: number;
    effort: 'low' | 'medium' | 'high';
    recommendation: string;
  }[];
}
