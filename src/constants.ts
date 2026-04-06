import { IntelligenceCase, PersonProfile } from './types';

export const TOBIAS_BLACK_PROFILE: PersonProfile = {
  id: 'P-001',
  name: 'Tobias Black',
  nationality: 'British',
  occupation: 'Financial Consultant',
  riskProfile: {
    totalScore: 50,
    status: 'AMBER 4',
    factors: [
      { id: 'f1', category: 'Primary Area of Concern', factor: 'Domestic', score: 10 },
      { id: 'f2', category: 'Sector', factor: 'Securities, Funds & Jersey Private Funds', score: 12 },
      { id: 'f3', category: 'Typology Focus', factor: 'Tax - Domestic', score: 8 },
      { id: 'f4', category: 'Asset Recovery Opportunity', factor: 'High', score: 20 }
    ]
  }
};

export const MICHAEL_GREENE_PROFILE: PersonProfile = {
  id: 'P-002',
  name: 'Michael Greene',
  nationality: 'American',
  occupation: 'Corporate Director',
  riskProfile: {
    totalScore: 132,
    status: 'RED BRAVO HIGH',
    factors: [
      { id: 'f5', category: 'Primary Area of Concern', factor: 'Foreign Predicate Offences', score: 18 },
      { id: 'f6', category: 'Primary Area of Concern', factor: 'International/Cross Border', score: 16 },
      { id: 'f7', category: 'Sector', factor: 'Legal Persons & Arrangements - Non-Jersey Company', score: 18 },
      { id: 'f8', category: 'Jurisdiction/Location', factor: 'Proximity Country Risk', score: 16 },
      { id: 'f9', category: 'Typology Focus', factor: 'Organised Money Laundering', score: 14 }
    ]
  }
};

export const LI_WEI_PROFILE: PersonProfile = {
  id: 'P-003',
  name: 'Li Wei',
  nationality: 'Singaporean',
  occupation: 'IT Consultant',
  riskProfile: {
    totalScore: 85,
    status: 'AMBER 5',
    factors: [
      { id: 'f10', category: 'Primary Area of Concern', factor: 'Cybercrime', score: 15 },
      { id: 'f11', category: 'Typology Focus', factor: 'Ransomware Proceeds', score: 12 }
    ]
  }
};

export const AHMED_MALIK_PROFILE: PersonProfile = {
  id: 'P-004',
  name: 'Ahmed Malik',
  nationality: 'Unknown',
  occupation: 'Unregistered NGO Director',
  riskProfile: {
    totalScore: 190,
    status: 'RED CRITICAL',
    factors: [
      { id: 'f12', category: 'Primary Area of Concern', factor: 'Terrorism Financing', score: 25 },
      { id: 'f13', category: 'Jurisdiction/Location', factor: 'High Risk Conflict Zone', score: 20 }
    ]
  }
};

export const SARAH_JENKINS_PROFILE: PersonProfile = {
  id: 'P-005',
  name: 'Sarah Jenkins',
  nationality: 'Australian',
  occupation: 'Procurement Officer',
  riskProfile: {
    totalScore: 65,
    status: 'AMBER 3',
    factors: [
      { id: 'f14', category: 'Primary Area of Concern', factor: 'Fraud / Cheating', score: 14 }
    ]
  }
};

export const IGOR_DIMITROV_PROFILE: PersonProfile = {
  id: 'P-006',
  name: 'Igor Dimitrov',
  nationality: 'Russian',
  occupation: 'Shipping Magnate',
  riskProfile: {
    totalScore: 160,
    status: 'RED BRAVO HIGH',
    factors: [
      { id: 'f15', category: 'Primary Area of Concern', factor: 'Sanctions Evasion', score: 22 },
      { id: 'f16', category: 'Sector', factor: 'Maritime & Freight', score: 15 }
    ]
  }
};

export const MOCK_CASES: IntelligenceCase[] = [
  {
    id: 'CASE-2026-001',
    title: 'Operation Highland - Cross-border Laundering',
    subject: MICHAEL_GREENE_PROFILE,
    reports: [],
    status: 'PRIORITY',
    analyst: 'Sgt. Wong',
    priority: true,
    disseminations: [],
    createdAt: '2026-03-15T09:00:00Z'
  },
  {
    id: 'CASE-2026-002',
    title: 'Project Emerald - Domestic Tax Evasion',
    subject: TOBIAS_BLACK_PROFILE,
    reports: [],
    status: 'ANALYSIS',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [
      {
        id: 'D-001',
        agency: 'MAS',
        date: '2026-03-20',
        intelligenceSummary: 'Suspicious fund layering detected in domestic shell companies.',
        feedback: {
          receivedDate: '2026-04-01',
          outcome: 'ONGOING',
          notes: 'Regulatory audit initiated on subject entities.',
          officialRef: 'MAS/ENT/2026/45'
        }
      }
    ],
    createdAt: '2026-03-25T14:30:00Z'
  },
  {
    id: 'ENT-2026-003',
    title: 'Syndicate Alpha - Cybercrime Extortion',
    subject: LI_WEI_PROFILE,
    reports: [],
    status: 'TRIAGE',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2026-04-02T10:15:00Z'
  },
  {
    id: 'CASE-2026-004',
    title: 'Network Nexus - Terrorism Financing Link',
    subject: AHMED_MALIK_PROFILE,
    reports: [],
    status: 'PRIORITY',
    analyst: 'Sgt. Wong',
    priority: true,
    disseminations: [],
    createdAt: '2026-04-05T08:45:00Z'
  },
  {
    id: 'CASE-2026-005',
    title: 'Operation Mirage - Corporate Fraud / Cheating',
    subject: SARAH_JENKINS_PROFILE,
    reports: [],
    status: 'ANALYSIS',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2026-03-28T16:20:00Z'
  },
  {
    id: 'ENT-2026-006',
    title: 'Project Shadow - Maritime Sanctions Evasion',
    subject: IGOR_DIMITROV_PROFILE,
    reports: [],
    status: 'TRIAGE',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2026-04-04T11:00:00Z'
  }
];
