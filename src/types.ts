export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type CaseStatus = 'TRIAGE' | 'ANALYSIS' | 'DISSEMINATED' | 'CLOSED' | 'PRIORITY';

export type DisseminationAgency = 'CAD' | 'MAS' | 'ICA' | 'AGC' | 'FOREIGN_FIU';

export type FeedbackOutcome = 'CONVICTION' | 'ASSET_SEIZURE' | 'ONGOING' | 'NO_OFFENCE_FOUND' | 'DISMISSED';

export interface RiskFactor {
  id: string;
  category: string;
  factor: string;
  score: number | 'N/A';
  notes?: string;
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
  riskProfile: Scorecard;
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
}

export interface IntelligenceCase {
  id: string;
  title: string;
  subject: PersonProfile;
  reports: SuspiciousTransactionReport[];
  status: CaseStatus;
  analyst?: string;
  priority: boolean;
  disseminations: DisseminationRecord[];
  createdAt: string;
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
  successRate: number; // For feedback loop visualization
}
