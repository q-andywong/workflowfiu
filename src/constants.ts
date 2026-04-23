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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
    status: 'TRIAGE', priority: false, createdAt: '2026-03-03T08:40:56Z'
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
