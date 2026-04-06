import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntelligenceCase, DashboardStats } from '../types';
import { MOCK_CASES } from '../constants';
import { useAuth } from './AuthContext';

interface AppContextType {
  cases: IntelligenceCase[];
  stats: DashboardStats;
  selectedCase: IntelligenceCase | null;
  setSelectedCase: (c: IntelligenceCase | null) => void;
  updateCaseStatus: (id: string, status: IntelligenceCase['status']) => void;
  addFeedback: (caseId: string, disseminationId: string, feedback: any) => void;
  view: 'DASHBOARD' | 'TRIAGE' | 'PRIORITY' | 'ANALYSIS' | 'DISSEMINATION';
  setView: (v: 'DASHBOARD' | 'TRIAGE' | 'PRIORITY' | 'ANALYSIS' | 'DISSEMINATION') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cases, setCases] = useState<IntelligenceCase[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<IntelligenceCase | null>(null);
  const [view, setView] = useState<'DASHBOARD' | 'TRIAGE' | 'PRIORITY' | 'ANALYSIS' | 'DISSEMINATION'>('DASHBOARD');

  useEffect(() => {
    if (user?.role === 'INVESTIGATOR' && user.typology) {
      // Enforce strict RBAC filtering for specific target typologies
      const targetTypology = user.typology.toLowerCase();
      const filteredCases = MOCK_CASES.filter(c => 
         c.title.toLowerCase().includes(targetTypology) || 
         c.subject.riskProfile.factors.some(f => f.factor.toLowerCase().includes(targetTypology))
      );
      setCases(filteredCases);
      setView('TRIAGE'); // Routes the investigator strictly to their pending triage pipeline
    } else {
      setCases(MOCK_CASES);
      setView('DASHBOARD');
    }
    // Clean selection on auth switch
    setSelectedCase(null);
  }, [user]);

  const stats: DashboardStats = {
    totalIncoming: 1240,
    activeAnalyses: cases.filter(c => c.status === 'ANALYSIS').length,
    disseminatedTotal: 45,
    priorityAlerts: cases.filter(c => c.priority).length,
    successRate: 78
  };

  const updateCaseStatus = (id: string, status: IntelligenceCase['status']) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const addFeedback = (caseId: string, disseminationId: string, feedback: any) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          disseminations: c.disseminations.map(d => 
            d.id === disseminationId ? { ...d, feedback } : d
          )
        };
      }
      return c;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      cases, 
      stats, 
      selectedCase, 
      setSelectedCase, 
      updateCaseStatus, 
      addFeedback,
      view,
      setView
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
