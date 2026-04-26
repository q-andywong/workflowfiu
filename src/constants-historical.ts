// ─────────────────────────────────────────────────────────────────────────────
// HISTORICAL MOCK DATA — Completed cases from Oct 2025 – Mar 2026
// These cases have traversed the full FIU workflow lifecycle and carry
// their final statuses. They must NOT be re-routed by initializeCases().
// ─────────────────────────────────────────────────────────────────────────────

import { IntelligenceCase } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// GROUP A — CLOSED via DISSEMINATE → Agency Feedback → Closed (6 cases)
// ═══════════════════════════════════════════════════════════════════════════

const HIST_CASE_2001: IntelligenceCase = {
  id: 'HIST-2025-MCB-2001',
  title: 'Automated Triage: Structuring / Layering — Lim Ah Kow',
  description: 'Systematic layering of funds through multiple domestic bank accounts. Customer conducted 47 inter-bank transfers averaging SGD 9,500 each over a 3-month period, consistently below reporting thresholds.',
  subjects: [{
    id: 'customer-2001',
    name: 'Lim Ah Kow',
    nationality: 'Singaporean',
    occupation: 'Retired hawker stall owner',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '22/08/1958',
    idNumber: 'S5823456B',
    gender: 'Male',
    fullAddress: 'Blk 234 Toa Payoh Lorong 8 #03-15 S310234',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Money Laundering'],
    riskProfile: {
      totalScore: 68,
      status: 'AMBER',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 12, notes: 'Consistent sub-threshold transfers of SGD 9,500 avg across 47 transactions' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 10, notes: 'SGD 446,500 total layered across 47 inter-bank transfers' },
        { id: 'h3', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 9, notes: 'Funds moved within 24h of receipt across 3 banks' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 8, notes: '12 third-party transfers to unrelated individuals' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 8, notes: 'Retired hawker with no declared income source for SGD 446K' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 7, notes: 'Transfers consistently rounded to SGD 9,500' },
        { id: 'h7', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 6, notes: 'Transfers across POSB, OCBC, and MCB domestic accounts' },
        { id: 'h8', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5, notes: 'Subject acts as hub — funds fan out to 12 unrelated recipients' },
        { id: 'h9', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 3, notes: 'Account flagged for enhanced monitoring' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-MCB-2001', date: '2025-10-15', amount: 446500, currency: 'SGD', institution: 'MERIDIAN CAPITAL BANK', type: 'STR', riskScore: 68, status: 'LINKED', crimeTypes: ['ML_NP', 'ML_SL'], suspicionCategories: ['S_L_T_A', 'S_L_T_F'], narrative: 'Customer Lim Ah Kow conducted 47 inter-bank transfers averaging SGD 9,500 each over Oct–Dec 2025, layering funds across POSB, OCBC, and MCB accounts. Pattern consistent with structuring to avoid CTR thresholds.' },
  ],
  status: 'CLOSED',
  analyst: 'Insp. Lim',
  priority: false,
  findings: 'Confirmed structuring pattern. Subject used retirement savings narrative but source of funds (SGD 446,500) inconsistent with declared income from hawker stall. Funds traced to unlicensed moneylending network. Disseminated to CAD who confirmed connection to ongoing Operation Watershed.',
  disseminations: [{
    id: 'DIS-HIST-2001',
    agency: 'CAD',
    date: '2025-12-10T14:30:00Z',
    intelligenceSummary: 'Structuring intelligence referral — subject linked to unlicensed moneylending network. 47 sub-threshold transfers totalling SGD 446,500.',
    feedback: {
      receivedDate: '2026-02-15T09:00:00Z',
      outcome: 'CONVICTION',
      notes: 'Subject convicted under CDSA s.47(1)(b) — acquiring property linked to proceeds of unlicensed moneylending. Sentenced to 18 months imprisonment.',
      officialRef: 'CAD-2025-REF-44210',
    }
  }],
  createdAt: '2025-10-08T08:45:00Z',
  closedAt: '2026-02-20T16:00:00Z',
};

const HIST_CASE_2002: IntelligenceCase = {
  id: 'HIST-2025-SFG-2002',
  title: 'Automated Triage: Investment Fraud — Sarah Tan Mei Xuan',
  description: 'Subject operated a fictitious high-yield investment scheme collecting SGD 2.1M from 34 victims via SFG accounts before redirecting funds offshore.',
  subjects: [{
    id: 'customer-2002',
    name: 'Sarah Tan Mei Xuan',
    nationality: 'Singaporean',
    occupation: 'Self-employed financial consultant',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '03/11/1991',
    idNumber: 'S9145678C',
    gender: 'Female',
    fullAddress: '8 Nassim Road #18-02 S258366',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: true, sanctionsMatch: false },
    crimeTypologies: ['Fraud'],
    riskProfile: {
      totalScore: 85,
      status: 'RED BRAVO HIGH',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 12, notes: 'SGD 2.1M collected from 34 individual depositors' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 11, notes: 'Funds swept offshore to HK within 48h of receipt' },
        { id: 'h3', category: 'Screening', factor: 'AdverseMediaHits', score: 10, notes: 'Local news reports of victims filing police reports' },
        { id: 'h4', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 9, notes: 'Funds routed Singapore → Hong Kong → Macau' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 8, notes: '34 individual victims depositing funds into subject account' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 8, notes: 'No legitimate investment activity — pure collection and sweep' },
        { id: 'h7', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 7, notes: 'Deposits from victims structured across multiple days' },
        { id: 'h8', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 6, notes: 'Registered as financial consultant but no MAS licence' },
        { id: 'h9', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'Funds routed to HK/Macau — high-risk for fraud proceeds' },
        { id: 'h10', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5, notes: 'Offshore receiving accounts in multiple jurisdictions' },
        { id: 'h11', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 4, notes: 'SFG flagged account for immediate review' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-SFG-2002', date: '2025-11-01', amount: 2100000, currency: 'SGD', institution: 'SENTOSA FINANCIAL GROUP', type: 'STR', riskScore: 85, status: 'LINKED', crimeTypes: ['ML_NP', 'ML_FTD'], suspicionCategories: ['S_L_T_A', 'S_L_T_B_I'], narrative: 'Subject Sarah Tan collected SGD 2.1M from 34 individuals promising 15% monthly returns. Funds swept to HK accounts within 48h. Classic Ponzi scheme indicators.' },
    { id: 'CTR-2025-2002', date: '2025-10-22', amount: 85000, currency: 'SGD', institution: 'SENTOSA FINANCIAL GROUP', type: 'CTR', riskScore: 85, status: 'LINKED', narrative: 'Cash deposit of SGD 85,000 by Sarah Tan — stated purpose: "client investment funds".' },
  ],
  status: 'CLOSED',
  analyst: 'Insp. Pei Shan',
  priority: false,
  findings: 'Ponzi/investment fraud confirmed. Subject collected SGD 2.1M from 34 victims under guise of "high-yield fund". No legitimate investment activity found. Funds traced to personal luxury spending and offshore accounts in HK/Macau. Disseminated to CAD; arrest warrant executed.',
  disseminations: [{
    id: 'DIS-HIST-2002',
    agency: 'MAS',
    date: '2025-12-20T10:15:00Z',
    intelligenceSummary: 'Investment fraud referral — unlicensed fund management, SGD 2.1M from 34 victims, funds offshore to HK/Macau.',
    feedback: {
      receivedDate: '2026-03-05T14:30:00Z',
      outcome: 'CONVICTION',
      notes: 'Subject charged under SFA s.340 (fraud in connection with securities) and CDSA s.47. Currently remanded pending sentencing. MAS issued investor alert.',
      officialRef: 'MAS-ENF-2025-0892',
    }
  }],
  createdAt: '2025-10-20T11:30:00Z',
  closedAt: '2026-03-10T09:00:00Z',
};

const HIST_CASE_2003: IntelligenceCase = {
  id: 'HIST-2025-PTB-2003',
  title: 'Automated Triage: Sanctions Evasion (Iran) — Jade Horizon Trading Pte Ltd',
  description: 'Shell trading company used PTB trade finance facility to route dual-use goods payments to Iranian end-users via UAE intermediaries.',
  subjects: [{
    id: 'customer-2003',
    name: 'Jade Horizon Trading Pte Ltd',
    nationality: 'Singapore',
    occupation: 'General trading (declared)',
    type: 'COMPANY',
    status: 'Closed',
    idNumber: '201520345K',
    directors: ['Chen Bao Lin (PRC)', 'Reza Ahmadi (Iranian-Canadian dual)'],
    ubos: ['Chen Bao Lin — 60%', 'Reza Ahmadi — 40%'],
    fullAddress: '1 Raffles Place #32-01 One Raffles Place S048616',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true },
    crimeTypologies: ['Sanctions Evasion', 'Money Laundering'],
    riskProfile: {
      totalScore: 112,
      status: 'RED CRITICAL',
      factors: [
        { id: 'h1', category: 'Screening', factor: 'SanctionsProximity', score: 15, notes: 'Director Reza Ahmadi linked to OFAC SDN-listed Kaveh Industrial Group' },
        { id: 'h2', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 13, notes: 'Iranian UBO, trade route via UAE to Tehran' },
        { id: 'h3', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 12, notes: 'No employees, virtual office, minimal web presence' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 11, notes: 'USD 4.7M in trade finance drawdowns over 6 months' },
        { id: 'h5', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 10, notes: 'Multi-layered BVI holding → SG operating entity' },
        { id: 'h6', category: 'Screening', factor: 'AdverseMediaHits', score: 9, notes: 'Kaveh Industrial Group widely reported in sanctions enforcement media' },
        { id: 'h7', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 8, notes: 'Dual-use equipment invoices used to mask payment flows' },
        { id: 'h8', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 8, notes: 'Singapore → UAE → Iran trade route' },
        { id: 'h9', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 7, notes: 'Trade finance drawdowns cleared within 48h' },
        { id: 'h10', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 7, notes: 'End-user entities appear on EU consolidated sanctions list' },
        { id: 'h11', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 6, notes: 'Payments routed through 3 UAE intermediary companies' },
        { id: 'h12', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 6, notes: 'Trade volumes spike then cease — consistent with procurement cycles' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-PTB-2003', date: '2025-10-28', amount: 4700000, currency: 'USD', institution: 'PACIFIC TRUST BANK', type: 'STR', riskScore: 112, status: 'LINKED', crimeTypes: ['T_T_NS_RS', 'ML_LE', 'ML_FTD'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_C'], narrative: 'Jade Horizon Trading used PTB trade finance to route USD 4.7M in dual-use equipment payments. End-users traced to Iranian entities linked to OFAC SDN Kaveh Industrial Group. UAE intermediary used to obscure origin.' },
  ],
  status: 'CLOSED',
  analyst: 'Sgt. Wong',
  priority: false,
  findings: 'Sanctions evasion confirmed. Jade Horizon is a shell entity used to procure dual-use industrial equipment (CNC machines, precision tools) for Iranian end-users via UAE front companies. Director Reza Ahmadi is a known associate of OFAC-listed Kaveh Industrial Group. AGC notified for UNSC sanctions enforcement.',
  disseminations: [{
    id: 'DIS-HIST-2003',
    agency: 'AGC',
    date: '2025-12-05T16:45:00Z',
    intelligenceSummary: 'Sanctions evasion referral — Singapore shell company routing dual-use goods payments to OFAC-linked Iranian entities via UAE.',
    feedback: {
      receivedDate: '2026-02-28T11:00:00Z',
      outcome: 'ASSET_SEIZURE',
      notes: 'AGC obtained freezing order under UN Act. SGD 3.2M frozen across 2 PTB accounts. Company deregistered by ACRA. Directors referred for prosecution.',
      officialRef: 'AGC-UNACT-2025-0034',
    }
  }],
  createdAt: '2025-10-12T07:20:00Z',
  closedAt: '2026-03-05T10:00:00Z',
};

const HIST_CASE_2004: IntelligenceCase = {
  id: 'HIST-2025-CCB-2004',
  title: 'Automated Triage: Terrorism Financing Suspicion — Mohamed Farhan bin Ismail',
  description: 'Unusual pattern of small international remittances to conflict-zone jurisdictions flagged by CCB compliance. Subject is a religious teacher with no prior adverse history.',
  subjects: [{
    id: 'customer-2004',
    name: 'Mohamed Farhan bin Ismail',
    nationality: 'Singaporean',
    occupation: 'Religious teacher (ustaz)',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '17/06/1982',
    idNumber: 'S8234567D',
    gender: 'Male',
    fullAddress: 'Blk 678 Woodlands Drive 71 #12-345 S730678',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Terrorism Financing'],
    riskProfile: {
      totalScore: 52,
      status: 'AMBER',
      factors: [
        { id: 'h1', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 10, notes: 'Remittances to Syria (12), Yemen (7), and Afghanistan (4)' },
        { id: 'h2', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 8, notes: 'Recipient countries are FATF high-risk jurisdictions' },
        { id: 'h3', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 8, notes: '23 remittances in 4 months, averaging SGD 1,200' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 7, notes: 'Frequent small remittances inconsistent with salary profile' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 6, notes: 'Some remittances on behalf of unnamed third parties' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 5, notes: 'SGD 27,600 total outbound remittances over 4 months' },
        { id: 'h7', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 4, notes: 'Remittances structured below SGD 2,000 per transaction' },
        { id: 'h8', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 4, notes: 'Account flagged for enhanced monitoring by CCB compliance' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-CCB-2004', date: '2025-11-05', amount: 27600, currency: 'SGD', institution: 'CHANGI COMMERCIAL BANK', type: 'STR', riskScore: 52, status: 'LINKED', crimeTypes: ['T_T_NS_IAT'], suspicionCategories: ['S_L_T_B_II', 'T_W_NAB_A_IV'], narrative: '23 international remittances totalling SGD 27,600 sent to recipients in Syria (12), Yemen (7), and Afghanistan (4) over 4 months. Subject stated funds are charitable donations to orphanages.' },
  ],
  status: 'CLOSED',
  analyst: 'Insp. Kumar',
  priority: false,
  findings: 'Investigation concluded — no terrorism financing nexus established. Subject is a legitimate ustaz conducting charitable fundraising through his mosque. All 23 remittances traced to verified orphanage accounts operated by recognized NGOs (Islamic Relief Worldwide, Muslim Aid). ISD consultation confirmed no adverse intelligence. Case closed with no offence found.',
  disseminations: [{
    id: 'DIS-HIST-2004',
    agency: 'CAD',
    date: '2025-12-18T09:30:00Z',
    intelligenceSummary: 'TF suspicion referral — small remittances to conflict zones. Preliminary assessment suggests legitimate charitable activity but referred for LEA verification.',
    feedback: {
      receivedDate: '2026-01-25T15:00:00Z',
      outcome: 'NO_OFFENCE_FOUND',
      notes: 'CAD and ISD joint review confirmed legitimate charitable remittances. Subject cooperated fully. No further action required.',
      officialRef: 'CAD-2025-REF-51023',
    }
  }],
  createdAt: '2025-10-25T13:15:00Z',
  closedAt: '2026-02-01T11:30:00Z',
};

const HIST_CASE_2005: IntelligenceCase = {
  id: 'HIST-2025-RBC-2005',
  title: 'Automated Triage: Trade-Based Laundering — Oceanic Ventures Holdings Ltd',
  description: 'Commodity trading firm exhibited significant trade-based money laundering indicators including over/under-invoicing of palm oil shipments between Singapore and Indonesia.',
  subjects: [{
    id: 'customer-2005',
    name: 'Oceanic Ventures Holdings Ltd',
    nationality: 'Singapore',
    occupation: 'Commodity trading (palm oil, rubber)',
    type: 'COMPANY',
    status: 'Closed',
    idNumber: '201812456M',
    directors: ['Surya Widodo (Indonesian)', 'David Lim Keng Huat (Singaporean)'],
    ubos: ['Surya Widodo — 70%', 'David Lim Keng Huat — 30%'],
    fullAddress: '9 Battery Road #28-01 Straits Trading Building S049910',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Money Laundering'],
    riskProfile: {
      totalScore: 73,
      status: 'AMBER',
      factors: [
        { id: 'h1', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 12, notes: 'Invoice values 40-60% above market price for CPO shipments' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 10, notes: 'USD 12.3M in trade flows over 8 months' },
        { id: 'h3', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 9, notes: 'Labuan holding → SG operating → Indonesian plantations' },
        { id: 'h4', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 8, notes: 'Singapore ↔ Indonesia ↔ Malaysia trade circuit' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 7, notes: 'Trade finance drawdowns deployed within 72h' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 7, notes: 'Counter-party in Jakarta is a related entity controlled by same UBO' },
        { id: 'h7', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 6, notes: 'Minimal operational infrastructure for stated trade volumes' },
        { id: 'h8', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 5, notes: 'Payments routed through intermediary in Labuan' },
        { id: 'h9', category: 'Screening', factor: 'AdverseMediaHits', score: 5, notes: 'Indonesian media reports on related palm oil fraud cases' },
        { id: 'h10', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Labuan offshore financial centre used as intermediary' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-RBC-2005', date: '2025-10-30', amount: 12300000, currency: 'USD', institution: 'REPUBLIC BANKING CORP', type: 'STR', riskScore: 73, status: 'LINKED', crimeTypes: ['ML_LE', 'ML_FTD'], suspicionCategories: ['S_L_T_A', 'S_L_T_C'], narrative: 'Oceanic Ventures over-invoiced CPO (crude palm oil) shipments by 40-60% above Rotterdam benchmark. USD 12.3M in trade finance over 8 months. Counter-party in Jakarta is a related entity controlled by same UBO.' },
  ],
  status: 'CLOSED',
  analyst: 'Insp. Lim',
  priority: false,
  findings: 'Trade-based laundering investigation inconclusive. While over-invoicing indicators were present, Oceanic Ventures provided documentation showing premium pricing was for certified sustainable palm oil (RSPO). Independent commodity price verification showed pricing was within range for certified product. MAS reviewed and concurred — no actionable ML finding.',
  disseminations: [{
    id: 'DIS-HIST-2005',
    agency: 'MAS',
    date: '2026-01-08T11:00:00Z',
    intelligenceSummary: 'TBML referral — potential over-invoicing in palm oil trade. Pricing anomalies flagged but subject claims RSPO premium.',
    feedback: {
      receivedDate: '2026-03-12T14:00:00Z',
      outcome: 'NO_OFFENCE_FOUND',
      notes: 'MAS trade surveillance unit reviewed shipping documentation and RSPO certification. Pricing consistent with certified sustainable product premium. No enforcement action.',
      officialRef: 'MAS-TBML-2026-0115',
    }
  }],
  createdAt: '2025-10-18T09:00:00Z',
  closedAt: '2026-03-15T16:30:00Z',
};

const HIST_CASE_2006: IntelligenceCase = {
  id: 'HIST-2025-MCB-2006',
  title: 'Automated Triage: Cybercrime Proceeds — Daniel Ng Wei Ming',
  description: 'Subject received multiple high-value transfers from overseas accounts linked to business email compromise (BEC) schemes targeting Australian companies.',
  subjects: [{
    id: 'customer-2006',
    name: 'Daniel Ng Wei Ming',
    nationality: 'Singaporean',
    occupation: 'Freelance IT consultant',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '29/03/1995',
    idNumber: 'S9534567E',
    gender: 'Male',
    fullAddress: '15 Lorong 25 Geylang #04-08 S388232',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Cybercrime', 'Money Laundering'],
    riskProfile: {
      totalScore: 78,
      status: 'RED BRAVO HIGH',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 12, notes: 'Funds withdrawn via ATM within 2h of receipt — 15 instances' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 10, notes: 'AUD 890,000 received from 8 different Australian sources' },
        { id: 'h3', category: 'Screening', factor: 'AdverseMediaHits', score: 9, notes: 'Australian Federal Police media release re: BEC syndicate mentioning SG money mules' },
        { id: 'h4', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 8, notes: 'Inbound from AU, rapid withdrawal, no outbound — mule pattern' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 8, notes: 'No legitimate business reason for 8 unrelated AU company transfers' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 7, notes: '8 different Australian company accounts — no relationship to subject' },
        { id: 'h7', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 6, notes: 'ATM withdrawals structured to daily maximum limits' },
        { id: 'h8', category: 'Network Pattern', factor: 'HubAndSpoke', score: 6, notes: 'Subject acts as money mule hub — funds fan out to handlers' },
        { id: 'h9', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 5, notes: 'Linked to Telegram recruitment channel flagged by AFP' },
        { id: 'h10', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 4, notes: 'Inbound from AU companies with compromised credentials' },
        { id: 'h11', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 3, notes: 'Account frozen by MCB compliance pending investigation' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-MCB-2006', date: '2025-11-12', amount: 890000, currency: 'AUD', institution: 'MERIDIAN CAPITAL BANK', type: 'STR', riskScore: 78, status: 'LINKED', crimeTypes: ['ML_NP', 'ML_FTD'], suspicionCategories: ['S_L_T_A', 'S_L_T_B_I'], narrative: 'Subject Daniel Ng received AUD 890,000 from 8 Australian company accounts over 6 weeks. Each transfer followed by immediate ATM withdrawal of SGD equivalent. Pattern consistent with money mule for BEC syndicate.' },
  ],
  status: 'CLOSED',
  analyst: 'Sgt. Azizah',
  priority: false,
  findings: 'Confirmed money mule for transnational BEC syndicate. Subject received AUD 890,000 from 8 compromised Australian company accounts. Funds immediately withdrawn via ATM and handed to unknown handlers. Subject admitted to being recruited via Telegram. Coordinated with AFP via Interpol. Disseminated to CAD — subject arrested under CDSA.',
  disseminations: [{
    id: 'DIS-HIST-2006',
    agency: 'CAD',
    date: '2026-01-15T14:00:00Z',
    intelligenceSummary: 'Cybercrime/BEC money mule referral — SGD mule receiving AUD 890K from compromised Australian companies. Coordinated with AFP.',
    feedback: {
      receivedDate: '2026-03-20T10:30:00Z',
      outcome: 'DISMISSED',
      notes: 'Subject arrested and charged under CDSA s.44(1)(a). However, prosecution discontinued due to subject cooperating as witness in larger AFP-led investigation targeting syndicate principals. Case marked as dismissed per AGC direction.',
      officialRef: 'CAD-2026-REF-10234',
    }
  }],
  createdAt: '2025-11-01T10:20:00Z',
  closedAt: '2026-03-25T14:00:00Z',
};

// ═══════════════════════════════════════════════════════════════════════════
// GROUP B — CLOSED at Analysis (insufficient evidence, no dissemination) (3)
// ═══════════════════════════════════════════════════════════════════════════

const HIST_CASE_2007: IntelligenceCase = {
  id: 'HIST-2025-SFG-2007',
  title: 'Automated Triage: Insurance Fraud Suspicion — Rachel Goh Li Wen',
  description: 'Multiple insurance claims filed across 3 insurers within 6 months. SFG flagged unusual premium payment patterns.',
  subjects: [{
    id: 'customer-2007',
    name: 'Rachel Goh Li Wen',
    nationality: 'Singaporean',
    occupation: 'Insurance agent',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '15/07/1988',
    idNumber: 'S8823456F',
    gender: 'Female',
    fullAddress: 'Blk 123 Bishan Street 12 #10-456 S570123',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Fraud'],
    riskProfile: {
      totalScore: 42,
      status: 'AMBER',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 9, notes: 'Premium payments from 3 different bank accounts' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 8, notes: 'Premium payments made by third parties on 4 occasions' },
        { id: 'h3', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'SGD 156,000 in premiums across 6 months' },
        { id: 'h4', category: 'Screening', factor: 'AdverseMediaHits', score: 5, notes: 'Flagged based on insurance industry fraud alerts' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5, notes: 'Claims spread across 3 insurers to avoid cross-referencing' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 4, notes: 'Claim payouts reinvested into new policies within days' },
        { id: 'h7', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 4, notes: 'SFG compliance flagged for review' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-SFG-2007', date: '2025-11-20', amount: 156000, currency: 'SGD', institution: 'SENTOSA FINANCIAL GROUP', type: 'STR', riskScore: 42, status: 'LINKED', crimeTypes: ['ML_NP'], suspicionCategories: ['S_L_T_A'], narrative: 'Insurance agent Rachel Goh filed multiple claims across 3 insurers. Premium payments sourced from different accounts. Potential churning or staged claims.' },
  ],
  status: 'CLOSED',
  analyst: 'Insp. Pei Shan',
  priority: false,
  findings: 'Investigation found no evidence of insurance fraud. Subject is a licensed insurance agent who legitimately holds policies with multiple insurers as part of her professional portfolio. Premium payments from different accounts explained by separate personal and business banking. Claims were for genuine medical expenses. Closed — insufficient evidence of criminal conduct.',
  createdAt: '2025-11-10T14:00:00Z',
  closedAt: '2026-01-20T09:30:00Z',
};

const HIST_CASE_2008: IntelligenceCase = {
  id: 'HIST-2025-PTB-2008',
  title: 'Automated Triage: Layering via Corporate Accounts — Pinnacle Resources Pte Ltd',
  description: 'Newly incorporated company with rapid high-value turnover inconsistent with declared business activity of "general consulting".',
  subjects: [{
    id: 'customer-2008',
    name: 'Pinnacle Resources Pte Ltd',
    nationality: 'Singapore',
    occupation: 'General consulting (declared)',
    type: 'COMPANY',
    status: 'Closed',
    idNumber: '202345678N',
    directors: ['Jason Ong Wei Liang (Singaporean)'],
    ubos: ['Jason Ong Wei Liang — 100%'],
    fullAddress: '10 Anson Road #25-07 International Plaza S079903',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Money Laundering'],
    riskProfile: {
      totalScore: 55,
      status: 'AMBER',
      factors: [
        { id: 'h1', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 10, notes: 'Incorporated 3 months prior, no employees, virtual office' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 9, notes: 'SGD 1.8M turnover in first 3 months — inconsistent with consulting' },
        { id: 'h3', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 8, notes: 'Multiple transfers of SGD 200K–400K' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 7, notes: 'Revenue pattern inconsistent with any known consulting model' },
        { id: 'h5', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 6, notes: 'Sole director with no verifiable corporate history' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 5, notes: 'Payments from 3 government-linked entities' },
        { id: 'h7', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'Outbound transfers to Malaysia-based subcontractors' },
        { id: 'h8', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 5, notes: 'PTB compliance escalated for review' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-PTB-2008', date: '2025-12-01', amount: 1800000, currency: 'SGD', institution: 'PACIFIC TRUST BANK', type: 'STR', riskScore: 55, status: 'LINKED', crimeTypes: ['ML_LE'], suspicionCategories: ['S_L_T_A', 'S_L_T_F'], narrative: 'Pinnacle Resources — 3-month-old company with SGD 1.8M turnover. Sole director. Virtual office. Activity inconsistent with declared consulting business.' },
  ],
  status: 'CLOSED',
  analyst: 'Insp. Lim',
  priority: false,
  findings: 'Investigation revealed Pinnacle Resources is a legitimate IT staffing/consulting company. High turnover explained by 3 government IT project contracts (verified via GeBIZ). Director Jason Ong is a former Accenture consultant. Virtual office is an interim arrangement — physical office secured at Science Park. Closed — no ML indicators after documentary verification.',
  createdAt: '2025-11-18T08:30:00Z',
  closedAt: '2026-02-05T11:00:00Z',
};

const HIST_CASE_2009: IntelligenceCase = {
  id: 'HIST-2025-CCB-2009',
  title: 'Automated Triage: Cryptocurrency Cashout — Kevin Teo Boon Huat',
  description: 'Subject deposited large cash amounts immediately after cryptocurrency exchange withdrawals. Suspected cashout of illicit crypto proceeds.',
  subjects: [{
    id: 'customer-2009',
    name: 'Kevin Teo Boon Huat',
    nationality: 'Singaporean',
    occupation: 'Cryptocurrency trader',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '08/12/1993',
    idNumber: 'S9312345G',
    gender: 'Male',
    fullAddress: '2 Jalan Bukit Merah #08-12 S169547',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Cybercrime'],
    riskProfile: {
      totalScore: 48,
      status: 'AMBER',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 9, notes: 'SGD 340,000 cash deposits over 3 months' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 8, notes: 'Cash deposits within hours of crypto exchange withdrawals' },
        { id: 'h3', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 7, notes: 'Pattern of convert-deposit-transfer inconsistent with legitimate trading' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 6, notes: 'Crypto exchange accounts under different names' },
        { id: 'h5', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 6, notes: 'Crypto withdrawals from global exchanges (Coinbase US, Binance)' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5, notes: 'Cash deposits structured to avoid daily ATM limits' },
        { id: 'h7', category: 'Screening', factor: 'AdverseMediaHits', score: 4, notes: 'General media coverage of crypto cashout schemes in SG' },
        { id: 'h8', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 3, notes: 'CCB compliance flagged for enhanced monitoring' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-CCB-2009', date: '2025-12-10', amount: 340000, currency: 'SGD', institution: 'CHANGI COMMERCIAL BANK', type: 'STR', riskScore: 48, status: 'LINKED', crimeTypes: ['ML_NP'], suspicionCategories: ['S_L_T_A'], narrative: 'Kevin Teo deposited SGD 340,000 in cash over 3 months. Timing correlates with cryptocurrency exchange withdrawals on Coinbase/Binance. Suspected cashout of illicit crypto.' },
  ],
  status: 'CLOSED',
  analyst: 'Sgt. Azizah',
  priority: false,
  findings: 'Investigation found subject is a licensed DPT (Digital Payment Token) trader registered with MAS. Cash deposits were legitimate conversions of cryptocurrency trading profits. Blockchain analysis showed clean wallet provenance — no darknet or mixer activity. Tax filings corroborate declared crypto income. Closed — legitimate trading activity.',
  createdAt: '2025-12-01T10:00:00Z',
  closedAt: '2026-02-15T14:30:00Z',
};

// ═══════════════════════════════════════════════════════════════════════════
// GROUP C — DISSEMINATED (still awaiting agency feedback) (3 cases)
// ═══════════════════════════════════════════════════════════════════════════

const HIST_CASE_2010: IntelligenceCase = {
  id: 'HIST-2025-RBC-2010',
  title: 'Automated Triage: Underground Banking / Hawala — Amir bin Hassan',
  description: 'Subject operates an informal value transfer system (hawala) channelling funds between Singapore and the Middle East. Multiple cash deposits with no verifiable source of funds.',
  subjects: [{
    id: 'customer-2010',
    name: 'Amir bin Hassan',
    nationality: 'Singaporean',
    occupation: 'Money changer (licensed)',
    type: 'INDIVIDUAL',
    status: 'Under Review',
    dob: '04/02/1975',
    idNumber: 'S7523456H',
    gender: 'Male',
    fullAddress: '48 Arab Street #01-01 S199745',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Money Laundering'],
    riskProfile: {
      totalScore: 88,
      status: 'RED BRAVO HIGH',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 12, notes: 'SGD 2.4M cash deposits over 10 months — exceeds licensed money changer volume' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 11, notes: '156 deposits structured below SGD 20,000' },
        { id: 'h3', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 10, notes: 'Outbound remittances to UAE, Bahrain, Jordan, Yemen' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 9, notes: 'Cash deposits made by 14 different unrelated individuals' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 8, notes: 'Deposits converted to outbound remittances within 24h' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 8, notes: 'Volume SGD 2.4M vs declared revenue capacity of SGD 500K' },
        { id: 'h7', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 7, notes: 'Remittance corridors include Yemen — FATF grey list' },
        { id: 'h8', category: 'Network Pattern', factor: 'HubAndSpoke', score: 7, notes: 'Subject acts as hub — 14 depositors fan in, ME recipients fan out' },
        { id: 'h9', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 6, notes: 'Deposits consistently in round amounts of SGD 18,000–19,000' },
        { id: 'h10', category: 'Screening', factor: 'AdverseMediaHits', score: 5, notes: 'MAS advisory on unlicensed remittance businesses in Arab Street corridor' },
        { id: 'h11', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'Remittance recipients in FATF-flagged jurisdictions' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-RBC-2010', date: '2025-11-15', amount: 2400000, currency: 'SGD', institution: 'REPUBLIC BANKING CORP', type: 'STR', riskScore: 88, status: 'LINKED', crimeTypes: ['ML_NP', 'ML_SL', 'ML_TPL'], suspicionCategories: ['S_L_T_A', 'S_L_T_F', 'T_W_NAB_A_IV'], narrative: 'Licensed money changer Amir bin Hassan with SGD 2.4M in structured cash deposits over 10 months. 14 different depositors. Outbound remittances to ME. Suspected parallel hawala operation.' },
    { id: 'CTR-2025-2010', date: '2025-11-01', amount: 48000, currency: 'SGD', institution: 'REPUBLIC BANKING CORP', type: 'CTR', riskScore: 88, status: 'LINKED', narrative: 'Cash deposit of SGD 48,000 by third party on behalf of Amir bin Hassan — stated purpose: "business float".' },
  ],
  status: 'DISSEMINATED',
  analyst: 'Insp. Lim',
  priority: false,
  findings: 'Strong indicators of unlicensed remittance business (hawala) operating parallel to subject\'s licensed money changer. Volume (SGD 2.4M) significantly exceeds declared business capacity. 14 individual cash depositors identified — likely hawala clients. Outbound flows to UAE and Jordan do not match licensed remittance corridors. Disseminated to MAS for regulatory enforcement.',
  disseminations: [{
    id: 'DIS-HIST-2010',
    agency: 'MAS',
    date: '2026-02-20T10:00:00Z',
    intelligenceSummary: 'Underground banking/hawala referral — licensed money changer operating parallel unlicensed remittance system. SGD 2.4M structured deposits, 14 third-party depositors.',
    feedback: {
      receivedDate: '2026-04-01T09:00:00Z',
      outcome: 'ONGOING',
      notes: 'MAS enforcement team has opened a formal investigation. On-site inspection of subject\'s money changer premises scheduled. Requesting additional transaction records from FIU.',
      officialRef: 'MAS-ENF-2026-0203',
    }
  }],
  createdAt: '2025-10-30T09:15:00Z',
};

const HIST_CASE_2011: IntelligenceCase = {
  id: 'HIST-2025-MCB-2011',
  title: 'Automated Triage: Sanctions Evasion (Russia) — Sergei Volkov',
  description: 'Russian national maintaining multiple SGD accounts with suspicious inbound transfers from Baltic intermediaries. Possible evasion of Russia-related financial sanctions.',
  subjects: [{
    id: 'customer-2011',
    name: 'Sergei Volkov',
    nationality: 'Russian',
    occupation: 'Commodities broker',
    type: 'INDIVIDUAL',
    status: 'Under Review',
    dob: '21/09/1978',
    idNumber: 'E7834567P',
    gender: 'Male',
    fullAddress: '1 Cuscaden Road #22-05 S249715',
    screeningStatus: { isPEP: false, isPEPRelative: true, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Sanctions Evasion'],
    riskProfile: {
      totalScore: 95,
      status: 'RED BRAVO HIGH',
      factors: [
        { id: 'h1', category: 'Screening', factor: 'SanctionsProximity', score: 13, notes: 'PEP relative — father is former deputy minister in Russian energy ministry' },
        { id: 'h2', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 11, notes: 'Russian national with active sanctions risk' },
        { id: 'h3', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 10, notes: 'USD 5.6M routed via Latvia/Estonia intermediary accounts' },
        { id: 'h4', category: 'Screening', factor: 'AdverseMediaHits', score: 9, notes: 'Named in Pandora Papers leak — offshore holdings in Cyprus/BVI' },
        { id: 'h5', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 8, notes: 'Funds routed through 3-layer Baltic holding structure' },
        { id: 'h6', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 8, notes: 'Latvia → Estonia → Singapore → Cyprus fund route' },
        { id: 'h7', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 8, notes: 'USD 5.6M total inbound over 8 months' },
        { id: 'h8', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 7, notes: 'Father on EU sanctions list for Russian energy sector' },
        { id: 'h9', category: 'Screening', factor: 'PEPAssociation', score: 7, notes: 'PEP-relative status confirmed — father is Russian PEP' },
        { id: 'h10', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 6, notes: 'Baltic intermediary entities have no operational substance' },
        { id: 'h11', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'Fund flows increase after each EU sanctions round' },
        { id: 'h12', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 3, notes: 'Some transfers initiated by Baltic entities on behalf of Volkov' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-MCB-2011', date: '2025-12-05', amount: 5600000, currency: 'USD', institution: 'MERIDIAN CAPITAL BANK', type: 'STR', riskScore: 95, status: 'LINKED', crimeTypes: ['T_T_NS_RS', 'ML_LE'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_C'], narrative: 'Russian national Sergei Volkov received USD 5.6M via Latvian and Estonian intermediary accounts. Father is a Russian PEP. Named in Pandora Papers. Possible sanctions evasion using Baltic route.' },
  ],
  status: 'DISSEMINATED',
  analyst: 'Sgt. Wong',
  priority: false,
  findings: 'Sergei Volkov is a Russian national with PEP-relative status (father: former deputy energy minister). USD 5.6M received via a 3-layer Baltic holding structure (Latvia → Estonia → Singapore). Named in Pandora Papers for undisclosed Cyprus/BVI holdings. While Volkov himself is not personally sanctioned, fund flows strongly suggest circumvention of Russia-related sectoral sanctions. Referred to FOREIGN_FIU for cross-border coordination with Baltic FIUs.',
  disseminations: [{
    id: 'DIS-HIST-2011',
    agency: 'FOREIGN_FIU',
    date: '2026-03-01T16:00:00Z',
    intelligenceSummary: 'Cross-border sanctions evasion referral — Russian PEP-relative routing USD 5.6M through Baltic intermediaries to Singapore. Egmont Group coordination requested with Latvian and Estonian FIUs.',
  }],
  createdAt: '2025-11-20T07:45:00Z',
};

const HIST_CASE_2012: IntelligenceCase = {
  id: 'HIST-2025-SFG-2012',
  title: 'Automated Triage: Terrorism Financing — Al-Baraka Charity Foundation',
  description: 'Charity foundation with disproportionate administrative spending and fund transfers to high-risk jurisdictions inconsistent with declared humanitarian mission.',
  subjects: [{
    id: 'customer-2012',
    name: 'Al-Baraka Charity Foundation',
    nationality: 'Singapore',
    occupation: 'Registered charity (IPC status)',
    type: 'COMPANY',
    status: 'Under Review',
    idNumber: 'T15CC0034A',
    directors: ['Imam Abdul Rashid (Singaporean)', 'Dr. Fatimah bte Yusof (Singaporean)', 'Khalid Al-Mansouri (Qatari)'],
    fullAddress: '62 Joo Chiat Place #03-01 S427784',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Terrorism Financing'],
    riskProfile: {
      totalScore: 67,
      status: 'AMBER',
      factors: [
        { id: 'h1', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 11, notes: 'Fund transfers to Syria, Somalia, and southern Philippines — active conflict zones' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 9, notes: '68% of donated funds spent on "administration" — far above charity norm of 15-20%' },
        { id: 'h3', category: 'Screening', factor: 'AdverseMediaHits', score: 8, notes: 'Director Khalid Al-Mansouri linked to Qatar-based entity on UN monitoring list' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 7, notes: 'Donations received from 8 corporate entities with no public charitable mandate' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'SGD 890,000 channelled through cash-intensive fundraising events' },
        { id: 'h6', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 7, notes: 'Fund flows to 3 conflict-zone jurisdictions' },
        { id: 'h7', category: 'Network Pattern', factor: 'HubAndSpoke', score: 6, notes: 'Multiple corporate donors funnel into charity, then fan out to conflict zones' },
        { id: 'h8', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5, notes: 'Outbound transfers structured below SGD 10,000' },
        { id: 'h9', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 4, notes: 'Multiple sub-entities and programme accounts under foundation umbrella' },
        { id: 'h10', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 3, notes: 'SFG compliance flagged for enhanced due diligence' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-SFG-2012', date: '2025-12-15', amount: 890000, currency: 'SGD', institution: 'SENTOSA FINANCIAL GROUP', type: 'STR', riskScore: 67, status: 'LINKED', crimeTypes: ['T_T_NS_IAT', 'T_T_NS_TB'], suspicionCategories: ['S_L_T_B_II', 'T_W_NAB_A_IV'], narrative: 'Al-Baraka Charity Foundation — registered IPC with 68% administrative spend ratio. Fund transfers to Syria, Somalia, Philippines. Director linked to UN-monitored Qatari entity. Corporate donations from 8 entities with no charitable mandate.' },
  ],
  status: 'DISSEMINATED',
  analyst: 'Insp. Kumar',
  priority: false,
  findings: 'Al-Baraka Charity Foundation exhibits multiple TF red flags: disproportionate admin spend (68% vs sector avg of 15-20%), fund transfers to conflict zones, director with adverse links, and corporate donors with no charitable history. While direct TF nexus not yet established, risk profile warrants LEA investigation. Disseminated to AGC for TSOFA assessment.',
  disseminations: [{
    id: 'DIS-HIST-2012',
    agency: 'AGC',
    date: '2026-03-15T09:30:00Z',
    intelligenceSummary: 'TF suspicion referral — registered charity with disproportionate admin spend, conflict-zone transfers, and director linked to UN-monitored entity. TSOFA assessment recommended.',
  }],
  createdAt: '2025-12-01T11:30:00Z',
};

// ═══════════════════════════════════════════════════════════════════════════
// GROUP D — DISMISSED at Triage (false positives / duplicates) (3 cases)
// ═══════════════════════════════════════════════════════════════════════════

const HIST_CASE_2013: IntelligenceCase = {
  id: 'HIST-2025-PTB-2013',
  title: 'Automated Triage: Unusual Activity — Jennifer Low Siew Ping',
  description: 'Large deposits flagged by PTB compliance but activity consistent with legitimate property transaction.',
  subjects: [{
    id: 'customer-2013',
    name: 'Jennifer Low Siew Ping',
    nationality: 'Singaporean',
    occupation: 'Property developer',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '12/01/1980',
    idNumber: 'S8012345H',
    gender: 'Female',
    fullAddress: '38 Scotts Road #24-01 S228229',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Fraud'],
    riskProfile: {
      totalScore: 22,
      status: 'GREEN LOW',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 8, notes: 'SGD 3.2M deposit — explained by property sale completion' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 6, notes: 'Single large deposit followed by multiple outbound transfers' },
        { id: 'h3', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 5, notes: 'Outbound transfers to 4 parties within 48h of deposit' },
        { id: 'h4', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 3, notes: 'Automated threshold trigger — no prior flags on account' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-PTB-2013', date: '2025-12-18', amount: 3200000, currency: 'SGD', institution: 'PACIFIC TRUST BANK', type: 'STR', riskScore: 22, status: 'LINKED', crimeTypes: ['ML_NP'], suspicionCategories: ['S_L_T_A'], narrative: 'Jennifer Low deposited SGD 3.2M followed by transfers to multiple parties. Activity flagged as unusual but may relate to property transaction.' },
  ],
  status: 'DISMISSED',
  analyst: 'Insp. Pei Shan',
  priority: false,
  findings: 'Dismissed at triage — verified property sale completion. SGD 3.2M deposit matches URA caveat records for 38 Nassim Hill. Outbound transfers to contractors, agent commission, and IRAS stamp duty. Legitimate property transaction.',
  createdAt: '2025-12-12T14:30:00Z',
  closedAt: '2025-12-20T10:00:00Z',
};

const HIST_CASE_2014: IntelligenceCase = {
  id: 'HIST-2025-CCB-2014',
  title: 'Automated Triage: Duplicate Alert — Christopher Wong Kah Fai',
  description: 'Duplicate STR filing — same activity already captured under a prior case. CCB compliance filed secondary alert due to system migration.',
  subjects: [{
    id: 'customer-2014',
    name: 'Christopher Wong Kah Fai',
    nationality: 'Singaporean',
    occupation: 'Remisier (stock broker)',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '05/09/1972',
    idNumber: 'S7234567J',
    gender: 'Male',
    fullAddress: 'Blk 456 Clementi Avenue 3 #06-789 S120456',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Money Laundering'],
    riskProfile: {
      totalScore: 18,
      status: 'GREEN LOW',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'SGD 180,000 in share trading proceeds — normal for remisier' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 4, notes: 'Account closure pattern triggered re-alert' },
        { id: 'h3', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 4, notes: 'Account closure triggered duplicate alert during CCB system migration' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 3, notes: 'Trading proceeds moved to personal account — normal for remisier' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-CCB-2014', date: '2026-01-05', amount: 180000, currency: 'SGD', institution: 'CHANGI COMMERCIAL BANK', type: 'STR', riskScore: 18, status: 'LINKED', crimeTypes: ['ML_NP'], suspicionCategories: ['S_L_T_A'], narrative: 'Duplicate filing — same customer activity already reported under prior case. Secondary alert generated during CCB AML system migration.' },
  ],
  status: 'DISMISSED',
  analyst: 'Insp. Lim',
  priority: false,
  findings: 'Dismissed — duplicate alert. Same transaction activity was reported under a prior STR filing and already assessed. CCB confirmed this was a secondary alert generated during their AML system migration to new platform. No new suspicious activity identified.',
  createdAt: '2025-12-28T08:00:00Z',
  closedAt: '2026-01-08T11:00:00Z',
};

const HIST_CASE_2015: IntelligenceCase = {
  id: 'HIST-2025-RBC-2015',
  title: 'Automated Triage: Phishing Victim — Priya Nair',
  description: 'Account flagged for rapid outbound transfers but subject identified as a phishing victim, not a perpetrator.',
  subjects: [{
    id: 'customer-2015',
    name: 'Priya Nair',
    nationality: 'Singaporean',
    occupation: 'University lecturer',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '19/04/1985',
    idNumber: 'S8512345K',
    gender: 'Female',
    fullAddress: '15 Kent Ridge Crescent #05-08 S119276',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Cybercrime'],
    riskProfile: {
      totalScore: 15,
      status: 'GREEN LOW',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 7, notes: 'SGD 45,000 transferred out in 20 minutes to unknown accounts' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'Transfer pattern inconsistent with 3-year account history' },
        { id: 'h3', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 3, notes: 'Account locked post-incident by RBC fraud team' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-RBC-2015', date: '2026-01-10', amount: 45000, currency: 'SGD', institution: 'REPUBLIC BANKING CORP', type: 'STR', riskScore: 15, status: 'LINKED', crimeTypes: ['ML_NP'], suspicionCategories: ['S_L_T_A'], narrative: 'Priya Nair account — SGD 45,000 rapid outbound transfers to 3 unknown accounts in 20 minutes. Customer subsequently filed police report claiming she was a phishing victim.' },
  ],
  status: 'DISMISSED',
  analyst: 'Sgt. Azizah',
  priority: false,
  findings: 'Dismissed at triage — subject is a victim, not perpetrator. Priya Nair fell victim to a phishing scam (fake Singpass login page). SGD 45,000 transferred by scammer who gained access to her iBanking credentials. Police report filed (G/20260108/2034). Referred to Anti-Scam Centre for victim support. Not an FIU case.',
  createdAt: '2026-01-05T16:20:00Z',
  closedAt: '2026-01-12T09:00:00Z',
};

// ═══════════════════════════════════════════════════════════════════════════
// GROUP E — HIBERNATED (auto-routed low risk, score < 10) (3 cases)
// ═══════════════════════════════════════════════════════════════════════════

const HIST_CASE_2016: IntelligenceCase = {
  id: 'HIST-2025-MCB-2016',
  title: 'Automated Triage: Low-Risk Alert — Mark Chen Jia Hao',
  description: 'Minor threshold exceedance on a single cash deposit. Customer is a long-standing MCB client with clean history.',
  subjects: [{
    id: 'customer-2016',
    name: 'Mark Chen Jia Hao',
    nationality: 'Singaporean',
    occupation: 'Dental surgeon (private practice)',
    type: 'INDIVIDUAL',
    status: 'Open',
    dob: '30/06/1979',
    idNumber: 'S7923456L',
    gender: 'Male',
    fullAddress: '1 Orchard Boulevard #12-03 S248649',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Money Laundering'],
    riskProfile: {
      totalScore: 6,
      status: 'GREEN LOW',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 4, notes: 'Single cash deposit of SGD 22,000 — slightly above threshold' },
        { id: 'h2', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 2, notes: 'Clean account history — 15-year relationship with MCB' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-MCB-2016', date: '2026-01-15', amount: 22000, currency: 'SGD', institution: 'MERIDIAN CAPITAL BANK', type: 'STR', riskScore: 6, status: 'LINKED', narrative: 'Single cash deposit of SGD 22,000 by long-standing customer Mark Chen. Minor threshold exceedance. No other risk indicators.' },
  ],
  status: 'HIBERNATED',
  priority: false,
  createdAt: '2026-01-12T10:30:00Z',
};

const HIST_CASE_2017: IntelligenceCase = {
  id: 'HIST-2025-SFG-2017',
  title: 'Automated Triage: Low-Risk Alert — Green Valley Enterprises Pte Ltd',
  description: 'Automated alert triggered by year-end bonus payroll disbursement exceeding daily threshold. Established SME with clean compliance history.',
  subjects: [{
    id: 'customer-2017',
    name: 'Green Valley Enterprises Pte Ltd',
    nationality: 'Singapore',
    occupation: 'Landscape maintenance services',
    type: 'COMPANY',
    status: 'Open',
    idNumber: '201034567G',
    directors: ['Ahmad bin Osman (Singaporean)'],
    ubos: ['Ahmad bin Osman — 100%'],
    fullAddress: '21 Mandai Estate #01-05 S729930',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Fraud'],
    riskProfile: {
      totalScore: 5,
      status: 'GREEN LOW',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 3, notes: 'SGD 180,000 payroll disbursement — year-end bonuses for 45 staff' },
        { id: 'h2', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 2, notes: 'Seasonal spike — same pattern observed in prior years' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-SFG-2017', date: '2026-01-20', amount: 180000, currency: 'SGD', institution: 'SENTOSA FINANCIAL GROUP', type: 'STR', riskScore: 5, status: 'LINKED', narrative: 'Year-end payroll disbursement of SGD 180,000 by Green Valley Enterprises. 45-employee company. Same pattern in prior years. Automated threshold alert — no suspicion.' },
  ],
  status: 'HIBERNATED',
  priority: false,
  createdAt: '2026-01-18T08:00:00Z',
};

const HIST_CASE_2018: IntelligenceCase = {
  id: 'HIST-2025-PTB-2018',
  title: 'Automated Triage: Low-Risk Alert — Tan Beng Seng',
  description: 'Elderly customer made a single large withdrawal for home renovation. Bank filed precautionary STR due to customer age and amount.',
  subjects: [{
    id: 'customer-2018',
    name: 'Tan Beng Seng',
    nationality: 'Singaporean',
    occupation: 'Retired civil servant',
    type: 'INDIVIDUAL',
    status: 'Open',
    dob: '14/11/1950',
    idNumber: 'S5012345M',
    gender: 'Male',
    fullAddress: 'Blk 89 Whampoa Drive #03-22 S320089',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
    crimeTypologies: ['Money Laundering'],
    riskProfile: {
      totalScore: 4,
      status: 'GREEN LOW',
      factors: [
        { id: 'h1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 3, notes: 'SGD 58,000 withdrawal — stated purpose: HDB renovation' },
        { id: 'h2', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 1, notes: 'Precautionary filing — elderly customer, otherwise clean' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-PTB-2018', date: '2026-01-22', amount: 58000, currency: 'SGD', institution: 'PACIFIC TRUST BANK', type: 'STR', riskScore: 4, status: 'LINKED', narrative: 'Elderly customer Tan Beng Seng withdrew SGD 58,000. Stated purpose: HDB flat renovation. Precautionary filing by PTB compliance due to customer age (75) and cash amount.' },
  ],
  status: 'HIBERNATED',
  priority: false,
  createdAt: '2026-01-20T14:15:00Z',
};

// ═══════════════════════════════════════════════════════════════════════════
// GROUP F — CLOSED via PRIORITY bypass → Disseminate → Closed (2 cases)
// ═══════════════════════════════════════════════════════════════════════════

const HIST_CASE_2019: IntelligenceCase = {
  id: 'HIST-2025-CCB-2019',
  title: '⚠️ CRITICAL — Terrorism Financing Network — Crescent Moon Foundation',
  description: 'PRIORITY BYPASS: Charity front funding extremist recruitment in Southeast Asia. Cross-border fund flows to designated entities in southern Philippines and Indonesia.',
  subjects: [{
    id: 'customer-2019',
    name: 'Crescent Moon Foundation',
    nationality: 'Singapore',
    occupation: 'Registered society (deregistered)',
    type: 'COMPANY',
    status: 'Closed',
    idNumber: 'T18SS0089C',
    directors: ['Abu Zaid bin Abdullah (Malaysian)', 'Iskandar Shah (Indonesian)'],
    fullAddress: '15 Geylang Road #02-01 S389235',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: true, sanctionsMatch: true },
    crimeTypologies: ['Terrorism Financing', 'Money Laundering'],
    riskProfile: {
      totalScore: 168,
      status: 'RED CRITICAL',
      factors: [
        { id: 'h1', category: 'Screening', factor: 'SanctionsProximity', score: 18, notes: 'Direct fund transfers to UN-designated Abu Sayyaf-linked entity' },
        { id: 'h2', category: 'Screening', factor: 'AdverseMediaHits', score: 16, notes: 'ISD intelligence report flagging extremist recruitment activity in SG' },
        { id: 'h3', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 15, notes: 'Fund flows to Mindanao, Sulawesi — active conflict zones' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 14, notes: 'SGD 1.2M funnelled through cash-intensive events and donations' },
        { id: 'h5', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 13, notes: 'Cash collected from 200+ individuals at multiple events across SG' },
        { id: 'h6', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 12, notes: 'Multiple sub-accounts and related entities used to obscure flows' },
        { id: 'h7', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 11, notes: 'Remittances structured below SGD 5,000 per transaction' },
        { id: 'h8', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 10, notes: 'Directors are Malaysian and Indonesian nationals with conflict-zone ties' },
        { id: 'h9', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 10, notes: 'Event proceeds remitted within 48h of collection' },
        { id: 'h10', category: 'Network Pattern', factor: 'HubAndSpoke', score: 9, notes: '200+ donors → foundation hub → 5 conflict-zone recipients' },
        { id: 'h11', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 9, notes: 'Fundraising spikes correlate with known extremist operations timeline' },
        { id: 'h12', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 8, notes: 'Abu Zaid linked to designated JI network via Malaysian intelligence' },
        { id: 'h13', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 8, notes: 'SG → Malaysia → Philippines → Indonesia fund routes' },
        { id: 'h14', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 7, notes: '"Charitable supplies" shipments used to mask cash couriering' },
        { id: 'h15', category: 'Screening', factor: 'PEPAssociation', score: 5, notes: 'Director linked to political figures in Mindanao' },
        { id: 'h16', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 3, notes: 'Foundation has no verifiable humanitarian operations at declared sites' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-CCB-2019', date: '2025-10-20', amount: 1200000, currency: 'SGD', institution: 'CHANGI COMMERCIAL BANK', type: 'STR', riskScore: 168, status: 'LINKED', crimeTypes: ['T_T_NS_IAT', 'T_T_NS_RS', 'ML_NP', 'ML_SL'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], narrative: 'CRITICAL: Crescent Moon Foundation funnelling SGD 1.2M to extremist-linked entities in southern Philippines and Indonesia. Cash collected at religious events. Directors linked to designated groups.' },
    { id: 'CMR-2025-2019', date: '2025-09-15', amount: 95000, currency: 'SGD', institution: 'ICA CHECKPOINT (CHANGI)', type: 'CMR', riskScore: 168, status: 'LINKED', narrative: 'Director Abu Zaid bin Abdullah declared SGD 95,000 cash on departure to Kota Kinabalu. Stated purpose: "charitable mission". Cross-referenced with Crescent Moon Foundation case.' },
  ],
  status: 'CLOSED',
  analyst: 'Insp. Kumar',
  priority: true,
  findings: 'PRIORITY CASE — auto-escalated due to critical risk score (168). Crescent Moon Foundation confirmed as a front for extremist recruitment fundraising. SGD 1.2M collected via religious events channelled to Abu Sayyaf-linked entities in Mindanao. Directors Abu Zaid and Iskandar identified by ISD as facilitators. Immediate dissemination to ICA for border controls and AGC for TSOFA designation. Foundation deregistered by ROS. Both directors arrested under ISA.',
  disseminations: [{
    id: 'DIS-HIST-2019',
    agency: 'ICA',
    date: '2025-11-05T08:00:00Z',
    intelligenceSummary: 'URGENT TF referral — charity front for extremist fundraising. SGD 1.2M to Abu Sayyaf-linked entities. Directors identified for border control measures.',
    feedback: {
      receivedDate: '2025-12-20T14:00:00Z',
      outcome: 'CONVICTION',
      notes: 'Both directors detained under ISA s.8. Foundation designated under TSOFA. Assets frozen. SGD 890,000 recovered from linked accounts. Case referred to Interpol for regional coordination.',
      officialRef: 'ISD-ISA-2025-0012',
    }
  }],
  createdAt: '2025-10-05T06:30:00Z',
  closedAt: '2026-01-10T09:00:00Z',
};

const HIST_CASE_2020: IntelligenceCase = {
  id: 'HIST-2025-RBC-2020',
  title: '⚠️ CRITICAL — Sanctions Evasion (DPRK) — Ivan Petrov',
  description: 'PRIORITY BYPASS: Ukrainian-born broker facilitating financial transactions for DPRK-linked procurement network. Multiple hits on UNSC and OFAC lists.',
  subjects: [{
    id: 'customer-2020',
    name: 'Ivan Petrov',
    nationality: 'Ukrainian',
    occupation: 'International trade broker',
    type: 'INDIVIDUAL',
    status: 'Closed',
    dob: '03/07/1970',
    idNumber: 'E7045678Q',
    gender: 'Male',
    fullAddress: '6 Shenton Way #38-01 S068809',
    screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true },
    crimeTypologies: ['Sanctions Evasion', 'Money Laundering'],
    riskProfile: {
      totalScore: 155,
      status: 'RED CRITICAL',
      factors: [
        { id: 'h1', category: 'Screening', factor: 'SanctionsProximity', score: 17, notes: 'Direct transactions with OFAC SDN-listed Korea Kwangson Banking Corp' },
        { id: 'h2', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 15, notes: 'Named in UN Panel of Experts report S/2025/171 on DPRK sanctions evasion' },
        { id: 'h3', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 14, notes: 'Transactions involving DPRK, Iran, and Syria — all FATF black-listed' },
        { id: 'h4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 13, notes: 'USD 8.9M routed through Singapore accounts over 14 months' },
        { id: 'h5', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 12, notes: 'Used 4 shell companies across HK, BVI, and Marshall Islands' },
        { id: 'h6', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 11, notes: 'Funds typically cleared within 24h through correspondent banks' },
        { id: 'h7', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 10, notes: '4-layer shell structure across 3 jurisdictions to obscure fund flows' },
        { id: 'h8', category: 'Screening', factor: 'AdverseMediaHits', score: 10, notes: 'Subject named in multiple UN Panel of Experts reports' },
        { id: 'h9', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 9, notes: 'SG → HK → BVI → Marshall Islands → DPRK correspondent chain' },
        { id: 'h10', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 8, notes: 'Transaction timing correlates with DPRK procurement cycles' },
        { id: 'h11', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 8, notes: 'Fake trade invoices for "industrial equipment" to mask fund transfers' },
        { id: 'h12', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 7, notes: 'DPRK — most sanctioned jurisdiction globally' },
        { id: 'h13', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 7, notes: 'Shell companies act as intermediaries — no economic substance' },
        { id: 'h14', category: 'Network Pattern', factor: 'HubAndSpoke', score: 7, notes: 'Petrov acts as professional broker hub for DPRK procurement network' },
        { id: 'h15', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 4, notes: 'Transactions split across 4 shell entities to avoid detection' },
        { id: 'h16', category: 'Account Behaviour', factor: 'CancelledCustomerScore', score: 3, notes: 'RBC flagged and froze accounts pending investigation' },
      ]
    }
  }],
  reports: [
    { id: 'STR-2025-RBC-2020', date: '2025-10-25', amount: 8900000, currency: 'USD', institution: 'REPUBLIC BANKING CORP', type: 'STR', riskScore: 155, status: 'LINKED', crimeTypes: ['T_T_NS_RS', 'T_T_NS_TB', 'ML_LE', 'ML_FTD'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C'], narrative: 'CRITICAL: Ivan Petrov facilitated USD 8.9M in transactions for DPRK procurement network. Direct links to OFAC SDN Korea Kwangson Banking Corp. Named in UN PoE DPRK report. 4 shell companies used as conduits.' },
    { id: 'CTR-2025-2020', date: '2025-10-10', amount: 120000, currency: 'USD', institution: 'REPUBLIC BANKING CORP', type: 'CTR', riskScore: 155, status: 'LINKED', narrative: 'Cash deposit of USD 120,000 by Ivan Petrov. Source of funds unverifiable. Petrov stated "trade commission payment".' },
  ],
  status: 'CLOSED',
  analyst: 'Sgt. Wong',
  priority: true,
  findings: 'PRIORITY CASE — auto-escalated due to critical risk score (155). Ivan Petrov is a professional sanctions evasion broker facilitating financial transactions for DPRK procurement networks. USD 8.9M routed through 4 shell companies (HK, BVI, Marshall Islands) to circumvent UNSC sanctions. Direct links to OFAC SDN-listed Korea Kwangson Banking Corp confirmed. Named in UN Panel of Experts Report S/2025/171. Immediate dissemination to CAD. Subject arrested at Changi Airport attempting to flee jurisdiction.',
  disseminations: [{
    id: 'DIS-HIST-2020',
    agency: 'CAD',
    date: '2025-11-10T07:00:00Z',
    intelligenceSummary: 'URGENT sanctions evasion referral — DPRK procurement network facilitator. USD 8.9M via shell companies. OFAC SDN links confirmed. UN PoE named individual. Flight risk.',
    feedback: {
      receivedDate: '2026-01-15T11:30:00Z',
      outcome: 'ASSET_SEIZURE',
      notes: 'Subject arrested at Changi Airport. USD 6.2M frozen across 4 shell company accounts (RBC, HSBC HK, BVI registered agent). Passport impounded. Charged under UN Act and CDSA. Remanded pending trial. Interpol Red Notice issued.',
      officialRef: 'CAD-2025-REF-99012',
    }
  }],
  createdAt: '2025-10-02T05:00:00Z',
  closedAt: '2026-01-20T16:00:00Z',
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT — Combined historical cases array
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_CASES_HISTORICAL: IntelligenceCase[] = [
  // Group A — Closed via Disseminate → Feedback → Closed
  HIST_CASE_2001,
  HIST_CASE_2002,
  HIST_CASE_2003,
  HIST_CASE_2004,
  HIST_CASE_2005,
  HIST_CASE_2006,
  // Group B — Closed at Analysis (no dissemination)
  HIST_CASE_2007,
  HIST_CASE_2008,
  HIST_CASE_2009,
  // Group C — Disseminated (awaiting feedback)
  HIST_CASE_2010,
  HIST_CASE_2011,
  HIST_CASE_2012,
  // Group D — Dismissed at Triage
  HIST_CASE_2013,
  HIST_CASE_2014,
  HIST_CASE_2015,
  // Group E — Hibernated (auto-routed low risk)
  HIST_CASE_2016,
  HIST_CASE_2017,
  HIST_CASE_2018,
  // Group F — Closed via Priority Bypass → Disseminate → Closed
  HIST_CASE_2019,
  HIST_CASE_2020,
];
