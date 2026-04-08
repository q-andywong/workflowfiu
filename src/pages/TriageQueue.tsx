import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Inbox, Filter, ShieldAlert, ArrowRight, UserPlus, FileSearch, AlertTriangle, CheckCircle, Clock, Trash2, X, Link as LinkIcon, ChevronRight } from 'lucide-react';
import BulkActionToolbar from '../components/BulkActionToolbar';

const TriageQueue: React.FC = () => {
    const { cases, allCases, stats, setView, setSelectedCase, bulkUpdateCases, linkEntitiesToCase } = useApp();
    const { user } = useAuth();
    
    const isInvestigator = user?.role === 'INVESTIGATOR';

    // Triage strictly includes only pre-escalation entities
    const triageEntities = cases.filter(c => c.status === 'TRIAGE');
    
    // Priority Bypass Cases (for investigator view)
    const priorityCases = allCases.filter(c => c.status === 'PRIORITY');
    
    // Hibernation Count
    const hibernationCount = allCases.filter(c => c.status === 'HIBERNATED').length;

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLinking, setIsLinking] = useState(false);
    const [targetCaseId, setTargetCaseId] = useState('');

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                        Automated Triage Queue
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Initial evidence assessment and risk scoring ingestion</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                        <Filter className="w-4 h-4 text-gray-400" />
                        Risk Threshold
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all focus:ring-4 focus:ring-blue-100">
                      Force Rescan
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 ${isInvestigator ? '' : 'xl:grid-cols-3'} gap-8`}>
                <div className={`${isInvestigator ? 'xl:col-span-3' : 'xl:col-span-2'} space-y-4`}>
                    <div className="px-4 pb-2 border-b border-gray-200 space-y-4">
                        <div className="flex items-center gap-4">
                            <input 
                                type="checkbox" 
                                checked={selectedIds.length === triageEntities.length && triageEntities.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Showing {triageEntities.length} pending items in Ingestion Queue</div>
                        </div>
                        
                        <div className="hidden sm:flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-2">
                            <div className="w-64 pl-12">Intelligence Subject</div>
                            <div className="w-24 text-center">Total Risk Score</div>
                            <div className="w-28 text-right pr-4">Actions</div>
                        </div>
                    </div>

                    {triageEntities.map(c => (
                        <div key={c.id} className="flex flex-col gap-2">
                            {c.rejectionReason && (
                                <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> REJECTED: {c.rejectionReason}
                                </div>
                            )}
                            {c.pendingModification && c.status === 'PENDING_APPROVAL' && (
                                <div className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> PENDING CLOSURE: Linked to {c.pendingModification.details.targetCase}
                                </div>
                            )}
                            <div 
                                onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                                className={`bg-white p-4 rounded-xl shadow-sm border group flex items-center justify-between hover:bg-gray-50 transition-colors border-l-4 cursor-pointer ${
                                    selectedIds.includes(c.id) ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                                } ${c.rejectionReason ? 'border-l-red-500' : (c.pendingModification ? 'border-l-amber-500' : 'border-l-blue-500')}`}
                            >
                                <div className="flex items-center gap-4 sm:w-64">
                                    <input 
                                        type="checkbox"
                                        checked={selectedIds.includes(c.id)}
                                        onChange={() => {}} 
                                        onClick={(e) => toggleSelect(c.id, e)}
                                        disabled={!!c.pendingModification}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 z-10 disabled:opacity-50"
                                    />
                                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${c.rejectionReason ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                        <Inbox className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-sm font-bold text-gray-900 truncate">{c.subject.name}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{c.id}</span>
                                            <span className="text-[10px] text-gray-300">•</span>
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{c.analyst || 'Unassigned'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex flex-col items-center w-24">
                                    <div className="text-lg font-black text-blue-600">{c.subject.riskProfile.totalScore}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confidence</div>
                                </div>

                                <div className="flex items-center justify-end gap-2 sm:w-28">
                                    <button className="p-2 border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors shadow-sm">
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                                      className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-colors border border-blue-100 shadow-sm"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {triageEntities.length === 0 && (
                      <div className="p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center space-y-4">
                          <FileSearch className="w-10 h-10 mx-auto text-gray-400" />
                          <div className="text-sm font-bold text-gray-600">The ingestion queue is currently empty.</div>
                      </div>
                    )}

                    {/* Investigator-Only Priority Bypass Section */}
                    {isInvestigator && (
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                                    <ShieldAlert className="w-6 h-6 text-red-600" />
                                    Priority Bypass Registry
                                </h3>
                                <div className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                                    {priorityCases.length} Critical Hit Detection
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {priorityCases.map(pc => (
                                    <div 
                                        key={pc.id}
                                        onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}
                                        className="bg-[#100628] p-5 rounded-2xl border border-white/10 shadow-xl group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">CRITICAL BYPASS</div>
                                                <div className="text-base font-black text-white">{pc.subject.name}</div>
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{pc.id}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-red-500">{pc.subject.riskProfile.totalScore}</div>
                                                <div className="text-[10px] font-bold text-white/30 uppercase">Risk Level</div>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                                            <div className="text-[10px] font-bold text-white/50 uppercase flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                Escalated {new Date(pc.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-blue-400 group-hover:translate-x-1 transition-transform">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {priorityCases.length === 0 && (
                                    <div className="col-span-full p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                        <CheckCircle className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">No Priority Items Pending</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Investigator-Only Hibernation Footer */}
                    {isInvestigator && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div 
                                onClick={() => setView('HIBERNATED')}
                                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Hibernation Registry Status</h4>
                                        <div className="text-xs font-bold text-gray-500 mt-1">
                                            <span className="text-green-600">{hibernationCount} low-risk entities</span> have been auto-triaged and are awaiting baseline monitoring.
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                    Access Registry List
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Manager-Only Sidebar */}
                {!isInvestigator && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                               Triage Statistics
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">Pending Intake</span>
                                    <span className="text-lg font-bold text-gray-900">{stats.totalIncoming}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">Avg Time to Triage</span>
                                    <span className="text-lg font-bold text-gray-900">4.2 hrs</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex border border-gray-200">
                                    <div className="h-full bg-green-500" style={{ width: '65%' }}></div>
                                    <div className="h-full bg-amber-400" style={{ width: '25%' }}></div>
                                    <div className="h-full bg-red-500" style={{ width: '10%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Low (65%)</span>
                                    <span>Med (25%)</span>
                                    <span>High (10%)</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col items-start shadow-sm">
                            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                               <ShieldAlert className="w-4 h-4 text-red-600" />
                               Priority Bypass
                            </h3>
                            <p className="text-sm text-red-700 leading-relaxed font-medium">
                                {stats.priorityAlerts} items have bypassed this queue due to CRITICAL risk hits and are now in the Priority Analysis workbench.
                            </p>
                            <button 
                              onClick={() => setView('PRIORITY')}
                              className="w-full mt-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-700 text-sm font-bold rounded-lg transition-colors shadow-sm"
                            >
                               Open Workbench
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <BulkActionToolbar 
                selectedCount={selectedIds.length}
                onClear={() => setSelectedIds([])}
                actions={bulkActions}
            />

            {/* Linking Overlay Modal */}
            {isLinking && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Merge with Investigation</h3>
                                <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-widest">Select target master case for {selectedIds.length} leads</p>
                            </div>
                            <button onClick={() => { setIsLinking(false); setTargetCaseId(''); }} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Master Investigations</label>
                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {activeInvestigations.map(ic => (
                                    <div 
                                        key={ic.id}
                                        onClick={() => setTargetCaseId(ic.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${targetCaseId === ic.id ? 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-500/10' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{ic.subject.name}</span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{ic.id}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-black text-blue-600">{ic.status}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase">{ic.analyst || 'Unassigned'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {activeInvestigations.length === 0 && (
                                    <div className="py-12 text-center text-gray-400 italic text-sm">No active investigations available for merging.</div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => { setIsLinking(false); setTargetCaseId(''); }}
                                className="flex-1 px-6 py-3 border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmLink}
                                disabled={!targetCaseId}
                                className={`flex-1 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                                    targetCaseId 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                }`}
                            >
                                Confirm Merge & Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TriageQueue;
