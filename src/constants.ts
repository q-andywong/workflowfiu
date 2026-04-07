import { IntelligenceCase, PersonProfile } from './types';

export const TOBIAS_BLACK_PROFILE: PersonProfile = {
  id: 'P-001',
  name: 'Tobias Black',
  nationality: 'British',
  occupation: 'Financial Consultant',
  type: 'INDIVIDUAL',
  status: 'Open',
  summary: 'Tobias Black is a registered financial consultant operating a network of complex international trusts. Primary concerns revolve around high-velocity outbound transfers immediately following structured domestic injections.',
  actionRequired: 'Verify sources of wealth for Q3 structured deposits.',
  companiesAssociated: [
    { name: 'Blackthorn Advisory Ltd', role: 'Director' },
    { name: 'Apex Holdings LLC', role: 'Shareholder' },
    { name: 'Malapanagudi Water User Cooperative', role: 'Consultant' }
  ],
  previousCases: [
    { id: 'CASE-2023-112', status: 'Closed', score: 45 },
    { id: 'CASE-2024-089', status: 'Closed', score: 60 },
    { id: 'CASE-2025-012', status: 'Under Review', score: 75 },
    { id: 'CASE-2025-045', status: 'Closed', score: 40 },
    { id: 'CASE-2025-099', status: 'Closed', score: 55 }
  ],
  linkedSTRs: [
    { id: 'STR-993-8822', date: '2025-10-14', amount: '$450,000', type: 'STR' },
    { id: 'STR-993-8845', date: '2025-11-02', amount: '$1.2M', type: 'STR' },
    { id: 'CTR-882-1110', date: '2025-12-15', amount: '$55,000', type: 'CTR' },
    { id: 'STR-994-0021', date: '2026-01-10', amount: '$890,000', type: 'STR' },
    { id: 'STR-994-0556', date: '2026-02-28', amount: '$2.4M', type: 'STR' }
  ],
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
  type: 'COMPANY',
  status: 'Open',
  summary: 'Malapanagudi Water User Cooperative Society is a cooperative society in India, a jurisdiction with moderate procurement risk. Primary concern is its potentially less formal governance structure requiring closer review.',
  actionRequired: 'Integrity Due Diligence checklist must be completed for this entity.',
  ubos: ['Governing Board Members'],
  shareholders: ['Member-owned'],
  directors: ['Society President', 'Society Secretary'],
  involvedProjects: [
    { name: 'National Rural Roads Program - Phase 3', value: '$250M', location: 'India - 2021', status: 'Open' },
    { name: 'Agricultural Supply Chain Modernization', value: '$150M', location: 'India - 2021', status: 'Closed' }
  ],
  previousCases: [
    { id: 'CASE-2021-001', status: 'Open', score: 30 },
    { id: 'CASE-2022-442', status: 'Closed', score: 45 },
    { id: 'CASE-2023-883', status: 'Closed', score: 20 },
    { id: 'CASE-2024-112', status: 'Closed', score: 50 },
    { id: 'CASE-2024-889', status: 'Under Review', score: 65 }
  ],
  linkedSTRs: [
    { id: 'STR-555-1122', date: '2021-04-12', amount: '$5.5M', type: 'STR' },
    { id: 'STR-666-4444', date: '2022-08-30', amount: '$12.0M', type: 'STR' },
    { id: 'CMR-777-1111', date: '2023-01-15', amount: '$800,000', type: 'CMR' },
    { id: 'STR-888-2222', date: '2024-05-18', amount: '$4.2M', type: 'STR' },
    { id: 'STR-999-3333', date: '2025-11-22', amount: '$1.1M', type: 'STR' }
  ],
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
    subject: IGOR_DIMITROV_PROFILE,
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
    subject: LI_WEI_PROFILE,
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
    id: 'TASK-2026-003',
    title: 'Syndicate Alpha - Cybercrime Extortion',
    subject: TOBIAS_BLACK_PROFILE,
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
    id: 'TASK-2026-006',
    title: 'Project Shadow - Maritime Sanctions Evasion',
    subject: MICHAEL_GREENE_PROFILE,
    reports: [],
    status: 'TRIAGE',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2026-04-04T11:00:00Z'
  }
];
