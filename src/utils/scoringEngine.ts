import { RiskFactor, Scorecard, RiskLevel } from '../types';

export const calculateRiskStatus = (totalScore: number): { status: string; level: RiskLevel; color: string } => {
  if (totalScore >= 100) return { status: 'RED BRAVO HIGH', level: 'CRITICAL', color: '#ef4444' };
  if (totalScore >= 75) return { status: 'AMBER 1', level: 'HIGH', color: '#f97316' };
  if (totalScore >= 50) return { status: 'AMBER 4', level: 'MEDIUM', color: '#fbbf24' };
  return { status: 'GREEN LOW', level: 'LOW', color: '#22c55e' };
};

export const applyScoringRules = (baseScore: number, factors: RiskFactor[]): Scorecard => {
  const totalScore = factors.reduce((acc, f) => acc + (typeof f.score === 'number' ? f.score : 0), baseScore);
  const { status } = calculateRiskStatus(totalScore);
  return {
    totalScore,
    status,
    factors
  };
};

// Rules derived from user screenshots
export const SCORING_RULES = {
  jurisdiction: {
    'GREY_LIST': 18,
    'TF_RED_LIST': 20,
    'TF_AMBER_LIST': 18,
    'LOCAL_REGULATOR_RISK': 16,
    'PROXIMITY_COUNTRY': 16
  },
  sector: {
    'TCSP': 16,
    'TRUSTS': 20,
    'LEGAL_NON_FIU': 18,
    'FIU_JURISDICTION_PN': 16,
    'INVESTMENT_UHNW': 10,
    'BANKING': 10
  },
  typology: {
    'TERRORISM_FINANCING': 'N/A', // Immediate escalation
    'BRIBERY_CORRUPTION': 18,
    'SANCTIONS': 14,
    'PEP': 18,
    'TRANSNATIONAL_OCG': 16
  }
};
