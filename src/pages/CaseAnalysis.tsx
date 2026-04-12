import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import MitigationScorecard from '../components/MitigationScorecard';
import STRViewer from '../components/STRViewer';
import { Download, AlertTriangle, X, FileText, Paperclip, Trash2, Loader2, Save, UserCheck, XCircle, Send, ShieldAlert, CheckCircle, BadgeCheck, Users, User, Briefcase, Plus, Search } from 'lucide-react';
import { MOCK_ENTITIES, MOCK_STRS } from '../constants';

const CaseAnalysis: React.FC = () => {
    const { cases, allCases, selectedCase, setSelectedCase, assessEntity, view, previousView, setView, saveFindings, uploadAttachment, removeAttachment, requestModification, approveCase, rejectCase, processModification, updateCaseStatus, bulkUpdateCases } = useApp();
    const { user } = useAuth();
    const [showSTRViewer, setShowSTRViewer] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
    
    // Manager Rejection State
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    
    // Escalation State
    const [isEscalating, setIsEscalating] = useState(false);
    const [newCaseTitle, setNewCaseTitle] = useState('');
    
    // Search & Add Modal State
    const [searchModal, setSearchModal] = useState<{ open: boolean, type: 'ENTITY' | 'STR' }>({ open: false, type: 'ENTITY' });
    const [searchQuery, setSearchQuery] = useState('');
    const { addManualEntity, bulkLinkReports } = useApp();
    
    const activeCase = allCases.find(c => c.id === selectedCase?.id);
    
    if (!activeCase || !selectedCase) return null;

    // Calculate Dynamic Case Score (Aggregate of all subjects + linked reports)
    const subjectTotal = activeCase.subjects.reduce((acc, s) => acc + (s.riskProfile?.totalScore || 0), 0);
    const reportTotal = (activeCase.reports || []).reduce((acc, r) => acc + (r.riskScore || 0), 0);
    const totalCaseScore = subjectTotal + reportTotal;

    // Use selected subject or default to the first one
    const currentSubjectId = activeSubjectId || activeCase.subjects[0]?.id;
    const profile = activeCase.subjects.find(s => s.id === currentSubjectId) || activeCase.subjects[0];
    const isEntity = profile?.type === 'INDIVIDUAL' || profile?.type === 'COMPANY';

    const handleClose = () => {
        setIsRejecting(false);
        setRejectionReason('');
        setSelectedCase(null);
        setView(previousView);
    };

    const handleActionClick = () => {
        if (!selectedAction) return;
        if (selectedAction === 'ESCALATE') {
            setNewCaseTitle(activeCase.title);
            setIsEscalating(true);
        } else {
            assessEntity(activeCase.id, selectedAction as 'HIBERNATE' | 'DISMISS');
        }
    };

    const handleConfirmEscalation = () => {
        if (newCaseTitle && newCaseTitle !== activeCase.title) {
            bulkUpdateCases([activeCase.id], { title: newCaseTitle });
        }
        assessEntity(activeCase.id, 'ESCALATE');
        setIsEscalating(false);
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setIsUploading(true);
        try {
            await uploadAttachment(activeCase.id, file);
        } catch (error) {
            console.error(error);
            alert("Failed to upload evidence to cloud storage.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSignOff = () => {
        if (activeCase.pendingModification || activeCase.status === 'PENDING_DELETION') {
            processModification(activeCase.id, true);
        } else {
            approveCase(activeCase.id);
        }
        handleClose();
    };

    const handleConfirmReject = () => {
        if (!rejectionReason || rejectionReason.length < 5) return;
        
        if (activeCase.pendingModification || activeCase.status === 'PENDING_DELETION') {
            processModification(activeCase.id, false);
        } else {
            rejectCase(activeCase.id, rejectionReason);
        }
        handleClose();
    };

    const handleSubmitForApproval = () => {
        // Formally escalate the draft intelligence to the managerial review pipeline
        updateCaseStatus(activeCase.id, 'PENDING_APPROVAL');
        handleClose();
    };

    const handleAddManual = (id: string) => {
        if (searchModal.type === 'ENTITY') {
            addManualEntity(activeCase.id, id);
        } else {
            bulkLinkReports(activeCase.id, [id]);
        }
        setSearchModal({ ...searchModal, open: false });
        setSearchQuery('');
    };

    const searchResults = searchModal.type === 'ENTITY' 
        ? MOCK_ENTITIES.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.toLowerCase().includes(searchQuery.toLowerCase()))
        : MOCK_STRS.filter(s => s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.institution.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-md flex justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="bg-gray-100 w-full max-w-7xl rounded-2xl shadow-2xl flex flex-col h-[95vh] transform transition-all animate-in zoom-in duration-300 overflow-hidden relative border border-gray-200">
                {/* Header */}
                <div className="bg-[#100628] p-6 lg:p-8 flex flex-col lg:flex-row justify-between lg:items-center gap-6 shadow-lg border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-5">
                        <div className="bg-[#00D7BA]/10 p-3.5 rounded-2xl border border-[#00D7BA]/20 shadow-inner">
                            <FileText className="w-8 h-8 text-[#00D7BA]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1.5 font-black uppercase">
                                {activeCase.status === 'STAGING' ? (
                                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-3 py-1 rounded-full border border-amber-500/30 tracking-[0.2em]">
                                        Draft Intel
                                    </span>
                                ) : (
                                    <span className={`text-[10px] px-3 py-1 rounded-full border tracking-[0.2em] ${
                                        activeCase.status === 'PRIORITY' ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                    }`}>
                                        {activeCase.status}
                                    </span>
                                )}
                                <span className="text-white/30 text-[10px] tracking-widest">OP-ID: {activeCase.id}</span>
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight leading-none">{activeCase.title}</h2>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                <div className="flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-white/40" />
                                    <span className="text-[11px] font-bold text-white/60 tracking-wider">Owner: <span className="text-white/90 font-black">{activeCase.analyst || 'System Auto'}</span></span>
                                </div>
                                {activeCase.subjects.flatMap(s => s.crimeTypologies || []).length > 0 && (
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                                            {[...new Set(activeCase.subjects.flatMap(s => s.crimeTypologies || []))].join(' • ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user?.role === 'MANAGER' && (activeCase.status === 'PENDING_APPROVAL' || activeCase.pendingModification) && (
                            <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                                <button 
                                    onClick={() => setIsRejecting(true)}
                                    className="px-6 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
                                >
                                    <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                                    Push Back
                                </button>
                                <button 
                                    onClick={handleSignOff}
                                    className="px-8 py-3 bg-[#00D7BA] hover:bg-[#00c4a8] text-[#100628] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#00D7BA]/10 flex items-center gap-2"
                                >
                                    <UserCheck className="w-4 h-4" /> 
                                    Authorize & Disseminate
                                </button>
                            </div>
                        )}
                        <button 
                            onClick={handleClose}
                            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white border border-white/5"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>


                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-100 p-6">
                    <div className="space-y-6 max-w-6xl mx-auto">
                        
                        {/* Status Guard: Staging Notice */}
                        {activeCase.status === 'STAGING' && (
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-xl shadow-sm border border-amber-100">
                                        <ShieldAlert className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-amber-900 uppercase tracking-widest">Draft Intelligence Mode</div>
                                        <div className="text-[10px] font-bold text-amber-700 mt-0.5">This case is currently private. Managers cannot view this investigation until you submit it.</div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-amber-100">STG-2026-ALPHA</div>
                            </div>
                        )}

                        {/* Intelligence Multi-Tier Cluster */}
                        {(activeCase.subjects.length >= 1 || (activeCase.reports || []).length >= 1) && (
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex flex-col gap-6 flex-grow overflow-hidden">
                                    {/* Row 1: Forensic Entities */}
                                    {activeCase.subjects.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Forensic Entities & Subjects</div>
                                            <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
                                                {activeCase.subjects.map(s => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => setActiveSubjectId(s.id)}
                                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap flex items-center gap-2.5 ${
                                                            currentSubjectId === s.id 
                                                                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-200' 
                                                                : 'bg-white text-gray-400 border-gray-200 hover:border-blue-200 hover:text-blue-600'
                                                        }`}
                                                    >
                                                        {s.type === 'COMPANY' ? <Briefcase className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                                        <span>{s.name}</span>
                                                        <span className={`ml-1 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm ${
                                                            currentSubjectId === s.id 
                                                                ? 'bg-white/20 text-white' 
                                                                : 'bg-red-50 text-red-600 border border-red-100'
                                                        }`}>
                                                            {s.riskProfile?.totalScore || 0}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Row 2: Regulatory Intelligence */}
                                    {(activeCase.reports || []).length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Regulatory Intelligence (STR/CTR/CMR)</div>
                                            <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
                                                {(activeCase.reports || []).map(r => (
                                                    <div
                                                        key={r.id}
                                                        className="px-4 py-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-amber-800 text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-2.5 shadow-sm"
                                                    >
                                                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                                                        <span>{r.id}</span>
                                                        <span className="bg-white border border-red-100 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                                                            {r.riskScore || 0}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Global Aggregate Metric */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center items-center gap-3 shrink-0 self-start lg:min-w-[200px] border-t-4 border-t-red-600">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Aggregate Case Risk</div>
                                        <div className="text-[10px] font-bold text-red-600 uppercase mt-1">High Exposure Cluster</div>
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 flex items-center justify-center shadow-inner">
                                        <span className="text-2xl font-black text-red-600 leading-none">{totalCaseScore}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ROW 1: Risk Scorecard & Unified Findings/Evidence Panel */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <MitigationScorecard 
                                entityId={activeCase.id} 
                                scorecard={profile.riskProfile} 
                            />
                            
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Investigation Analysis & Evidence</h3>
                                    </div>
                                    <label className={`flex items-center gap-2 px-3 py-1.5 ${isUploading ? 'opacity-50' : 'hover:bg-blue-50 text-blue-600'} rounded-lg cursor-pointer transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-blue-100`}>
                                        {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Paperclip className="w-3 h-3" />}
                                        {isUploading ? 'Uploading...' : 'Attach Evidence'}
                                        <input type="file" className="hidden" onChange={onFileChange} disabled={isUploading} />
                                    </label>
                                </div>
                                
                                <div className="p-8 space-y-8 flex-1 flex flex-col">
                                    {/* Findings Textarea */}
                                    <div className="flex-grow flex flex-col">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Narrative</h4>
                                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">Auto-Saving Enabled</span>
                                        </div>
                                        <textarea 
                                            value={activeCase.findings || ''}
                                            onChange={(e) => saveFindings(activeCase.id, e.target.value)}
                                            placeholder="Document key investigation findings, typology matching, or justification for disposal..."
                                            className="w-full flex-1 min-h-[160px] p-5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-400 transition-all resize-none outline-none leading-relaxed placeholder:text-gray-300 shadow-inner"
                                        />
                                    </div>

                                    {/* Nested Evidence Locker */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Evidentiary Assets (Cloud Storage)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {activeCase.attachments && activeCase.attachments.length > 0 ? (
                                                activeCase.attachments.map(att => (
                                                    <div key={att.id} className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all group relative">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-1.5 bg-gray-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors border border-gray-100">
                                                                <FileText className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-[11px] font-black text-gray-900 truncate pr-6" title={att.name}>{att.name}</div>
                                                                <div className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                                                                    {(att.size / 1024).toFixed(1)} KB • {att.type.split('/')[1] || 'FILE'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <a href={att.url} target="_blank" rel="noreferrer" className="p-1 hover:bg-blue-50 text-blue-600 rounded">
                                                                <Download className="w-3 h-3" />
                                                            </a>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); removeAttachment(activeCase.id, att.id); }}
                                                                className="p-1 hover:bg-red-50 text-red-600 rounded"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full py-4 flex items-center justify-center gap-2 text-gray-400 opacity-60">
                                                    <Paperclip className="w-3.5 h-3.5" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">No cloud evidence attached</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Quick Discovery Actions */}
                                    <div className="pt-6 mt-2 border-t border-gray-100 flex flex-wrap gap-3">
                                        <button 
                                            onClick={() => setSearchModal({ open: true, type: 'ENTITY' })}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-100 transition-all text-[10px] font-black uppercase tracking-widest group"
                                        >
                                            <Users className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                            Link Additional Subject
                                        </button>
                                        <button 
                                            onClick={() => setSearchModal({ open: true, type: 'STR' })}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl border border-amber-100 transition-all text-[10px] font-black uppercase tracking-widest group"
                                        >
                                            <ShieldAlert className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                            Link Regulatory Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ROW 2: Vital Particulars & Subject Identity (Full Horizontal) */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-t-4 border-t-emerald-600">
                            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Vital Particulars & Target Identity</h3>
                                </div>
                                {profile.addedManually ? (
                                    <div className="flex flex-col items-end px-3">
                                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md border border-amber-200">Manual Addition</div>
                                        <div className="text-[8px] font-bold text-amber-500 uppercase mt-1 tracking-tighter">Tagged: {new Date(profile.addedAt || '').toLocaleString()}</div>
                                    </div>
                                ) : (
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-md">Reg-Verified</div>
                                )}
                            </div>
                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-16">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Entity Designation</span>
                                    <span className="text-lg font-black text-gray-900 tracking-tight leading-tight">{profile.name}</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Jurisdiction / Origin</span>
                                    <div className="flex items-center gap-2">
                                         <div className="w-4 h-3 bg-gray-200 rounded-sm"></div> {/* Placeholder for flag */}
                                         <span className="text-sm font-black text-gray-900">{profile.nationality}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Operational ID</span>
                                    <span className="text-sm font-black text-blue-600 font-mono p-1 bg-blue-50 rounded border border-blue-100">{profile.idNumber || 'S8831****'}</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Birth / Incorp Date</span>
                                    <span className="text-sm font-black text-gray-900">{profile.dob || '14 Oct 1982'}</span>
                                </div>
                                <div className="space-y-2 md:col-span-2 lg:col-span-4 pt-6 border-t border-gray-50">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Primary Registered Address</span>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 italic font-medium">
                                            <span className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-wider">{profile.fullAddress || 'Address details currently encrypted or unavailable in repository.'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ROW 3: Linked Cases & Linked Regulatory Reports (Side-by-Side) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Cross-Entity Related Cases</h4>
                                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {allCases.filter((c: any) => c.id !== activeCase.id && c.subjects.some((cs: any) => activeCase.subjects.some(as => as.id === cs.id || (as.idNumber && as.idNumber === cs.idNumber)))).map((rc: any, i: number) => {
                                        const matchingSubjects = activeCase.subjects.filter(as => 
                                            rc.subjects.some((rs: any) => rs.id === as.id || (as.idNumber && as.idNumber === rs.idNumber))
                                        );
                                        
                                        return (
                                            <div key={i} onClick={() => { setSelectedCase(rc); }} className="flex justify-between items-center p-3 bg-blue-50/30 hover:bg-blue-50 rounded-lg border border-blue-100/50 cursor-pointer transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                                                        <FileText className="w-3 h-3" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-gray-900 uppercase tracking-wider">{rc.id}</div>
                                                        <div className="text-[9px] text-blue-600 font-bold uppercase truncate max-w-[150px]">{rc.title}</div>
                                                        <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mr-1">Linked to:</span>
                                                            {matchingSubjects.map(s => (
                                                                <span key={s.id} className="text-[8px] font-black text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-1.5 py-0.5 rounded shadow-sm shadow-blue-500/20 uppercase border border-blue-400/30">
                                                                    {s.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase ${
                                                        rc.status === 'CLOSED' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-green-100 text-green-600 border-green-200'
                                                    }`}>
                                                        {rc.status}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {allCases.filter((c: any) => c.id !== activeCase.id && c.subjects.some((cs: any) => activeCase.subjects.some(as => as.id === cs.id || (as.idNumber && as.idNumber === cs.idNumber)))).length === 0 && (
                                        <div className="text-center py-8 text-gray-400 text-[10px] font-bold uppercase">No related cross-entity cases found</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10"></div>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Linked Regulatory Reports</h4>
                                    <button 
                                        onClick={() => setSearchModal({ open: true, type: 'STR' })}
                                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {activeCase.subjects.flatMap(s => 
                                        (s.linkedSTRs || []).map(str => ({ ...str, sourceEntity: s.name }))
                                    ).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).map((str, i) => (
                                        <div key={i} onClick={() => setShowSTRViewer(str.id)} className="flex justify-between items-center p-3 bg-gray-50/50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all border border-gray-200 group">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-gray-700 tracking-wider group-hover:text-blue-600">{str.id}</span>
                                                    <span className="text-[8px] font-black text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-2 py-0.5 rounded uppercase border border-blue-400/30 shadow-sm shadow-blue-500/20">{str.sourceEntity}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-500 mt-1 font-black uppercase tracking-widest">{str.date}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-black text-gray-900">{str.amount}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {str.addedManually && (
                                                        <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 uppercase tracking-tighter">Manual</span>
                                                    )}
                                                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">{str.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {activeCase.subjects.flatMap(s => s.linkedSTRs || []).length === 0 && (
                                        <div className="text-center py-8 text-gray-400 text-[10px] font-bold uppercase">No linked regulatory reports</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CASE ACTIONS / FINAL SUBMISSION */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center gap-6 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                            
                            {activeCase.status === 'STAGING' ? (
                                <div className="w-full space-y-6">
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 mb-2">
                                            <ShieldAlert className="w-8 h-8" />
                                        </div>
                                        <h4 className="text-xl font-black text-gray-900 tracking-tight">Ready for Operational Escalation?</h4>
                                        <p className="text-sm text-gray-500 max-w-lg mx-auto font-medium">
                                            Formal submission will move this investigation out of your private draft space and into the Manager's Approvals Queue for sign-off.
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <button 
                                            onClick={handleClose}
                                            className="px-8 py-4 border border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all min-w-[200px]"
                                        >
                                            Save as Draft
                                        </button>
                                        <button 
                                            onClick={handleSubmitForApproval}
                                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-blue-200 transition-all flex items-center gap-3 min-w-[280px] justify-center"
                                        >
                                            <Send className="w-4 h-4" />
                                            Submit for Case Creation Approval
                                        </button>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Findings auto-saved to cloud storage</span>
                                    </div>
                                </div>
                            ) : activeCase.status === 'PENDING_APPROVAL' ? (
                                <div className="w-full py-8 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="flex flex-col items-center gap-3 text-gray-400">
                                        <CheckCircle className="w-10 h-10 opacity-30" />
                                        <span className="text-sm font-black uppercase tracking-[0.2em] opacity-60">Submitted for Managerial Review</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full flex flex-col gap-6">
                                     <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Operational Status Workbench</h4>
                                     
                                     {activeCase.status === 'ANALYSIS' || activeCase.status === 'PRIORITY' ? (
                                        <div className="flex flex-col md:flex-row gap-6 w-full justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                            <div className="flex flex-col gap-2">
                                                <h5 className="font-black text-gray-900 text-base flex items-center gap-2">
                                                    <BadgeCheck className="w-5 h-5 text-green-600" /> Formal Investigation Active
                                                </h5>
                                                <div className="flex gap-4">
                                                    <button 
                                                        onClick={() => requestModification(activeCase.id, 'DELETION', { reason: 'Analyst requested deletion.' })}
                                                        className="text-[10px] font-black text-red-600 hover:text-red-700 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Request Deletion
                                                    </button>
                                                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                                                        <Save className="w-3 h-3" /> Status Override
                                                    </button>
                                                </div>
                                            </div>
                                            <a 
                                                href={`https://demo.quantexa.com/banking/share/investigation?id=${activeCase.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-8 py-3.5 bg-[#100628] text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-xl hover:bg-black transition-all flex items-center gap-3"
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M80 20C80 11.163 72.837 4 64 4H20C11.163 4 4 11.163 4 20V64C4 72.837 11.163 80 20 80H54" stroke="white" stroke-width="12" stroke-linecap="round"/>
                                                    <path d="M50 84L80 84C88.837 84 96 76.837 96 68V34C96 25.163 88.837 18 80 18H76" stroke="white" stroke-width="12" stroke-linecap="round"/>
                                                    <line x1="60" y1="64" x2="96" y2="100" stroke="#00D7BA" stroke-width="16" stroke-linecap="round"/>
                                                </svg>
                                                Open in Quantexa
                                            </a>
                                        </div>
                                     ) : (
                                        <div className="flex gap-4 w-full md:w-auto">
                                            <select 
                                                value={selectedAction}
                                                onChange={e => setSelectedAction(e.target.value)}
                                                className="bg-white border border-gray-300 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 block w-full md:w-80 p-3 shadow-sm"
                                            >
                                                <option value="">Select organizational action...</option>
                                                <option value="ESCALATE">Escalate to Case</option>
                                                <option value="HIBERNATE">Hibernate Profile</option>
                                                <option value="DISMISS">Dismiss Lead</option>
                                            </select>
                                            <button 
                                                onClick={handleActionClick}
                                                disabled={!selectedAction}
                                                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all whitespace-nowrap ${
                                                    selectedAction 
                                                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                }`}
                                            >
                                                Confirm Action
                                            </button>
                                        </div>
                                     )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nested Escalation Modal Overlay */}
                {isEscalating && (
                    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 transform transition-all animate-in zoom-in duration-200">
                            <h3 className="text-lg font-black text-gray-900 mb-2">Configure Case Name</h3>
                            <p className="text-xs text-gray-500 mb-6 font-bold uppercase tracking-widest">Formalizing intelligence operation</p>
                            
                            <input 
                                type="text"
                                value={newCaseTitle}
                                onChange={(e) => setNewCaseTitle(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 block p-4 shadow-sm mb-6"
                                placeholder={"Enter formal case name..."}
                            />
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setIsEscalating(false)}
                                    className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmEscalation}
                                    disabled={!newCaseTitle.trim()}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Escalation
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nested Rejection Modal Overlay */}
                {isRejecting && (
                    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 transform transition-all animate-in zoom-in duration-200">
                            <h3 className="text-lg font-black text-gray-900 mb-2">Provide Rejection Rationale</h3>
                            <p className="text-xs text-gray-500 mb-6 font-bold uppercase tracking-widest">Formal intelligence push-back required</p>
                            
                            <textarea 
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter detailed reason for rejection..."
                                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-red-500 transition-all resize-none outline-none mb-6"
                            />
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => { setIsRejecting(false); setRejectionReason(''); }}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmReject}
                                    disabled={rejectionReason.length < 5}
                                    className={`flex-1 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                                        rejectionReason.length >= 5 
                                          ? 'bg-red-600 text-white hover:bg-red-700' 
                                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    }`}
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Add Modal Overlay */}
                {searchModal.open && (
                    <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                        <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-8 transform transition-all animate-in zoom-in duration-200 flex flex-col max-h-[80vh]">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 mb-1">Search & Link {searchModal.type === 'ENTITY' ? 'Subject' : 'Regulatory Report'}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Master Registry Discovery</p>
                                </div>
                                <button onClick={() => { setSearchModal({ ...searchModal, open: false }); setSearchQuery(''); }} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={searchModal.type === 'ENTITY' ? "Search by name or ID (e.g. Tobias, P-001)..." : "Search by Report ID or Institution..."}
                                    className="w-full bg-gray-50 border border-gray-200 text-sm font-bold p-4 pl-12 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {searchResults.length > 0 ? (
                                    searchResults.map((res: any) => {
                                        const alreadyLinked = searchModal.type === 'ENTITY' 
                                            ? activeCase.subjects.some(s => s.id === res.id)
                                            : activeCase.reports.some(r => r.id === res.id);

                                        return (
                                            <div 
                                                key={res.id} 
                                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                                                    alreadyLinked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                                                }`}
                                                onClick={() => !alreadyLinked && handleAddManual(res.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2.5 rounded-xl ${searchModal.type === 'ENTITY' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {searchModal.type === 'ENTITY' ? (res.type === 'COMPANY' ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />) : <FileText className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-gray-900">{res.name || res.id}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {searchModal.type === 'ENTITY' ? `${res.nationality} • ${res.id}` : `${res.institution} • ${res.type}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                {alreadyLinked ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg border border-green-100 text-[10px] font-black uppercase">
                                                        <BadgeCheck className="w-3 h-3" /> Linked
                                                    </div>
                                                ) : (
                                                    <Plus className="w-5 h-5 text-blue-600" />
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-12 text-center">
                                        <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No matching results in registry</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showSTRViewer && (
                <STRViewer 
                    strId={showSTRViewer} 
                    onClose={() => setShowSTRViewer(null)} 
                />
            )}
        </div>
    );
};

export default CaseAnalysis;
