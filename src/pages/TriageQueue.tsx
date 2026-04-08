import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Inbox, Filter, ShieldAlert, ArrowRight, UserPlus, FileSearch, AlertTriangle, CheckCircle, Clock, Trash2, X, Link as LinkIcon, ChevronRight } from 'lucide-react';
import BulkActionToolbar from '../components/BulkActionToolbar';

const TriageQueue: React.FC = () => {
    const { cases, allCases, stats, setView, setSelectedCase, bulkUpdateCases, linkEntitiesToCase } = useApp();
    const { user } = useAuth();
    
    const isInvestigator = user?.role === 'INVESTIGATOR';

    // Buckets
    const triageEntities = cases.filter(c => c.status === 'TRIAGE');
    const priorityCases = allCases.filter(c => c.status === 'PRIORITY');
    const hibernatedEntities = allCases.filter(c => c.status === 'HIBERNATED');
    const hibernationCount = hibernatedEntities.length;

    // View States
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLinking, setIsLinking] = useState(false);
    const [targetCaseId, setTargetCaseId] = useState('');
    const [managerView, setManagerView] = useState<'SUMMARY' | 'TRIAGE' | 'PRIORITY' | 'HIBERNATED'>('SUMMARY');

    const toggleSelectAll = () => {
        if (selectedIds.length === triageEntities.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(triageEntities.map(c => c.id));
        }
    };

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkAction = (action: 'ESCALATE' | 'HIBERNATE' | 'DISMISS') => {
        let status: any = 'PENDING_APPROVAL';
        if (action === 'HIBERNATE') status = 'HIBERNATED';
        if (action === 'DISMISS') status = 'DISMISSED';
        
        bulkUpdateCases(selectedIds, { status });
        setSelectedIds([]);
    };

    const handleConfirmLink = () => {
        if (!targetCaseId || selectedIds.length === 0) return;
        linkEntitiesToCase(targetCaseId, selectedIds);
        setSelectedIds([]);
        setIsLinking(false);
        setTargetCaseId('');
    };

    const bulkActions = [
        { label: 'Link to Investigation', icon: <LinkIcon className="w-4 h-4" />, onClick: () => setIsLinking(true), variant: 'primary' as const },
        { label: 'Escalate Selection', icon: <CheckCircle className="w-4 h-4" />, onClick: () => handleBulkAction('ESCALATE'), variant: 'primary' as const },
        { label: 'Hibernate', icon: <Clock className="w-4 h-4" />, onClick: () => handleBulkAction('HIBERNATE'), variant: 'warning' as const },
        { label: 'Dismiss', icon: <Trash2 className="w-4 h-4" />, onClick: () => handleBulkAction('DISMISS'), variant: 'danger' as const },
    ];

    const activeInvestigations = allCases.filter(c => c.status === 'ANALYSIS' || c.status === 'PRIORITY');

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {!isInvestigator && managerView !== 'SUMMARY' && (
                        <button 
                            onClick={() => setManagerView('SUMMARY')}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                            {!isInvestigator && managerView !== 'SUMMARY' ? `${managerView} Registry Details` : 'Automated Triage Queue'}
                        </h2>
                        <p className="text-gray-500 mt-1 font-medium text-sm">
                            {!isInvestigator && managerView === 'SUMMARY' 
                                ? 'Operational oversight of ingestion pipelines and bypass registries' 
                                : 'Initial evidence assessment and risk scoring ingestion'}
                        </p>
                    </div>
                </div>
                {isInvestigator && (
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                            <Filter className="w-4 h-4 text-gray-400" />
                            Risk Threshold
                        </button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all focus:ring-4 focus:ring-blue-100">
                          Force Rescan
                        </button>
                    </div>
                )}
            </div>

            {/* Manager Dashboard (Summary Tiles) */}
            {!isInvestigator && managerView === 'SUMMARY' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Triage Bucket */}
                    <div onClick={() => setManagerView('TRIAGE')} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-6"><Inbox className="w-6 h-6" /></div>
                            <div className="text-4xl font-black text-gray-900">{triageEntities.length}</div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Pending Analyst Triage</div>
                            <p className="text-xs text-gray-400 mt-4 font-medium italic">Standard ingestion items awaiting analyst assessment.</p>
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-blue-600 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Expand Details <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Priority Bucket */}
                    <div onClick={() => setManagerView('PRIORITY')} className="bg-[#100628] p-8 rounded-3xl border border-white/5 shadow-2xl hover:shadow-red-900/10 hover:border-red-500/30 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 blur-xl"></div>
                        <div className="relative z-10">
                            <div className="p-4 bg-red-600/20 text-red-500 rounded-2xl w-fit mb-6"><ShieldAlert className="w-6 h-6" /></div>
                            <div className="text-4xl font-black text-white">{priorityCases.length}</div>
                            <div className="text-sm font-bold text-red-400 uppercase tracking-widest mt-1">Priority Bypass Hits</div>
                            <p className="text-xs text-white/40 mt-4 font-medium italic">Critical alerts that bypassed standard triage protocols.</p>
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-red-500 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Review Bypasses <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Hibernation Bucket */}
                    <div onClick={() => setManagerView('HIBERNATED')} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-200 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl w-fit mb-6"><Clock className="w-6 h-6" /></div>
                            <div className="text-4xl font-black text-gray-900">{hibernationCount}</div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Auto-Hibernated Entities</div>
                            <p className="text-xs text-gray-400 mt-4 font-medium italic">Low-risk entities moved to baseline monitoring.</p>
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-green-600 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Access Registry <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Content / Investigator Stack */}
            {(isInvestigator || managerView !== 'SUMMARY') && (
                <div className={`grid grid-cols-1 ${isInvestigator ? 'xl:grid-cols-4' : ''} gap-8`}>
                    <div className={isInvestigator ? 'xl:col-span-3' : 'w-full'}>
                        <div className="space-y-4">
                            {/* Standard Triage List */}
                            {(isInvestigator || managerView === 'TRIAGE') && (
                                <>
                                    <div className="px-4 pb-2 border-b border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.length === triageEntities.length && triageEntities.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ingestion Queue ({triageEntities.length} items)</div>
                                        </div>
                                    </div>

                                    {triageEntities.map(c => (
                                        <div key={c.id} 
                                            onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer border-l-4 border-l-blue-500"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                    <Inbox className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{c.subject.name}</div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.id}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8 text-right">
                                                <div>
                                                    <div className="text-lg font-black text-blue-600">{c.subject.riskProfile.totalScore}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Risk Score</div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-300" />
                                            </div>
                                        </div>
                                    ))}

                                    {triageEntities.length === 0 && (
                                        <div className="p-12 bg-white rounded-xl border border-dashed border-gray-200 text-center text-gray-400 font-bold italic">
                                            Queue is currently empty.
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Priority Detail View */}
                            {!isInvestigator && managerView === 'PRIORITY' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {priorityCases.map(pc => (
                                        <div key={pc.id} onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }} className="bg-[#100628] p-6 rounded-2xl border border-white/5 shadow-xl hover:scale-[1.02] transition-all cursor-pointer">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">CRITICAL BYPASS</div>
                                                    <div className="text-base font-black text-white">{pc.subject.name}</div>
                                                </div>
                                                <div className="text-2xl font-black text-red-500">{pc.subject.riskProfile.totalScore}</div>
                                            </div>
                                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{pc.id}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hibernation Detail View */}
                            {!isInvestigator && managerView === 'HIBERNATED' && (
                                <div className="space-y-4">
                                    {hibernatedEntities.map(hc => (
                                        <div key={hc.id} className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between border-l-4 border-l-green-500">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-base font-bold text-gray-900">{hc.subject.name}</div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{hc.id}</div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-black uppercase tracking-widest">Auto-Resolved</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Investigator-Only Priority Sidebar (Duplicate functionality for investigator vertical scroll) */}
                            {isInvestigator && priorityCases.length > 0 && (
                                <div className="mt-12 space-y-6">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-3"><ShieldAlert className="w-6 h-6 text-red-600" /> Priority Bypass Registry</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {priorityCases.map(pc => (
                                            <div key={pc.id} onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }} className="bg-[#100628] p-5 rounded-2xl border border-white/5 hover:scale-[1.02] transition-all cursor-pointer">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-[10px] font-bold text-red-400">CRITICAL BYPASS</div>
                                                        <div className="text-base font-black text-white">{pc.subject.name}</div>
                                                    </div>
                                                    <div className="text-lg font-black text-red-500">{pc.subject.riskProfile.totalScore}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Area for Investigator Stats */}
                    {isInvestigator && (
                        <div className="xl:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2 underline underline-offset-4 decoration-blue-500">Triage Stats</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-bold"><span className="text-gray-500">Pending</span><span className="text-gray-900">{triageEntities.length}</span></div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                                        <div className="h-full bg-amber-400" style={{ width: '30%' }}></div>
                                        <div className="h-full bg-red-500" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <BulkActionToolbar 
                selectedCount={selectedIds.length}
                onClear={() => setSelectedIds([])}
                actions={bulkActions}
            />

            {/* Linking Overlay Modal */}
            {isLinking && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-gray-900">Merge with Investigation</h3>
                            <button onClick={() => setIsLinking(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 mb-8 pr-2 custom-scrollbar">
                            {activeInvestigations.map(ic => (
                                <div key={ic.id} onClick={() => setTargetCaseId(ic.id)} className={`p-4 rounded-xl border cursor-pointer ${targetCaseId === ic.id ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="font-bold text-sm text-gray-900">{ic.subject.name}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ic.id}</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleConfirmLink} disabled={!targetCaseId} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-lg">Confirm Merge & Link</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TriageQueue;
