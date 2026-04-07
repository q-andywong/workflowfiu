import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntelligenceCase, DashboardStats } from '../types';
import { MOCK_CASES } from '../constants';
import { useAuth } from './AuthContext';

interface AppContextType {
  cases: IntelligenceCase[];
  allCases: IntelligenceCase[];
  stats: DashboardStats;
  selectedCase: IntelligenceCase | null;
  setSelectedCase: (c: IntelligenceCase | null) => void;
  updateCaseStatus: (id: string, status: IntelligenceCase['status']) => void;
  saveMitigation: (entityId: string, factorId: string, category: string, notes: string) => void;
  saveFindings: (caseId: string, findings: string) => void;
  addFeedback: (caseId: string, disseminationId: string, feedback: any) => void;
  assessEntity: (id: string, action: 'ESCALATE' | 'HIBERNATE' | 'DISMISS') => void;
  approveCase: (id: string) => void;
  rejectCase: (id: string, reason: string) => void;
  view: 'DASHBOARD' | 'TRIAGE' | 'HIBERNATED' | 'ANALYSIS' | 'DISSEMINATION' | 'APPROVALS' | 'DIRECTORY' | 'STR_DIRECTORY';
  setView: (v: 'DASHBOARD' | 'TRIAGE' | 'HIBERNATED' | 'ANALYSIS' | 'DISSEMINATION' | 'APPROVALS' | 'DIRECTORY' | 'STR_DIRECTORY') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initializeCases = (rawCases: IntelligenceCase[]) => {
  return rawCases.map(c => {
    const score = c.subject.riskProfile.totalScore;
    if (score < 10) return { ...c, status: 'HIBERNATED' as const };
    if (score > 150) return { ...c, status: 'PRIORITY' as const, priority: true };
    // Between 10 and 150, keep as TRIAGE if it was TASK-, else stay in status
    if (c.id.startsWith('TASK-') && c.status === 'TRIAGE') return c;
    return c;
  });
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cases, setCases] = useState<IntelligenceCase[]>(() => initializeCases(MOCK_CASES));
  const [selectedCase, setSelectedCase] = useState<IntelligenceCase | null>(null);
  const [view, setView] = useState<'DASHBOARD' | 'TRIAGE' | 'HIBERNATED' | 'ANALYSIS' | 'DISSEMINATION' | 'APPROVALS' | 'DIRECTORY' | 'STR_DIRECTORY'>('DASHBOARD');

  useEffect(() => {
    // Universal Landing Page: Default to DASHBOARD regardless of role
    setView('DASHBOARD');
    // Clean selection on auth switch
    setSelectedCase(null);
  }, [user]);

  // Compute dynamic RBAC view without destroying master configuration
  // RED cases (>150 score) bypass the typology filter for everyone
  const activeCases = (user?.role === 'INVESTIGATOR' && user.typology) 
    ? cases.filter(c => 
         c.subject.riskProfile.totalScore > 150 || // Priority Bypass
         c.title.toLowerCase().includes(user.typology!.toLowerCase()) || 
         c.subject.riskProfile.factors.some(f => f.factor.toLowerCase().includes(user.typology!.toLowerCase())) ||
         c.status === 'PENDING_APPROVAL' 
      )
    : cases;

  // Efficiency calculation logic
  const resolvedCases = cases.filter(c => c.createdAt && c.closedAt);
  const totalResolutionDays = resolvedCases.reduce((sum, c) => {
    const created = new Date(c.createdAt).getTime();
    const closed = new Date(c.closedAt!).getTime();
    return sum + (closed - created) / (1000 * 60 * 60 * 24);
  }, 0);
  const avgTime = resolvedCases.length > 0 ? Math.round(totalResolutionDays / resolvedCases.length * 10) / 10 : 0;

  const stats: DashboardStats = {
    totalIncoming: 1240,
    activeAnalyses: cases.filter(c => c.status === 'ANALYSIS' || c.status === 'PRIORITY').length,
    disseminatedTotal: 45,
    priorityAlerts: cases.filter(c => c.priority).length,
    successRate: 78,
    triagesInQueue: cases.filter(c => c.status === 'TRIAGE').length,
    pendingApproval: cases.filter(c => c.status === 'PENDING_APPROVAL').length,
    casesClosed: cases.filter(c => c.status === 'CLOSED' || c.status === 'DISMISSED').length,
    avgResolutionTime: avgTime
  };

  const updateCaseStatus = (id: string, status: IntelligenceCase['status']) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const assessEntity = (id: string, action: 'ESCALATE' | 'HIBERNATE' | 'DISMISS') => {
    // Find the case in the current state array before the asynchronous setter
    const target = cases.find(c => c.id === id);
    if (!target) return;

    let nextStatus: IntelligenceCase['status'] = 'TRIAGE';
    if (action === 'ESCALATE') nextStatus = 'PENDING_APPROVAL';
    else if (action === 'HIBERNATE') nextStatus = 'HIBERNATED';
    else if (action === 'DISMISS') nextStatus = 'DISMISSED';

    const updatedCase = { ...target, status: nextStatus };

    setCases(prev => prev.map(c => c.id === id ? updatedCase : c));
    
    if (action === 'ESCALATE') {
        // Now updatedCase is guaranteed to be the new object reference
        setSelectedCase(updatedCase);
    } else {
        setView('TRIAGE');
        setSelectedCase(null);
    }
  };

  const approveCase = (id: string) => {
    let escalatedId = id;
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        escalatedId = id.replace('TASK-', 'CASE-');
        return { ...c, id: escalatedId, status: 'ANALYSIS', rejectionReason: undefined };
      }
      return c;
    }));
    // Remove selectedCase if the queue drops
    setSelectedCase(null);
  };

  const rejectCase = (id: string, reason: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: 'TRIAGE', rejectionReason: reason };
      }
      return c;
    }));
  };

  const saveMitigation = (entityId: string, factorId: string, category: string, notes: string) => {
    setCases(prev => prev.map(c => {
      // Look inside c.subject.riskProfile.factors
      if (c.id === entityId || c.subject.id === entityId) {
        return {
          ...c,
          subject: {
            ...c.subject,
            riskProfile: {
              ...c.subject.riskProfile,
              factors: c.subject.riskProfile.factors.map(f => {
                if (f.id === factorId) {
                  return { ...f, mitigation: { category, notes, savedAt: new Date().toISOString() } };
                }
                return f;
              })
            }
          }
        };
      }
      return c;
    }));
  };

  const saveFindings = (caseId: string, findings: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          subject: {
            ...c.subject,
            investigationFindings: findings
          }
        };
      }
      return c;
    }));
  };

  const addFeedback = (caseId: string, disseminationId: string, feedback: any) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          disseminations: (c.disseminations || []).map(d => 
            d.id === disseminationId ? { ...d, feedback } : d
          )
        };
      }
      return c;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      cases: activeCases, 
      allCases: cases,
      stats, 
      selectedCase, 
      setSelectedCase, 
      updateCaseStatus, 
      saveMitigation,
      saveFindings,
      addFeedback,
      assessEntity,
      approveCase,
      rejectCase,
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
