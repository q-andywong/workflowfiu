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
    { id: 'CASE-2024-001', status: 'Closed', score: 82 },
    { id: 'CASE-2025-012', status: 'Under Review', score: 75 },
    { id: 'CASE-2025-099', status: 'Closed', score: 55 }
  ],
  linkedSTRs: [
    { id: 'STR-2025-7711', date: '2025-10-14', amount: '$450,000', type: 'STR' },
    { id: 'STR-2025-7734', date: '2025-11-02', amount: '$1.2M', type: 'STR' },
    { id: 'CTR-2025-8810', date: '2025-12-15', amount: '$55,000', type: 'CTR' },
    { id: 'STR-2026-1121', date: '2026-01-10', amount: '$890,000', type: 'STR' }
  ],
  riskProfile: {
    totalScore: 82,
    status: 'AMBER 4',
    factors: [
      { id: 'f1', category: 'Primary Area of Concern', factor: 'Domestic', score: 10 },
      { id: 'f2', category: 'Sector', factor: 'Securities, Funds & Jersey Private Funds', score: 12 },
      { id: 'f3', category: 'Typology Focus', factor: 'Tax - Domestic', score: 8 },
      { id: 'f4', category: 'Asset Recovery Opportunity', factor: 'High', score: 20 }
    ]
  },
  crimeTypologies: ['Money Laundering', 'Tax Evasion'],
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

export const APEX_HOLDINGS_PROFILE: PersonProfile = {
  id: 'P-007',
  name: 'Apex Holdings LLC',
  nationality: 'Cayman Islands',
  occupation: 'Holding Company',
  type: 'COMPANY',
  status: 'Open',
  summary: 'Apex Holdings LLC acts as the primary vehicle for cross-border asset movement within the Blackthorn network. Recent intelligence suggests it may be used for disguising ultimate beneficial ownership of maritime assets located in high-risk jurisdictions.',
  actionRequired: 'Perform deep-scan of UBO register and verify directorship links to high-risk PEPs.',
  ubos: ['Tobias Black', 'Undisclosed Trust (Seychelles)'],
  shareholders: ['Blackthorn Global', 'Maritime Partners LTD'],
  directors: ['Tobias Black', 'Elena Vassiliou'],
  involvedProjects: [
    { name: 'Highland Logistics Hub', value: '$45M', location: 'Singapore', status: 'Open' },
    { name: 'Baltic Freight Terminal', value: '$12M', location: 'Estonia', status: 'Closed' }
  ],
  previousCases: [
    { id: 'CASE-2024-001', status: 'Closed', score: 82 }
  ],
  linkedSTRs: [
    { id: 'STR-2026-9905', date: '2026-02-15', amount: '$1.4M', type: 'STR' },
    { id: 'STR-2026-9912', date: '2026-03-22', amount: '$2.8M', type: 'STR' }
  ],
  riskProfile: {
    totalScore: 115,
    status: 'RED ALPHA',
    factors: [
      { id: 'f_ax1', category: 'Jurisdiction', factor: 'Offshore Secrecy Jurisdiction', score: 25 },
      { id: 'f_ax2', category: 'Ownership', factor: 'Opaque Trust Structure', score: 20 },
      { id: 'f_ax3', category: 'Activity', factor: 'High Volume Cross-Border Flow', score: 15 }
    ]
  },
  crimeTypologies: ['Money Laundering', 'Sanctions Evasion'],
  idNumber: 'KY-CORP-442299',
  countryOfBirth: 'Cayman Islands',
  taxResidency: 'Cayman Islands',
  fullAddress: 'Cricket Square, Hutchins Drive, PO Box 2681, Grand Cayman, KY1-1111',
  screeningStatus: {
    isPEP: false,
    isPEPRelative: false,
    adverseNewsForeign: true,
    adverseNewsLocal: false,
    sanctionsMatch: false
  }
};

export const IGOR_DIMITROV_PROFILE: PersonProfile = {
  id: 'P-006',
  name: 'Igor Dimitrov',
  nationality: 'Russian',
  occupation: 'Shipping Magnate',
  type: 'INDIVIDUAL',
  status: 'Open',
  summary: 'Igor Dimitrov is the primary controller of a large-scale maritime logistics network. Recent regulatory filings indicate significant involvement in the transfer of sensitive technologies to restricted jurisdictions via intermediary Estonian entities.',
  actionRequired: 'Immediate block on all pending outbound transfers. Verify sanctions nexus.',
  riskProfile: {
    totalScore: 195,
    status: 'RED CRITICAL',
    factors: [
      { id: 'f15', category: 'Primary Area of Concern', factor: 'Sanctions Evasion', score: 35 },
      { id: 'f16', category: 'Sector', factor: 'Maritime & Freight', score: 15 },
      { id: 'f17', category: 'Screening', factor: 'Direct Sanctions Match', score: 40 }
    ]
  },
  linkedSTRs: [
    { id: 'STR-2026-SANCTIONS', date: '2026-03-14', amount: '$3.9M', type: 'STR' },
    { id: 'STR-2026-8801', date: '2026-04-01', amount: '$540,000', type: 'STR' }
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
  },
  crimeTypologies: ['Sanctions Evasion', 'Money Laundering']
};

export const MICHAEL_GREENE_PROFILE: PersonProfile = {
  id: 'P-002',
  name: 'Gov. Board - Malapanagudi',
  nationality: 'Indian',
  type: 'COMPANY',
  status: 'Open',
  summary: 'Malapanagudi Water User Cooperative Society is a cooperative society in India. Concerns revolve around potential funneling of agricultural subsidies into private real estate development.',
  actionRequired: 'Integrity Due Diligence checklist must be completed for this entity.',
  involvedProjects: [
    { name: 'National Rural Roads Program', value: '$250M', location: 'India', status: 'Open' }
  ],
  previousCases: [
    { id: 'CASE-2021-001', status: 'Open', score: 30 }
  ],
  linkedSTRs: [
    { id: 'STR-2021-5511', date: '2021-04-12', amount: '$5.5M', type: 'STR' },
    { id: 'CTR-2026-9902', date: '2026-04-03', amount: '$120,000', type: 'CTR' }
  ],
  riskProfile: {
    totalScore: 78,
    status: 'AMBER 3',
    factors: [
      { id: 'f5', category: 'Jurisdiction', factor: 'High Procurement Risk', score: 18 }
    ]
  },
  crimeTypologies: ['Fraud', 'Corruption'],
  idNumber: 'IN-CORP-442211',
  countryOfBirth: 'India',
  taxResidency: 'India',
  fullAddress: 'Block 4, Industrial Estate, Bangalore, India',
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
  type: 'INDIVIDUAL',
  riskProfile: {
    totalScore: 85,
    status: 'AMBER 5',
    factors: [
      { id: 'f10', category: 'Primary Area of Concern', factor: 'Cybercrime', score: 15 }
    ]
  },
  crimeTypologies: ['Cybercrime'],
  idNumber: 'SG-NRIC-S9933110E',
  fullAddress: 'Block 112, Ang Mo Kio Ave 4, Singapore',
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
  nationality: 'Syrian',
  type: 'INDIVIDUAL',
  riskProfile: {
    totalScore: 190,
    status: 'RED CRITICAL',
    factors: [
      { id: 'f12', category: 'Primary Area of Concern', factor: 'Terrorism Financing', score: 25 }
    ]
  },
  crimeTypologies: ['Terrorism Financing'],
  idNumber: 'SY-ID-MM882244',
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
  type: 'INDIVIDUAL',
  riskProfile: {
    totalScore: 8,
    status: 'GREEN LOW',
    factors: [
      { id: 'f14', category: 'Risk', factor: 'Low Transaction Volume', score: 8 }
    ]
  }
};

export const MOCK_CASES: IntelligenceCase[] = [
  {
    id: 'CASE-2026-001',
    title: 'Operation Highland - Cross-border Sanctions Evasion',
    description: 'High-priority investigation into a logistics ring involving maritime assets and shell companies across Russia, Cyprus, and the Cayman Islands. Intelligence suggests use of domestic consultants to facilitate payments for restricted strategic goods.',
    subjects: [IGOR_DIMITROV_PROFILE, TOBIAS_BLACK_PROFILE, APEX_HOLDINGS_PROFILE],
    findings: 'Initial evaluation confirms that Igor Dimitrov is the primary beneficiary of funds flowing through Apex Holdings LLC. Tobias Black acts as the facilitator, providing the fiduciary shell needed for Estonian brokerage services. Strategic goods match Russian aerospace procurement profiles.',
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
        narrative: 'Client account was funded rapidly via domestic shell structures. Consolidation followed by immediate outbound transfer to Estonian entity participating in strategic goods brokering.'
      },
      {
        id: 'STR-2026-9905',
        date: '2026-02-15',
        amount: 1400000,
        currency: 'USD',
        institution: 'CAYMAN OFFSHORE BANK',
        type: 'STR',
        riskScore: 78,
        status: 'LINKED',
        narrative: 'High-value transfer from Apex Holdings LLC to a maritime consultancy in Cyprus. Source of funds is unclear.'
      }
    ],
    status: 'PRIORITY',
    analyst: 'Sgt. Wong',
    priority: true,
    attachments: [
      { id: '1', name: 'Identity-Verification-ID-Shipping.pdf', url: '#', type: 'application/pdf', uploadedBy: 'Sgt. Wong', uploadedAt: '2026-03-15' },
      { id: '2', name: 'Logistics-Nexus-Chart.png', url: '#', type: 'image/png', uploadedBy: 'Sgt. Wong', uploadedAt: '2026-03-16' }
    ],
    createdAt: '2026-03-15T09:00:00Z',
    disseminations: [
      {
        id: 'DIS-2026-001',
        agency: 'CAD',
        date: '2026-04-05T14:30:00Z',
        intelligenceSummary: 'Referral regarding cross-border high-value fund movements with suspected shell integration.',
        feedback: {
          receivedDate: '2026-04-12T10:00:00Z',
          outcome: 'CONVICTION',
          notes: 'Successful investigation led to the identification of an unlicensed money changer network.'
        }
      }
    ]
  },
  {
    id: 'CASE-2024-001',
    title: 'Project Cobalt - 2024 Historical Review',
    description: 'Historical investigation into the early setup of the Blackthorn trust network. Focus was on establishing the primary nodes used for subsequent asset movement.',
    subjects: [TOBIAS_BLACK_PROFILE, APEX_HOLDINGS_PROFILE],
    findings: 'Case was closed after initial review found insufficient evidence for further escalation at the time. Entities were placed on a monitoring list.',
    reports: [
      {
        id: 'STR-2024-001A',
        date: '2024-01-12',
        amount: 215000,
        currency: 'USD',
        institution: 'HSBC CAYMAN',
        type: 'STR',
        riskScore: 65,
        status: 'LINKED',
        narrative: 'Initial structural setup payments. Source of wealth unverified.'
      }
    ],
    status: 'CLOSED',
    analyst: 'Insp. Lim',
    priority: false,
    createdAt: '2024-01-15T09:00:00Z',
    closedAt: '2024-01-18T14:00:00Z'
  },
  {
    id: 'TASK-2026-010',
    title: 'Automated Triage: Cybercrime Extortion',
    subjects: [LI_WEI_PROFILE],
    reports: [
        {
          id: 'CTR-2026-9903',
          date: '2026-04-05',
          amount: 25000,
          currency: 'USD',
          institution: 'CRYPTOTREASURES PSMD',
          type: 'CTR',
          riskScore: 40,
          status: 'TRIAGED',
          narrative: 'Asset-backed token transaction via cash primary.'
        }
    ],
    status: 'TRIAGE',
    priority: false,
    createdAt: '2026-04-02T10:15:00Z'
  },
  {
    id: 'CASE-2026-005',
    title: 'Operation Mirage - Low Risk Monitoring',
    subjects: [SARAH_JENKINS_PROFILE],
    reports: [],
    status: 'HIBERNATED',
    analyst: 'Insp. Lim',
    priority: false,
    createdAt: '2026-03-28T16:20:00Z'
  },
  {
    id: 'CASE-2026-E2E',
    title: 'Operation Emerald - Complex Laundering Network',
    description: 'Ongoing investigation into a high-tier money laundering network involving offshore shell integrations and high-value domestic asset acquisitions.',
    subjects: [TOBIAS_BLACK_PROFILE, APEX_HOLDINGS_PROFILE],
    findings: 'Network analysis reveals a multi-layered placement strategy. Funds are being cycled through consultant-led trusts to obfuscate ultimate beneficial ownership of maritime assets.',
    reports: [
      {
        id: 'STR-2026-EMERALD',
        date: '2026-04-10',
        amount: 2500000,
        currency: 'USD',
        institution: 'STANDARD CHARTERED SINGAPORE',
        type: 'STR',
        riskScore: 88,
        status: 'LINKED',
        narrative: 'Suspicious layering activity identified across multiple corporate accounts. High-frequency transfers inconsistent with stated business profiles.'
      }
    ],
    status: 'ANALYSIS',
    analyst: 'Insp. Lim',
    priority: true,
    attachments: [
        { id: 'att-e2e-1', name: 'Laundering-Topology-Flow.pdf', url: '#', type: 'application/pdf', uploadedBy: 'Insp. Lim', uploadedAt: '2026-04-11' }
    ],
    createdAt: '2026-04-10T10:00:00Z'
  }
];

const GENERATED_TASKS: IntelligenceCase[] = Array.from({ length: 15 }).map((_, i) => {
  const types = ['Money Laundering', 'Tax Evasion', 'Sanctions Evasion', 'Fraud', 'Cybercrime', 'Terrorism Financing'];
  const sgNames = [
    'Tan Wei Ming', 'Lee Boon Hock', 'Siti Azizah', 'Rajesh Kumar', 
    'Lim Pei Shan', 'Desmond Ng', 'Ahmad bin Ibrahim', 'Wong Li Qin', 
    'Muthu Subramaniam', 'Chong Wei Jie'
  ];
  const companyNames = [
    'Raffles Logistics Group', 'Merlion Trading Pte Ltd', 'Apex Digital Solutions', 
    'Sentosa Maritime Corp', 'Crescent Holdings LLC'
  ];
  
  const entityName = i < 10 ? sgNames[i] : companyNames[i - 10];
  const entityType = i < 10 ? 'INDIVIDUAL' : 'COMPANY';

  const crimeType = types[i % 6];
  const assignedCrimes = [crimeType];
  
  // Assign a second crime type to half of the mock tasks (even indices) to simulate overlapping queues
  if (i % 2 === 0) {
      assignedCrimes.push(types[(i + 1) % 6]);
  }

  return {
    id: `TASK-2026-GEN0${i}`,
    title: `Automated Triage: Potential ${assignedCrimes.join(' & ')} Match`,
    description: `System flag matching ${assignedCrimes.join(' and ')} heuristic indicators. Pipeline analysis indicates suspicious activity. Priority review required.`,
    subjects: [{
      id: `P-TEST-${i}`,
      name: entityName,
      nationality: 'Singaporean',
      type: entityType as 'INDIVIDUAL' | 'COMPANY',
      status: 'Open',
      riskProfile: {
        totalScore: 50 + (i * 4),
        status: 'AMBER 3',
        factors: [
          { id: `f_gen1_${i}`, category: 'Typology Match', factor: 'Automated Keyword Hit', score: 30 + (i * 2) },
          { id: `f_gen2_${i}`, category: 'Transaction Pattern', factor: 'High Velocity Transfers', score: 20 + (i * 2) }
        ]
      },
      crimeTypologies: assignedCrimes,
      linkedSTRs: []
    }],
    reports: [],
    status: 'TRIAGE',
    priority: false,
    createdAt: new Date(new Date('2026-04-09T00:00:00Z').getTime() - (i * 86400000)).toISOString()
  };
});

export const MOCK_INVESTIGATORS = [
  { name: 'Insp. Lim', typology: 'Money Laundering' },
  { name: 'Sgt. Wong', typology: 'Sanctions Evasion' },
  { name: 'Insp. Kumar', typology: 'Terrorism Financing' },
  { name: 'Sgt. Azizah', typology: 'Cybercrime' },
  { name: 'Insp. Pei Shan', typology: 'Fraud' }
];

MOCK_CASES.push(...GENERATED_TASKS);

export const MOCK_STRS: SuspiciousTransactionReport[] = [
  ...MOCK_CASES.flatMap(c => c.reports),
  { id: 'STR-2026-SANCTIONS', date: '2026-03-14', amount: 3900000, currency: 'USD', institution: 'STANDARD COMMERCE', type: 'STR', riskScore: 92, status: 'LINKED' },
  { id: 'STR-2026-9905', date: '2026-02-15', amount: 1400000, currency: 'USD', institution: 'CAYMAN OFFSHORE', type: 'STR', riskScore: 78, status: 'LINKED' },
  { id: 'STR-2026-9912', date: '2026-03-22', amount: 2800000, currency: 'USD', institution: 'DBS BANK', type: 'STR', riskScore: 85, status: 'TRIAGED' },
  { id: 'STR-2026-8801', date: '2026-04-01', amount: 540000, currency: 'USD', institution: 'VTB ESTONIA', type: 'STR', riskScore: 88, status: 'LINKED' },
  { id: 'CTR-2026-9902', date: '2026-04-03', amount: 120000, currency: 'USD', institution: 'IMPERIAL GEMS', type: 'CTR', riskScore: 28, status: 'TRIAGED' },
  { id: 'CTR-2026-9903', date: '2026-04-05', amount: 25000, currency: 'USD', institution: 'CRYPTOTREASURES', type: 'CTR', riskScore: 40, status: 'TRIAGED' },
  { id: 'CMR-2026-4411', date: '2026-03-10', amount: 45000, currency: 'EUR', institution: 'BERLIN CUSTOMS', type: 'CMR', riskScore: 55, status: 'TRIAGED' },
  { id: 'STR-2026-4422', date: '2026-03-12', amount: 890000, currency: 'GBP', institution: 'LLOYDS BANK', type: 'STR', riskScore: 72, status: 'TRIAGED' },
  { id: 'CTR-2026-4433', date: '2026-03-15', amount: 150000, currency: 'USD', institution: 'ANTIQUE ARTS SG', type: 'CTR', riskScore: 35, status: 'TRIAGED' },
  { id: 'STR-2026-4444', date: '2026-03-18', amount: 1200000, currency: 'USD', institution: 'CHASE MANHATTAN', type: 'STR', riskScore: 81, status: 'TRIAGED' },
  { id: 'STR-2026-4455', date: '2026-03-20', amount: 650000, currency: 'USD', institution: 'SOCIETE GENERALE', type: 'STR', riskScore: 68, status: 'TRIAGED' },
  { id: 'CTR-2026-4466', date: '2026-03-22', amount: 80000, currency: 'SGD', institution: 'UOB SINGAPORE', type: 'CTR', riskScore: 25, status: 'TRIAGED' },
  { id: 'STR-2026-4477', date: '2026-03-25', amount: 2100000, currency: 'USD', institution: 'MORGAN STANLEY', type: 'STR', riskScore: 79, status: 'TRIAGED' },
  { id: 'CMR-2026-4488', date: '2026-03-28', amount: 35000, currency: 'USD', institution: 'ZURICH AIRPORT', type: 'CMR', riskScore: 48, status: 'TRIAGED' },
  { id: 'STR-2026-4499', date: '2026-03-30', amount: 4300000, currency: 'USD', institution: 'GOLDMAN SACHS', type: 'STR', riskScore: 90, status: 'TRIAGED' }
].filter((str, index, self) => 
  index === self.findIndex((t) => t.id === str.id)
);

export const MOCK_ENTITIES: PersonProfile[] = [
  TOBIAS_BLACK_PROFILE,
  APEX_HOLDINGS_PROFILE,
  IGOR_DIMITROV_PROFILE,
  MICHAEL_GREENE_PROFILE,
  LI_WEI_PROFILE,
  AHMED_MALIK_PROFILE,
  SARAH_JENKINS_PROFILE
];
