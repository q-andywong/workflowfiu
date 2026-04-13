
import React, { useState } from 'react';
import { 
    Shield, Globe, Clock, UserCheck, X, FileText, Activity, 
    Zap, Users, Briefcase, User, Hash, ShieldPlus, ShieldCheck,
    Scale, Plus, FileCheck2, CheckCircle2, Share2, Eye, Box,
    Lock, ExternalLink, Search, BadgeCheck, ShieldAlert, Info,
    ChevronDown, ChevronUp, Check
} from 'lucide-react';
import { useApp as useAppContext } from '../contexts/AppContext';
import { MOCK_STRS as STR_DIRECTORY, MOCK_ENTITIES } from '../constants';
import STRViewer from '../components/STRViewer';

const CaseAnalysis = () => {
    const { 
        selectedCase: activeCase, 
        setSelectedCase: setActiveCase, 
        cases, 
        updateCaseStatus, 
        rejectCase, 
        approveCase,
        addManualEntity,
        bulkLinkReports,
        bulkUpdateCases
    } = useAppContext();

    const [isEscalating, setIsEscalating] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [newCaseTitle, setNewCaseTitle] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    
    // Switcher State
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>(activeCase?.subjects[0]?.id || '');

    // Finalization Workflow States
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [finalizeOutcome, setFinalizeOutcome] = useState<'DISSEMINATE' | 'HIBERNATE' | 'CLOSE' | null>(null);
    const [selectedAgency, setSelectedAgency] = useState('');
    const [finalizeRationale, setFinalizeRationale] = useState('');

    // Search & Link States
    const [searchModal, setSearchModal] = useState<{ open: boolean, type: 'ENTITY' | 'REPORT' }>({ open: false, type: 'ENTITY' });
    const [searchQuery, setSearchQuery] = useState('');
    const [showSTRViewer, setShowSTRViewer] = useState<string | null>(null);

    // Reassignment State
    const [isReassigning, setIsReassigning] = useState(false);
    const [newOwner, setNewOwner] = useState(activeCase?.analyst || '');

    // Mitigation Workflow States
    const [expandedFactorId, setExpandedFactorId] = useState<string | null>(null);
    const [mitigationInputs, setMitigationInputs] = useState<Record<string, { category: string, notes: string }>>({});
    const [savedMitigations, setSavedMitigations] = useState<Record<string, boolean>>({});

    const MITIGATION_CATEGORIES = [
        'RFI sent to bank for more information',
        'Intelligence Cross-Reference (ICR) Completed',
        'Strategic STR/CTR Database Search',
        'External Database Validation (WorldCheck/Gisec)',
        'Regulatory Disclosure / SOP Triggered',
        'Remaining Open / Priority Analysis'
    ];

    if (!activeCase) return null;

    const activeSubject = activeCase.subjects.find(s => s.id === selectedSubjectId) || activeCase.subjects[0];
    const totalCaseRisk = activeCase.subjects.reduce((sum, s) => sum + (s.riskProfile?.totalScore || 0), 0);

    const handleClose = () => setActiveCase(null);

    const handleConfirmEscalation = () => {
        bulkUpdateCases([activeCase.id], { 
            status: 'PENDING_APPROVAL', 
            title: newCaseTitle, 
            lastUpdated: new Date().toLocaleDateString() 
        });
        setActiveCase(null);
    };

    const handleConfirmReject = () => {
        rejectCase(activeCase.id, rejectionReason);
        setActiveCase(null);
    };

    const handleConfirmFinalization = () => {
        let finalStatus = 'CLOSED';
        if (finalizeOutcome === 'DISSEMINATE') finalStatus = 'DISSEMINATED';
        if (finalizeOutcome === 'HIBERNATE') finalStatus = 'HIBERNATED';

        bulkUpdateCases([activeCase.id], { 
            status: finalStatus as any, 
            lastUpdated: new Date().toLocaleDateString(), 
            outcomeRationale: finalizeRationale, 
            targetAgency: selectedAgency 
        });
        setActiveCase(null);
    };

    const handleConfirmReassignment = () => {
        bulkUpdateCases([activeCase.id], { 
            analyst: newOwner,
            lastUpdated: new Date().toLocaleDateString()
        });
        setIsReassigning(false);
    };

    const openSearch = (type: 'ENTITY' | 'REPORT') => {
        setSearchModal({ open: true, type });
        setSearchQuery('');
    };

    const handleAddManual = (id: string) => {
        if (searchModal.type === 'ENTITY') {
            addManualEntity(activeCase.id, id);
        } else {
            bulkLinkReports(activeCase.id, [id]);
        }
        setSearchModal({ ...searchModal, open: false });
    };

    const searchResults = searchQuery.trim() === '' ? [] : (
        searchModal.type === 'ENTITY' 
            ? MOCK_ENTITIES.filter(e => 
                e.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                e.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : STR_DIRECTORY.filter(s => 
                s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                s.institution.toLowerCase().includes(searchQuery.toLowerCase())
              )
    ).slice(0, 5);

    return (
        <>
            <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-md flex justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="bg-gray-100 w-full max-w-7xl rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col h-[95vh] transform transition-all animate-in zoom-in duration-300 overflow-hidden relative border border-white/20">
                    
                    {/* Header */}
                    <div className="bg-[#0c051a] p-8 lg:p-10 flex flex-col lg:flex-row justify-between lg:items-center gap-8 shadow-2xl relative border-b border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <FileText className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20">Priority</span>
                                    <span className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">Op-ID: {activeCase.id}</span>
                                </div>
                                <h1 className="text-3xl font-black text-white tracking-tighter mb-4 leading-none">{activeCase.title}</h1>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 pr-2">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <User className="w-3 h-3 text-blue-400" />
                                        </div>
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Owner: <span className="text-white/70">{activeCase.analyst || 'Unassigned'}</span></span>
                                    </div>
                                    <button 
                                        onClick={() => setIsReassigning(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-400 transition-all group"
                                    >
                                        <Users className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Reassign Case</span>
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        <div className="flex gap-2">
                                            {(activeSubject?.crimeTypologies || ['MONEY LAUNDERING']).map(typ => (
                                                <span key={typ} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/60 uppercase tracking-widest">{typ}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <button onClick={() => setIsFinalizing(true)} className="px-8 py-4 bg-[#00D7BA]/10 hover:bg-[#00D7BA]/20 rounded-2xl transition-all text-[#00D7BA] border border-[#00D7BA]/20 group shadow-[0_0_20px_rgba(0,215,186,0.1)] flex items-center gap-4">
                                <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Finalize Case</span>
                            </button>
                            <button onClick={handleClose} className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/20 hover:text-white border border-white/5 group">
                                <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-10">
                        <div className="space-y-10 max-w-7xl mx-auto">
                            
                            {/* Switcher Navigation */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Forensic Entities & Subjects</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {activeCase.subjects.map(s => (
                                                <button 
                                                    key={s.id}
                                                    onClick={() => setSelectedSubjectId(s.id)}
                                                    className={`px-6 py-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                                                        selectedSubjectId === s.id 
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20 -translate-y-1' 
                                                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className={`p-2 rounded-xl ${selectedSubjectId === s.id ? 'bg-white/20' : 'bg-gray-50'}`}>
                                                        {s.type === 'COMPANY' ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-widest">{s.name}</span>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${selectedSubjectId === s.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{s.riskProfile?.totalScore || 0}</span>
                                                </button>
                                            ))}
                                            <button onClick={() => openSearch('ENTITY')} className="w-14 h-14 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-300 hover:border-blue-300 hover:text-blue-500 transition-all">
                                                <Plus className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Regulatory Intelligence (STR/CTR/CMR)</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {activeCase.reports.slice(0, 3).map(r => (
                                                <div key={r.id} onClick={() => setShowSTRViewer(r.id)} className="px-5 py-3.5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                                    <span className="text-[10px] font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{r.id}</span>
                                                    <div className="text-[10px] font-bold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-lg">{r.riskScore}</div>
                                                </div>
                                            ))}
                                            <button onClick={() => openSearch('REPORT')} className="px-5 py-3.5 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-300 hover:border-amber-300 hover:text-amber-500 transition-all">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Aggregate Case Risk */}
                                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border-t-8 border-red-500 shrink-0 min-w-[200px] flex flex-col items-center justify-center text-center">
                                    <div className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-2 leading-tight">Aggregate Case Risk<br/>High Exposure Cluster</div>
                                    <div className="text-6xl font-black text-gray-900 tracking-tighter">{totalCaseRisk}</div>
                                </div>
                            </div>

                            {/* Staging Notice */}
                            {activeCase.status === 'STAGING' && (
                                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-amber-100"><ShieldAlert className="w-5 h-5 text-amber-600" /></div>
                                        <div>
                                            <div className="text-xs font-black text-amber-900 uppercase tracking-widest">Draft Intelligence Mode</div>
                                            <div className="text-[10px] font-bold text-amber-700">This case is private. Managers cannot view this investigation until you escalate.</div>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsEscalating(true)} className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Escalate for Review</button>
                                </div>
                            )}

                            {/* Main Investigation Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                
                                {/* Left: Risk Scorecard */}
                                <div className="lg:col-span-6 flex flex-col gap-6">
                                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                                        <div className="p-8 border-b border-gray-50 flex justify-between items-end">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Risk Scorecard & Investigation Findings</h3>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Subject: {activeSubject?.name}</div>
                                            </div>
                                            <div className="flex items-end gap-3">
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Risk Score</div>
                                                    <div className="text-4xl font-black text-red-600 tracking-tighter leading-none">{activeSubject?.riskProfile?.totalScore || 0}</div>
                                                </div>
                                                <div className="h-10 w-px bg-gray-100 mx-2" />
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Risk Factors</div>
                                                    <div className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{activeSubject?.riskProfile?.factors?.length || 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-0">
                                            <table className="w-full">
                                                <thead className="bg-[#fcfdfe] border-b border-gray-50">
                                                    <tr>
                                                        <th className="px-8 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Score</th>
                                                        <th className="px-8 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Risk Factor Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {(activeSubject?.riskProfile?.factors || []).map((factor: any, idx: number) => {
                                                        const factorId = `${activeSubject.id}-${idx}`;
                                                        const isExpanded = expandedFactorId === factorId;
                                                        const isSaved = savedMitigations[factorId];
                                                        
                                                        return (
                                                            <React.Fragment key={factorId}>
                                                                <tr 
                                                                    onClick={() => setExpandedFactorId(isExpanded ? null : factorId)}
                                                                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer group ${isExpanded ? 'bg-blue-50/30' : ''}`}
                                                                >
                                                                    <td className="px-8 py-6">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                                                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                                                                                <span className={`text-sm font-black ${isSaved ? 'text-emerald-600' : 'text-red-600'}`}>{factor.score}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-6">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="text-xs font-black text-gray-900 uppercase tracking-wider">{factor.factor || factor.category}</div>
                                                                            {isSaved && (
                                                                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-right-2">
                                                                                    <Check className="w-3 h-3" />
                                                                                    <span className="text-[8px] font-black uppercase tracking-widest">Mitigated</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {isExpanded && (
                                                                    <tr>
                                                                        <td colSpan={2} className="px-8 py-8 bg-[#fdfdfe] animate-in slide-in-from-top-4 duration-300">
                                                                            <div className="max-w-2xl">
                                                                                <div className="flex items-center gap-4 mb-8">
                                                                                    <div className="w-8 h-px bg-gray-100" />
                                                                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mitigation & Action Governance</h4>
                                                                                </div>
                                                                                
                                                                                <div className="space-y-6">
                                                                                    <div>
                                                                                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Action Category</label>
                                                                                        <select 
                                                                                            value={mitigationInputs[factorId]?.category || ''}
                                                                                            onChange={(e) => setMitigationInputs({
                                                                                                ...mitigationInputs,
                                                                                                [factorId]: { ...mitigationInputs[factorId], category: e.target.value }
                                                                                            })}
                                                                                            className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                                                        >
                                                                                            <option value="">Select a category...</option>
                                                                                            {MITIGATION_CATEGORIES.map(cat => (
                                                                                                <option key={cat} value={cat}>{cat}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </div>
                                                                                    
                                                                                    <div>
                                                                                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Investigative Notes & Rationale</label>
                                                                                        <textarea 
                                                                                            placeholder="Enter mitigation details, actions taken, and rationale..."
                                                                                            value={mitigationInputs[factorId]?.notes || ''}
                                                                                            onChange={(e) => setMitigationInputs({
                                                                                                ...mitigationInputs,
                                                                                                [factorId]: { ...mitigationInputs[factorId], notes: e.target.value }
                                                                                            })}
                                                                                            className="w-full h-32 p-5 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold resize-none outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                                                        />
                                                                                    </div>
                                                                                    
                                                                                    <div className="flex justify-end pt-2">
                                                                                        <button 
                                                                                            onClick={() => {
                                                                                                setSavedMitigations({ ...savedMitigations, [factorId]: true });
                                                                                                setExpandedFactorId(null);
                                                                                            }}
                                                                                            disabled={!mitigationInputs[factorId]?.category || !mitigationInputs[factorId]?.notes?.trim()}
                                                                                            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                                                                                        >
                                                                                            Save Mitigation
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Analysis & Evidence */}
                                <div className="lg:col-span-6 flex flex-col gap-6">
                                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-8">
                                        <div className="flex justify-between items-center mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Investigation Analysis & Evidence</h3>
                                            </div>
                                            <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                                                <Plus className="w-4 h-4" /> Attach Evidence
                                            </button>
                                        </div>

                                        <div className="space-y-8">
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Narrative</span>
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100">Auto-Saving Enabled</span>
                                                </div>
                                                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 min-h-[160px] text-sm text-gray-700 font-medium leading-relaxed">
                                                    {activeCase.findings || "Initial evaluation confirms cross-border high-value fund movements with suspected shell integration."}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Evidentiary Assets (Cloud Storage)</div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {activeCase.attachments?.map((att: any) => (
                                                        <div key={att.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer group shadow-sm">
                                                            <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                                                <Box className="w-5 h-5" />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <div className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate">{att.name}</div>
                                                                <div className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.1em]">{att.uploadedAt} • {att.size ? (att.size / 1024).toFixed(0) + 'KB' : 'Verify ID'}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-gray-50">
                                                {/* Open in Quantexa Button - Moved here as requested */}
                                                <button 
                                                    onClick={() => window.open('https://quantexa.com', '_blank')} 
                                                    className="w-full mt-2 px-8 py-5 bg-[#0c051a] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-4 group overflow-hidden relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                    <ExternalLink className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-all" />
                                                    <span>Open in Quantexa Investigation Browser</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vital Particulars & Target Identity */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                                <div className="p-1 border-b-4 border-emerald-500/20" />
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Vital Particulars & Target Identity</h3>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[8px] font-black uppercase tracking-widest border border-gray-100">DUE/VERIFIED</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                                        <div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Entity Designation</div>
                                            <div className="text-lg font-black text-gray-900 tracking-tight">{activeSubject?.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Jurisdiction / Origin</div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-4 bg-gray-100 rounded shadow-sm border border-gray-200" />
                                                <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{activeSubject?.nationality || 'Global'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Operational ID</div>
                                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest border border-blue-100 underline decoration-blue-300 underline-offset-4 cursor-pointer">{activeSubject?.id}</span>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Birth / Incorp Date</div>
                                            <div className="text-sm font-black text-gray-900 tracking-tight">{activeSubject?.dob || '1965-02-28'}</div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-10 border-t border-gray-50">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Primary Registered Address</div>
                                        <div className="inline-block px-4 py-2 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest">
                                            {activeSubject?.fullAddress || '44 VOLKOV STREET, ST. PETERSBURG, RUSSIA'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Discovery Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-8 flex flex-col">
                                    <div className="flex items-center justify-center gap-4 mb-8">
                                        <div className="h-px bg-gray-100 flex-1" />
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Cross-Entity Related Cases</h3>
                                        <div className="h-px bg-gray-100 flex-1" />
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        {activeCase.subjects.length > 1 && (
                                            <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-600"><Briefcase className="w-4 h-4" /></div>
                                                        <div>
                                                            <div className="text-[10px] font-black text-gray-900 uppercase">CASE-2024-001</div>
                                                            <div className="text-[9px] font-bold text-blue-600 uppercase">Project Cobalt - Review</div>
                                                        </div>
                                                    </div>
                                                    <span className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[8px] font-black text-gray-400 uppercase">Closed</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Linked To:</span>
                                                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-widest">Tobias Black</span>
                                                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-widest">Apex Holdings</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col">
                                    <div className="flex border-b border-gray-50">
                                        <button className="flex-1 px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-50 flex items-center justify-center gap-3"><Activity className="w-4 h-4" /> Advanced Analytics</button>
                                        <button className="flex-1 px-8 py-5 text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] bg-gray-50/50 flex items-center justify-center gap-3 border-l-4 border-blue-500 relative">
                                            Linked Regulatory Reports
                                            <div className="absolute top-1/2 -translate-y-1/2 right-6 p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Plus className="w-3 h-3" /></div>
                                        </button>
                                    </div>
                                    <div className="p-8 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {activeCase.reports.map(r => (
                                            <div key={r.id} className="p-5 bg-white border border-gray-50 rounded-2xl flex items-center justify-between hover:border-amber-200 transition-all cursor-pointer group shadow-sm">
                                                <div className="flex items-center gap-5">
                                                    <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-amber-50 group-hover:text-amber-500 transition-all">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <div className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{r.id}</div>
                                                            <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-widest leading-none">New Search</span>
                                                        </div>
                                                        <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">{r.date}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-gray-900">${(r.amount / 1000000).toFixed(1)}M</div>
                                                    <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[9px] font-black tracking-widest mt-1 border border-amber-100">{r.riskScore}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isEscalating && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                        <h3 className="text-lg font-black text-gray-900 mb-2">Configure Case Name</h3>
                        <p className="text-[10px] text-gray-400 mb-6 font-bold uppercase tracking-widest italic">Formalization of intelligence operation name</p>
                        <input type="text" value={newCaseTitle} onChange={(e) => setNewCaseTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 p-4 rounded-xl mb-6 text-sm font-black outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter formal case name..." />
                        <div className="flex gap-4">
                            <button onClick={() => setIsEscalating(false)} className="flex-1 py-3 border rounded-xl font-black text-xs uppercase tracking-widest text-gray-500">Cancel</button>
                            <button onClick={handleConfirmEscalation} disabled={!newCaseTitle.trim()} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {isRejecting && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                        <h3 className="text-lg font-black text-gray-900 mb-2 font-black uppercase tracking-tight">Rejection Rationale</h3>
                        <p className="text-[10px] text-gray-400 mb-6 font-bold uppercase tracking-widest italic tracking-widest">Formal intelligence push-back documentation required</p>
                        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="Explain the reason for rejection..." />
                        <div className="flex gap-4">
                            <button onClick={() => { setIsRejecting(false); setRejectionReason(''); }} className="flex-1 py-3 border rounded-xl font-black text-xs uppercase tracking-widest text-gray-500">Cancel</button>
                            <button onClick={handleConfirmReject} disabled={rejectionReason.length < 5} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-red-200">Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}

            {isFinalizing && (
                <div className="fixed inset-0 z-[200] bg-[#0c051a]/80 backdrop-blur-xl flex justify-center items-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
                        <div className="md:w-5/12 bg-gradient-to-br from-[#100628] to-[#1a0b3e] p-10 text-white flex flex-col justify-between">
                            <div>
                                <ShieldCheck className="w-12 h-12 text-emerald-400 mb-8" />
                                <h3 className="text-3xl font-black tracking-tight leading-tight">Finalize Operation</h3>
                                <p className="text-xs text-white/50 font-bold uppercase mt-6 tracking-[0.2em] italic">Immutable Governance Gate</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-40">
                                <Lock className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest tracking-widest">Secured by Quantexa FIU Gateway</span>
                            </div>
                        </div>

                        <div className="flex-1 p-10 flex flex-col bg-gray-50/50">
                            <div className="flex justify-between items-start mb-8">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest tracking-wider">Operational Outcome</span>
                                <button onClick={() => setIsFinalizing(false)} className="p-2 hover:bg-white rounded-xl transition-all text-gray-300"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div onClick={() => setFinalizeOutcome('DISSEMINATE')} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${finalizeOutcome === 'DISSEMINATE' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200'}`}>
                                    <div className="text-xs font-black uppercase tracking-widest tracking-wider">Disseminate Intelligence</div>
                                </div>
                                {finalizeOutcome === 'DISSEMINATE' && (
                                    <select value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)} className="w-full p-4 bg-white border border-emerald-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500">
                                        <option value="">Select Target Agency...</option>
                                        <option value="CAD">CAD (Commercial Affairs)</option>
                                        <option value="MAS">MAS (Monetary Authority)</option>
                                        <option value="FOREIGN_FIU">Foreign FIU Partner</option>
                                    </select>
                                )}
                                <div onClick={() => setFinalizeOutcome('HIBERNATE')} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${finalizeOutcome === 'HIBERNATE' ? 'border-amber-500 bg-amber-50' : 'border-gray-100 bg-white hover:border-amber-200'}`}>
                                    <div className="text-xs font-black uppercase tracking-widest tracking-wider">Place in Hibernation</div>
                                </div>
                                <div onClick={() => setFinalizeOutcome('CLOSE')} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${finalizeOutcome === 'CLOSE' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}>
                                    <div className="text-xs font-black uppercase tracking-widest tracking-wider">Administrative Archive</div>
                                </div>
                            </div>

                            <textarea value={finalizeRationale} onChange={(e) => setFinalizeRationale(e.target.value)} placeholder="Enter closure rationale or executive summary..." className="w-full h-24 p-5 bg-white border border-gray-200 rounded-3xl text-xs font-bold mb-6 resize-none outline-none focus:ring-2 focus:ring-emerald-500" />
                            
                            <button onClick={handleConfirmFinalization} disabled={!finalizeOutcome || !finalizeRationale.trim() || (finalizeOutcome === 'DISSEMINATE' && !selectedAgency)} className="w-full py-5 bg-[#100628] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/10 disabled:opacity-50">Confirm Finalization</button>
                        </div>
                    </div>
                </div>
            )}

            {searchModal.open && (
                <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-8 flex flex-col max-h-[80vh] animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-gray-900 border-b-2 border-blue-500/20 pb-0.5">Global Master Registry Discovery</h3>
                            <button onClick={() => setSearchModal({ ...searchModal, open: false })} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input value={searchQuery} autoFocus onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search by Entity ID, Institution, or Keyword..." />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                            {searchResults.map((res: any) => (
                                <div key={res.id} onClick={() => handleAddManual(res.id)} className="p-5 border border-gray-100 rounded-2xl hover:border-blue-400 cursor-pointer flex justify-between items-center group transition-all hover:shadow-lg hover:shadow-blue-500/5 hover:bg-blue-50/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-white group-hover:scale-110 shadow-sm transition-all">
                                            {searchModal.type === 'ENTITY' ? <User className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-gray-900 group-hover:text-blue-900 transition-colors uppercase tracking-tight">
                                                {searchModal.type === 'ENTITY' ? res.name : res.id}
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {searchModal.type === 'ENTITY' ? `${res.id} • ${res.nationality}` : `${res.institution} • ${res.type}`}
                                            </div>
                                        </div>
                                    </div>
                                    <Plus className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:rotate-90 transition-all" />
                                </div>
                            ))}
                            {searchResults.length === 0 && searchQuery.trim() !== '' && (
                                <div className="py-12 text-center">
                                    <Info className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching results found in global registry</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isReassigning && (
                <div className="fixed inset-0 z-[250] bg-[#0c051a]/60 backdrop-blur-md flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Reassign Ownership</h3>
                            <button onClick={() => setIsReassigning(false)} className="text-gray-300 hover:text-gray-900 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-3 mb-8">
                            {['Sgt. Wong', 'Insp. Tan', 'Det. Lee', 'Senior Analyst Zhang'].map(name => (
                                <div 
                                    key={name}
                                    onClick={() => setNewOwner(name)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${newOwner === name ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
                                >
                                    <span className="text-xs font-black uppercase tracking-wider">{name}</span>
                                    {newOwner === name && <BadgeCheck className="w-4 h-4 text-blue-600" />}
                                </div>
                            ))}
                        </div>
                        <button onClick={handleConfirmReassignment} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">Confirm Transfer</button>
                    </div>
                </div>
            )}

            {showSTRViewer && (
                <STRViewer strId={showSTRViewer} onClose={() => setShowSTRViewer(null)} />
            )}
        </>
    );
};

export default CaseAnalysis;
