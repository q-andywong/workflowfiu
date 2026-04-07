import { IntelligenceCase, PersonProfile, SuspiciousTransactionReport } from './types';

// Master Data List for STR Risk Factors (from User Screenshots)
export const STR_CRIME_TYPES = {
  'TERRORISM': {
    label: 'Terrorism and Threats to National Security',
    items: [
      { id: 'T_T_NS_IAT', label: 'Illicit Arms Trafficking' },
      { id: 'T_T_NS_KSO', label: 'Known or Suspected terrorist/organisation' },
      { id: 'T_T_NS_TF', label: 'Terrorism-financing' },
      { id: 'T_T_NS_RS', label: 'Terrorism-related sanctions' },
      { id: 'T_T_NS_TB', label: 'Transfer/brokering of strategic goods' }
    ]
  },
  'MONEY_LAUNDERING': {
    label: 'Money Laundering',
    items: [
      { id: 'ML_LE', label: 'Legal Entity' },
      { id: 'ML_NP', label: 'Natural Person' },
      { id: 'ML_SL', label: 'Self-Laundering' },
      { id: 'ML_TPL', label: 'Third Party Laundering' },
      { id: 'ML_FWT', label: 'ML involving fraudulent wire transfer' },
      { id: 'ML_FTD', label: 'ML involving fraudulent trade documents' }
    ]
  },
  'TAX_CRIME': {
    label: 'Tax Crimes and Smuggling',
    items: [
      { id: 'TC_S_DTE', label: 'Domestic Tax Evasion' },
      { id: 'TC_S_FTE', label: 'Foreign Tax Evasion' },
      { id: 'TC_S_TA', label: 'Tax Amnesty' },
      { id: 'TC_S_CEE', label: 'Customs/Excise duties evasion' }
    ]
  },
  'FRAUD': {
    label: 'Fraud / Cheating',
    items: [
      { id: 'F_C_PCF', label: 'Public/Company funds in official capacity' },
      { id: 'F_C_FIF', label: 'Fictitious Invoice Financing' },
      { id: 'F_C_FDF', label: 'Forgery/Fraudulent Documents' },
      { id: 'F_C_IF', label: 'Investment Fraud' },
      { id: 'F_C_WTF', label: 'Wire Transfer Fraud' }
    ]
  }
};

export const STR_SUSPICION_CATEGORIES = {
  'STRUCTURING': {
    label: 'Structuring/Layering of Transactions',
    items: [
      { id: 'S_L_T_A', label: 'Segregating a large transaction into smaller ones' },
      { id: 'S_L_T_B_I', label: 'Transactions with offshore companies' },
      { id: 'S_L_T_B_II', label: 'Entity conducting transaction(s) on behalf of third party/s' },
      { id: 'S_L_T_C', label: 'Unable to determine source of funds' },
      { id: 'S_L_T_F', label: 'Large cash transactions' }
    ]
  },
  'NO_BUSINESS': {
    label: 'Transactions with no apparent business/lawful purpose',
    items: [
      { id: 'T_W_NAB_A_I', label: 'Frequent redemptions and short holding period of investments' },
      { id: 'T_W_NAB_A_II', label: 'Minimal investments with large/frequent transactions' },
      { id: 'T_W_NAB_A_IV', label: 'Frequent/repeated transactions with no apparent purpose' },
      { id: 'T_W_NAB_QFI', label: 'Questionable Financial Instruments' }
    ]
  }
};

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
    totalScore: 50, // Amber - Stay in Triage
    status: 'AMBER 4',
    factors: [
      { id: 'f1', category: 'Primary Area of Concern', factor: 'Domestic', score: 10 },
      { id: 'f2', category: 'Sector', factor: 'Securities, Funds & Jersey Private Funds', score: 12 },
      { id: 'f3', category: 'Typology Focus', factor: 'Tax - Domestic', score: 8 },
      { id: 'f4', category: 'Asset Recovery Opportunity', factor: 'High', score: 20 }
    ]
  },
  crimeTypologies: ['Money Laundering', 'Terrorism Financing'],
  dob: '1978-05-14',
  idNumber: 'UK-PASSPORT-BB99331',
  gender: 'Male',
  countryOfBirth: 'United Kingdom',
  taxResidency: 'UK',
  aliases: ['T.B.', 'Blackthorn Advisor'],
  fullAddress: '12b Blackthorn Grove, Chelsea, London SW3 5UR, UK',
  screeningStatus: {
    isPEP: false,
    isPEPRelative: true,
    adverseNewsForeign: false,
    adverseNewsLocal: false,
    sanctionsMatch: false
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
    { id: 'STR-999-3333', date: '2025-11-22', amount: '$1.1M', type: 'STR' },
    { id: 'CTR-2026-9902', date: '2026-04-03', amount: '$120,000', type: 'CTR' }
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
  },
  crimeTypologies: ['Cybercrime', 'Fraud'],
  dob: '1998-11-20',
  idNumber: 'IN-CORP-442211-MWA',
  gender: 'Unknown',
  countryOfBirth: 'India',
  taxResidency: 'India / Mauritius',
  fullAddress: 'Block 4, Industrial Estate, Bangalore, Karnataka, India',
  screeningStatus: {
    isPEP: false,
    isPEPRelative: false,
    adverseNewsForeign: false,
    adverseNewsLocal: true,
    sanctionsMatch: false
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
  },
  crimeTypologies: ['Cybercrime'],
  dob: '1992-07-15',
  idNumber: 'SG-NRIC-S9933110E',
  gender: 'Male',
  countryOfBirth: 'Singapore',
  taxResidency: 'Singapore',
  aliases: ['L.W.', 'CodeMaster'],
  fullAddress: 'Block 112, Ang Mo Kio Ave 4, #08-22, Singapore',
  screeningStatus: {
    isPEP: false,
    isPEPRelative: false,
    adverseNewsForeign: false,
    adverseNewsLocal: false,
    sanctionsMatch: false
  },
  linkedSTRs: [
    { id: 'CTR-2026-9903', date: '2026-04-05', amount: '$25,000', type: 'CTR' }
  ]
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
  },
  crimeTypologies: ['Terrorism Financing'],
  dob: '1985-03-22',
  idNumber: 'SY-ID-MM882244',
  gender: 'Male',
  countryOfBirth: 'Syria',
  taxResidency: 'Unknown',
  aliases: ['A.M.', 'Project Saham'],
  fullAddress: 'Compartmented Office, Refugee Sector 4, Border Zone',
  screeningStatus: {
    isPEP: false,
    isPEPRelative: false,
    adverseNewsForeign: true,
    adverseNewsLocal: false,
    sanctionsMatch: false
  }
};

export const SARAH_JENKINS_PROFILE: PersonProfile = {
  id: 'P-005',
  name: 'Sarah Jenkins',
  nationality: 'Australian',
  occupation: 'Procurement Officer',
  riskProfile: {
    totalScore: 8, // Green - Automated Hibernation
    status: 'GREEN LOW',
    factors: [
      { id: 'f14', category: 'Primary Area of Concern', factor: 'Fraud / Cheating', score: 8 }
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
  },
  linkedSTRs: [
    { id: 'STR-2026-SANCTIONS', date: '2026-03-14', amount: '$3.9M', type: 'STR' }
  ],
  dob: '1965-02-28',
  idNumber: 'RU-INT-8833110',
  gender: 'Male',
  countryOfBirth: 'Russia',
  taxResidency: 'Russia / Cyprus',
  aliases: ['The Magnate', 'I.D. Shipping'],
  fullAddress: '44 Volkov Street, St. Petersburg, Russia',
  screeningStatus: {
    isPEP: true,
    isPEPRelative: false,
    adverseNewsForeign: true,
    adverseNewsLocal: true,
    sanctionsMatch: true
  }
};

export const MOCK_CASES: IntelligenceCase[] = [
  {
    id: 'CASE-2026-001',
    title: 'Operation Highland - Cross-border Laundering',
    subject: IGOR_DIMITROV_PROFILE,
    reports: [
      {
        id: 'STR-2026-SANCTIONS',
        date: '2026-03-14',
        amount: 3900000,
        currency: 'USD',
        institution: 'STANDARD COMMERCE BANK SINGAPORE',
        type: 'STR',
        riskScore: 92,
        status: 'LINKED',
        crimeTypes: ['ML_NP', 'ML_FTD', 'T_T_NS_RS'],
        suspicionCategories: ['S_L_T_B_I', 'T_W_NAB_A_IV'],
        narrative: 'Client account version was funded rapidly via domestic shell structures. Consolidation followed by immediate outbound transfer to Estonian entity participating in strategic goods brokering.'
      }
    ],
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
    reports: [
       {
        id: 'STR-993-8845',
        date: '2026-03-20',
        amount: 850000,
        currency: 'SGD',
        institution: 'MAS BANK',
        type: 'STR',
        riskScore: 72,
        status: 'LINKED',
        crimeTypes: ['TC_S_DTE', 'ML_NP'],
        suspicionCategories: ['S_L_T_C', 'S_L_T_A'],
        narrative: 'Multiple structured cash deposits identified beneath reporting thresholds. Subject unable to provide documentation for primary source of wealth.'
      }
    ],
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
    reports: [
      {
        id: 'STR-993-8822',
        date: '2025-10-14',
        amount: 450000,
        currency: 'USD',
        institution: 'BLACKTHORN FIDUCIARY',
        type: 'STR',
        riskScore: 68,
        status: 'TRIAGED',
        crimeTypes: ['ML_SPL_PL', 'ML_FWT'],
        suspicionCategories: ['S_L_T_A', 'S_L_T_B_I'],
        narrative: 'Structuring of funds via multiple domestic entities followed by layering through offshore consultancy accounts. Fails economic rationale for advisory fee volumes.'
      }
    ],
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
    reports: [
       {
        id: 'STR-555-1122',
        date: '2026-04-01',
        amount: 5500000,
        currency: 'USD',
        institution: 'GLOBAL TRUST BANK',
        type: 'STR',
        riskScore: 95,
        status: 'LINKED',
        crimeTypes: ['T_T_NS_TF', 'T_T_NS_IAT'],
        suspicionCategories: ['S_L_T_B_II', 'T_W_NAB_QFI'],
        narrative: 'Wire transfers conducted on behalf of third-party NGO profiles. Fund destination is a high-risk conflict zone with known militant logistics nodes.'
      }
    ],
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
    status: 'HIBERNATED',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2026-03-28T16:20:00Z'
  },
  {
    id: 'TASK-2026-006',
    title: 'Project Shadow - High-Value Gem Acquisition',
    subject: MICHAEL_GREENE_PROFILE,
    reports: [
      {
        id: 'CTR-2026-9902',
        date: '2026-04-03',
        amount: 120000,
        currency: 'USD',
        institution: 'IMPERIAL GEMS SINGAPORE',
        type: 'CTR',
        riskScore: 28,
        status: 'TRIAGED',
        narrative: 'Cash purchase of primary-grade diamonds exceeding regulatory threshold. Source of funds attributed to foreign corporate dividends, awaiting verification.'
      }
    ],
    status: 'TRIAGE',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2026-04-04T11:00:00Z'
  },
  {
    id: 'CASE-2025-110',
    title: 'Operation Copper - Retired Analysis',
    subject: LI_WEI_PROFILE,
    reports: [],
    status: 'CLOSED',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2025-11-05T09:00:00Z',
    closedAt: '2025-11-12T16:00:00Z'
  },
  {
    id: 'CASE-2025-125',
    title: 'Project Zenith - Resolved Fraud',
    subject: SARAH_JENKINS_PROFILE,
    reports: [],
    status: 'DISMISSED',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2025-12-10T11:00:00Z',
    closedAt: '2025-12-14T10:00:00Z'
  },
  {
    id: 'CASE-2026-008',
    title: 'Operation Frost - Quick Closure',
    subject: TOBIAS_BLACK_PROFILE,
    reports: [],
    status: 'CLOSED',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2026-01-15T09:00:00Z',
    closedAt: '2026-01-18T14:00:00Z'
  },
  {
    id: 'CASE-2026-015',
    title: 'Project Cobalt - March Completion',
    subject: IGOR_DIMITROV_PROFILE,
    reports: [],
    status: 'CLOSED',
    analyst: 'Insp. Lim',
    priority: false,
    disseminations: [],
    createdAt: '2026-03-02T10:00:00Z',
    closedAt: '2026-03-08T17:00:00Z'
  }
];

export const MOCK_STRS: SuspiciousTransactionReport[] = [
  ...MOCK_CASES.flatMap(c => c.reports),
  {
    id: 'STR-993-8822',
    date: '2025-10-14',
    amount: 450000,
    currency: 'USD',
    institution: 'BLACKTHORN FIDUCIARY',
    type: 'STR' as const,
    riskScore: 68,
    status: 'TRIAGED' as const,
    crimeTypes: ['ML_SPL_PL', 'ML_FWT'],
    suspicionCategories: ['S_L_T_A', 'S_L_T_B_I'],
    narrative: 'Structuring of funds via multiple domestic entities.'
  },
  {
    id: 'CTR-882-1110',
    date: '2025-12-15',
    amount: 55000,
    currency: 'USD',
    institution: 'HSBC JERSEY',
    type: 'CTR' as const,
    riskScore: 15,
    status: 'LINKED' as const
  },
  {
    id: 'STR-994-0021',
    date: '2026-01-10',
    amount: 890000,
    currency: 'USD',
    institution: 'STANDARD CHARTERED',
    type: 'STR' as const,
    riskScore: 78,
    status: 'LINKED' as const
  },
  {
    id: 'STR-994-0556',
    date: '2026-02-28',
    amount: 2400000,
    currency: 'GBP',
    institution: 'BARCLAYS UK',
    type: 'STR' as const,
    riskScore: 85,
    status: 'LINKED' as const
  },
  {
    id: 'STR-666-4444',
    date: '2022-08-30',
    amount: 12000000,
    currency: 'USD',
    institution: 'GLOBAL TRUST BANK',
    type: 'STR' as const,
    riskScore: 88,
    status: 'LINKED' as const
  },
  {
    id: 'CMR-777-1111',
    date: '2023-01-15',
    amount: 800000,
    currency: 'USD',
    institution: 'CASH MANAGEMENT CORP',
    type: 'CMR' as const,
    riskScore: 45,
    status: 'TRIAGED' as const
  },
  {
    id: 'STR-888-2222',
    date: '2024-05-18',
    amount: 4200000,
    currency: 'EUR',
    institution: 'DEUTSCHE BANK',
    type: 'STR' as const,
    riskScore: 75,
    status: 'LINKED' as const
  },
  {
    id: 'STR-999-3333',
    date: '2025-11-22',
    amount: 1100000,
    currency: 'SGD',
    institution: 'DBS BANK',
    type: 'STR' as const,
    riskScore: 62,
    status: 'TRIAGED' as const
  },
  {
    id: 'CTR-2026-9901',
    date: '2026-04-02',
    amount: 35000,
    currency: 'USD',
    institution: 'BLACKTHORN GOLD EXCHANGE',
    type: 'CTR' as const,
    riskScore: 32,
    status: 'TRIAGED' as const,
    narrative: 'Cash purchase of precious metal bullion.'
  },
  {
    id: 'CTR-2026-9902',
    date: '2026-04-03',
    amount: 120000,
    currency: 'USD',
    institution: 'IMPERIAL GEMS SINGAPORE',
    type: 'CTR' as const,
    riskScore: 28,
    status: 'TRIAGED' as const,
    narrative: 'Cash purchase of primary-grade diamonds.'
  },
  {
    id: 'CTR-2026-9903',
    date: '2026-04-05',
    amount: 25000,
    currency: 'USD',
    institution: 'CRYPTOTREASURES PSMD',
    type: 'CTR' as const,
    riskScore: 40,
    status: 'TRIAGED' as const,
    narrative: 'Asset-backed token transaction via cash primary.'
  }
].filter((str, index, self) => 
  index === self.findIndex((t) => t.id === str.id)
);
