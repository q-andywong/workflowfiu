export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type CaseStatus = 'TRIAGE' | 'PENDING_APPROVAL' | 'ANALYSIS' | 'DISSEMINATED' | 'CLOSED' | 'PRIORITY' | 'HIBERNATED' | 'DISMISSED' | 'PENDING_DELETION' | 'STAGING';

export type DisseminationAgency = 'CAD' | 'MAS' | 'ICA' | 'AGC' | 'FOREIGN_FIU';

export type FeedbackOutcome = 'CONVICTION' | 'ASSET_SEIZURE' | 'ONGOING' | 'NO_OFFENCE_FOUND' | 'DISMISSED';

export interface RiskFactor {
  id: string;
  category: string;
  factor: string;
  score: number | 'N/A';
  notes?: string;
  mitigation?: {
    category: string;
    notes: string;
    savedAt: string;
  };
}

export interface Scorecard {
  totalScore: number;
  status: string; // e.g., 'RED BRAVO HIGH', 'AMBER 4'
  factors: RiskFactor[];
}

export interface PersonProfile {
  id: string;
  name: string;
  nationality: string;
  occupation?: string;
  type?: 'INDIVIDUAL' | 'COMPANY';
  status?: 'Open' | 'Closed' | 'Under Review';
  summary?: string;
  actionRequired?: string;
  ubos?: string[];
  shareholders?: string[];
  directors?: string[];
  companiesAssociated?: Array<{ name: string; role: string }>;
  involvedProjects?: Array<{ name: string; value: string; location: string; status: string }>;
  previousCases?: Array<{ id: string; status: string; score: number }>;
  linkedSTRs?: Array<{ id: string; date: string; amount: string; type: string }>;
  riskProfile: Scorecard;
  crimeTypologies?: string[];
  // New AML/FIU Particulars
  dob?: string;
  idNumber?: string;
  gender?: 'Male' | 'Female' | 'Unknown';
  countryOfBirth?: string;
  taxResidency?: string;
  aliases?: string[];
  fullAddress?: string;
  screeningStatus?: {
    isPEP: boolean;
    isPEPRelative: boolean;
    adverseNewsForeign: boolean;
    adverseNewsLocal: boolean;
    sanctionsMatch: boolean;
  };
  investigationFindings?: string;
}

export interface SuspiciousTransactionReport {
  id: string;
  date: string;
  amount: number;
  currency: string;
  institution: string;
  type: 'STR' | 'CTR' | 'CMR';
  riskScore: number;
  status: 'PENDING' | 'TRIAGED' | 'LINKED';
  crimeTypes?: string[];
  suspicionCategories?: string[];
  narrative?: string;
}

export interface IntelligenceCase {
  id: string;
  title: string;
  subject: PersonProfile;
  reports: SuspiciousTransactionReport[];
  status: CaseStatus;
  analyst?: string;
  priority: boolean;
  rejectionReason?: string;
  disseminations: DisseminationRecord[];
  attachments: Attachment[];
  pendingModification?: CaseModificationRequest;
  createdAt: string;
  closedAt?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CaseModificationRequest {
  id: string;
  requestedBy: string;
  requestedAt: string;
  type: 'STATUS_CHANGE' | 'DATA_CORRECTION' | 'DELETION';
  details: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    reason: string;
    originalOwner?: string;
    targetCase?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DisseminationRecord {
  id: string;
  agency: DisseminationAgency;
  date: string;
  intelligenceSummary: string;
  feedback?: FeedbackLoop;
}

export interface FeedbackLoop {
  receivedDate: string;
  outcome: FeedbackOutcome;
  notes: string;
  officialRef?: string;
}

export interface DashboardStats {
  totalIncoming: number;
  activeAnalyses: number;
  disseminatedTotal: number;
  priorityAlerts: number;
  successRate: number;
  // New Investigator Metrics
  triagesInQueue: number;
  pendingApproval: number;
  casesClosed: number;
  avgResolutionTime: number; // in days
}
