import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntelligenceCase, DashboardStats, PersonProfile, Attachment, CaseModificationRequest } from '../types';
import { MOCK_CASES, MOCK_STRS, MOCK_ENTITIES } from '../constants';
import { useAuth } from './AuthContext';
import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

interface AppContextType {
  cases: IntelligenceCase[];
  allCases: IntelligenceCase[];
  stats: DashboardStats;
  selectedCase: IntelligenceCase | null;
  setSelectedCase: (c: IntelligenceCase | null) => void;
  updateCaseStatus: (id: string, status: IntelligenceCase['status']) => void;
  addFeedback: (caseId: string, disseminationId: string, feedback: any) => void;
  assessEntity: (id: string, action: 'ESCALATE' | 'HIBERNATE' | 'DISMISS') => void;
  approveCase: (id: string) => void;
  rejectCase: (id: string, reason: string) => void;
  bulkUpdateCases: (ids: string[], updates: Partial<IntelligenceCase>) => void;
  bulkLinkReports: (caseId: string, reportIds: string[]) => void;
  linkEntitiesToCase: (targetCaseId: string, sourceEntityIds: string[]) => void;
  addManualEntity: (caseId: string, entityId: string) => void;
  uploadAttachment: (caseId: string, file: File) => Promise<void>;
  removeAttachment: (caseId: string, attachmentId: string) => Promise<void>;
  requestModification: (caseId: string, type: CaseModificationRequest['type'], details: any) => void;
  processModification: (caseId: string, approved: boolean) => void;
  saveMitigation: (caseId: string, subjectId: string, factorId: string, category: string, notes: string) => void;
  saveFindings: (caseId: string, findings: string) => void;
  createCase: (subjects: PersonProfile[], description: string, title?: string) => IntelligenceCase;
  view: 'DASHBOARD' | 'TRIAGE' | 'HIBERNATED' | 'ANALYSIS' | 'DISSEMINATION' | 'APPROVALS' | 'DIRECTORY' | 'STR_DIRECTORY' | 'PRIORITY';
  previousView: 'DASHBOARD' | 'TRIAGE' | 'HIBERNATED' | 'ANALYSIS' | 'DISSEMINATION' | 'APPROVALS' | 'DIRECTORY' | 'STR_DIRECTORY' | 'PRIORITY';
  setView: (v: 'DASHBOARD' | 'TRIAGE' | 'HIBERNATED' | 'ANALYSIS' | 'DISSEMINATION' | 'APPROVALS' | 'DIRECTORY' | 'STR_DIRECTORY' | 'PRIORITY') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initializeCases = (rawCases: any[]) => {
  return rawCases.map(c => {
    // Migration: Handle both old 'subject' and new 'subjects' formats
    const subjects = c.subjects || [c.subject];
    const score = subjects[0]?.riskProfile?.totalScore || 0;
    let status = c.status;
    
    if (score < 10) status = 'HIBERNATED';
    else if (score > 150) status = 'PRIORITY';
    
    return { 
      ...c, 
      subjects,
      findings: c.findings || subjects[0]?.investigationFindings || '',
      description: c.description || '',
      status: status as IntelligenceCase['status'],
      attachments: c.attachments || [],
      priority: status === 'PRIORITY',
      analyst: status === 'TRIAGE' ? undefined : (c.analyst || (status !== 'HIBERNATED' ? (Math.random() > 0.5 ? 'Director Shen' : 'Insp. Lim') : undefined))
    };
  });
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cases, setCases] = useState<IntelligenceCase[]>(() => initializeCases(MOCK_CASES));
  const [selectedCase, setSelectedCase] = useState<IntelligenceCase | null>(null);
  const [view, _setView] = useState<AppContextType['view']>('DASHBOARD');
  const [previousView, setPreviousView] = useState<AppContextType['view']>('DASHBOARD');

  // Reset view to dashboard on login
  useEffect(() => {
    if (user) {
      _setView('DASHBOARD');
    }
  }, [user]);

  const setView = (v: AppContextType['view']) => {
    if (v !== 'ANALYSIS') {
      setPreviousView(v);
    }
    _setView(v);
  };

  const activeCases = cases.filter(c => c.status !== 'CLOSED' && c.status !== 'DISMISSED');
  const resolvedCases = cases.filter(c => c.status === 'CLOSED' || c.status === 'DISMISSED');
  
  const totalResolutionDays = resolvedCases.reduce((sum, c) => {
    const created = new Date(c.createdAt).getTime();
    const closed = new Date(c.closedAt || new Date().toISOString()).getTime();
    return sum + (closed - created) / (1000 * 60 * 60 * 24);
  }, 0);
  const avgTime = resolvedCases.length > 0 ? Math.round(totalResolutionDays / resolvedCases.length * 10) / 10 : 0;

  const filteredTriages = cases.filter(c => {
    if (c.status !== 'TRIAGE') return false;
    if (user?.role === 'INVESTIGATOR' && user.typology) {
        const typs = (c.subjects || []).flatMap(s => s.crimeTypologies || []);
        return typs.length === 0 || typs.includes(user.typology);
    }
    return true;
  });

  const stats: DashboardStats = {
    totalIncoming: 1240,
    activeAnalyses: cases.filter(c => c.status === 'ANALYSIS' || c.status === 'PRIORITY').length,
    disseminatedTotal: 45,
    priorityAlerts: cases.filter(c => c.priority).length,
    successRate: 78,
    triagesInQueue: filteredTriages.length,
    pendingApproval: cases.filter(c => c.status === 'PENDING_APPROVAL').length,
    casesClosed: cases.filter(c => c.status === 'CLOSED' || c.status === 'DISMISSED').length,
    avgResolutionTime: avgTime
  };

  const updateCaseStatus = (id: string, status: IntelligenceCase['status']) => {
    const target = cases.find(c => c.id === id);
    // Global Guard: Closure/Dismissal needs approval if no dissemination
    if ((status === 'CLOSED' || status === 'DISMISSED') && target && (target.disseminations || []).length === 0) {
        requestModification(id, 'STATUS_CHANGE', { newValue: status, reason: `Analyst requested ${status.toLowerCase()} without dissemination record.` });
        return;
    }
    setCases(prev => prev.map(c => c.id === id ? { ...c, status, closedAt: (status === 'CLOSED' || status === 'DISMISSED') ? new Date().toISOString() : undefined } : c));
  };

  const requestModification = (caseId: string, type: CaseModificationRequest['type'], details: any) => {
    if (!user) return;
    const request: CaseModificationRequest = {
      id: `REQ-${Date.now()}`,
      requestedBy: user.name,
      requestedAt: new Date().toISOString(),
      type,
      details,
      status: 'PENDING'
    };
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, pendingModification: request, status: (type === 'DELETION' || (type === 'STATUS_CHANGE' && details.newValue === 'CLOSED')) ? 'PENDING_APPROVAL' : c.status } : c));
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

  const assessEntity = (id: string, action: 'ESCALATE' | 'HIBERNATE' | 'DISMISS') => {
    const target = cases.find(c => c.id === id);
    if (!target) return;
    let nextStatus: IntelligenceCase['status'] = 'TRIAGE';
    if (action === 'ESCALATE') nextStatus = 'PENDING_APPROVAL';
    else if (action === 'HIBERNATE') nextStatus = 'HIBERNATED';
    else if (action === 'DISMISS') nextStatus = 'DISMISSED';
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        let updatedAnalyst = c.analyst;
        if (action === 'ESCALATE' && user) {
          updatedAnalyst = user.name;
        }
        return { ...c, status: nextStatus, analyst: updatedAnalyst };
      }
      return c;
    }));
    setSelectedCase(null);
  };

  const approveCase = (id: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        const escalatedId = id.startsWith('TASK-') ? id.replace('TASK-', 'CASE-') : id;
        return { ...c, id: escalatedId, status: 'ANALYSIS', rejectionReason: undefined };
      }
      return c;
    }));
    setSelectedCase(null);
  };

  const rejectCase = (id: string, reason: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'TRIAGE', rejectionReason: reason } : c));
    setSelectedCase(null);
  };

  const linkEntitiesToCase = (targetCaseId: string, sourceEntityIds: string[]) => {
    const targetCase = cases.find(c => c.id === targetCaseId);
    if (!targetCase || !user) return;
    const sourceEntities = cases.filter(c => sourceEntityIds.includes(c.id));
    const mergedReports = [...targetCase.reports];
    const mergedLinkedSTRs: any[] = [];
    
    // Add existing linked STRs from the primary subjects of the target case
    targetCase.subjects.forEach(s => {
        s.linkedSTRs?.forEach(ls => { if (!mergedLinkedSTRs.find(existing => existing.id === ls.id)) mergedLinkedSTRs.push(ls); });
    });

    sourceEntities.forEach(se => {
        se.reports.forEach(r => { if (!mergedReports.find(existing => existing.id === r.id)) mergedReports.push(r); });
        se.subjects.forEach(s => {
            s.linkedSTRs?.forEach(ls => { if (!mergedLinkedSTRs.find(existing => existing.id === ls.id)) mergedLinkedSTRs.push(ls); });
        });
    });
    setCases(prev => prev.map(c => {
        if (c.id === targetCaseId) return { ...c, reports: mergedReports, subjects: [...c.subjects, ...sourceEntities.flatMap(se => se.subjects)] };
        if (sourceEntityIds.includes(c.id)) {
            const request: CaseModificationRequest = {
              id: `REQ-LINK-${Date.now()}-${c.id}`,
              requestedBy: user.name,
              requestedAt: new Date().toISOString(),
              type: 'STATUS_CHANGE',
              details: { newValue: 'CLOSED', reason: `Merged into investigation ${targetCaseId}.`, targetCase: targetCaseId, originalOwner: c.analyst || 'System' },
              status: 'PENDING'
            };
            return { ...c, status: 'PENDING_APPROVAL', pendingModification: request };
        }
        return c;
    }));
  };

  const saveMitigation = (caseId: string, subjectId: string, factorId: string, category: string, notes: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return { 
          ...c, 
          subjects: c.subjects.map(s => s.id === subjectId ? {
            ...s,
            riskProfile: {
              ...s.riskProfile,
              factors: s.riskProfile.factors.map(f => f.id === factorId ? {
                ...f,
                mitigation: { category, notes, savedAt: new Date().toISOString() }
              } : f)
            }
          } : s)
        };
      }
      return c;
    }));
  };

  const saveFindings = (caseId: string, findings: string) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, findings } : c));
  };

  const bulkUpdateCases = (ids: string[], updates: Partial<IntelligenceCase>) => {
    setCases(prev => prev.map(c => ids.includes(c.id) ? { ...c, ...updates } : c));
  };

  const bulkLinkReports = (caseId: string, reportIds: string[]) => {
    const reportsToLink = MOCK_STRS.filter((str: any) => reportIds.includes(str.id));
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const existingReportIds = new Set(c.reports.map(r => r.id));
        const now = new Date().toISOString();
        const newReports = reportsToLink.filter((r: any) => !existingReportIds.has(r.id)).map((r: any) => ({ 
          ...r, 
          status: 'LINKED' as const,
          addedManually: true,
          addedAt: now
        }));
        return { 
          ...c, 
          reports: [...c.reports, ...newReports], 
          subjects: c.subjects.map((s, idx) => idx === 0 ? {
            ...s,
            linkedSTRs: [...(s.linkedSTRs || []), ...newReports.map(r => ({ 
              id: r.id, 
              date: r.date, 
              amount: `${r.amount.toLocaleString()} ${r.currency}`, 
              type: r.type,
              addedManually: true,
              addedAt: now
            }))]
          } : s)
        };
      }
      return c;
    }));
  };

  const addManualEntity = (caseId: string, entityId: string) => {
    const entityToAdd = MOCK_ENTITIES.find((e: any) => e.id === entityId);
    if (!entityToAdd) return;

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        if (c.subjects.some(s => s.id === entityId)) return c;
        const now = new Date().toISOString();
        return {
          ...c,
          subjects: [...c.subjects, { ...entityToAdd, addedManually: true, addedAt: now }]
        };
      }
      return c;
    }));
  };

  const uploadAttachment = async (caseId: string, file: File) => {
    if (!user) return;
    const attachmentId = `ATT-${Date.now()}`;
    const storageRef = ref(storage, `cases/${caseId}/${attachmentId}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise<void>((resolve, reject) => {
      uploadTask.on('state_changed', null, (error) => { console.error("Upload failed:", error); reject(error); }, async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newAttachment: Attachment = { id: attachmentId, name: file.name, type: file.type, size: file.size, url: downloadURL, uploadedBy: user.name, uploadedAt: new Date().toISOString() };
          setCases(prev => prev.map(c => c.id === caseId ? { ...c, attachments: [...c.attachments, newAttachment] } : c));
          resolve();
      });
    });
  };

  const removeAttachment = async (caseId: string, attachmentId: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    const attachment = targetCase?.attachments.find(a => a.id === attachmentId);
    if (attachment) { try { const fileRef = ref(storage, attachment.url); await deleteObject(fileRef); } catch (e) { console.warn("Storage deletion failed", e); } }
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, attachments: c.attachments.filter(a => a.id !== attachmentId) } : c));
  };

  const processModification = (caseId: string, approved: boolean) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId && c.pendingModification) {
        const req = c.pendingModification;
        if (approved) {
          if (req.type === 'DELETION' || (req.type === 'STATUS_CHANGE' && req.details.newValue === 'CLOSED')) {
            return { ...c, status: 'CLOSED', closedAt: new Date().toISOString(), pendingModification: undefined };
          }
          if (req.type === 'STATUS_CHANGE' && req.details.newValue) {
            return { ...c, status: req.details.newValue, pendingModification: undefined };
          }
        } else {
          if (req.type === 'DELETION' || (req.type === 'STATUS_CHANGE' && req.details.newValue === 'CLOSED')) {
            return { ...c, status: 'ANALYSIS', pendingModification: undefined };
          }
        }
        return { ...c, pendingModification: undefined };
      }
      return c;
    }));
  };

  const createCase = (subjects: PersonProfile[], description: string, title?: string) => {
    const newCaseId = `CASE-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const newCase: IntelligenceCase = {
      id: newCaseId,
      title: title || `Investigation: ${subjects.map(s => s.name).join(', ')}`,
      description,
      subjects: subjects.map(s => ({
        ...s,
        id: s.id || `P-NEW-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        riskProfile: s.riskProfile || { totalScore: 0, status: 'GRAY PENDING', factors: [] }
      })),
      reports: [], // Initially empty, will be linked from the Analysis/Locker
      status: 'STAGING',
      priority: false,
      disseminations: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      analyst: user?.name
    };
    setCases(prev => [newCase, ...prev]);
    return newCase;
  };

  return (
    <AppContext.Provider value={{ 
      cases: activeCases, allCases: cases, stats, selectedCase, setSelectedCase, updateCaseStatus, saveMitigation, saveFindings, addFeedback, assessEntity, approveCase, rejectCase, createCase, bulkUpdateCases, bulkLinkReports, linkEntitiesToCase, addManualEntity, uploadAttachment, removeAttachment, requestModification, processModification, view, previousView, setView
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
