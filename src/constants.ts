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

// ─── Batch Run 2026-03-03 — Entity Profiles ────────────────────────────────

export const AHMAD_SULAIMAN_PROFILE: PersonProfile = {
  id: 'customer-1001', name: 'Ahmad Bin Sulaiman', nationality: 'Singaporean', occupation: 'Management executive', type: 'INDIVIDUAL', status: 'Open',
  dob: '14/04/1987', idNumber: 'S8712340A', gender: 'Male',
  fullAddress: 'Blk 411 Hougang Avenue 10 #08-22 S530411',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
  crimeTypologies: ['Money Laundering'],
  riskProfile: { totalScore: 45, status: 'AMBER', factors: [
    { id: 'r1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r2', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6 },
    { id: 'r3', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r4', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5 },
    { id: 'r5', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5 },
    { id: 'r7', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r8', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4 },
    { id: 'r9', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};

export const NATALIA_PETROVA_PROFILE: PersonProfile = {
  id: 'customer-1002', name: 'Natalia Petrova', nationality: 'Russian', occupation: 'Trade broker', type: 'INDIVIDUAL', status: 'Open',
  dob: '03/11/1985', idNumber: 'M19283746', gender: 'Female',
  fullAddress: 'Pasdaran Avenue, Tehran, Iran',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: false },
  crimeTypologies: ['Sanctions Evasion', 'Money Laundering'],
  riskProfile: { totalScore: 51, status: 'AMBER', factors: [
    { id: 'r1', category: 'Screening', factor: 'SanctionsProximity', score: 9 },
    { id: 'r2', category: 'Screening', factor: 'PEPAssociation', score: 7 },
    { id: 'r3', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r4', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r5', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5 },
    { id: 'r7', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5 },
    { id: 'r8', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r9', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};

export const DRAGON_GATE_PROFILE: PersonProfile = {
  id: 'customer-1003', name: 'Dragon Gate Pte Limited', nationality: 'Singapore', occupation: 'General wholesale trade', type: 'COMPANY', status: 'Open',
  idNumber: 'UEN 202312345W',
  directors: ['Chen Jian Wei (S8401232D)'],
  shareholders: ['Chen Jian Wei — 51%', 'Shenzhen Golden Bridge Trading Co. Ltd (CN) — 49%'],
  fullAddress: '10 Anson Road #20-01 S079903',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
  crimeTypologies: ['Money Laundering'],
  riskProfile: { totalScore: 60, status: 'AMBER', factors: [
    { id: 'r1', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8 },
    { id: 'r2', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r3', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6 },
    { id: 'r4', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6 },
    { id: 'r5', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5 },
    { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r7', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r8', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5 },
    { id: 'r9', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5 },
    { id: 'r10', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r11', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};

export const LEE_WEI_JIAN_PROFILE: PersonProfile = {
  id: 'customer-1004', name: 'Lee Wei Jian', nationality: 'Singaporean', occupation: 'Director / Shareholder', type: 'INDIVIDUAL', status: 'Open',
  dob: '29/05/1979', idNumber: 'S7901234B', gender: 'Male',
  aliases: ['Jason Lee', 'Li Weijian'],
  fullAddress: '31 Sentosa Cove Ave #04-08 S098751',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: true, sanctionsMatch: true },
  crimeTypologies: ['Sanctions Evasion'],
  riskProfile: { totalScore: 68, status: 'AMBER', factors: [
    { id: 'r1', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 12 },
    { id: 'r2', category: 'Screening', factor: 'SanctionsProximity', score: 9 },
    { id: 'r3', category: 'Screening', factor: 'PEPAssociation', score: 7 },
    { id: 'r4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r5', category: 'Screening', factor: 'AdverseMediaHits', score: 6 },
    { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r7', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5 },
    { id: 'r8', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r9', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r10', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4 },
    { id: 'r11', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};

export const SYNERGY_ASIA_PROFILE: PersonProfile = {
  id: 'customer-1005', name: 'Synergy Asia Trading Pte Ltd', nationality: 'Singapore', occupation: 'Securities trading', type: 'COMPANY', status: 'Open',
  idNumber: 'UEN 201988432N',
  directors: ['Michael Tan Eng Huat (S8103412G)'],
  shareholders: ['Michael Tan Eng Huat — 60%', 'Apex Capital Partners (Labuan) — 40%'],
  fullAddress: '18 Robinson Road #12-00 S048547',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
  crimeTypologies: ['Money Laundering'],
  riskProfile: { totalScore: 55, status: 'AMBER', factors: [
    { id: 'r1', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8 },
    { id: 'r2', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r3', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6 },
    { id: 'r4', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6 },
    { id: 'r5', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5 },
    { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r7', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r8', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5 },
    { id: 'r9', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r10', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};

export const RAJAN_PROFILE: PersonProfile = {
  id: 'customer-1006', name: 'Rajan Krishnamurthy', nationality: 'Indian (Singapore PR)', occupation: 'Retired', type: 'INDIVIDUAL', status: 'Open',
  dob: '17/02/1966', idNumber: 'F6612345H', gender: 'Male',
  fullAddress: 'Blk 77 Toa Payoh Lorong 4 #11-22 S310077',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
  crimeTypologies: ['Money Laundering'],
  riskProfile: { totalScore: 45, status: 'AMBER', factors: [
    { id: 'r1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r2', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6 },
    { id: 'r3', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r4', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5 },
    { id: 'r5', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5 },
    { id: 'r7', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r8', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4 },
    { id: 'r9', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};

export const PYONGYANG_TECH_PROFILE: PersonProfile = {
  id: 'customer-1007', name: 'Pyongyang Tech Export Co.', nationality: 'DPRK', occupation: 'Technology export', type: 'COMPANY', status: 'Open',
  aliases: ['PT Global Trade Solutions'],
  fullAddress: 'Ryomyong Street, Pyongyang, DPRK',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true },
  crimeTypologies: ['Terrorism Financing', 'Sanctions Evasion', 'Money Laundering'],
  riskProfile: { totalScore: 79, status: 'RED', factors: [
    { id: 'r1', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 12 },
    { id: 'r2', category: 'Screening', factor: 'SanctionsProximity', score: 9 },
    { id: 'r3', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8 },
    { id: 'r4', category: 'Screening', factor: 'PEPAssociation', score: 7 },
    { id: 'r5', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r6', category: 'Screening', factor: 'AdverseMediaHits', score: 6 },
    { id: 'r7', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6 },
    { id: 'r8', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5 },
    { id: 'r9', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r10', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5 },
    { id: 'r11', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r12', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 }
  ]}
};

export const TAN_MEI_LING_PROFILE: PersonProfile = {
  id: 'customer-1008', name: 'Tan Mei Ling', nationality: 'Singaporean', occupation: 'Administrative assistant', type: 'INDIVIDUAL', status: 'Open',
  dob: '05/07/1992', idNumber: 'S9201234C', gender: 'Female',
  fullAddress: 'Blk 201 Tampines Street 21 #14-108 S520201',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: true, sanctionsMatch: false },
  crimeTypologies: ['Fraud / Cheating', 'Money Laundering'],
  riskProfile: { totalScore: 40, status: 'AMBER', factors: [
    { id: 'r1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r2', category: 'Account Status', factor: 'CancelledCustomerScore', score: 6 },
    { id: 'r3', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5 },
    { id: 'r4', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r5', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r6', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r7', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4 },
    { id: 'r8', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};

export const ONG_BEE_LIAN_PROFILE: PersonProfile = {
  id: 'customer-1009', name: 'Ong Bee Lian', nationality: 'Singaporean', occupation: 'Retired schoolteacher', type: 'INDIVIDUAL', status: 'Open',
  dob: '22/08/1975', idNumber: 'S7534210B', gender: 'Female',
  fullAddress: 'Blk 203 Jurong East Street 21 #04-15 S600203',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
  crimeTypologies: ['Money Laundering'],
  riskProfile: { totalScore: 4, status: 'GREEN LOW', factors: [
    { id: 'r1', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 }
  ]}
};

export const SUNRISE_WELLNESS_PROFILE: PersonProfile = {
  id: 'customer-1010', name: 'Sunrise Wellness Pte Ltd', nationality: 'Singapore', occupation: 'Health supplements wholesale', type: 'COMPANY', status: 'Open',
  idNumber: 'UEN 202008876W',
  directors: ['Koh Chee Wai'],
  fullAddress: '52 Toa Payoh Lorong 1 #01-08 S310052',
  screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
  crimeTypologies: ['Money Laundering'],
  riskProfile: { totalScore: 8, status: 'GREEN LOW', factors: [
    { id: 'r1', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r2', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4 }
  ]}
};

export const VIKTOR_LAZAREV_PROFILE: PersonProfile = {
  id: 'customer-1011', name: 'Viktor Lazarev', nationality: 'Russian', occupation: 'Private investor / Former Deputy Minister', type: 'INDIVIDUAL', status: 'Open',
  dob: '19/06/1968', idNumber: 'RF72114589', gender: 'Male',
  aliases: ['Viktor Andreyevich Lazarev'],
  fullAddress: 'Rublyovo-Uspenskoye Highway, Moscow, Russia',
  screeningStatus: { isPEP: true, isPEPRelative: true, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true },
  crimeTypologies: ['Money Laundering', 'Sanctions Evasion', 'Terrorism Financing'],
  riskProfile: { totalScore: 156, status: 'RED CRITICAL', factors: [
    { id: 'r1', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 12 },
    { id: 'r2', category: 'Screening', factor: 'SanctionsProximity', score: 9 },
    { id: 'r3', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8 },
    { id: 'r4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r5', category: 'Screening', factor: 'PEPAssociation', score: 7 },
    { id: 'r6', category: 'Screening', factor: 'AdverseMediaHits', score: 6 },
    { id: 'r7', category: 'Account Status', factor: 'CancelledCustomerScore', score: 6 },
    { id: 'r8', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6 },
    { id: 'r9', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6 },
    { id: 'r10', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5 },
    { id: 'r11', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r12', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5 },
    { id: 'r13', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5 },
    { id: 'r14', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5 },
    { id: 'r15', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r16', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r17', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4 },
    { id: 'r18', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};

export const GOLDEN_PHOENIX_PROFILE: PersonProfile = {
  id: 'customer-1012', name: 'Golden Phoenix International Ltd', nationality: 'Malaysia (Labuan)', occupation: 'Jade, gemstones, and timber trading', type: 'COMPANY', status: 'Open',
  idNumber: 'LL-2023-18876',
  directors: ['Gen. (Ret.) Aung Kyaw Moe'],
  shareholders: ['Gen. (Ret.) Aung Kyaw Moe (Myanmar) — UBO', 'Phoenix Jade Trading Pte Ltd (Singapore) — Subsidiary'],
  fullAddress: 'Level 12, Main Office Tower, Financial Park Labuan, Malaysia',
  screeningStatus: { isPEP: true, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true },
  crimeTypologies: ['Money Laundering', 'Sanctions Evasion', 'Terrorism Financing'],
  riskProfile: { totalScore: 151, status: 'RED CRITICAL', factors: [
    { id: 'r1', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 12 },
    { id: 'r2', category: 'Screening', factor: 'SanctionsProximity', score: 9 },
    { id: 'r3', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8 },
    { id: 'r4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7 },
    { id: 'r5', category: 'Screening', factor: 'PEPAssociation', score: 7 },
    { id: 'r6', category: 'Screening', factor: 'AdverseMediaHits', score: 6 },
    { id: 'r7', category: 'Account Status', factor: 'CancelledCustomerScore', score: 6 },
    { id: 'r8', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6 },
    { id: 'r9', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6 },
    { id: 'r10', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5 },
    { id: 'r11', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5 },
    { id: 'r12', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5 },
    { id: 'r13', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5 },
    { id: 'r14', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5 },
    { id: 'r15', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5 },
    { id: 'r16', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4 },
    { id: 'r17', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4 },
    { id: 'r18', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4 }
  ]}
};


export const MOCK_CASES: IntelligenceCase[] = [
  // ─── Mock Batch Run 2026-03-03 — Meridian Capital Bank ───────────────────────
  {
    id: 'TASK-2026-MCB-1001',
    title: 'Automated Triage: Structuring / Smurfing — Ahmad Bin Sulaiman',
    description: 'Customer is making repeated cash transactions consistently below the SGD 10,000 reporting threshold (avg SGD 9,800). Structuring window ratio 82%, round amounts ratio 76% across 24 transactions, with Benford\'s Law deviation of 0.18. Indicators consistent with deliberate cash structuring. Cross-border CMR filed 03/12/2025 (CMR-2026-0101): SGD 53,500 declared on entry from Malaysia.',
    subjects: [{
      id: 'customer-1001', name: 'Ahmad Bin Sulaiman', nationality: 'Singaporean', occupation: 'Management executive', type: 'INDIVIDUAL', status: 'Open',
      dob: '14/04/1987', idNumber: 'S8712340A', gender: 'Male',
      fullAddress: 'Blk 411 Hougang Avenue 10 #08-22 S530411',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
      crimeTypologies: ['Money Laundering'],
      riskProfile: { totalScore: 45, status: 'AMBER', factors: [
        { id: 'r1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — SGD 303,800 total cash across 31 transactions' },
        { id: 'r2', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6, notes: 'High — consolidation outflow within 3 days of deposits' },
        { id: 'r3', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'Medium — cross-border Malaysia cash movements' },
        { id: 'r4', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5, notes: 'High — 29 deposits below SGD 10k threshold over 6 months' },
        { id: 'r5', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — Benford\'s Law deviation 0.18' },
        { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'Medium — SGD→MYR cross-border flows' },
        { id: 'r7', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Medium — Malaysia frequent crossings' },
        { id: 'r8', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4, notes: 'High — 76% round-amount ratio' },
        { id: 'r9', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'Medium — Malaysian real estate entity as counterparty' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-MCB-1001', date: '2026-03-03', amount: 303800, currency: 'SGD', institution: 'MERIDIAN CAPITAL BANK', type: 'STR', riskScore: 45, status: 'TRIAGED', crimeTypes: ['ML_NP', 'ML_SL'], suspicionCategories: ['S_L_T_A', 'S_L_T_F', 'T_W_NAB_A_IV'], narrative: 'Structuring detected: 29 sub-threshold cash deposits + SGD 285,000 consolidation outflow to Malaysian real estate entity.' },
      { id: 'CMR-2026-0101', date: '2025-12-03', amount: 53500, currency: 'SGD', institution: 'ICA CHECKPOINT (WOODLANDS)', type: 'CMR', riskScore: 45, status: 'TRIAGED', narrative: 'SGD 49,000 + MYR 15,000 (equiv SGD 53,500) declared on cross-border entry from Malaysia.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-18T09:12:33Z'
  },
  {
    id: 'TASK-2026-MCB-1002',
    title: 'Automated Triage: Cross-Border Layering / Sanctions Evasion — Natalia Petrova',
    description: 'Customer Natalia Petrova is domiciled in Iran (FATF High Risk). She has conducted transactions totalling SGD 287,500 with jurisdictions including Iran and North Korea (FATF Blacklisted). IRN→SGD→PRK triangulation pattern. CMR filed 28/01/2026: USD 207,500 physical cash declared at Changi Airport; source declared as Iranian entity, recipient declared as North Korean entity.',
    subjects: [{
      id: 'customer-1002', name: 'Natalia Petrova', nationality: 'Russian', occupation: 'Trade broker', type: 'INDIVIDUAL', status: 'Open',
      dob: '03/11/1985', idNumber: 'M19283746', gender: 'Female',
      fullAddress: 'Pasdaran Avenue, Tehran, Iran',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: false },
      crimeTypologies: ['Money Laundering', 'Sanctions Evasion', 'Terrorism Financing'],
      riskProfile: { totalScore: 51, status: 'AMBER', factors: [
        { id: 'r1', category: 'Screening', factor: 'SanctionsProximity', score: 9, notes: 'High — Iran/DPRK FATF counterparties' },
        { id: 'r2', category: 'Screening', factor: 'PEPAssociation', score: 7, notes: 'Medium — Iranian government-linked source entity' },
        { id: 'r3', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — USD 207,500 physical cash declared' },
        { id: 'r4', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'High — Iran FATF High Risk jurisdiction' },
        { id: 'r5', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — IRN→SGD→PRK triangulation' },
        { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'High — IRN→SGD→PRK across 3 FATF-risk jurisdictions' },
        { id: 'r7', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5, notes: 'Medium — Iranian entity sourcing through Russian broker' },
        { id: 'r8', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'High — Iran/DPRK' },
        { id: 'r9', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'High — funds not owned by carrier' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-SFG-1002', date: '2026-03-03', amount: 2455000, currency: 'USD', institution: 'SENTOSA FINANCIAL GROUP', type: 'STR', riskScore: 51, status: 'TRIAGED', crimeTypes: ['ML_NP', 'ML_TPL', 'ML_FTD', 'T_T_NS_RS', 'T_T_NS_TB'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], narrative: 'IRN→SGD→PRK triangulation: Iranian inflows transit Singapore account and exit to DPRK-linked entity within 7 days. Filed under CDSA s.39 + TSOFA.' },
      { id: 'CMR-2026-0102', date: '2026-01-28', amount: 207500, currency: 'USD', institution: 'ICA CHECKPOINT (CHANGI)', type: 'CMR', riskScore: 51, status: 'TRIAGED', narrative: 'USD 207,500 cash declared on arrival from Iran. Source: Caspian Trade Partners LLC (Iran). Recipient: North Star Resources Co. (DPRK).' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-20T14:05:17Z'
  },
  {
    id: 'TASK-2026-MCB-1003',
    title: 'Automated Triage: Hub-and-Spoke / Corporate ML — Dragon Gate Pte Limited',
    description: 'Corporate entity Dragon Gate Pte Limited displays hub-and-spoke pattern across 14 spoke accounts with rapid fund turnover. 23 inflow-outflow cycles detected: funds arrive from Chinese/HK entities and 95–98% transits to BVI/Cayman nominees within 3–8 business days. Director declared CNY 830k + HKD 1.2M bearer cheque (CMR-2026-0103) on entry from China 15/02/2026.',
    subjects: [{
      id: 'customer-1003', name: 'Dragon Gate Pte Limited', nationality: 'Singapore', occupation: 'General wholesale trade', type: 'COMPANY', status: 'Open',
      idNumber: 'UEN 202312345W',
      directors: ['Chen Jian Wei (S8401232D)'],
      shareholders: ['Chen Jian Wei — 51%', 'Shenzhen Golden Bridge Trading Co. Ltd (CN) — 49%'],
      fullAddress: '10 Anson Road #20-01 S079903',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
      crimeTypologies: ['Money Laundering'],
      riskProfile: { totalScore: 60, status: 'AMBER', factors: [
        { id: 'r1', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8, notes: 'High — company retains negligible operating balance, no GST filings' },
        { id: 'r2', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — SGD 18.5M across 23 cycles' },
        { id: 'r3', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6, notes: 'High — 95–98% of each inflow exits within 3–8 business days' },
        { id: 'r4', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6, notes: 'High — no verifiable supply chain' },
        { id: 'r5', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5, notes: 'High — CN/HK source entities + BVI/Cayman nominees' },
        { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'Medium — CN/HK source jurisdictions' },
        { id: 'r7', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — outflows match inflow values within 98%' },
        { id: 'r8', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'High — CN/HK→SGD→BVI/Cayman across 4+ jurisdictions' },
        { id: 'r9', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5, notes: 'High — Singapore account acts as single transit node' },
        { id: 'r10', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Medium — China/HK/BVI/Cayman' },
        { id: 'r11', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'High — bearer cheque from Kowloon Pacific Holdings' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-PTB-1003', date: '2026-03-03', amount: 18500000, currency: 'SGD', institution: 'PACIFIC TRADE BANK', type: 'STR', riskScore: 60, status: 'TRIAGED', crimeTypes: ['ML_LE', 'ML_TPL', 'ML_FTD'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_II', 'T_W_NAB_A_IV'], narrative: 'SGD 18.5M across 23 hub-and-spoke cycles; company retains negligible operating balance. No GST filings or verifiable supply chain.' },
      { id: 'CMR-2026-0103', date: '2026-02-15', amount: 362000, currency: 'SGD', institution: 'ICA CHECKPOINT (CHANGI)', type: 'CMR', riskScore: 60, status: 'TRIAGED', narrative: 'Director Chen Jian Wei declared CNY 830,000 + HKD 1,200,000 bearer cheque (equiv SGD 362,000) on entry from China.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-21T10:33:41Z'
  },
  {
    id: 'TASK-2026-MCB-1004',
    title: 'Automated Triage: Sanctions Evasion (OFAC SDN) — Lee Wei Jian',
    description: 'Customer Lee Wei Jian is indirectly linked to OFAC SDN-listed entities via 2 hops. OFAC SDN positive match triggered 03/03/2026: SDN-LEE-WJ-2025-0441 under EO13694 (Cyber-related sanctions). Concurrent UN Consolidated Sanctions List match. Account blocked. USD 7,850,000 in circular PRC→SGD→PRC flows across 6 cycles.',
    subjects: [{
      id: 'customer-1004', name: 'Lee Wei Jian', nationality: 'Singaporean', occupation: 'Director / Shareholder', type: 'INDIVIDUAL', status: 'Open',
      dob: '29/05/1979', idNumber: 'S7901234B', gender: 'Male',
      aliases: ['Jason Lee', 'Li Weijian'],
      fullAddress: '31 Sentosa Cove Ave #04-08 S098751',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: true, sanctionsMatch: true },
      crimeTypologies: ['Money Laundering', 'Sanctions Evasion'],
      riskProfile: { totalScore: 68, status: 'AMBER', factors: [
        { id: 'r1', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 12, notes: 'High — OFAC SDN match confirmed SDN-LEE-WJ-2025-0441' },
        { id: 'r2', category: 'Screening', factor: 'SanctionsProximity', score: 9, notes: 'High — 2-hop link to SDN-listed entities' },
        { id: 'r3', category: 'Screening', factor: 'PEPAssociation', score: 7, notes: 'Medium — associated with sanctioned entities' },
        { id: 'r4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — USD 7,850,000 circular flows' },
        { id: 'r5', category: 'Screening', factor: 'AdverseMediaHits', score: 6, notes: 'High — adverse media + sanctions convergence' },
        { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'Medium — PRC counterparty jurisdiction' },
        { id: 'r7', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'High — PRC→SGD→PRC circular flows' },
        { id: 'r8', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — circular flow pattern across 6 cycles' },
        { id: 'r9', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Medium — PRC jurisdiction' },
        { id: 'r10', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4, notes: 'Medium — round-amount wire transfers' },
        { id: 'r11', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'High — flows through intermediary entities' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-SFG-1004', date: '2026-03-03', amount: 7850000, currency: 'USD', institution: 'SENTOSA FINANCIAL GROUP', type: 'STR', riskScore: 68, status: 'TRIAGED', crimeTypes: ['ML_NP', 'ML_LE', 'ML_FTD', 'T_T_NS_RS'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], narrative: 'OFAC SDN match — USD 7,850,000 circular flow PRC→SGD→PRC. Account frozen. Referral to MAS under Financial Sanctions regime. Filed CDSA s.39 + UN Act Cap.339A.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-24T08:15:02Z'
  },
  {
    id: 'TASK-2026-MCB-1005',
    title: 'Automated Triage: TBML / Mirror Trading — Synergy Asia Trading Pte Ltd',
    description: 'Trade-Based Money Laundering indicators detected. Synergy Asia Trading Pte Ltd executed a back-to-back physical gold mirror trade (Buy SGD 450,000 → Sell SGD 394,200 next day, 12.4% loss accepted). Compound exposure: electronic wire cycling (Labuan ↔ SGD ↔ Shanghai) + PSMD cash commodity layering. CTR-2026-0105 filed by PSMD Meridian Precious Assets.',
    subjects: [{
      id: 'customer-1005', name: 'Synergy Asia Trading Pte Ltd', nationality: 'Singapore', occupation: 'Securities trading and investment', type: 'COMPANY', status: 'Open',
      idNumber: 'UEN 201988432N',
      directors: ['Michael Tan Eng Huat (S8103412G)'],
      shareholders: ['Michael Tan Eng Huat — 60%', 'Apex Capital Partners (Labuan) — 40%'],
      fullAddress: '18 Robinson Road #12-00 S048547',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
      crimeTypologies: ['Money Laundering'],
      riskProfile: { totalScore: 55, status: 'AMBER', factors: [
        { id: 'r1', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8, notes: 'High — Labuan shareholder + minimal operating history' },
        { id: 'r2', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — SGD 450,000 cash gold purchase' },
        { id: 'r3', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6, notes: 'High — buy/sell within 24 hours' },
        { id: 'r4', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6, notes: 'High — TBML mirror trade via precious metals' },
        { id: 'r5', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5, notes: 'High — Labuan 40% shareholder' },
        { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'Medium — Labuan offshore shareholder' },
        { id: 'r7', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — 12.4% loss on gold resale accepted' },
        { id: 'r8', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5, notes: 'Medium — Labuan↔SGD↔Shanghai wire cycling' },
        { id: 'r9', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Medium — Labuan/Shanghai counterparties' },
        { id: 'r10', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'High — PSMD counterparty transaction' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-PTB-1005', date: '2026-03-03', amount: 4500000, currency: 'USD', institution: 'PACIFIC TRADE BANK', type: 'STR', riskScore: 55, status: 'TRIAGED', crimeTypes: ['ML_LE', 'ML_FTD', 'ML_TPL'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_I', 'T_W_NAB_A_IV', 'T_W_NAB_QFI'], narrative: 'TBML via dual mechanism: Labuan wire cycling + PSMD precious metals mirror trade. Cross-reference CTR-2026-0105.' },
      { id: 'CTR-2026-0105', date: '2026-02-16', amount: 450000, currency: 'SGD', institution: 'MERIDIAN PRECIOUS ASSETS', type: 'CTR', riskScore: 55, status: 'TRIAGED', narrative: 'Back-to-back gold bullion purchase (SGD 450,000) and sale (SGD 394,200) within 24 hours. 12.4% economic loss accepted. 5th bar destination unknown.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-22T11:47:29Z'
  },
  {
    id: 'TASK-2026-MCB-1006',
    title: 'Automated Triage: Dormant Account Reactivation — Rajan Krishnamurthy',
    description: 'Account dormant for 612 days suddenly reactivated with markedly elevated transaction activity. Average transaction value SGD 360,000 exceeds 99th percentile of peer group. SGD 2,880,000 received from Mauritius family trust, 97% immediately transited to unnamed Indian beneficiary. Trust layering mechanism suspected: India → Mauritius → Singapore → India.',
    subjects: [{
      id: 'customer-1006', name: 'Rajan Krishnamurthy', nationality: 'Indian (Singapore PR)', occupation: 'Retired', type: 'INDIVIDUAL', status: 'Open',
      dob: '17/02/1966', idNumber: 'F6612345H', gender: 'Male',
      fullAddress: 'Blk 77 Toa Payoh Lorong 4 #11-22 S310077',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
      crimeTypologies: ['Money Laundering'],
      riskProfile: { totalScore: 45, status: 'AMBER', factors: [
        { id: 'r1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — SGD 2,880,000 total through dormant account' },
        { id: 'r2', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6, notes: 'High — 97% transited to Indian beneficiary within 3–8 days' },
        { id: 'r3', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — dormant account reactivated after 59 months' },
        { id: 'r4', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5, notes: 'High — multiple cycles matching dormancy reactivation pattern' },
        { id: 'r5', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'Medium — Mauritius trust source' },
        { id: 'r6', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'High — India→Mauritius→Singapore→India trust layering' },
        { id: 'r7', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Medium — Mauritius/India' },
        { id: 'r8', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4, notes: 'Medium — round-amount trust disbursements' },
        { id: 'r9', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'High — unnamed Indian beneficiary' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-MCB-1006', date: '2026-03-03', amount: 2880000, currency: 'SGD', institution: 'MERIDIAN CAPITAL BANK', type: 'STR', riskScore: 45, status: 'TRIAGED', crimeTypes: ['ML_NP', 'ML_TPL'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_C', 'T_W_NAB_A_IV'], narrative: 'Dormant account reactivated: SGD 2.88M from Mauritius trust, 97% transited to Indian beneficiary within 3–8 days per cycle. Trust deed and trustee identity unverified.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-25T15:22:08Z'
  },
  {
    id: 'TASK-2026-MCB-1007',
    title: '⚠️ CRITICAL — Proliferation Financing (WMD) — Pyongyang Tech Export Co.',
    description: 'PROLIFERATION FINANCING — CRITICAL PRIORITY: Pyongyang Tech Export Co. is directly linked to UNSC Res.1718 designated Korea Ryonbong General Corporation (WMD proliferator). Account opened under alias. CMR-2026-0107: North Korean national Kim Sung Jin declared USD 250,000 cash at Changi — source named as Korea Ryonbong on CMR form. ICA detained same day. Referred to SPF-CAD.',
    subjects: [{
      id: 'customer-1007', name: 'Pyongyang Tech Export Co.', nationality: 'DPRK', occupation: 'Technology equipment export (front entity)', type: 'COMPANY', status: 'Open',
      aliases: ['PT Global Trade Solutions', 'PTE Co. Ltd'],
      idNumber: 'No verifiable registration',
      directors: ['Kim Sung Jin (PRK-PAX-7734912)'],
      fullAddress: 'Ryomyong Street, Pyongyang, DPRK',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true },
      crimeTypologies: ['Terrorism Financing', 'Sanctions Evasion', 'Money Laundering'],
      riskProfile: { totalScore: 79, status: 'RED', factors: [
        { id: 'r1', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 12, notes: 'High — Korea Ryonbong General Corp: UNSC Res.1718 DESIGNATED WMD proliferator' },
        { id: 'r2', category: 'Screening', factor: 'SanctionsProximity', score: 9, notes: 'High — DPRK + Iran UNSC-sanctioned counterparties' },
        { id: 'r3', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8, notes: 'High — alias-registered front entity, no verifiable registration' },
        { id: 'r4', category: 'Screening', factor: 'PEPAssociation', score: 7, notes: 'High — DPRK state entity linkage' },
        { id: 'r5', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — USD 250,000 physical cash + USD 3.9M wire flows' },
        { id: 'r6', category: 'Screening', factor: 'AdverseMediaHits', score: 6, notes: 'High — Korea Ryonbong in multiple WMD proliferation reports' },
        { id: 'r7', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6, notes: 'High — dual-use technology procurement pattern' },
        { id: 'r8', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5, notes: 'High — alias entities and front company structure' },
        { id: 'r9', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'High — DPRK FATF Blacklisted jurisdiction' },
        { id: 'r10', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'High — CN→SGD→UAE→IRN across 4 FATF-risk jurisdictions' },
        { id: 'r11', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — cash chosen to circumvent SWIFT/banking controls' },
        { id: 'r12', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'High — DPRK/Iran/UAE/China' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-CCB-1007', date: '2026-03-03', amount: 3900000, currency: 'USD', institution: 'CHANGI COMMERCIAL BANK', type: 'STR', riskScore: 79, status: 'TRIAGED', crimeTypes: ['T_T_NS_RS', 'T_T_NS_TB', 'T_T_NS_IAT', 'ML_LE', 'ML_FTD'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], narrative: 'DPRK proliferation financing: China sourcing → UAE transit → Iran end-use (dual-use technology). Filed CDSA s.39 + TSOFA + UN Act Cap.339A. SPF-CAD referral. All accounts frozen.' },
      { id: 'CMR-2026-0107', date: '2025-10-19', amount: 250000, currency: 'USD', institution: 'ICA CHECKPOINT (CHANGI)', type: 'CMR', riskScore: 79, status: 'TRIAGED', narrative: 'CRITICAL: USD 250,000 cash declared by North Korean national. Source on CMR: Korea Ryonbong General Corp (UNSC Res.1718 DESIGNATED). ICA detained carrier same day.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-14T07:55:19Z'
  },
  {
    id: 'TASK-2026-MCB-1008',
    title: 'Automated Triage: Fraud / Money Mule — Tan Mei Ling',
    description: 'Customer account cancelled due to Fraud Flag. Customer holds 7 bank accounts across 3 institutions. Receives round-amount PayNow/FAST transfers from 7 unrelated individuals, then immediately withdraws 97% as cash (mule pattern). CTR-2026-0108 filed by Golden Link Pawnbrokers: 3 pawn transactions totalling SGD 16,500, jewellery inconsistent with financial profile. SPF CID investigation CID-SCAM-2026-REF-8812 opened.',
    subjects: [{
      id: 'customer-1008', name: 'Tan Mei Ling', nationality: 'Singaporean', occupation: 'Administrative assistant', type: 'INDIVIDUAL', status: 'Open',
      dob: '05/07/1992', idNumber: 'S9201234C', gender: 'Female',
      fullAddress: 'Blk 201 Tampines Street 21 #14-108 S520201',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: true, sanctionsMatch: false },
      crimeTypologies: ['Money Laundering', 'Fraud / Cheating'],
      riskProfile: { totalScore: 40, status: 'AMBER', factors: [
        { id: 'r1', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — SGD 247,500 received + SGD 16,500 pawn cash-out' },
        { id: 'r2', category: 'Account Status', factor: 'CancelledCustomerScore', score: 6, notes: 'High — account cancelled with Fraud Flag, 7 accounts across 3 banks' },
        { id: 'r3', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5, notes: 'High — 7 unrelated senders, systematic cash withdrawal pattern' },
        { id: 'r4', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — 97% immediately withdrawn as cash' },
        { id: 'r5', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'Low — domestic but cross-institution mule pattern' },
        { id: 'r6', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Low — domestic transactions' },
        { id: 'r7', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4, notes: 'High — all inflows and pawn loans in exact round amounts' },
        { id: 'r8', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'High — 7 unrelated senders' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-RBC-1008', date: '2026-03-03', amount: 247500, currency: 'SGD', institution: 'RAFFLES BANKING CORPORATION', type: 'STR', riskScore: 40, status: 'TRIAGED', crimeTypes: ['ML_NP', 'ML_SL', 'F_C_WTF', 'F_C_IF'], suspicionCategories: ['S_L_T_A', 'S_L_T_F', 'T_W_NAB_A_II', 'T_W_NAB_A_IV'], narrative: 'Money mule: SGD 247,500 received from 7 unrelated senders, 97% immediately withdrawn as cash. SPF CID referral CID-SCAM-2026-REF-8812. Accounts cancelled Fraud Flag.' },
      { id: 'CTR-2026-0108', date: '2026-01-20', amount: 16500, currency: 'SGD', institution: 'GOLDEN LINK PAWNBROKERS', type: 'CTR', riskScore: 40, status: 'TRIAGED', narrative: '3 pawn transactions totalling SGD 16,500: 22K gold necklace + 18K diamond bracelet + 24K bar pendants. All round amounts. Jewellery inconsistent with financial profile of administrative assistant.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-26T13:08:44Z'
  },
  {
    id: 'TASK-2026-MCB-1009',
    title: 'Automated Triage: Low-Risk Geographic Flag — Ong Bee Lian',
    description: 'Minimal risk. Retired schoolteacher sending regular monthly remittances of SGD 6,000 to family member (sister) in Jakarta, Indonesia. Pattern consistent for over 2 years. Single geographic flag (Indonesia) triggered low-level alert. No behavioural anomalies detected. Score below active triage threshold.',
    subjects: [{
      id: 'customer-1009', name: 'Ong Bee Lian', nationality: 'Singaporean', occupation: 'Retired schoolteacher', type: 'INDIVIDUAL', status: 'Open',
      dob: '22/08/1975', idNumber: 'S7534210B', gender: 'Female',
      fullAddress: 'Blk 203 Jurong East Street 21 #04-15 S600203',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
      crimeTypologies: ['Money Laundering'],
      riskProfile: { totalScore: 4, status: 'GREEN LOW', factors: [
        { id: 'r1', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Low — Indonesia geographic flag only' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-MCB-1009', date: '2026-03-03', amount: 12000, currency: 'SGD', institution: 'MERIDIAN CAPITAL BANK', type: 'STR', riskScore: 4, status: 'TRIAGED', crimeTypes: ['ML_NP'], suspicionCategories: ['T_W_NAB_A_IV'], narrative: 'Automated STR triggered by geographic risk flag. Regular monthly remittances of SGD 6,000 to family member in Jakarta. Consistent 2-year pattern. No other risk indicators.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-28T16:30:55Z'
  },
  {
    id: 'TASK-2026-MCB-1010',
    title: 'Automated Triage: Low-Risk Round Amounts — Sunrise Wellness Pte Ltd',
    description: 'Low risk. Singapore-incorporated health supplements wholesaler with 6-year operating history. Minor geographic flag (Cambodia) combined with low-level round-amount indicator (4 payments of exactly SGD 12,000 to established Cambodian supplier). Payments consistent with normal wholesale supplier payments. Score below active triage threshold.',
    subjects: [{
      id: 'customer-1010', name: 'Sunrise Wellness Pte Ltd', nationality: 'Singapore', occupation: 'Health supplements wholesale', type: 'COMPANY', status: 'Open',
      idNumber: 'UEN 202008876W',
      directors: ['Koh Chee Wai'],
      fullAddress: '52 Toa Payoh Lorong 1 #01-08 S310052',
      screeningStatus: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false },
      crimeTypologies: ['Money Laundering'],
      riskProfile: { totalScore: 8, status: 'GREEN LOW', factors: [
        { id: 'r1', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'Low — Cambodia geographic flag' },
        { id: 'r2', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4, notes: 'Low — 4 payments of exactly SGD 12,000' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-SFG-1010', date: '2026-03-03', amount: 48000, currency: 'SGD', institution: 'SENTOSA FINANCIAL GROUP', type: 'STR', riskScore: 8, status: 'TRIAGED', crimeTypes: ['ML_NP'], suspicionCategories: ['T_W_NAB_A_IV'], narrative: 'Automated STR triggered by minor geographic flag (Cambodia) and round-amount pattern (31% ratio). Payments to established Cambodian supplier consistent with normal business.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-03-01T09:45:12Z'
  },
  {
    id: 'TASK-2026-MCB-1011',
    title: '⚠️ CRITICAL — Sanctions Evasion / PEP Network — Viktor Lazarev',
    description: 'CRITICAL: Russian national and former Deputy Minister of Industry and Trade — confirmed PEP. Direct links to 2 OFAC/EU sanctioned defence entities (Rostec, Promtechnologia). Named in OCCRP investigation and Pandora Papers leak. 7-layer ownership structure across 7 jurisdictions. Fund throughput of SGD 8.5M with 1.8hr average holding period. Trade invoice discrepancies at 62% with 2.15x over-invoicing ratio. Extreme hub-and-spoke network (14 spokes, 0.97 centrality). CMR-2026-0111: USD 185,000 cash declared on entry from UAE (Russia via Dubai). Immediate priority escalation required.',
    subjects: [{
      id: 'customer-1011', name: 'Viktor Lazarev', nationality: 'Russian', occupation: 'Private investor / Former Deputy Minister', type: 'INDIVIDUAL', status: 'Open',
      dob: '19/06/1968', idNumber: 'RF72114589', gender: 'Male',
      aliases: ['Viktor Andreyevich Lazarev'],
      fullAddress: 'Rublyovo-Uspenskoye Highway, Moscow, Russia',
      screeningStatus: { isPEP: true, isPEPRelative: true, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true },
      crimeTypologies: ['Money Laundering', 'Sanctions Evasion', 'Terrorism Financing'],
      riskProfile: { totalScore: 156, status: 'RED CRITICAL', factors: [
        { id: 'r1', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 12, notes: 'High — OFAC/EU sanctioned Rostec + Promtechnologia' },
        { id: 'r2', category: 'Screening', factor: 'SanctionsProximity', score: 9, notes: 'High — direct links to 2 sanctioned defence entities' },
        { id: 'r3', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8, notes: 'High — 7-layer shell structure across 7 jurisdictions' },
        { id: 'r4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — SGD 8.5M fund throughput + USD 185,000 cash declared' },
        { id: 'r5', category: 'Screening', factor: 'PEPAssociation', score: 7, notes: 'High — former Deputy Minister, spouse on Gazprom subsidiary board' },
        { id: 'r6', category: 'Screening', factor: 'AdverseMediaHits', score: 6, notes: 'High — named in OCCRP + Pandora Papers' },
        { id: 'r7', category: 'Account Status', factor: 'CancelledCustomerScore', score: 6, notes: 'High — account flagged for sanctions review' },
        { id: 'r8', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6, notes: 'High — 1.8hr average holding period' },
        { id: 'r9', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6, notes: 'High — 62% trade invoice discrepancies, 2.15x over-invoicing' },
        { id: 'r10', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5, notes: 'High — 7 layers across 7 jurisdictions' },
        { id: 'r11', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'High — Russia (sanctioned jurisdiction)' },
        { id: 'r12', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'High — Russia/UAE/Cyprus/Singapore/BVI/Cayman/Seychelles' },
        { id: 'r13', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5, notes: 'High — 14 spokes, 0.97 centrality score' },
        { id: 'r14', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5, notes: 'High — structured flows across multiple shell entities' },
        { id: 'r15', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — trade invoice discrepancies at 62%' },
        { id: 'r16', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'High — Russia/UAE/Cyprus' },
        { id: 'r17', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4, notes: 'Medium — round-amount wire transfers' },
        { id: 'r18', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'High — flows through Cypriot and BVI shells' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-CCB-1011', date: '2026-03-03', amount: 8500000, currency: 'USD', institution: 'CHANGI COMMERCIAL BANK', type: 'STR', riskScore: 156, status: 'TRIAGED', crimeTypes: ['ML_NP', 'ML_TPL', 'ML_FTD', 'T_T_NS_RS', 'T_T_NS_TB'], suspicionCategories: ['S_L_T_A', 'S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'S_L_T_F', 'T_W_NAB_A_IV'], narrative: 'CRITICAL: Russian PEP with OFAC/EU sanctioned defence entity links. USD 8.5M throughput via 7-layer shell network. Trade invoice discrepancies 62%. Pandora Papers named. Immediate escalation.' },
      { id: 'CMR-2026-0111', date: '2025-01-12', amount: 251600, currency: 'SGD', institution: 'ICA CHECKPOINT (CHANGI)', type: 'CMR', riskScore: 156, status: 'TRIAGED', narrative: 'USD 185,000 physical cash declared on entry from UAE (Russia via Dubai). Confirmed PEP with OFAC SDN-linked counterparties.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-10T06:30:22Z'
  },
  {
    id: 'TASK-2026-MCB-1012',
    title: '⚠️ CRITICAL — Sanctions Evasion / Military-Linked Shell — Golden Phoenix International Ltd',
    description: 'CRITICAL: Myanmar-linked Labuan-registered shell company with direct ties to 2 sanctioned military-controlled entities (MEHL, Myanmar Gems Enterprise). UBO is retired military general Gen. (Ret.) Aung Kyaw Moe — confirmed PEP. 6-layer ownership across 4 jurisdictions. Jade and gemstone trade with 55% invoice discrepancies. Fund throughput SGD 6.2M with 2.4hr holding period. Hub-and-spoke network with 11 spokes. Subsidiary shares nominee director. CMR-2026-0112: USD 250,000 cash declared on entry from Thailand (Myanmar via Bangkok). Immediate priority escalation required.',
    subjects: [{
      id: 'customer-1012', name: 'Golden Phoenix International Ltd', nationality: 'Malaysia (Labuan)', occupation: 'Jade, gemstones, and timber trading', type: 'COMPANY', status: 'Open',
      idNumber: 'LL-2023-18876',
      directors: ['Gen. (Ret.) Aung Kyaw Moe'],
      shareholders: ['Gen. (Ret.) Aung Kyaw Moe (Myanmar) — UBO', 'Phoenix Jade Trading Pte Ltd (Singapore) — Subsidiary'],
      fullAddress: 'Level 12, Main Office Tower, Financial Park Labuan, Malaysia',
      screeningStatus: { isPEP: true, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true },
      crimeTypologies: ['Money Laundering', 'Sanctions Evasion', 'Terrorism Financing'],
      riskProfile: { totalScore: 151, status: 'RED CRITICAL', factors: [
        { id: 'r1', category: 'Screening', factor: 'CustomerIndirectLinkToHotlistRanked', score: 12, notes: 'High — OFAC SDN (MEHL) + UNSC (Myanmar Gems Enterprise)' },
        { id: 'r2', category: 'Screening', factor: 'SanctionsProximity', score: 9, notes: 'High — direct ties to 2 sanctioned military entities' },
        { id: 'r3', category: 'Entity Risk', factor: 'ShellCompanyIndicators', score: 8, notes: 'High — Labuan shell + BVI beneficial ownership + nominee director' },
        { id: 'r4', category: 'Transaction Behaviour', factor: 'HighValueCashTransaction', score: 7, notes: 'High — SGD 6.2M throughput + USD 250,000 cash declared' },
        { id: 'r5', category: 'Screening', factor: 'PEPAssociation', score: 7, notes: 'High — UBO is retired Myanmar military general' },
        { id: 'r6', category: 'Screening', factor: 'AdverseMediaHits', score: 6, notes: 'High — named in Justice for Myanmar NGO reports' },
        { id: 'r7', category: 'Account Status', factor: 'CancelledCustomerScore', score: 6, notes: 'High — account flagged for sanctions review' },
        { id: 'r8', category: 'Transaction Behaviour', factor: 'RapidMovementOfFundsCustomer', score: 6, notes: 'High — 2.4hr average holding period' },
        { id: 'r9', category: 'Transaction Pattern', factor: 'TradeBasedLaundering', score: 6, notes: 'High — 55% jade invoice discrepancies' },
        { id: 'r10', category: 'Entity Risk', factor: 'ComplexOwnershipStructure', score: 5, notes: 'High — 6 layers across 4 jurisdictions' },
        { id: 'r11', category: 'Jurisdiction Risk', factor: 'CustomerFromHighRiskCountry', score: 5, notes: 'High — Myanmar (sanctioned jurisdiction)' },
        { id: 'r12', category: 'Jurisdiction Risk', factor: 'CustomerHasTransactionWithDifferentJurisdictions', score: 5, notes: 'High — Myanmar/Thailand/Labuan/Singapore/BVI' },
        { id: 'r13', category: 'Network Pattern', factor: 'HubAndSpoke', score: 5, notes: 'High — 11 spokes across Myanmar/Thailand/Singapore' },
        { id: 'r14', category: 'Transaction Behaviour', factor: 'StructuringRelationship', score: 5, notes: 'High — structured jade auction settlements' },
        { id: 'r15', category: 'Transaction Behaviour', factor: 'UnusualTransactionPattern', score: 5, notes: 'High — jade trade inconsistent with company profile' },
        { id: 'r16', category: 'Jurisdiction Risk', factor: 'GeographicRiskCountry', score: 4, notes: 'High — Myanmar/Labuan' },
        { id: 'r17', category: 'Transaction Behaviour', factor: 'RoundAmountsCustomer', score: 4, notes: 'Medium — round-amount jade settlements' },
        { id: 'r18', category: 'Transaction Behaviour', factor: 'ThirdPartyTransactions', score: 4, notes: 'High — Myanmar military-controlled entities as source' },
      ]}
    }],
    reports: [
      { id: 'STR-2026-PTB-1012', date: '2026-03-03', amount: 6200000, currency: 'USD', institution: 'PACIFIC TRADE BANK', type: 'STR', riskScore: 151, status: 'TRIAGED', crimeTypes: ['ML_NP', 'ML_TPL', 'T_T_NS_RS', 'T_T_NS_TB'], suspicionCategories: ['S_L_T_A', 'S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], narrative: 'CRITICAL: Myanmar military-linked shell company. OFAC SDN (MEHL) + UNSC (Myanmar Gems Enterprise). USD 6.2M jade trade with 55% invoice discrepancies. Retired general as UBO. Immediate escalation.' },
      { id: 'CMR-2026-0112', date: '2025-01-12', amount: 340000, currency: 'SGD', institution: 'ICA CHECKPOINT (CHANGI)', type: 'CMR', riskScore: 151, status: 'TRIAGED', narrative: 'USD 250,000 cash declared on entry from Thailand (Myanmar via Bangkok). Carrier is company representative. Source: Labuan shell company linked to MEHL/Myanmar Gems Enterprise.' }
    ],
    status: 'TRIAGE', priority: false, createdAt: '2026-02-12T11:18:37Z'
  }
];

export const MOCK_INVESTIGATORS = [
  { name: 'Insp. Lim', typology: 'Money Laundering' },
  { name: 'Sgt. Wong', typology: 'Sanctions Evasion' },
  { name: 'Insp. Kumar', typology: 'Terrorism Financing' },
  { name: 'Sgt. Azizah', typology: 'Cybercrime' },
  { name: 'Insp. Pei Shan', typology: 'Fraud' }
];

export const MOCK_STRS: SuspiciousTransactionReport[] = [
  ...MOCK_CASES.flatMap(c => c.reports),
].filter((str, index, self) =>
  index === self.findIndex((t) => t.id === str.id)
);

export const MOCK_ENTITIES: PersonProfile[] = [
  AHMAD_SULAIMAN_PROFILE,
  NATALIA_PETROVA_PROFILE,
  DRAGON_GATE_PROFILE,
  LEE_WEI_JIAN_PROFILE,
  SYNERGY_ASIA_PROFILE,
  RAJAN_PROFILE,
  PYONGYANG_TECH_PROFILE,
  TAN_MEI_LING_PROFILE,
  ONG_BEE_LIAN_PROFILE,
  SUNRISE_WELLNESS_PROFILE,
  VIKTOR_LAZAREV_PROFILE,
  GOLDEN_PHOENIX_PROFILE
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK CMR DATA (NP728 — Cash Movement Report, filed via SONAR)
// ─────────────────────────────────────────────────────────────────────────────
export interface CbniItem {
  cbniType: string;
  currency: string;
  amount: number;
  amountEquivSGD?: number;
  ownedBySelf: boolean;
  source?: { entityType: string; businessName?: string; address: any; relationship: string; sanctionsNote?: string } | null;
  recipient?: { entityType: string; businessName?: string; address: any; relationship: string } | null;
  countryCarriedFrom: string;
  purposeOfMovement: string;
}

export interface MockCMR {
  reportId: string; reportType: 'CMR'; reportForm: 'NP728';
  linkedSubjectName: string; scorecardOverallScore: number;
  partI: { declarantFullName: string; identificationType: string; identificationNumber: string; countryOfIssue: string; occupation: string; identificationNote?: string; permanentAddress: any; addressInSingapore?: any; };
  partII: { movementDirection: string; countryFrom: string; dateOfArrival: string; timeOfArrival: string; flightVehicleVessel: string; cbniItems: CbniItem[]; totalEquivSGD: number; };
  partIII: { declarationText: string; declarationChecked: boolean; submissionStatus: string; reportNumber: string; submittedVia: string; dateOfSubmission: string; };
  fiu_annotations: { redFlags: string[]; linkedScores: string[]; linkedSTR: string; priorityLevel?: string; };
}

export const MOCK_CMRS: MockCMR[] = [
  {
    reportId: 'CMR-2026-0101', reportType: 'CMR', reportForm: 'NP728', linkedSubjectName: 'Ahmad Bin Sulaiman', scorecardOverallScore: 45.0,
    partI: { declarantFullName: 'Ahmad Bin Sulaiman', identificationType: 'NRIC', identificationNumber: 'S8712340A', countryOfIssue: 'Singapore', occupation: 'Management executive', permanentAddress: { block: '411', streetName: 'Hougang Avenue 10', unitNumber: '#08-22', postalCode: '530411', country: 'Singapore' }, addressInSingapore: 'Same as permanent address' },
    partII: { movementDirection: 'Entering Singapore', countryFrom: 'Malaysia', dateOfArrival: '03/12/2025', timeOfArrival: '09:14', flightVehicleVessel: 'Bus SBS8821', cbniItems: [ { cbniType: 'Currency Notes', currency: 'SGD', amount: 49000, ownedBySelf: true, source: null, recipient: null, countryCarriedFrom: 'Malaysia', purposeOfMovement: 'Personal savings — stated for living expenses' }, { cbniType: 'Currency Notes', currency: 'MYR', amount: 15000, amountEquivSGD: 4500, ownedBySelf: true, source: null, recipient: null, countryCarriedFrom: 'Malaysia', purposeOfMovement: 'Personal savings' } ], totalEquivSGD: 53500 },
    partIII: { declarationText: 'I declare that the information provided is true and correct.', declarationChecked: true, submissionStatus: 'Submitted', reportNumber: 'CMR-2026-0101', submittedVia: 'SONAR', dateOfSubmission: '03/12/2025' },
    fiu_annotations: { redFlags: ['Multiple cross-border cash movements over 90-day period', 'Total declared CBNI SGD 53,500; subsequent deposits structured below SGD 10,000 threshold', 'Frequency of Malaysia-Singapore crossings inconsistent with living-expense purpose'], linkedScores: ['StructuringRelationship', 'RoundAmountsCustomer'], linkedSTR: 'STR-2026-MCB-1001' }
  },
  {
    reportId: 'CMR-2026-0102', reportType: 'CMR', reportForm: 'NP728', linkedSubjectName: 'Natalia Petrova', scorecardOverallScore: 51.0,
    partI: { declarantFullName: 'Natalia Petrova', identificationType: 'Passport', identificationNumber: 'M19283746', countryOfIssue: 'Russia', occupation: 'Trade broker', permanentAddress: { streetName: 'Pasdaran Avenue', city: 'Tehran', country: 'Iran' }, addressInSingapore: { block: '88', streetName: 'Market Street', unitNumber: '#14-01', postalCode: '048948', country: 'Singapore', temporaryAccommodation: true } },
    partII: { movementDirection: 'Entering Singapore', countryFrom: 'Iran', dateOfArrival: '28/01/2026', timeOfArrival: '14:35', flightVehicleVessel: 'IR-712 (Mahan Air)', cbniItems: [ { cbniType: 'Currency Notes', currency: 'USD', amount: 207500, ownedBySelf: false, source: { entityType: 'Business', businessName: 'Caspian Trade Partners LLC', address: { city: 'Tehran', country: 'Iran' }, relationship: 'Employer / Client' }, recipient: { entityType: 'Business', businessName: 'North Star Resources Co.', address: { city: 'Pyongyang', country: "Korea, Democratic People's Republic of" }, relationship: 'Business Counterparty' }, countryCarriedFrom: 'Iran', purposeOfMovement: 'Payment for technology consultancy services' } ], totalEquivSGD: 287500 },
    partIII: { declarationText: 'I declare that the information provided is true and correct.', declarationChecked: true, submissionStatus: 'Submitted', reportNumber: 'CMR-2026-0102', submittedVia: 'SONAR', dateOfSubmission: '28/01/2026' },
    fiu_annotations: { redFlags: ['USD 207,500 physical cash from Iran (FATF High Risk) into Singapore', 'Source: Iranian entity; Recipient: North Korean entity (FATF Blacklisted)', 'Declared purpose — no trade documentation presented', 'IRN\u2192SGD\u2192PRK routing consistent with sanctions evasion typology'], linkedScores: ['CustomerFromHighRiskCountry', 'CustomerHasTransactionWithDifferentJurisdictions'], linkedSTR: 'STR-2026-SFG-1002' }
  },
  {
    reportId: 'CMR-2026-0103', reportType: 'CMR', reportForm: 'NP728', linkedSubjectName: 'Dragon Gate Pte Limited', scorecardOverallScore: 60.0,
    partI: { declarantFullName: 'Chen Jian Wei', identificationNote: 'Director of Dragon Gate Pte Limited (UEN: 202312345W)', identificationType: 'NRIC', identificationNumber: 'S8401232D', countryOfIssue: 'Singapore', occupation: 'Managing director/Chief executive officer', permanentAddress: { block: '10', streetName: 'Anson Road', unitNumber: '#20-01', postalCode: '079903', country: 'Singapore' } },
    partII: { movementDirection: 'Entering Singapore', countryFrom: 'China', dateOfArrival: '15/02/2026', timeOfArrival: '08:20', flightVehicleVessel: 'CX-718 (Cathay Pacific)', cbniItems: [ { cbniType: 'Currency Notes', currency: 'CNY', amount: 830000, amountEquivSGD: 154000, ownedBySelf: false, source: { entityType: 'Business', businessName: 'Shenzhen Golden Bridge Trading Co. Ltd', address: { city: 'Shenzhen', country: 'China' }, relationship: 'Business Partner' }, recipient: { entityType: 'Business', businessName: 'Dragon Gate Pte Limited', address: { country: 'Singapore' }, relationship: 'Own Company' }, countryCarriedFrom: 'China', purposeOfMovement: 'Business capital injection for wholesale inventory purchase' }, { cbniType: 'Bearer Cheque', currency: 'HKD', amount: 1200000, amountEquivSGD: 208000, ownedBySelf: false, source: { entityType: 'Business', businessName: 'Kowloon Pacific Holdings Ltd', address: { city: 'Hong Kong', country: 'China (Hong Kong SAR)' }, relationship: 'Investor / Creditor' }, recipient: { entityType: 'Business', businessName: 'Dragon Gate Pte Limited', address: { country: 'Singapore' }, relationship: 'Own Company' }, countryCarriedFrom: 'Hong Kong', purposeOfMovement: 'Loan disbursement for business operations' } ], totalEquivSGD: 362000 },
    partIII: { declarationText: 'I declare that the information provided is true and correct.', declarationChecked: true, submissionStatus: 'Submitted', reportNumber: 'CMR-2026-0103', submittedVia: 'SONAR', dateOfSubmission: '15/02/2026' },
    fiu_annotations: { redFlags: ['SGD 362,000 equiv in CNY cash + HKD bearer cheque carried by company director', 'Bearer cheque (HKD 1.2M) — high-risk ML instrument', 'Funds not owned by carrier — sourced from two separate offshore entities', 'Declared capital injection inconsistent with hub-and-spoke bank account pattern', 'No loan agreement or trade contract presented at declaration'], linkedScores: ['RapidMovementOfFundsCustomer', 'HubAndSpoke'], linkedSTR: 'STR-2026-PTB-1003' }
  },
  {
    reportId: 'CMR-2026-0107', reportType: 'CMR', reportForm: 'NP728', linkedSubjectName: 'Pyongyang Tech Export Co.', scorecardOverallScore: 79.0,
    partI: { declarantFullName: 'Kim Sung Jin', identificationNote: 'Representative of Pyongyang Tech Export Co. — declared as company agent', identificationType: 'Passport', identificationNumber: 'PRK-PAX-7734912', countryOfIssue: "Korea, Democratic People's Republic of", occupation: 'Trade broker', permanentAddress: { streetName: 'Ryomyong Street', city: 'Pyongyang', country: "Korea, Democratic People's Republic of" }, addressInSingapore: { checkboxNotApplicable: true, note: 'Day trip / transit — no accommodation' } },
    partII: { movementDirection: 'Entering Singapore', countryFrom: 'China', dateOfArrival: '19/10/2025', timeOfArrival: '11:05', flightVehicleVessel: 'Air China CA-831', cbniItems: [ { cbniType: 'Currency Notes', currency: 'USD', amount: 250000, ownedBySelf: false, source: { entityType: 'Business', businessName: 'Korea Ryonbong General Corporation', address: { city: 'Pyongyang', country: "Korea, Democratic People's Republic of" }, relationship: 'Employer / Beneficial Owner of Funds', sanctionsNote: 'UNSC Resolution 1718 DESIGNATED ENTITY' }, recipient: { entityType: 'Business', businessName: 'Unnamed Iranian Procurement Entity', address: { city: 'Tehran', country: 'Iran, Islamic Republic of' }, relationship: 'Technology Procurement Counterparty' }, countryCarriedFrom: 'China', purposeOfMovement: 'Payment for technology equipment procurement services' } ], totalEquivSGD: 350000 },
    partIII: { declarationText: 'I declare that the information provided is true and correct.', declarationChecked: true, submissionStatus: 'Submitted — FLAGGED FOR IMMEDIATE REVIEW', reportNumber: 'CMR-2026-0107', submittedVia: 'SONAR', dateOfSubmission: '19/10/2025' },
    fiu_annotations: { redFlags: ['CRITICAL: Source is Korea Ryonbong General Corp — UNSC Res.1718 DESIGNATED WMD PROLIFERATOR', 'North Korean national (FATF Blacklisted) carrying USD 250,000 physical cash', 'Recipient: Iranian procurement entity (UNSC Sanctioned)', 'Cash chosen to circumvent SWIFT/banking controls', 'Singapore used as neutral transit between two UNSC-sanctioned nations', 'IMMEDIATE: ICA detention triggered; referred to SPF-CAD same day'], linkedScores: ['CustomerFromHighRiskCountry', 'CustomerIndirectLinkToHotlistRanked'], linkedSTR: 'STR-2026-CCB-1007', priorityLevel: 'CRITICAL' }
  },
  {
    reportId: 'CMR-2026-0111', reportType: 'CMR', reportForm: 'NP728', linkedSubjectName: 'Viktor Lazarev', scorecardOverallScore: 156.0,
    partI: { declarantFullName: 'Viktor Andreyevich Lazarev', identificationType: 'Passport', identificationNumber: 'RF72114589', countryOfIssue: 'Russia', occupation: 'Private investor', permanentAddress: { streetName: 'Rublyovo-Uspenskoye Highway', city: 'Moscow', country: 'Russia' }, addressInSingapore: { block: '1', streetName: 'Cuscaden Road', unitNumber: '#38-01', postalCode: '249715', country: 'Singapore' } },
    partII: { movementDirection: 'Entering Singapore', countryFrom: 'United Arab Emirates', dateOfArrival: '12/01/2025', timeOfArrival: '22:45', flightVehicleVessel: 'EK 354 (Emirates)', cbniItems: [ { cbniType: 'Currency Notes', currency: 'USD', amount: 185000, ownedBySelf: true, source: null, recipient: null, countryCarriedFrom: 'Russia (via Dubai)', purposeOfMovement: 'Personal funds — stated for investment purposes' } ], totalEquivSGD: 251600 },
    partIII: { declarationText: 'I declare that the information provided is true and correct.', declarationChecked: true, submissionStatus: 'Submitted', reportNumber: 'CMR-2026-0111', submittedVia: 'SONAR', dateOfSubmission: '12/01/2025' },
    fiu_annotations: { redFlags: ['USD 185,000 physical cash transported from Russia via Dubai into Singapore', 'Declarant is a confirmed PEP (former Russian Deputy Minister) with OFAC SDN-linked counterparties', 'Named in OCCRP investigation and Pandora Papers leak', 'Transit via UAE consistent with Russian sanctions evasion routing', 'Purpose stated as investment — no specifics provided'], linkedScores: ['CustomerIndirectLinkToHotlistRanked', 'SanctionsProximity', 'PEPAssociation', 'CustomerFromHighRiskCountry'], linkedSTR: 'STR-2026-CCB-1011' }
  },
  {
    reportId: 'CMR-2026-0112', reportType: 'CMR', reportForm: 'NP728', linkedSubjectName: 'Golden Phoenix International Ltd', scorecardOverallScore: 151.0,
    partI: { declarantFullName: 'Zaw Min Tun', identificationType: 'Passport', identificationNumber: 'MD8834521', countryOfIssue: 'Myanmar', occupation: 'Company representative — Golden Phoenix International Ltd', permanentAddress: { streetName: 'Merchant Road', city: 'Yangon', country: 'Myanmar' }, addressInSingapore: { block: '133', streetName: 'New Bridge Road', unitNumber: '#08-12', postalCode: '059413', country: 'Singapore', temporaryAccommodation: true } },
    partII: { movementDirection: 'Entering Singapore', countryFrom: 'Thailand', dateOfArrival: '12/01/2025', timeOfArrival: '16:20', flightVehicleVessel: 'TG 404 (Thai Airways)', cbniItems: [ { cbniType: 'Currency Notes', currency: 'USD', amount: 250000, ownedBySelf: false, source: { entityType: 'Business', businessName: 'Golden Phoenix International Ltd', address: { city: 'Labuan', country: 'Malaysia' }, relationship: 'Employer' }, recipient: { entityType: 'Business', businessName: 'Phoenix Jade Trading Pte Ltd', address: { city: 'Singapore', country: 'Singapore' }, relationship: 'Subsidiary' }, countryCarriedFrom: 'Myanmar (via Bangkok)', purposeOfMovement: 'Jade auction settlement — Naypyidaw Gems Emporium 2024' } ], totalEquivSGD: 340000 },
    partIII: { declarationText: 'I declare that the information provided is true and correct.', declarationChecked: true, submissionStatus: 'Submitted', reportNumber: 'CMR-2026-0112', submittedVia: 'SONAR', dateOfSubmission: '12/01/2025' },
    fiu_annotations: { redFlags: ['USD 250,000 physical cash from Myanmar via Bangkok into Singapore', 'Carrier is company representative, not the UBO — funds owned by Labuan shell', 'Source entity linked to OFAC SDN (MEHL) and UNSC-sanctioned Myanmar Gems Enterprise', 'Purpose: jade auction settlement — Naypyidaw Gems Emporium controlled by Myanmar military', 'Transit routing via Bangkok consistent with Myanmar sanctions evasion typology'], linkedScores: ['CustomerIndirectLinkToHotlistRanked', 'SanctionsProximity', 'ShellCompanyIndicators', 'TradeBasedLaundering'], linkedSTR: 'STR-2026-PTB-1012' }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK CTR DATA (NP784 — Cash Transaction Report for PSMDs & Pawnbrokers)
// ─────────────────────────────────────────────────────────────────────────────
export interface CashTransaction {
  transactionNumber: number; transactionDate: string; commodityType: string;
  commodityDescription: string; quantity: number; unitOfMeasure: string;
  transactionType: string; cashAmount: { currency: string; amount: number; label: string };
  paymentMode: string; transactingOfficerName: string; transactingOfficerDesignation: string; remarks: string;
}

export interface MockCTR {
  reportId: string; reportType: 'CTR'; reportForm: 'NP784';
  linkedSubjectName: string; scorecardOverallScore: number;
  partI: { reportingInstitution: { name: string; registrationNumber: string; countryOfRegistration: string; institutionType: string; internalReferenceNumber: string } };
  partII: { cashTransactions: CashTransaction[]; totalCash?: { currency: string; amount: number } };
  partIII: { personWhoTransacted: { isIndividualOrBusiness: string } };
  partIV?: { personOwnerOfCash: { firstName: string; lastName: string; dateOfBirth: string; identificationType: string; identificationNumber: string; nationality: string; permanentAddress: any; relationshipToTransactor: string } } | null;
  partV?: { businessOwnerOfCash: { businessName: string; registrationNumber: string; countryOfIncorporation: string; businessNature: string; isPSMD: boolean; principalAddress: any; relationshipToTransactor: string; authorisedRepresentative: any } } | null;
  partVI: { declarationText: string; declarationChecked: boolean; submissionStatus: string; reportNumber: string; submittedVia: string; dateOfDeclaration: string };
  fiu_annotations: { redFlags: string[]; linkedScores: string[]; linkedSTR: string };
}

export const MOCK_CTRS: MockCTR[] = [
  {
    reportId: 'CTR-2026-0105', reportType: 'CTR', reportForm: 'NP784', linkedSubjectName: 'Synergy Asia Trading Pte Ltd', scorecardOverallScore: 55.0,
    partI: { reportingInstitution: { name: 'Meridian Precious Assets Pte Ltd', registrationNumber: '201899123K', countryOfRegistration: 'Singapore', institutionType: 'PSMD — Precious Metals Dealer', internalReferenceNumber: 'MPA-CTR-2026-0105' } },
    partII: { cashTransactions: [ { transactionNumber: 1, transactionDate: '14/02/2026', commodityType: 'Precious Metal — Gold Bullion', commodityDescription: '1kg gold bullion bars (LBMA certified)', quantity: 5, unitOfMeasure: 'kg', transactionType: 'Purchase (Customer buying from dealer)', cashAmount: { currency: 'SGD', amount: 450000, label: 'Cash Received' }, paymentMode: 'Cash (SGD notes)', transactingOfficerName: 'David Lim', transactingOfficerDesignation: 'Head of Trading', remarks: 'Customer paid SGD 450,000 cash for 5\u00d71kg gold bars. No advance notice. LBMA certified bars requested. Purpose: "Investment hedging for sister company."' }, { transactionNumber: 2, transactionDate: '15/02/2026', commodityType: 'Precious Metal — Gold Bullion', commodityDescription: '500g gold bullion bars', quantity: 4, unitOfMeasure: 'kg', transactionType: 'Sale (Customer selling to dealer)', cashAmount: { currency: 'SGD', amount: 394200, label: 'Cash Paid Out' }, paymentMode: 'Cash (SGD notes)', transactingOfficerName: 'David Lim', transactingOfficerDesignation: 'Head of Trading', remarks: 'Same customer returned next day. Sold 4\u00d7500g bars (different bars). Loss SGD 55,800 (12.4%) accepted. No commercial rationale. Consistent with TBML mirror trade via precious metals.' } ], totalCash: { currency: 'SGD', amount: 450000 } },
    partIII: { personWhoTransacted: { isIndividualOrBusiness: 'Business' } },
    partIV: null,
    partV: { businessOwnerOfCash: { businessName: 'Synergy Asia Trading Pte Ltd', registrationNumber: '201988432N', countryOfIncorporation: 'Singapore', businessNature: 'Securities Trading and Investment', isPSMD: false, principalAddress: { streetName: '18 Robinson Road', unitNumber: '#12-00', postalCode: '048547', country: 'Singapore' }, relationshipToTransactor: 'Account Holder / Principal', authorisedRepresentative: { name: 'Michael Tan Eng Huat', identification: 'S8103412G', designation: 'Director' } } },
    partVI: { declarationText: 'I declare that the information provided is true and correct.', declarationChecked: true, submissionStatus: 'Submitted', reportNumber: 'CTR-2026-0105', submittedVia: 'SONAR', dateOfDeclaration: '16/02/2026' },
    fiu_annotations: { redFlags: ['Back-to-back physical gold buy/sell within 24 hours — TBML mirror trade via precious metals', 'Economic loss SGD 55,800 (12.4%) accepted — commercially irrational, consistent with ML placement', 'Securities trading company purchasing physical gold bullion is atypical for stated business', 'Only 4 of 5 original bars returned — 5th bar (\u2248SGD 90,000) destination unknown', 'Cash-based transactions to avoid SWIFT trail'], linkedScores: ['TradeBasedLaundering', 'HighValueCashTransaction'], linkedSTR: 'STR-2026-PTB-1005' }
  },
  {
    reportId: 'CTR-2026-0108', reportType: 'CTR', reportForm: 'NP784', linkedSubjectName: 'Tan Mei Ling', scorecardOverallScore: 40.0,
    partI: { reportingInstitution: { name: 'Golden Link Pawnbrokers Pte Ltd', registrationNumber: '198812345P', countryOfRegistration: 'Singapore', institutionType: 'Pawnbroker (Pawnbrokers Act 2015 s.74A)', internalReferenceNumber: 'GLP-CTR-2026-0108' } },
    partII: { cashTransactions: [ { transactionNumber: 1, transactionDate: '10/01/2026', commodityType: 'Jewellery — Gold', commodityDescription: '22K gold necklace set, 120g', quantity: 1, unitOfMeasure: 'piece', transactionType: 'Pawn (Customer pledging item for cash loan)', cashAmount: { currency: 'SGD', amount: 8500, label: 'Loan Disbursed' }, paymentMode: 'Cash (SGD notes)', transactingOfficerName: 'Goh Beng Kiat', transactingOfficerDesignation: 'Branch Manager', remarks: 'Customer pledged 22K gold necklace set for SGD 8,500 cash loan. Round amount.' }, { transactionNumber: 2, transactionDate: '10/01/2026', commodityType: 'Jewellery — Gold', commodityDescription: '18K gold bracelet set with diamonds, 45g', quantity: 1, unitOfMeasure: 'piece', transactionType: 'Pawn', cashAmount: { currency: 'SGD', amount: 3000, label: 'Loan Disbursed' }, paymentMode: 'Cash (SGD notes)', transactingOfficerName: 'Goh Beng Kiat', transactingOfficerDesignation: 'Branch Manager', remarks: 'Second item pledged in same visit. Round amount SGD 3,000.' }, { transactionNumber: 3, transactionDate: '17/01/2026', commodityType: 'Jewellery — Gold', commodityDescription: '24K gold bar pendant, 20g \u00d7 2', quantity: 2, unitOfMeasure: 'pieces', transactionType: 'Pawn', cashAmount: { currency: 'SGD', amount: 5000, label: 'Loan Disbursed' }, paymentMode: 'Cash (SGD notes)', transactingOfficerName: 'Goh Beng Kiat', transactingOfficerDesignation: 'Branch Manager', remarks: 'Customer returned 7 days later. All loans in round amounts. Total SGD 16,500 across 3 transactions.' } ], totalCash: { currency: 'SGD', amount: 16500 } },
    partIII: { personWhoTransacted: { isIndividualOrBusiness: 'Individual' } },
    partIV: { personOwnerOfCash: { firstName: 'Mei Ling', lastName: 'Tan', dateOfBirth: '05/07/1992', identificationType: 'NRIC', identificationNumber: 'S9201234C', nationality: 'Singaporean', permanentAddress: { block: '201', streetName: 'Tampines Street 21', unitNumber: '#14-108', postalCode: '520201', country: 'Singapore' }, relationshipToTransactor: 'Self (transactor is the owner)' } },
    partV: null,
    partVI: { declarationText: 'I declare that the information provided is true and correct.', declarationChecked: true, submissionStatus: 'Submitted', reportNumber: 'CTR-2026-0108', submittedVia: 'SONAR', dateOfDeclaration: '20/01/2026' },
    fiu_annotations: { redFlags: ['Three pawn transactions totalling SGD 16,500 — all exact round amounts', 'Multiple jewellery items pawned rapidly — likely liquidation of scam proceeds', 'Customer bank account cancelled with Fraud Flag — cross-institution mule pattern confirmed', 'Round-amount pawn loans consistent with money mule disbursement', '7 accounts across 3 banks receiving round-amount transfers'], linkedScores: ['CancelledCustomerScore', 'RoundAmountsCustomer'], linkedSTR: 'STR-2026-RBC-1008' }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// FULL STR DATA (from MockSTRsToLoad.json — structured 5-tab STR form data)
// ─────────────────────────────────────────────────────────────────────────────

export interface STRTransaction {
  date: string;
  type: string;
  channel: string;
  amount: number;
  currency: string;
  counterparty: string;
  remarks: string;
}

export interface STRAccountInfo {
  accountNumber: string;
  accountType: string;
  currency: string;
  openingDate: string;
  accountStatus: string;
  productType?: string;
  unknownAccountNumber?: boolean;
  additionalAccountsOnSameHolding?: STRAccountInfo[];
  bankInternalAccountId?: string;
  accountHolderName?: string;
  branch?: string;
  relationshipManager?: string | null;
  closingDate?: string | null;
  bankRiskRating?: number;
  amlAlertTriggered?: boolean;
  priorFilingCount?: number | null;
  contactNumber?: string;
}

export interface STREntityInfo {
  entityType: string;
  fullName: string;
  unknownName?: boolean;
  dateOfBirth?: string;
  unknownDOB?: boolean;
  gender?: string;
  nationality?: string;
  identificationType?: string;
  identificationNumber?: string;
  unknownIdentification?: boolean;
  occupation?: string;
  employer?: string;
  residentialAddress?: any;
  unknownAddress?: boolean;
  screeningResults?: {
    isPEP: boolean;
    isPEPRelative: boolean;
    adverseNewsForeign: boolean;
    adverseNewsLocal: boolean;
    sanctionsMatch: boolean;
  };
  additionalParties?: any[];
  companyName?: string;
  companyRegistrationNumber?: string;
  countryOfIncorporation?: string;
  principalBusinessActivity?: string;
  registeredAddress?: any;
}

export interface MockSTRFull {
  reportId: string;
  reportType: 'STR';
  reportForm: string;
  linkedSubjectId: string;
  linkedSubjectName: string;
  alertRunDate: string;
  scorecardOverallScore: number;
  typology: string;
  tabI_reportingInstitution: {
    institutionType: string;
    businessType: string;
    nameOfReportingInstitution: string;
    UEN: string;
    internalReportingReferenceNumber: string;
    noticeReferenceNumber: string;
    contactOfficer: {
      name: string;
      designation: string;
      directContactNumber: string;
      email: string;
    };
  };
  tabII_accountInformation: STRAccountInfo[];
  tabIII_entityInformation: STREntityInfo;
  tabIV_suspiciousTransactions: {
    transactionPeriod: { from: string; to: string };
    totalSuspiciousAmount: { currency: string; amount: number };
    transactions: STRTransaction[];
  };
  tabV_reasonsForSuspicion: {
    possibleCrimeTypes: string[];
    suspicionCategories: string[];
    detailedNarrative: string;
    legalBasis: string;
  };
}

export const MOCK_STRS_FULL: MockSTRFull[] = [
  { reportId: 'STR-2026-MCB-1001', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1001', linkedSubjectName: 'Ahmad Bin Sulaiman', alertRunDate: '2026-03-03', scorecardOverallScore: 45, typology: 'Structuring / Smurfing', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Meridian Capital Bank Pte Ltd', UEN: '201209001G', internalReportingReferenceNumber: 'MCB-COMP-2026-0301-001', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Lim Siew Ching', designation: 'Compliance Senior Manager', directContactNumber: '+65 6321 8800', email: 'siewching.lim@meridianbank.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'MCB-001-00441122', accountType: 'Current Account', currency: 'SGD', openingDate: '14/03/2019', accountStatus: 'Active', productType: 'Current / Cheque Account', unknownAccountNumber: false, additionalAccountsOnSameHolding: [{ accountNumber: 'MCB-001-00441155', accountType: 'Fixed Deposit', currency: 'SGD', openingDate: '01/06/2022', accountStatus: 'Active', bankInternalAccountId: '302', accountHolderName: 'AHMAD BIN SULAIMAN FD', branch: 'Hougang', relationshipManager: null, closingDate: null, bankRiskRating: 5200, amlAlertTriggered: false, priorFilingCount: null, contactNumber: '+65 8123 4567' }], bankInternalAccountId: '301', accountHolderName: 'AHMAD BIN SULAIMAN', branch: 'Hougang', relationshipManager: null, closingDate: null, bankRiskRating: 5200, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 8123 4567' }], tabIII_entityInformation: { entityType: 'Natural Person', fullName: 'Ahmad Bin Sulaiman', unknownName: false, dateOfBirth: '14/04/1987', unknownDOB: false, gender: 'Male', nationality: 'Singaporean', identificationType: 'NRIC', identificationNumber: 'S8712340A', unknownIdentification: false, occupation: 'Management executive', employer: 'Trans-Link Freight Solutions Pte Ltd', residentialAddress: { block: '411', streetName: 'Hougang Avenue 10', unitNumber: '#08-22', postalCode: '530411', country: 'Singapore' }, unknownAddress: false, screeningResults: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false }, additionalParties: [] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '01/09/2025', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'SGD', amount: 303800 }, transactions: [{ date: '01/09/2025', type: 'Cash Deposit', channel: 'Branch Counter', amount: 9800, currency: 'SGD', counterparty: 'N/A', remarks: 'Cash deposit, round amount just below SGD 10,000 threshold' }, { date: '15/09/2025', type: 'Cash Deposit', channel: 'Branch Counter', amount: 9500, currency: 'SGD', counterparty: 'N/A', remarks: 'Second deposit below threshold; different teller, same branch' }, { date: '30/09/2025', type: 'Cash Deposit', channel: 'ATM', amount: 7200, currency: 'SGD', counterparty: 'N/A', remarks: 'ATM cash deposit' }, { date: '12/10/2025', type: 'Cash Deposit', channel: 'Branch Counter', amount: 9900, currency: 'SGD', counterparty: 'N/A', remarks: 'Near-threshold deposit; subject presents varying denominations' }, { date: '28/10/2025', type: 'Cash Deposit', channel: 'Branch Counter', amount: 9600, currency: 'SGD', counterparty: 'N/A', remarks: '' }, { date: '14/11/2025', type: 'Cash Deposit', channel: 'Branch Counter', amount: 9000, currency: 'SGD', counterparty: 'N/A', remarks: '' }, { date: '02/12/2025', type: 'Cash Deposit', channel: 'ATM', amount: 8500, currency: 'SGD', counterparty: 'N/A', remarks: '' }, { date: '12/12/2025', type: 'Cross-Border Cash Declaration', channel: 'CBNI / CMR Flagged', amount: 53500, currency: 'SGD', counterparty: 'ICA Checkpoint', remarks: 'CMR-2026-0101: SGD 49,000 + MYR 15,000 declared on cross-border entry from Malaysia' }, { date: '17/12/2025', type: 'Cash Deposit', channel: 'Branch Counter', amount: 9800, currency: 'SGD', counterparty: 'N/A', remarks: 'Post cross-border entry cash deposit; consistent pattern' }, { date: '10/01/2026', type: 'Cash Deposit', channel: 'Branch Counter', amount: 9500, currency: 'SGD', counterparty: 'N/A', remarks: '' }, { date: '25/01/2026', type: 'Cash Deposit', channel: 'ATM', amount: 8700, currency: 'SGD', counterparty: 'N/A', remarks: '' }, { date: '14/02/2026', type: 'Cash Deposit', channel: 'Branch Counter', amount: 9800, currency: 'SGD', counterparty: 'N/A', remarks: '29th deposit event in surveillance window. Cumulative total: SGD 303,800' }, { date: '03/03/2026', type: 'Outward Transfer', channel: 'FAST Transfer', amount: 285000, currency: 'SGD', counterparty: 'Mutiara Hartanah Sdn Bhd (MY)', remarks: 'Bulk consolidation outflow to Malaysian entity — consolidation event triggers STR' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP', 'ML_SL'], suspicionCategories: ['S_L_T_A', 'S_L_T_F', 'T_W_NAB_A_IV'], detailedNarrative: 'Customer Ahmad Bin Sulaiman has maintained a current account at MCB since March 2019 and is employed as a management executive at Trans-Link Freight Solutions. Over the 6-month window from September 2025 to March 2026, the AML system flagged 29 discrete cash deposit events totalling SGD 303,800. Each individual deposit was below the SGD 10,000 CDD threshold, with the largest being SGD 9,900 — a classic structuring signature.\n\nOn 03/12/2025, an associated CMR (CMR-2026-0101) was filed at Woodlands Checkpoint when subject declared SGD 49,000 + MYR 15,000 (equiv. SGD 53,500) upon entry from Malaysia. The frequency of these crossings (10+ documented over 90 days) combined with the below-threshold deposit pattern is consistent with courier smurfing — physical cash transported across the border and deposited in sub-threshold tranches to avoid CDD scrutiny.\n\nOn 03/03/2026, a single FAST transfer of SGD 285,000 was executed to Mutiara Hartanah Sdn Bhd, a Malaysian real estate holding entity. This consolidation event — where sub-threshold deposits funnel into a single outbound transfer — is consistent with the Placement and Layering stages of the ML cycle. The ultimate beneficial owner of Mutiara Hartanah Sdn Bhd has not been verified by the institution.\n\nThe subject\'s stated income as a management executive does not plausibly account for the sustained volume of cash deposits. No legitimate business purpose has been provided for the real estate transfer. This report is filed under CDSA s.39.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report' } },
  { reportId: 'STR-2026-SFG-1002', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1002', linkedSubjectName: 'Natalia Petrova', alertRunDate: '2026-03-03', scorecardOverallScore: 51, typology: 'Cross-Border Layering / Sanctions Evasion', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Sentosa Financial Group Pte Ltd', UEN: '201512088H', internalReportingReferenceNumber: 'SFG-COMP-2026-0201-002', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Raj Kumar', designation: 'Head of Financial Crime Compliance', directContactNumber: '+65 6455 2200', email: 'raj.kumar@sentosafinancial.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'SFG-009-00882244', accountType: 'Current Account', currency: 'USD', openingDate: '22/08/2024', accountStatus: 'Active', productType: 'Current / Cheque Account', unknownAccountNumber: false, bankInternalAccountId: '303', accountHolderName: 'NATALIA PETROVA', branch: 'CBD', relationshipManager: 'Lim Kah Seng', closingDate: null, bankRiskRating: 4500, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 9876 5432' }], tabIII_entityInformation: { entityType: 'Natural Person', fullName: 'Natalia Petrova', unknownName: false, dateOfBirth: '03/11/1985', unknownDOB: false, gender: 'Female', nationality: 'Russian', identificationType: 'Passport', identificationNumber: 'M19283746', countryOfIssuance: 'Russia', unknownIdentification: false, occupation: 'Trade broker', employer: 'Caspian Trade Partners LLC (Tehran, Iran)', residentialAddress: { streetName: 'Pasdaran Avenue', city: 'Tehran', country: 'Iran' }, singaporeAddress: { block: '88', streetName: 'Market Street', unitNumber: '#14-01', postalCode: '048948', country: 'Singapore', temporary: true }, unknownAddress: false, screeningResults: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: false }, additionalParties: [{ role: 'Source of Funds', entityType: 'Corporate', name: 'Caspian Trade Partners LLC', jurisdiction: 'Iran', riskNote: 'FATF High-Risk Jurisdiction' }, { role: 'Recipient', entityType: 'Corporate', name: 'North Star Resources Co.', jurisdiction: 'Korea, Democratic People\'s Republic of', riskNote: 'FATF Blacklisted Jurisdiction — DPRK' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '22/08/2024', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'USD', amount: 2455000 }, transactions: [{ date: '22/08/2024', type: 'Account Opening Cash Deposit', channel: 'Branch Counter', amount: 150000, currency: 'USD', counterparty: 'Self — declared personal funds', remarks: 'Initial deposit at account opening — source of funds not verified' }, { date: '15/10/2024', type: 'Inward Wire Transfer', channel: 'SWIFT', amount: 480000, currency: 'USD', counterparty: 'Volga Trade House Ltd (Cyprus)', remarks: 'SWIFT ref VTH-2024-881. Purpose: trade settlement. No underlying trade documents provided.' }, { date: '02/11/2024', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 625000, currency: 'USD', counterparty: 'Silk Gateway FZE (UAE)', remarks: 'Transfer to UAE free zone entity 2 days after inflow. No commercial nexus established.' }, { date: '18/01/2025', type: 'Inward Wire Transfer', channel: 'SWIFT', amount: 390000, currency: 'USD', counterparty: 'Caspian Trade Partners LLC (Iran)', remarks: 'Direct inflow from Iranian employer — FATF High Risk. Stated purpose: salary + commission.' }, { date: '25/01/2025', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 385000, currency: 'USD', counterparty: 'North Star Resources Co. (DPRK)', remarks: 'CRITICAL: Outward transfer to North Korean entity within 7 days of Iranian inflow. DPRK is FATF Blacklisted.' }, { date: '28/01/2026', type: 'Cross-Border Cash Declaration', channel: 'CMR Flagged', amount: 207500, currency: 'USD', counterparty: 'ICA Checkpoint — Changi Airport', remarks: 'CMR-2026-0102: USD 207,500 physical cash declared on arrival from Iran. Source: Caspian Trade Partners LLC. Recipient: North Star Resources Co. (PRK).' }, { date: '14/02/2026', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 217500, currency: 'USD', counterparty: 'Unnamed Iranian Procurement Entity (Iran)', remarks: 'Final outflow. Combined with CMR cash movement, total IRN→SGD→PRK exposure: USD 2,455,000' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP', 'ML_TPL', 'ML_FTD', 'T_T_NS_RS', 'T_T_NS_TB'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], detailedNarrative: 'Natalia Petrova, a Russian national permanently resident in Tehran, Iran, and employed by Caspian Trade Partners LLC, was identified through a convergence of SWIFT wire alerts and a cross-border CMR filing.\n\nThe account pattern demonstrates a classic IRN→SGD→PRK triangulation: funds originating from an Iranian source entity transit the Singapore account and are moved onward to North Korean-linked entities. The DPRK recipient (North Star Resources Co.) has no publicly verifiable commercial presence and is consistent with entities used in DPRK sanctions evasion typologies.\n\nThe CMR filed on 28/01/2026 (CMR-2026-0102) reveals that Petrova physically carried USD 207,500 in cash from Iran into Singapore on a single journey. The declared source and recipient of this cash match the SWIFT wire counterparties exactly — suggesting a coordinated strategy combining electronic wires and physical cash couriering to maximise the volume moved while reducing any single event\'s visibility.\n\nNo trade documentation, commercial invoices, or underlying contracts have been provided to substantiate the \'technology consultancy\' purpose stated for the transfers. The institution has been unable to verify any of the fund flows as legitimate commercial transactions.\n\nThis report is filed under CDSA s.39 and TSOFA given the DPRK nexus. A separate referral has been made to the Proliferation Financing Unit.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report | TSOFA — Terrorism (Suppression of Financing) Act' } },
  { reportId: 'STR-2026-PTB-1003', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1003', linkedSubjectName: 'Dragon Gate Pte Limited', alertRunDate: '2026-03-03', scorecardOverallScore: 60, typology: 'Hub-and-Spoke / Corporate ML', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Pacific Trade Bank Pte Ltd', UEN: '201703145K', internalReportingReferenceNumber: 'PTB-COMP-2026-0215-003', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Angela Tan', designation: 'AML Compliance Director', directContactNumber: '+65 6788 3300', email: 'angela.tan@pacifictrade.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'PTB-007-00332211', accountType: 'Current Account', currency: 'SGD', openingDate: '28/03/2023', accountStatus: 'Active', productType: 'Business Current Account', unknownAccountNumber: false, bankInternalAccountId: '304', accountHolderName: 'DRAGON GATE PTE LIMITED', branch: 'CBD', relationshipManager: null, closingDate: null, bankRiskRating: 6350, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 6234 5678' }, { accountNumber: 'PTB-007-00332299', accountType: 'Foreign Currency Account', currency: 'USD', openingDate: '05/04/2023', accountStatus: 'Active', productType: 'Business FCA', unknownAccountNumber: false, bankInternalAccountId: '304', accountHolderName: 'DRAGON GATE PTE LIMITED', branch: 'CBD', relationshipManager: null, closingDate: null, bankRiskRating: 6350, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 6234 5678' }], tabIII_entityInformation: { entityType: 'Legal Entity (Company)', fullName: 'Dragon Gate Pte Limited', unknownName: false, UEN: '202312345W', dateOfIncorporation: '15/02/2023', countryOfIncorporation: 'Singapore', registeredAddress: { block: '10', streetName: 'Anson Road', unitNumber: '#20-01', postalCode: '079903', country: 'Singapore' }, businessActivity: 'General wholesale trade (UEN-declared)', unknownAddress: false, authorisedRepresentative: { name: 'Chen Jian Wei', identificationType: 'NRIC', identificationNumber: 'S8401232D', role: 'Managing Director / Sole Director', nationality: 'Singaporean' }, ultimateBeneficialOwners: [{ name: 'Chen Jian Wei', ownershipPercentage: '51%', jurisdiction: 'Singapore' }, { name: 'Shenzhen Golden Bridge Trading Co. Ltd', ownershipPercentage: '49%', jurisdiction: 'China (PRC)' }], screeningResults: { isPEP: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false }, additionalParties: [{ role: 'Primary Inflow Counterparty', name: 'Shenzhen Golden Bridge Trading Co. Ltd', jurisdiction: 'China' }, { role: 'Primary Inflow Counterparty', name: 'Kowloon Pacific Holdings Ltd', jurisdiction: 'Hong Kong SAR' }, { role: 'Primary Outflow Counterparty', name: 'Meridian Conduit Holdings (BVI)', jurisdiction: 'British Virgin Islands' }, { role: 'Primary Outflow Counterparty', name: 'Pacific Rim Nominees Ltd', jurisdiction: 'Cayman Islands' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '28/03/2023', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'SGD', amount: 18500000 }, transactions: [{ date: '28/03/2023', type: 'Account Opening Deposit', channel: 'FAST Transfer', amount: 50000, currency: 'SGD', counterparty: 'Chen Jian Wei (Personal Account)', remarks: 'Seed capital from director\'s personal account' }, { date: '15/05/2023', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 1200000, currency: 'USD', counterparty: 'Shenzhen Golden Bridge Trading Co. Ltd (CN)', remarks: 'First major inflow 47 days after incorporation. Purpose: \'Trade settlement for electronics\'' }, { date: '22/05/2023', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 1180000, currency: 'USD', counterparty: 'Meridian Conduit Holdings (BVI)', remarks: '95% of inflow transited onward within 7 days to BVI entity. No retention.' }, { date: '10/07/2023', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 840000, currency: 'USD', counterparty: 'Kowloon Pacific Holdings Ltd (HK)', remarks: 'Second major inflow. HK entity has opaque ownership.' }, { date: '18/07/2023', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 825000, currency: 'USD', counterparty: 'Pacific Rim Nominees Ltd (Cayman)', remarks: '98% of HK inflow transited to Cayman entity within 8 days.' }, { date: '15/02/2026', type: 'Cross-Border CBNI Declaration', channel: 'CMR Flagged', amount: 362000, currency: 'SGD', counterparty: 'ICA Checkpoint — Changi Airport', remarks: 'CMR-2026-0103: Director Chen Jian Wei declared CNY 830,000 + HKD 1,200,000 bearer cheque (equiv. SGD 362,000) on entry from China. Physical cash movement supplement to wire transit pattern.' }, { date: '20/02/2026', type: 'Cash Deposit', channel: 'Branch Counter', amount: 150000, currency: 'SGD', counterparty: 'N/A', remarks: 'Cash deposited by director 5 days after CBNI declaration. Consistent with couriered funds being placed into account.' }, { date: '03/03/2026', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 2100000, currency: 'USD', counterparty: 'Shenzhen Golden Bridge Trading Co. Ltd (CN)', remarks: 'Alert trigger: 23rd inflow-outflow cycle. Cumulative suspicious amount: SGD 18.5M equivalent.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_LE', 'ML_TPL', 'ML_FTD'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_II', 'T_W_NAB_A_IV'], detailedNarrative: 'Dragon Gate Pte Limited was incorporated in February 2023, just 26 months prior to this reporting date. Within 47 days of incorporation, the company received its first USD 1.2M wire transfer from a Chinese counterparty (Shenzhen Golden Bridge). The AML system identified 23 distinct inflow-outflow cycles over the surveillance window, each exhibiting a characteristic pattern: large inflows are received from Chinese or Hong Kong entities and then transited onward (95–98% of the inflow amount) to BVI or Cayman Islands-registered nominees within 3–8 business days.\n\nThe company retains negligible operating balances, has not filed GST returns indicating meaningful domestic trade activity, and has no verifiable supply chain, inventory records, or customer base consistent with its declared wholesale trade business.\n\nThe associated CMR (CMR-2026-0103) revealed that Director Chen Jian Wei physically transported CNY 830,000 in cash and an HKD 1.2M bearer cheque (total equiv. SGD 362,000) into Singapore, with the funds attributed to the company\'s Chinese and Hong Kong business partners. Bearer cheques were deposited 5 days after declaration — consistent with parallel physical cash couriering supplementing electronic wire transit.\n\nThe hub-and-spoke pattern — Singapore entity acting as a transit node between Chinese sources and Caribbean/Cayman destinations — is a well-documented corporate ML typology. The company profile provides the commercial cover (UEN registration, bank account, letterhead) while the actual ML mechanics are in the wire transfers.\n\nFiled under CDSA s.39.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report' } },
  { reportId: 'STR-2026-SFG-1004', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1004', linkedSubjectName: 'Lee Wei Jian', alertRunDate: '2026-03-03', scorecardOverallScore: 68, typology: 'Sanctions Evasion — OFAC SDN Match', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Sentosa Financial Group Pte Ltd', UEN: '201512088H', internalReportingReferenceNumber: 'SFG-COMP-2026-0201-004', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Raj Kumar', designation: 'Head of Financial Crime Compliance', directContactNumber: '+65 6455 2200', email: 'raj.kumar@sentosafinancial.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'SFG-002-00559911', accountType: 'Current Account', currency: 'USD', openingDate: '05/11/2021', accountStatus: 'Blocked — OFAC Alert Pending', productType: 'Current / Cheque Account', unknownAccountNumber: false, bankInternalAccountId: '305', accountHolderName: 'LEE WEI JIAN USD', branch: 'Telok Blangah', relationshipManager: 'Wong Mei Lin', closingDate: null, bankRiskRating: 7800, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 9012 3456', additionalAccountsOnSameHolding: [{ accountNumber: 'SFG-002-00559922', bankInternalAccountId: '306', accountHolderName: 'LEE WEI JIAN SGD', accountType: 'Current Account', currency: 'SGD', openingDate: '10/01/2020', closingDate: null, accountStatus: 'Blocked — OFAC Alert Pending', branch: 'Telok Blangah', relationshipManager: 'Wong Mei Lin', bankRiskRating: 7800, amlAlertTriggered: true, priorFilingCount: null }] }], tabIII_entityInformation: { entityType: 'Natural Person', fullName: 'Lee Wei Jian', aliases: ['LWJ Holdings', 'Jason Lee', 'Li Weijian'], unknownName: false, dateOfBirth: '29/05/1979', unknownDOB: false, gender: 'Male', nationality: 'Singaporean', identificationType: 'NRIC', identificationNumber: 'S7901234B', unknownIdentification: false, occupation: 'Director / Shareholder — multiple entities', employer: 'LWJ Holdings Pte Ltd (Singapore); Tanaka Precision Industries KK (Japan, dissolved)', residentialAddress: { streetName: '31 Sentosa Cove Ave', unitNumber: '#04-08', postalCode: '098751', country: 'Singapore' }, unknownAddress: false, screeningResults: { isPEP: false, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: true, sanctionsMatch: true, sanctionsDetail: 'OFAC SDN Match — Reference: SDN-LEE-WJ-2025-0441. Listed under OFAC\'s EO13694 (Cyber-related sanctions). Also matched on UN Consolidated Sanctions List.' }, additionalParties: [{ role: 'Shell Entity — Receiving Account', name: 'LWJ Holdings Pte Ltd', jurisdiction: 'Singapore', UEN: '2019876543Z' }, { role: 'Beneficial Flow Destination', name: 'Shenzen Cyber Industrial Park Development Ltd', jurisdiction: 'China' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '05/11/2021', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'USD', amount: 7850000 }, transactions: [{ date: '05/11/2021', type: 'Account Opening Wire', channel: 'SWIFT', amount: 500000, currency: 'USD', counterparty: 'Tanaka Precision Industries KK (JP, now dissolved)', remarks: 'Initial funding from now-dissolved Japanese entity.' }, { date: '14/03/2022', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 1850000, currency: 'USD', counterparty: 'Shenzen Cyber Industrial Park Development Ltd (CN)', remarks: 'Large PRC inflow. Purpose: \'Technology licensing fees\'' }, { date: '20/03/2022', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 1800000, currency: 'USD', counterparty: 'LWJ Holdings Pte Ltd (SG Internal Transfer)', remarks: 'Rapid transit to connected entity — same beneficial owner' }, { date: '10/09/2023', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 2200000, currency: 'USD', counterparty: 'Epsilon Fintech Partners Ltd (Malta)', remarks: 'Inflow from Maltese fintech with opaque ownership' }, { date: '18/09/2023', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 2150000, currency: 'USD', counterparty: 'Shenzen Cyber Industrial Park Development Ltd (CN)', remarks: 'Return flow to PRC — circular pattern confirmed' }, { date: '15/01/2026', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 1500000, currency: 'USD', counterparty: 'Unnamed Cyprus Entity via Limassol', remarks: 'Most recent inflow. OFAC SDN screening match triggered 03/03/2026.' }, { date: '03/03/2026', type: 'Account Freeze — Compliance Action', channel: 'Internal', amount: 0, currency: 'USD', counterparty: 'N/A', remarks: 'Account blocked pending OFAC SDN review. STR filed same day. Funds held.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP', 'ML_LE', 'ML_FTD', 'T_T_NS_RS'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], detailedNarrative: 'Lee Wei Jian\'s account was flagged on 03/03/2026 following an OFAC SDN positive screening match (SDN-LEE-WJ-2025-0441, listed under EO13694 — Cyber-related sanctions). A concurrent match was identified on the UN Consolidated Sanctions List.\n\nThe account has been active since November 2021 and has processed USD 7,850,000 across 6 inflow/outflow cycles. The pattern involves inflows from technology-related entities in China and a Maltese fintech intermediary, followed within days by transfers to a connected Singapore entity (LWJ Holdings Pte Ltd, same UBO) and return flows to PRC-based entities — consistent with circular flow designed to obscure the ultimate source and destination of funds.\n\nAll four accounts associated with the LWJ Holdings group have been identified as part of this flow network. The institution was unable to verify the existence of any technology licensing arrangement or genuine commercial relationship underpinning the USD 7,850,000 in transactions.\n\nThe account has been frozen pending OFAC clearance. This report is filed simultaneously under CDSA s.39 and with reference to Singapore\'s obligations under the UN Act Cap.339A. A separate referral has been escalated to MAS under the Financial Sanctions regime.', legalBasis: 'CDSA s.39 | UN Act Cap.339A — United Nations Act (Financial Sanctions)' } },
  { reportId: 'STR-2026-PTB-1005', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1005', linkedSubjectName: 'Synergy Asia Trading Pte Ltd', alertRunDate: '2026-03-03', scorecardOverallScore: 55, typology: 'Trade-Based Money Laundering (TBML) / Mirror Trading', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Pacific Trade Bank Pte Ltd', UEN: '201703145K', internalReportingReferenceNumber: 'PTB-COMP-2026-0215-005', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Angela Tan', designation: 'AML Compliance Director', directContactNumber: '+65 6788 3300', email: 'angela.tan@pacifictrade.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'PTB-005-00771188', accountType: 'Current Account', currency: 'SGD', openingDate: '12/01/2020', accountStatus: 'Active', productType: 'Business Current Account', unknownAccountNumber: false, bankInternalAccountId: '307', accountHolderName: 'SYNERGY ASIA TRADING PTE LTD', branch: 'CBD', relationshipManager: null, closingDate: null, bankRiskRating: 4950, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 6345 6789' }, { accountNumber: 'PTB-005-00771199', accountType: 'Foreign Currency Account', currency: 'USD', openingDate: '12/01/2020', accountStatus: 'Active', productType: 'Business FCA', unknownAccountNumber: false, bankInternalAccountId: '307', accountHolderName: 'SYNERGY ASIA TRADING PTE LTD', branch: 'CBD', relationshipManager: null, closingDate: null, bankRiskRating: 4950, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 6345 6789' }], tabIII_entityInformation: { entityType: 'Legal Entity (Company)', fullName: 'Synergy Asia Trading Pte Ltd', unknownName: false, UEN: '201988432N', dateOfIncorporation: '12/01/2020', countryOfIncorporation: 'Singapore', registeredAddress: { streetName: '18 Robinson Road', unitNumber: '#12-00', postalCode: '048547', country: 'Singapore' }, businessActivity: 'Securities trading and investment', unknownAddress: false, authorisedRepresentative: { name: 'Michael Tan Eng Huat', identificationType: 'NRIC', identificationNumber: 'S8103412G', role: 'Director', nationality: 'Singaporean' }, ultimateBeneficialOwners: [{ name: 'Michael Tan Eng Huat', ownershipPercentage: '60%', jurisdiction: 'Singapore' }, { name: 'Apex Capital Partners (Labuan)', ownershipPercentage: '40%', jurisdiction: 'Malaysia (Labuan)' }], screeningResults: { isPEP: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false }, additionalParties: [{ role: 'PSMD Counterparty — Gold Trade', name: 'Meridian Precious Assets Pte Ltd', jurisdiction: 'Singapore', riskNote: 'CTR-2026-0105 filed' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '01/10/2025', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'USD', amount: 4500000 }, transactions: [{ date: '14/10/2025', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 480000, currency: 'USD', counterparty: 'Apex Capital Partners (Labuan, MY)', remarks: 'Inflow from Labuan-based related party. Purpose: \'Capital injection for securities trading\'' }, { date: '22/10/2025', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 470000, currency: 'USD', counterparty: 'HK Bullion Exchange Settlement Account (HK)', remarks: 'Over-counter gold purchase settlement to HK bullion clearing entity' }, { date: '02/11/2025', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 390000, currency: 'USD', counterparty: 'Shanghai Commodity Nominees Ltd (CN)', remarks: 'Second inflow from PRC nominee. No underlying trade documentary evidence provided.' }, { date: '10/11/2025', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 380000, currency: 'USD', counterparty: 'Apex Capital Partners (Labuan, MY)', remarks: 'Rapid return flow to originating entity — circular pattern.' }, { date: '14/02/2026', type: 'Cash Withdrawal for PSMD Purchase', channel: 'Branch Counter', amount: 450000, currency: 'SGD', counterparty: 'Meridian Precious Assets Pte Ltd (SG)', remarks: 'SGD 450,000 cash withdrawn for same-day physical gold bullion purchase (5×1kg LBMA bars). CTR-2026-0105 filed by PSMD.' }, { date: '15/02/2026', type: 'Cash Deposit — PSMD Sale Proceeds', channel: 'Branch Counter', amount: 394200, currency: 'SGD', counterparty: 'Meridian Precious Assets Pte Ltd (SG)', remarks: 'Cash proceeds from gold sale next day. Net loss accepted: SGD 55,800 (12.4%). Back-to-back PSMD mirror trade confirmed.' }, { date: '03/03/2026', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 2330000, currency: 'USD', counterparty: 'Apex Capital Partners (Labuan, MY)', remarks: 'Largest single inflow. Alert trigger event: 23rd wire cycle combined with PSMD CTR creates compound suspicion.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_LE', 'ML_FTD', 'ML_TPL'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_I', 'T_W_NAB_A_IV', 'T_W_NAB_QFI'], detailedNarrative: 'Synergy Asia Trading Pte Ltd is a securities trading company incorporated in 2020, with a 40% Labuan-based ownership stake (Apex Capital Partners). The company has been identified as conducting a TBML scheme via two parallel mechanisms: electronic wire cycling and physical precious metals mirror trading.\n\nThe electronic mechanism involves inflows from Labuan and PRC nominee entities being transited rapidly (within 8 days on average) back to the same or related entities without evidence of any underlying securities trade, investment activity, or commercial purpose.\n\nThe physical mechanism was captured via CTR-2026-0105: the company purchased 5×1kg LBMA-certified gold bars for SGD 450,000 cash on 14/02/2026, returned the next day, and sold 4×500g bars (different bars from those purchased) for SGD 394,200 — accepting an economically irrational 12.4% loss with no commercial explanation. The 5th bar\'s whereabouts remain unaccounted for.\n\nThe use of precious metals as a layering vehicle — complementing electronic wires — creates a compound ML exposure across two regulated institutions (MCB and Meridian Precious Assets). The cash-based PSMD transactions specifically avoid the SWIFT paper trail and allow physical gold to be moved across borders without triggering traditional wire monitoring.\n\nFiled under CDSA s.39. Cross-referencing with CTR-2026-0105 (NP784) simultaneously filed by PSMD.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report' } },
  { reportId: 'STR-2026-MCB-1006', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1006', linkedSubjectName: 'Rajan Krishnamurthy', alertRunDate: '2026-03-03', scorecardOverallScore: 45, typology: 'Dormant Account Reactivation / Unexplained Wealth', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Meridian Capital Bank Pte Ltd', UEN: '201209001G', internalReportingReferenceNumber: 'MCB-COMP-2026-0301-006', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Lim Siew Ching', designation: 'Compliance Senior Manager', directContactNumber: '+65 6321 8800', email: 'siewching.lim@meridianbank.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'MCB-006-00119988', accountType: 'Current Account', currency: 'SGD', openingDate: '22/03/2017', accountStatus: 'Active — Reactivated', productType: 'Current / Cheque Account', dormancyPeriod: '01/09/2020 to 14/08/2025 (59 months inactive)', unknownAccountNumber: false, bankInternalAccountId: '308', accountHolderName: 'RAJAN KRISHNAMURTHY', branch: 'Tanjong Rhu', relationshipManager: null, closingDate: null, bankRiskRating: 3800, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 8234 5678' }], tabIII_entityInformation: { entityType: 'Natural Person', fullName: 'Rajan Krishnamurthy', unknownName: false, dateOfBirth: '17/02/1966', unknownDOB: false, gender: 'Male', nationality: 'Singaporean Permanent Resident (Indian National)', identificationType: 'FIN', identificationNumber: 'F6612345H', unknownIdentification: false, occupation: 'Retired (stated)', employer: 'N/A — retired', residentialAddress: { block: '77', streetName: 'Toa Payoh Lorong 4', unitNumber: '#11-22', postalCode: '310077', country: 'Singapore' }, unknownAddress: false, screeningResults: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false }, additionalParties: [{ role: 'Inflow Counterparty', name: 'Krishnamurthy Family Trust (Mauritius)', jurisdiction: 'Mauritius', riskNote: 'Trust beneficiary and trustee details not verified' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '14/08/2025', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'SGD', amount: 2880000 }, transactions: [{ date: '14/08/2025', type: 'Reactivation Deposit — Wire', channel: 'SWIFT', amount: 450000, currency: 'SGD', counterparty: 'Krishnamurthy Family Trust (Mauritius)', remarks: 'Reactivation event: first credit after 59-month dormancy. Source declared as family trust distribution.' }, { date: '21/08/2025', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 440000, currency: 'SGD', counterparty: 'Unnamed India-based Beneficiary (IN)', remarks: '98% of inflow transited to Indian beneficiary within 7 days. Round amounts.' }, { date: '05/09/2025', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 380000, currency: 'SGD', counterparty: 'Krishnamurthy Family Trust (Mauritius)', remarks: 'Second trust distribution' }, { date: '12/09/2025', type: 'Cash Withdrawal', channel: 'Branch Counter', amount: 30000, currency: 'SGD', counterparty: 'N/A', remarks: 'Large cash withdrawal. No stated purpose.' }, { date: '15/10/2025', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 620000, currency: 'SGD', counterparty: 'Krishnamurthy Family Trust (Mauritius)', remarks: 'Third distribution' }, { date: '22/10/2025', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 600000, currency: 'SGD', counterparty: 'Unnamed India-based Beneficiary (IN)', remarks: 'Pattern consistent: near-instant transit of trust distributions to India' }, { date: '10/12/2025', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 480000, currency: 'SGD', counterparty: 'Krishnamurthy Family Trust (Mauritius)', remarks: '' }, { date: '15/02/2026', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 950000, currency: 'SGD', counterparty: 'Krishnamurthy Family Trust (Mauritius)', remarks: 'Largest single distribution. Alert trigger event.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP', 'ML_TPL'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_C', 'T_W_NAB_A_IV'], detailedNarrative: 'Rajan Krishnamurthy\'s account was dormant for 59 consecutive months (September 2020 to August 2025) before being suddenly reactivated with a SGD 450,000 wire transfer from a Mauritius-based family trust. Over the subsequent 6.5 months, the account received SGD 2,880,000 in total from the same trust entity and transited approximately 97% of all inflows to an Indian beneficiary (identity unverified by MCB) within 3–8 business days of each receipt.\n\nThe pattern is consistent with a trust-layering mechanism: funds originating in India are routed through a Mauritius trust (a jurisdiction with historically favourable tax treaty positions with India) into a dormant Singapore account to create geographical and institutional distance before being returned to Indian-connected recipients. This three-step loop — India → Mauritius → Singapore → India — exploits Singapore\'s legitimate financial hub status as an intermediate layering stage.\n\nThe subject, who is retired, has not been able to provide documentation substantiating the Krishnamurthy Family Trust\'s legitimate source of assets, trust deed, or trustee identity. The economic profile of a retired individual receiving SGD 2.88M in trust distributions and immediately transiting the funds is inconsistent with genuine retirement income management.\n\nFiled under CDSA s.39.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report' } },
  { reportId: 'STR-2026-CCB-1007', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1007', linkedSubjectName: 'Pyongyang Tech Export Co.', alertRunDate: '2026-03-03', scorecardOverallScore: 79, typology: 'Proliferation Financing — WMD-Related', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Changi Commercial Bank Pte Ltd', UEN: '201809234M', internalReportingReferenceNumber: 'CCB-COMP-2026-0310-007', noticeReferenceNumber: 'PMO-PFIU-REFERRAL-2025-1009', contactOfficer: { name: 'David Wong', designation: 'Chief Compliance Officer', directContactNumber: '+65 6912 4400', email: 'david.wong@changibank.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'CCB-007-00994455', accountType: 'Current Account', currency: 'USD', openingDate: '08/03/2022', accountStatus: 'Blocked — UNSC Alert', productType: 'Business Current Account', unknownAccountNumber: false, note: 'Account opened under cover name \'PT Global Trade Solutions\' — subsequently identified as Pyongyang Tech Export Co. front entity', bankInternalAccountId: '309', accountHolderName: 'PT GLOBAL TRADE SOLUTIONS', branch: 'CBD', relationshipManager: null, closingDate: null, bankRiskRating: 8500, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 6456 7890' }], tabIII_entityInformation: { entityType: 'Legal Entity (Company) — Suspected Front Entity', fullName: 'Pyongyang Tech Export Co.', aliases: ['PT Global Trade Solutions', 'PTE Co. Ltd'], unknownName: false, jurisdiction: 'Korea, Democratic People\'s Republic of', registeredAgent: 'Unknown — no verifiable registration', businessActivity: 'Technology equipment export (declared) — suspected dual-use goods procurement', unknownAddress: false, authorisedRepresentative: { name: 'Kim Sung Jin', identificationType: 'Passport', identificationNumber: 'PRK-PAX-7734912', role: 'Company Representative / Agent', nationality: 'North Korean' }, screeningResults: { isPEP: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true, sanctionsDetail: 'UNSC Resolution 1718 — Designated Entity linked to Korea Ryonbong General Corporation (beneficial owner of funds per CMR-2026-0107). Entity suspected under UNSC Res.2270, 2321.' }, additionalParties: [{ role: 'Beneficial Owner of Funds', name: 'Korea Ryonbong General Corporation', jurisdiction: 'DPRK', riskNote: 'UNSC Resolution 1718 DESIGNATED — WMD Proliferator' }, { role: 'Procurement Counterparty / Recipient', name: 'Unnamed Iranian Procurement Entity', jurisdiction: 'Iran', riskNote: 'UNSC Sanctioned Jurisdiction — Dual-use goods nexus' }, { role: 'Transit Entity', name: 'Dalian Forwarding Agents Ltd', jurisdiction: 'China', riskNote: 'Used as intermediary forwarding agent for dual-use components' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '08/03/2022', to: '19/10/2025' }, totalSuspiciousAmount: { currency: 'USD', amount: 3900000 }, transactions: [{ date: '08/03/2022', type: 'Account Opening Wire', channel: 'SWIFT', amount: 125000, currency: 'USD', counterparty: 'Dalian Forwarding Agents Ltd (CN)', remarks: 'Account opened under alias \'PT Global Trade Solutions\'. Initial funding from Chinese forwarding agent.' }, { date: '14/06/2022', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 450000, currency: 'USD', counterparty: 'Dalian Forwarding Agents Ltd (CN)', remarks: 'Technology equipment payment stated. No import permits or Customs declarations filed in Singapore.' }, { date: '22/06/2022', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 440000, currency: 'USD', counterparty: 'Gulf Technology Holdings (UAE)', remarks: 'Rapid transit. UAE entity is intermediary for dual-use goods procurement per intelligence.' }, { date: '10/01/2023', type: 'Inward Wire — SWIFT', channel: 'SWIFT', amount: 780000, currency: 'USD', counterparty: 'Dalian Forwarding Agents Ltd (CN)', remarks: 'Increasing volumes. Purpose: \'Electronic component procurement settlement\'' }, { date: '20/01/2023', type: 'Outward Wire — SWIFT', channel: 'SWIFT', amount: 765000, currency: 'USD', counterparty: 'Gulf Technology Holdings (UAE)', remarks: 'Same UAE transit destination. 7-day cycle maintained.' }, { date: '19/10/2025', type: 'Cross-Border Physical Cash', channel: 'CMR Flagged', amount: 250000, currency: 'USD', counterparty: 'ICA Checkpoint — Changi Airport', remarks: 'CMR-2026-0107: Kim Sung Jin declares USD 250,000 cash. Source: Korea Ryonbong General Corp (UNSC DESIGNATED). Recipient: Iranian procurement entity. CRITICAL — ICA detained; referred to SPF-CAD same day.' }, { date: '19/10/2025', type: 'SWIFT Wire — Final', channel: 'SWIFT', amount: 1090000, currency: 'USD', counterparty: 'Gulf Technology Holdings (UAE)', remarks: 'Simultaneous final wire coinciding with physical cash declaration. Total exposure: USD 3.9M equivalent' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['T_T_NS_RS', 'T_T_NS_TB', 'T_T_NS_IAT', 'ML_LE', 'ML_FTD'], suspicionCategories: ['S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], detailedNarrative: 'Pyongyang Tech Export Co. is assessed to be a front entity for Korea Ryonbong General Corporation, a UNSC Resolution 1718-designated entity and known WMD proliferator. The account was opened under a cover name (\'PT Global Trade Solutions\') with a Chinese forwarding agent as the initial funder, a classic obfuscation technique used by DPRK-connected entities to maintain banking access in international financial centres.\n\nThe transaction pattern — inflows from a Chinese forwarding intermediary, transit through a UAE entity specialising in dual-use goods procurement, routed toward Iranian technology procurement counterparties — maps precisely onto the DPRK proliferation financing typology documented in UNSC Panel of Experts reports (S/2024/215): China acts as the supply chain originator, UAE the logistics intermediary, and Iran the end-use destination for WMD-related components.\n\nThe CMR filed on 19/10/2025 (CMR-2026-0107) is the critical triggering event: Kim Sung Jin, the company\'s agent and a North Korean national, physically transported USD 250,000 in cash into Singapore. The declared source (Korea Ryonbong General Corp — UNSC DESIGNATED) and recipient (unnamed Iranian procurement entity) were confirmed in declaration. This represents the cash-based supplement to the electronic wire network, chosen specifically to avoid SWIFT surveillance.\n\nICA detained the subject on the same day. This STR is filed concurrently with a referral to SPF-CAD (Proliferation Financing Unit), MAS, and pursuant to Singapore\'s obligations under TSOFA and UN Act Cap.339A. All accounts associated with the entity have been frozen.', legalBasis: 'CDSA s.39 | TSOFA — Terrorism (Suppression of Financing) Act | UN Act Cap.339A — United Nations Act (Financial Sanctions) | Proliferation Finance referral to SPF-CAD' } },
  { reportId: 'STR-2026-RBC-1008', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1008', linkedSubjectName: 'Tan Mei Ling', alertRunDate: '2026-03-03', scorecardOverallScore: 40, typology: 'Fraud / Money Mule — Scam Proceeds Layering', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Retail Banking', nameOfReportingInstitution: 'Raffles Banking Corporation Pte Ltd', UEN: '201604177J', internalReportingReferenceNumber: 'RBC-COMP-2026-0228-008', noticeReferenceNumber: 'SPF-CID-SCAM-2026-REF-8812', contactOfficer: { name: 'Michelle Koh', designation: 'Compliance Manager', directContactNumber: '+65 6234 5500', email: 'michelle.koh@rafflesbank.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'RBC-008-00228877', accountType: 'Savings Account', currency: 'SGD', openingDate: '15/06/2019', accountStatus: 'Cancelled — Fraud Flag', productType: 'Savings Account', unknownAccountNumber: false, bankInternalAccountId: '311', accountHolderName: 'TAN MEI LING SAVINGS', branch: 'Bedok', relationshipManager: null, closingDate: null, bankRiskRating: 4100, amlAlertTriggered: true, priorFilingCount: null, contactNumber: '+65 9345 6789' }, { accountNumber: 'RBC-008-00228800', accountType: 'Current Account', currency: 'SGD', openingDate: '03/11/2021', accountStatus: 'Cancelled — Fraud Flag', productType: 'Current / Cheque Account', unknownAccountNumber: false, bankInternalAccountId: '310', accountHolderName: 'TAN MEI LING CURRENT', branch: 'Bedok', relationshipManager: null, closingDate: null, bankRiskRating: 4100, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 9345 6789' }], tabIII_entityInformation: { entityType: 'Natural Person', fullName: 'Tan Mei Ling', unknownName: false, dateOfBirth: '05/07/1992', unknownDOB: false, gender: 'Female', nationality: 'Singaporean', identificationType: 'NRIC', identificationNumber: 'S9201234C', unknownIdentification: false, occupation: 'Administrative assistant', employer: 'ABC Consultancy Pte Ltd (stated — unverified)', residentialAddress: { block: '201', streetName: 'Tampines Street 21', unitNumber: '#14-108', postalCode: '520201', country: 'Singapore' }, unknownAddress: false, screeningResults: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: true, adverseNewsDetail: 'SPF CID scam investigation referral — CID-SCAM-2026-REF-8812', sanctionsMatch: false }, additionalParties: [{ role: 'Transaction Inflow Source (Suspected Scam Victims)', name: 'Multiple unidentified individuals (7 counterparties)', jurisdiction: 'Singapore', riskNote: 'Round-amount transfers from 7 different MCB/DBS/OCBC accounts — consistent with scam victim disbursements' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '01/11/2025', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'SGD', amount: 247500 }, transactions: [{ date: '01/11/2025', type: 'Inward Transfer — PayNow', channel: 'PayNow', amount: 10000, currency: 'SGD', counterparty: 'Unknown Individual A (DBS Account)', remarks: 'Round amount. PayNow transfer from unknown sender.' }, { date: '02/11/2025', type: 'Inward Transfer — PayNow', channel: 'PayNow', amount: 15000, currency: 'SGD', counterparty: 'Unknown Individual B (OCBC Account)', remarks: 'Round amount. Second sender within 24 hours.' }, { date: '04/11/2025', type: 'Cash Withdrawal', channel: 'ATM', amount: 23000, currency: 'SGD', counterparty: 'N/A', remarks: '96% of received funds withdrawn as cash within 3 days' }, { date: '15/11/2025', type: 'Inward Transfer — FAST', channel: 'FAST', amount: 25000, currency: 'SGD', counterparty: 'Unknown Individual C (UOB Account)', remarks: 'Third sender. All senders unrelated to each other.' }, { date: '16/11/2025', type: 'Pawnbroker Cash Loan', channel: 'Golden Link Pawnbrokers', amount: 8500, currency: 'SGD', counterparty: 'Golden Link Pawnbrokers Pte Ltd', remarks: 'CTR-2026-0108: 22K gold necklace pawned for SGD 8,500 cash loan. First pawnbroker event.' }, { date: '16/11/2025', type: 'Pawnbroker Cash Loan', channel: 'Golden Link Pawnbrokers', amount: 3000, currency: 'SGD', counterparty: 'Golden Link Pawnbrokers Pte Ltd', remarks: 'CTR-2026-0108: 18K gold bracelet pawned for SGD 3,000 in same visit.' }, { date: '20/12/2025', type: 'Inward Transfer — PayNow', channel: 'PayNow', amount: 30000, currency: 'SGD', counterparty: 'Unknown Individual D (DBS Account)', remarks: '4th unrelated sender. Escalating individual transfer amounts.' }, { date: '22/12/2025', type: 'Cash Withdrawal', channel: 'Branch Counter', amount: 29000, currency: 'SGD', counterparty: 'N/A', remarks: '97% immediate cash out' }, { date: '17/01/2026', type: 'Pawnbroker Cash Loan', channel: 'Golden Link Pawnbrokers', amount: 5000, currency: 'SGD', counterparty: 'Golden Link Pawnbrokers Pte Ltd', remarks: 'CTR-2026-0108: 24K gold bar pendants pawned for SGD 5,000. Third pawnbroker event. Total pawn proceeds: SGD 16,500.' }, { date: '20/01/2026', type: 'Inward Transfer — FAST', channel: 'FAST', amount: 50000, currency: 'SGD', counterparty: 'Unknown Individual E (MCB Account)', remarks: 'Fifth sender — internal MCB cross-account transfer from suspected scam victim account' }, { date: '25/01/2026', type: 'Cash Withdrawal', channel: 'ATM', amount: 49500, currency: 'SGD', counterparty: 'N/A', remarks: '99% cash out within 5 days' }, { date: '03/03/2026', type: 'Account Cancellation', channel: 'Bank-Initiated', amount: 0, currency: 'SGD', counterparty: 'N/A', remarks: 'Both MCB accounts cancelled after SPF referral (CID-SCAM-2026-REF-8812). Fraud flag applied. STR filed.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP', 'ML_SL', 'F_C_WTF', 'F_C_IF'], suspicionCategories: ['S_L_T_A', 'S_L_T_F', 'T_W_NAB_A_II', 'T_W_NAB_A_IV'], detailedNarrative: 'Tan Mei Ling, an administrative assistant, maintained two accounts at MCB that received SGD 247,500 in round-amount transfers from 7 unrelated individuals across DBS, OCBC, UOB, and MCB over a 4-month period. Near-immediately after each receipt (within 1–5 days), funds were withdrawn as cash — achieving an average 97% cash-out rate. This receive-and-withdraw cycle is the defining signature of a money mule account receiving scam disbursements.\n\nParallel to the bank account activity, the subject pawned multiple high-value gold jewellery items at Golden Link Pawnbrokers (CTR-2026-0108) across two visits in January 2026, obtaining SGD 16,500 in round-amount cash loans. The jewellery characteristics (22K necklace sets, 18K diamond bracelets, 24K bar pendants) are inconsistent with the financial profile of an administrative assistant and are consistent with assets received as gifts or payment from romance scam or investment scam operators who cultivate mules with luxury goods.\n\nSPF CID has opened investigation CID-SCAM-2026-REF-8812 following a complaint from one of the identified inflow senders (Individual C — UOB SGD 25,000 transfer), who reported being defrauded in an investment scam. The sender transferred funds believing they were making a legitimate crypto investment; the funds flowed directly to Tan Mei Ling\'s MCB account.\n\nBoth MCB accounts have been cancelled with Fraud Flag. The institution is cooperating with the SPF investigation. Filed under CDSA s.39.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report | SPF CID Referral CID-SCAM-2026-REF-8812' } },
  { reportId: 'STR-2026-MCB-1009', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1009', linkedSubjectName: 'Ong Bee Lian', alertRunDate: '2026-03-03', scorecardOverallScore: 4, typology: 'Low Risk — Geographic Flag', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Meridian Capital Bank Pte Ltd', UEN: '201209001G', internalReportingReferenceNumber: 'MCB-COMP-2026-0301-009', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Lim Siew Ching', designation: 'Compliance Senior Manager', directContactNumber: '+65 6321 8800', email: 'siewching.lim@meridianbank.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'MCB-001-00667788', accountType: 'Savings Account', currency: 'SGD', openingDate: '05/06/2018', accountStatus: 'Active', productType: 'Savings Account', unknownAccountNumber: false, bankInternalAccountId: '401', accountHolderName: 'ONG BEE LIAN', branch: 'Jurong East', relationshipManager: null, closingDate: null, bankRiskRating: 400, amlAlertTriggered: false, priorFilingCount: 0, contactNumber: '+65 9234 5678' }], tabIII_entityInformation: { entityType: 'Natural Person', fullName: 'Ong Bee Lian', unknownName: false, dateOfBirth: '22/08/1975', unknownDOB: false, gender: 'Female', nationality: 'Singaporean', identificationType: 'NRIC', identificationNumber: 'S7534210B', unknownIdentification: false, occupation: 'Retired schoolteacher', employer: null, residentialAddress: { block: '203', streetName: 'Jurong East Street 21', unitNumber: '#04-15', postalCode: '600203', country: 'Singapore' }, unknownAddress: false, screeningResults: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false }, additionalParties: [] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '01/01/2026', to: '28/02/2026' }, totalSuspiciousAmount: { currency: 'SGD', amount: 12000 }, transactions: [{ date: '15/01/2026', type: 'Outward Remittance', channel: 'Online Banking', amount: 6000, currency: 'SGD', counterparty: 'Ong Mei Hua (Jakarta, Indonesia)', remarks: 'Monthly remittance to sister in Jakarta. Consistent with prior pattern.' }, { date: '15/02/2026', type: 'Outward Remittance', channel: 'Online Banking', amount: 6000, currency: 'SGD', counterparty: 'Ong Mei Hua (Jakarta, Indonesia)', remarks: 'Monthly remittance to sister in Jakarta. Same amount, same recipient.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP'], suspicionCategories: ['T_W_NAB_A_IV'], detailedNarrative: 'Automated STR filing triggered by geographic risk flag. Customer Ong Bee Lian, a retired Singaporean schoolteacher, has been sending regular monthly remittances of SGD 6,000 to a family member (sister Ong Mei Hua) in Jakarta, Indonesia. The pattern has been consistent for over 2 years. No other risk indicators were identified. The geographic flag alone (Indonesia) triggered a low-level alert (score 4.0). No behavioural anomalies, no structuring patterns, no adverse media. This filing is precautionary and the institution considers the risk to be minimal.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report' } },
  { reportId: 'STR-2026-SFG-1010', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1010', linkedSubjectName: 'Sunrise Wellness Pte Ltd', alertRunDate: '2026-03-03', scorecardOverallScore: 8, typology: 'Low Risk — Minor Geographic + Round Amount', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Sentosa Financial Group Pte Ltd', UEN: '201512088H', internalReportingReferenceNumber: 'SFG-COMP-2026-0301-010', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Raj Kumar', designation: 'Head of Financial Crime Compliance', directContactNumber: '+65 6455 2200', email: 'raj.kumar@sentosafinancial.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'SFG-009-00334455', accountType: 'Business Current Account', currency: 'SGD', openingDate: '12/03/2020', accountStatus: 'Active', productType: 'Business Current Account', unknownAccountNumber: false, bankInternalAccountId: '402', accountHolderName: 'SUNRISE WELLNESS PTE LTD', branch: 'Toa Payoh', relationshipManager: 'Angela Tan', closingDate: null, bankRiskRating: 800, amlAlertTriggered: false, priorFilingCount: 0, contactNumber: '+65 6345 8901' }], tabIII_entityInformation: { entityType: 'Legal Person', fullName: 'Sunrise Wellness Pte Ltd', unknownName: false, dateOfIncorporation: '12/03/2020', nationality: 'Singapore', identificationType: 'UEN', identificationNumber: '202008876W', unknownIdentification: false, principalActivity: 'Health supplements wholesale', registeredAddress: { block: '52', streetName: 'Toa Payoh Lorong 1', unitNumber: '#01-08', postalCode: '310052', country: 'Singapore' }, unknownAddress: false, screeningResults: { isPEP: false, isPEPRelative: false, adverseNewsForeign: false, adverseNewsLocal: false, sanctionsMatch: false }, additionalParties: [{ role: 'Director / UBO', entityType: 'Natural Person', name: 'Koh Chee Wai', nationality: 'Singaporean', riskNote: 'No adverse findings' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '01/11/2025', to: '28/02/2026' }, totalSuspiciousAmount: { currency: 'SGD', amount: 48000 }, transactions: [{ date: '15/11/2025', type: 'Outward TT', channel: 'Online Banking', amount: 12000, currency: 'SGD', counterparty: 'Khmer Health Supplies Co. (Phnom Penh, Cambodia)', remarks: 'Quarterly payment to Cambodian supplier. Round amount.' }, { date: '15/12/2025', type: 'Outward TT', channel: 'Online Banking', amount: 12000, currency: 'SGD', counterparty: 'Khmer Health Supplies Co. (Phnom Penh, Cambodia)', remarks: 'Quarterly payment to Cambodian supplier. Round amount.' }, { date: '15/01/2026', type: 'Outward TT', channel: 'Online Banking', amount: 12000, currency: 'SGD', counterparty: 'Khmer Health Supplies Co. (Phnom Penh, Cambodia)', remarks: 'Quarterly payment to Cambodian supplier. Round amount.' }, { date: '15/02/2026', type: 'Outward TT', channel: 'Online Banking', amount: 12000, currency: 'SGD', counterparty: 'Khmer Health Supplies Co. (Phnom Penh, Cambodia)', remarks: 'Quarterly payment to Cambodian supplier. Round amount.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP'], suspicionCategories: ['T_W_NAB_A_IV'], detailedNarrative: 'Automated STR filing triggered by a minor geographic risk flag (Cambodia) combined with a low-level round-amount indicator (4 payments of exactly SGD 12,000). Sunrise Wellness Pte Ltd is a Singapore-incorporated health supplements wholesaler with a 6-year operating history. The payments are to its established Cambodian supplier (Khmer Health Supplies Co.) and are consistent with the company\'s trade records and prior payment patterns. No structuring, no layering, no adverse media, no sanctions matches. Score of 8.0 is below the active triage threshold. Filing is precautionary.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report' } },
  { reportId: 'STR-2026-CCB-1011', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1011', linkedSubjectName: 'Viktor Lazarev', alertRunDate: '2026-03-03', scorecardOverallScore: 156, typology: 'Sanctions Evasion / Proliferation Financing / PEP Corruption', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial Banking', nameOfReportingInstitution: 'Changi Commercial Bank Pte Ltd', UEN: '199905432M', internalReportingReferenceNumber: 'CCB-COMP-2026-0301-011', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Siti Nurhaliza', designation: 'Senior Compliance Officer', directContactNumber: '+65 6512 7700', email: 'siti.n@changicommercial.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'CCB-003-00881100', accountType: 'Current Account', currency: 'USD', openingDate: '14/05/2023', accountStatus: 'Active', productType: 'Premium Current Account', unknownAccountNumber: false, bankInternalAccountId: '501', accountHolderName: 'VIKTOR LAZAREV', branch: 'Marina Bay', relationshipManager: 'David Ng', closingDate: null, bankRiskRating: 15600, amlAlertTriggered: true, priorFilingCount: 2, contactNumber: '+65 8899 1234' }, { accountNumber: 'MCB-001-00993344', accountType: 'Current Account', currency: 'EUR', openingDate: '22/09/2023', accountStatus: 'Active', productType: 'Multi-Currency Account', unknownAccountNumber: false, bankInternalAccountId: '502', accountHolderName: 'LAZAREV HOLDINGS PTE LTD', branch: 'Orchard', relationshipManager: 'David Ng', closingDate: null, bankRiskRating: 15600, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 8899 1234' }], tabIII_entityInformation: { entityType: 'Natural Person', fullName: 'Viktor Andreyevich Lazarev', unknownName: false, dateOfBirth: '19/06/1968', unknownDOB: false, gender: 'Male', nationality: 'Russian', identificationType: 'Passport', identificationNumber: 'RF72114589', countryOfIssuance: 'Russia', unknownIdentification: false, occupation: 'Private investor / Former Deputy Minister of Industry and Trade (Russia)', employer: 'Self-employed — Lazarev Holdings Pte Ltd', residentialAddress: { streetName: 'Rublyovo-Uspenskoye Highway', city: 'Moscow', country: 'Russia' }, singaporeAddress: { block: '1', streetName: 'Cuscaden Road', unitNumber: '#38-01', postalCode: '249715', country: 'Singapore', temporary: false }, unknownAddress: false, screeningResults: { isPEP: true, isPEPRelative: true, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true }, additionalParties: [{ role: 'Sanctioned Counterparty', entityType: 'Corporate', name: 'Rostec State Corporation', jurisdiction: 'Russia', riskNote: 'OFAC SDN Listed — Russian state defence conglomerate' }, { role: 'Sanctioned Counterparty', entityType: 'Corporate', name: 'Promtechnologia LLC', jurisdiction: 'Russia', riskNote: 'EU Consolidated Sanctions — Defence subcontractor' }, { role: 'Spouse / PEP Family', entityType: 'Natural Person', name: 'Irina Lazareva', jurisdiction: 'Russia', riskNote: 'Board member of Gazprom subsidiary — PEP relative' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '14/05/2023', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'USD', amount: 8500000 }, transactions: [{ date: '14/05/2023', type: 'Inward Wire Transfer', channel: 'SWIFT', amount: 1250000, currency: 'USD', counterparty: 'Volga Industrial Holdings SA (Cyprus)', remarks: 'Initial funding via Cypriot shell. UBO screening traces to Rostec affiliate.' }, { date: '22/07/2023', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 980000, currency: 'USD', counterparty: 'Precision Dynamics FZE (Dubai, UAE)', remarks: 'Transfer to UAE free zone entity. Invoice: \'precision machining components\'. Dual-use goods concern.' }, { date: '15/11/2023', type: 'Inward Wire Transfer', channel: 'SWIFT', amount: 1800000, currency: 'EUR', counterparty: 'Promtechnologia LLC (Russia)', remarks: 'CRITICAL: Direct inflow from EU-sanctioned entity. Purpose stated: \'consulting fees\'.' }, { date: '28/11/2023', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 1750000, currency: 'USD', counterparty: 'Titan Global Resources Ltd (BVI)', remarks: 'Near-full amount moved to BVI entity within 13 days. Nominee director. Classic layering.' }, { date: '03/04/2024', type: 'Cash Deposit', channel: 'Branch Counter', amount: 425000, currency: 'USD', counterparty: 'Self', remarks: 'Large cash deposit. Source of funds: \'investment returns\'. No documentation.' }, { date: '10/06/2024', type: 'Inward Wire Transfer', channel: 'SWIFT', amount: 620000, currency: 'CHF', counterparty: 'Lazarev Family Trust (Zurich, Switzerland)', remarks: 'Inflow from Swiss family trust. Opaque structure, UBO unverified.' }, { date: '18/09/2024', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 890000, currency: 'USD', counterparty: 'Harbour View Properties Ltd (Hong Kong)', remarks: 'Real estate acquisition vehicle. Structuring via HK holding.' }, { date: '12/01/2025', type: 'Cross-Border Cash Declaration', channel: 'CMR Flagged', amount: 185000, currency: 'USD', counterparty: 'ICA Checkpoint — Changi Airport', remarks: 'CMR-2026-0111: USD 185,000 declared on arrival from Moscow via Dubai. Purpose: \'personal funds\'.' }, { date: '25/02/2026', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 600000, currency: 'USD', counterparty: 'Precision Dynamics FZE (Dubai, UAE)', remarks: 'Second transfer to same UAE entity. Cumulative: USD 1,580,000 to dual-use goods nexus.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP', 'ML_TPL', 'ML_FTD', 'T_T_NS_RS', 'T_T_NS_TB'], suspicionCategories: ['S_L_T_A', 'S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'S_L_T_F', 'T_W_NAB_A_IV'], detailedNarrative: 'Viktor Andreyevich Lazarev is a Russian national and former Deputy Minister of Industry and Trade — a confirmed Politically Exposed Person. His spouse, Irina Lazareva, sits on the board of a Gazprom subsidiary (PEP family). Lazarev maintains two accounts in Singapore: a personal USD account at CCB (Marina Bay) and a corporate EUR account under Lazarev Holdings Pte Ltd at MCB (Orchard).\n\nThe AML system flagged direct financial flows linked to two sanctioned entities: (1) Rostec State Corporation (OFAC SDN — Russian state defence conglomerate), traced through a Cypriot shell company (Volga Industrial Holdings SA), and (2) Promtechnologia LLC (EU Consolidated Sanctions — Russian defence subcontractor), which sent EUR 1,800,000 directly into the corporate account.\n\nFund movements exhibit a classic multi-layered sanctions evasion and layering pattern: inflows from sanctioned/opaque sources → brief transit through Singapore accounts (average holding period 1.8 hours for pass-through transactions) → outflows to shell entities in BVI, UAE free zones, and Hong Kong. The UAE recipient (Precision Dynamics FZE) received cumulative transfers of USD 1,580,000 for \'precision machining components\' — goods falling under dual-use export control categories.\n\nLazarev was named in the OCCRP investigation (2025) into Russian oligarch asset networks and appeared in the Pandora Papers leak (ICIJ), which identified a 7-layer ownership structure spanning Russia, Cyprus, BVI, Switzerland, UAE, Hong Kong, and Singapore.\n\nThe subject\'s hub-and-spoke network shows 14 connected entities with a centrality score of 0.97. Cash structuring patterns (window ratio 0.88, 42 transactions averaging SGD 9,950) are consistent with deliberate threshold avoidance.\n\nTotal suspicious exposure: USD 8,500,000. This report is filed under CDSA s.39 and TSOFA. Referral to Proliferation Financing Unit and CAD recommended.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report | TSOFA — Terrorism (Suppression of Financing) Act' } },
  { reportId: 'STR-2026-PTB-1012', reportType: 'STR', reportForm: 'STR_v3.2', linkedSubjectId: 'customer-1012', linkedSubjectName: 'Golden Phoenix International Ltd', alertRunDate: '2026-03-03', scorecardOverallScore: 151, typology: 'Sanctions Evasion / Military-Linked Shell Network / Trade-Based ML', tabI_reportingInstitution: { institutionType: 'Bank - Full Bank', businessType: 'Commercial & Trade Finance Banking', nameOfReportingInstitution: 'Pacific Trade Bank Pte Ltd', UEN: '200801556K', internalReportingReferenceNumber: 'PTB-COMP-2026-0301-012', noticeReferenceNumber: 'N/A', contactOfficer: { name: 'Chen Wei Lin', designation: 'VP Compliance', directContactNumber: '+65 6788 3300', email: 'weilin.chen@pacifictrade.com.sg' } }, tabII_accountInformation: [{ accountNumber: 'PTB-002-00556677', accountType: 'Trade Finance Account', currency: 'USD', openingDate: '08/01/2024', accountStatus: 'Active', productType: 'Trade Finance — Documentary Collection', unknownAccountNumber: false, bankInternalAccountId: '601', accountHolderName: 'GOLDEN PHOENIX INTERNATIONAL LTD', branch: 'Shenton Way', relationshipManager: 'Tan Boon Huat', closingDate: null, bankRiskRating: 15100, amlAlertTriggered: true, priorFilingCount: 1, contactNumber: '+65 6778 4455' }, { accountNumber: 'MCB-001-00778899', accountType: 'Current Account', currency: 'SGD', openingDate: '15/03/2024', accountStatus: 'Active', productType: 'Business Current Account', unknownAccountNumber: false, bankInternalAccountId: '602', accountHolderName: 'PHOENIX JADE TRADING PTE LTD', branch: 'Chinatown', relationshipManager: null, closingDate: null, bankRiskRating: 15100, amlAlertTriggered: true, priorFilingCount: 0, contactNumber: '+65 6778 4455' }], tabIII_entityInformation: { entityType: 'Legal Person', fullName: 'Golden Phoenix International Ltd', unknownName: false, dateOfIncorporation: '18/11/2023', nationality: 'Malaysia (Labuan)', identificationType: 'Registration Number', identificationNumber: 'LL-2023-18876', unknownIdentification: false, principalActivity: 'Jade, gemstones, and timber trading', registeredAddress: { streetName: 'Level 12, Main Office Tower, Financial Park Labuan', city: 'Labuan', country: 'Malaysia' }, singaporeAddress: { block: '133', streetName: 'New Bridge Road', unitNumber: '#08-12', postalCode: '059413', country: 'Singapore' }, unknownAddress: false, screeningResults: { isPEP: true, isPEPRelative: false, adverseNewsForeign: true, adverseNewsLocal: false, sanctionsMatch: true }, additionalParties: [{ role: 'UBO / Director', entityType: 'Natural Person', name: 'Gen. (Ret.) Aung Kyaw Moe', nationality: 'Myanmar', riskNote: 'Retired Myanmar military general — PEP. Named in Justice for Myanmar reports.' }, { role: 'Sanctioned Counterparty', entityType: 'Corporate', name: 'Myanmar Economic Holdings Ltd (MEHL)', jurisdiction: 'Myanmar', riskNote: 'OFAC SDN Listed — Myanmar military conglomerate' }, { role: 'Sanctioned Counterparty', entityType: 'Corporate', name: 'Myanmar Gems Enterprise', jurisdiction: 'Myanmar', riskNote: 'UNSC Sanctioned — State-owned gems monopoly' }, { role: 'Subsidiary / Shell', entityType: 'Corporate', name: 'Phoenix Jade Trading Pte Ltd', jurisdiction: 'Singapore', riskNote: 'Singapore subsidiary — same nominee director as parent. BVI beneficial ownership.' }] }, tabIV_suspiciousTransactions: { transactionPeriod: { from: '08/01/2024', to: '03/03/2026' }, totalSuspiciousAmount: { currency: 'USD', amount: 6200000 }, transactions: [{ date: '08/01/2024', type: 'Inward Wire Transfer', channel: 'SWIFT', amount: 850000, currency: 'USD', counterparty: 'Myanmar Gems Enterprise (Naypyidaw, Myanmar)', remarks: 'CRITICAL: Direct inflow from UNSC-sanctioned state-owned gems monopoly. Purpose: \'jade lot purchase advance\'.' }, { date: '22/01/2024', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 820000, currency: 'USD', counterparty: 'Yunnan Jade Processing Co. Ltd (Kunming, China)', remarks: 'Transfer to Chinese jade processor within 14 days. Over-invoiced by estimated 55%.' }, { date: '15/04/2024', type: 'Inward Wire Transfer', channel: 'SWIFT', amount: 1200000, currency: 'USD', counterparty: 'MEHL Trading Division (Yangon, Myanmar)', remarks: 'CRITICAL: Inflow from OFAC SDN-listed Myanmar military conglomerate.' }, { date: '28/04/2024', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 1150000, currency: 'USD', counterparty: 'Siam Precious Resources Co. Ltd (Bangkok, Thailand)', remarks: 'Layering via Thai entity. Invoice: \'teak timber — Grade A logs\'. Over-invoicing ratio 1.62x.' }, { date: '10/08/2024', type: 'Inward Wire Transfer', channel: 'SWIFT', amount: 680000, currency: 'USD', counterparty: 'Dragon Crown Trading Ltd (Hong Kong)', remarks: 'Inflow from HK entity. UBO traces back to MEHL network.' }, { date: '22/08/2024', type: 'Internal Transfer', channel: 'Internal', amount: 650000, currency: 'SGD', counterparty: 'Phoenix Jade Trading Pte Ltd (Singapore subsidiary)', remarks: 'Inter-company transfer to subsidiary with identical nominee director. Layering indicator.' }, { date: '05/11/2024', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 950000, currency: 'USD', counterparty: 'Mandalay Timber Export Corp. (Mandalay, Myanmar)', remarks: 'Teak timber export. No bill of lading provided. Entity linked to Myanmar military.' }, { date: '12/01/2025', type: 'Cross-Border Cash Declaration', channel: 'CMR Flagged', amount: 250000, currency: 'USD', counterparty: 'ICA Checkpoint — Changi Airport', remarks: 'CMR-2026-0112: USD 250,000 declared by company representative arriving from Yangon via Bangkok. Purpose: \'jade auction settlement\'.' }, { date: '20/02/2026', type: 'Outward Wire Transfer', channel: 'SWIFT', amount: 400000, currency: 'USD', counterparty: 'Yunnan Jade Processing Co. Ltd (Kunming, China)', remarks: 'Second transfer to same Chinese entity. Cumulative: USD 1,220,000. No customs documentation.' }] }, tabV_reasonsForSuspicion: { possibleCrimeTypes: ['ML_NP', 'ML_TPL', 'T_T_NS_RS', 'T_T_NS_TB'], suspicionCategories: ['S_L_T_A', 'S_L_T_B_I', 'S_L_T_B_II', 'S_L_T_C', 'T_W_NAB_A_IV'], detailedNarrative: 'Golden Phoenix International Ltd is a Labuan-registered jade and timber trading company incorporated in November 2023. The UBO is Gen. (Ret.) Aung Kyaw Moe, a retired Myanmar military general identified in multiple Justice for Myanmar NGO reports as being linked to the Tatmadaw\'s commercial interests.\n\nThe entity has received direct financial flows from two sanctioned Myanmar entities: (1) Myanmar Economic Holdings Ltd (MEHL) — OFAC SDN-listed military conglomerate, which sent USD 1,200,000, and (2) Myanmar Gems Enterprise — UNSC-sanctioned state-owned gems monopoly, which sent USD 850,000. Combined sanctioned-entity exposure: USD 2,050,000.\n\nThe fund flow pattern demonstrates trade-based money laundering through the jade and timber sectors. Inflows from sanctioned Myanmar entities transit the Singapore accounts and are moved to jade processors in Yunnan (China) and timber traders in Thailand, with invoice discrepancies averaging 55% over-invoicing on jade and 62% on timber. No bills of lading or customs documentation have been provided for any of the trade transactions.\n\nA subsidiary entity — Phoenix Jade Trading Pte Ltd — was incorporated in Singapore with the same nominee director as the parent company and BVI beneficial ownership. Inter-company transfers of SGD 650,000 between parent and subsidiary are consistent with layering through related-party transactions.\n\nThe hub-and-spoke network shows 11 connected entities with a centrality score of 0.94. The company\'s 6-layer ownership structure spans Myanmar, Malaysia (Labuan), Singapore, BVI, Thailand, and China.\n\nA CMR filing (CMR-2026-0112) records USD 250,000 in physical cash brought into Singapore by a company representative arriving from Yangon via Bangkok, stated for \'jade auction settlement\'.\n\nTotal suspicious exposure: USD 6,200,000. This report is filed under CDSA s.39 and TSOFA. Referral to CAD, MAS Enforcement, and ICA recommended.', legalBasis: 'CDSA s.39 — Suspicious Transaction Report | TSOFA — Terrorism (Suppression of Financing) Act' } },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT PROFILES (from MockTasksToLoad(New).json — enriched entity profiles)
// ─────────────────────────────────────────────────────────────────────────────

export interface SubjectProfileIndividual {
  entityType: 'INDIVIDUAL';
  fullName: string;
  parsedName: { initials: string; forename: string; familyName: string };
  gender: string;
  dateOfBirth: string;
  nationality: string;
  countryOfBirth: string;
  taxResidency: string;
  identificationType: string;
  identificationNumber: string;
  identificationCountry: string;
  address: {
    blockNumber: string;
    streetName: string;
    floorNumber: string;
    unitNumber: string;
    postalCode: string;
    country: string;
    parsedAddress: string;
  };
}

export interface SubjectProfileCompany {
  entityType: 'COMPANY';
  companyName: string;
  companyNumber: string;
  jurisdictionCode: string;
  companyType: string;
  incorporationDate: string;
  currentStatus: string;
  registeredAddress: {
    streetAddress: string;
    locality: string;
    postalCode: string;
    country: string;
    inFull: string;
  };
  directors: Array<{
    name: string;
    nationality: string;
    countryOfResidence: string;
    position: string;
    partialDateOfBirth: string;
    shareholding?: number;
  }>;
}

export type SubjectProfile = SubjectProfileIndividual | SubjectProfileCompany;

export const MOCK_SUBJECT_PROFILES: Record<string, SubjectProfile> = {
  'customer-1001': { entityType: 'INDIVIDUAL', fullName: 'Ahmad Bin Sulaiman', parsedName: { initials: 'A', forename: 'Ahmad', familyName: 'Bin Sulaiman' }, gender: 'M', dateOfBirth: '1987-04-14', nationality: 'SG', countryOfBirth: 'SG', taxResidency: 'SG', identificationType: 'NRIC', identificationNumber: 'S8712340A', identificationCountry: 'SG', address: { blockNumber: '411', streetName: 'Hougang Avenue 10', floorNumber: '08', unitNumber: '22', postalCode: '530411', country: 'SG', parsedAddress: '411 Hougang Avenue 10 #08-22, Singapore 530411' } },
  'customer-1002': { entityType: 'INDIVIDUAL', fullName: 'Natalia Petrova', parsedName: { initials: 'N', forename: 'Natalia', familyName: 'Petrova' }, gender: 'F', dateOfBirth: '1989-11-02', nationality: 'RU', countryOfBirth: 'RU', taxResidency: 'IR', identificationType: null, identificationNumber: null, identificationCountry: null, address: { streetName: 'Pasdaran Avenue', country: 'IR', parsedAddress: 'Pasdaran Avenue, Tehran, Iran' } },
  'customer-1003': { entityType: 'COMPANY', companyName: 'Dragon Gate Pte Limited', companyNumber: '202300567W', jurisdictionCode: 'SG', companyType: 'Private Limited Company', incorporationDate: '2023-02-15', currentStatus: 'Active', registeredAddress: { streetAddress: '71 Robinson Road #14-01', locality: 'Singapore', postalCode: '068895', country: 'Singapore', inFull: '71 Robinson Road #14-01 Singapore 068895 Singapore' }, directors: [{ name: 'Chen Jian Wei', nationality: 'CN', countryOfResidence: 'SG', position: 'Director', partialDateOfBirth: '1980-05-12', shareholding: 85 }] },
  'customer-1004': { entityType: 'INDIVIDUAL', fullName: 'Lee Wei Jian', parsedName: { initials: 'L', forename: 'Wei Jian', familyName: 'Lee' }, gender: 'M', dateOfBirth: '1978-06-15', nationality: 'SG', countryOfBirth: 'SG', taxResidency: 'SG', identificationType: 'NRIC', identificationNumber: 'S7801234B', identificationCountry: 'SG', address: { blockNumber: '88', streetName: 'Telok Blangah Road', floorNumber: '22', unitNumber: '05', postalCode: '098867', country: 'SG', parsedAddress: '88 Telok Blangah Road #22-05, Singapore 098867' } },
  'customer-1005': { entityType: 'COMPANY', companyName: 'Synergy Asia Trading Pte Ltd', companyNumber: '201988432N', jurisdictionCode: 'SG', companyType: 'Private Limited Company', incorporationDate: '2019-06-20', currentStatus: 'Active', registeredAddress: { streetAddress: '18 Robinson Road #12-00', locality: 'Singapore', postalCode: '048547', country: 'Singapore', inFull: '18 Robinson Road #12-00 Singapore 048547 Singapore' }, directors: [{ name: 'Michael Tan Eng Huat', nationality: 'SG', countryOfResidence: 'SG', position: 'Director', partialDateOfBirth: '1975-11-28' }] },
  'customer-1006': { entityType: 'INDIVIDUAL', fullName: 'Rajan Krishnamurthy', parsedName: { initials: 'R', forename: 'Rajan', familyName: 'Krishnamurthy' }, gender: 'M', dateOfBirth: '1958-03-22', nationality: 'IN', countryOfBirth: 'IN', taxResidency: 'SG', identificationType: 'PASSPORT', identificationNumber: 'Z4821957', identificationCountry: 'IN', address: { blockNumber: '2', streetName: 'Tanjong Rhu Road', floorNumber: '18', unitNumber: '03', postalCode: '436010', country: 'SG', parsedAddress: '2 Tanjong Rhu Road #18-03, Singapore 436010' } },
  'customer-1007': { entityType: 'COMPANY', companyName: 'PT Global Trade Solutions', companyNumber: 'KP-2019-88412', jurisdictionCode: 'SG', companyType: 'Private Limited Company', incorporationDate: '2019-10-01', currentStatus: 'Active', registeredAddress: { streetAddress: '10 Anson Road #25-07', locality: 'Singapore', postalCode: '079903', country: 'Singapore', inFull: '10 Anson Road #25-07 Singapore 079903 Singapore' }, directors: [{ name: 'Kim Sung Jin', nationality: 'KP', countryOfResidence: 'SG', position: 'Director', partialDateOfBirth: '1972-09-18' }] },
  'customer-1008': { entityType: 'INDIVIDUAL', fullName: 'Tan Mei Ling', parsedName: { initials: 'T', forename: 'Mei Ling', familyName: 'Tan' }, gender: 'F', dateOfBirth: '1995-08-30', nationality: 'SG', countryOfBirth: 'SG', taxResidency: 'SG', identificationType: 'NRIC', identificationNumber: 'S9504872D', identificationCountry: 'SG', address: { blockNumber: '123', streetName: 'Bedok North Street 2', floorNumber: '04', unitNumber: '118', postalCode: '460123', country: 'SG', parsedAddress: '123 Bedok North Street 2 #04-118, Singapore 460123' } },
  'customer-1009': { entityType: 'INDIVIDUAL', fullName: 'Ong Bee Lian', parsedName: { initials: 'O', forename: 'Bee Lian', familyName: 'Ong' }, gender: 'F', dateOfBirth: '1975-08-22', nationality: 'SG', countryOfBirth: 'SG', taxResidency: 'SG', identificationType: 'NRIC', identificationNumber: 'S7534210B', identificationCountry: 'SG', address: { blockNumber: '203', streetName: 'Jurong East Street 21', floorNumber: '04', unitNumber: '15', postalCode: '600203', country: 'SG', parsedAddress: '203 Jurong East Street 21 #04-15, Singapore 600203' } },
  'customer-1010': { entityType: 'COMPANY', companyName: 'Sunrise Wellness Pte Ltd', companyNumber: '202008876W', jurisdictionCode: 'SG', companyType: 'Private Limited Company', incorporationDate: '2020-03-12', currentStatus: 'Active', registeredAddress: { streetAddress: '52 Toa Payoh Lorong 1 #01-08', locality: 'Singapore', postalCode: '310052', country: 'Singapore', inFull: '52 Toa Payoh Lorong 1 #01-08 Singapore 310052 Singapore' }, directors: [{ name: 'Koh Chee Wai', nationality: 'SG', countryOfResidence: 'SG', position: 'Director', partialDateOfBirth: '1982-04-10' }] },
  'customer-1011': { entityType: 'INDIVIDUAL', fullName: 'Viktor Lazarev', parsedName: { initials: 'V', forename: 'Viktor', familyName: 'Lazarev' }, gender: 'M', dateOfBirth: '1968-06-19', nationality: 'RU', countryOfBirth: 'RU', taxResidency: 'RU', identificationType: 'PASSPORT', identificationNumber: 'RF72114589', identificationCountry: 'RU', address: { blockNumber: '1', streetName: 'Cuscaden Road', floorNumber: '38', unitNumber: '01', postalCode: '249715', country: 'SG', parsedAddress: '1 Cuscaden Road #38-01, Singapore 249715' } },
  'customer-1012': { entityType: 'COMPANY', companyName: 'Golden Phoenix International Ltd', companyNumber: 'LL-2023-18876', jurisdictionCode: 'MY', companyType: 'Labuan Company', incorporationDate: '2023-11-18', currentStatus: 'Active', registeredAddress: { streetAddress: 'Level 12 Main Office Tower Financial Park Labuan', locality: 'Labuan', postalCode: '87000', country: 'Malaysia', inFull: 'Level 12 Main Office Tower Financial Park Labuan 87000 Malaysia' }, directors: [{ name: 'Aung Kyaw Moe', nationality: 'MM', countryOfResidence: 'MM', position: 'Director', partialDateOfBirth: '1958-12-03' }] },
};