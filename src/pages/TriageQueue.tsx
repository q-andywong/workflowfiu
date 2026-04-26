import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Inbox, Filter, ShieldAlert, ArrowRight, UserPlus, FileSearch, AlertTriangle, CheckCircle, Clock, Trash2, X, Link as LinkIcon, ChevronRight, RefreshCw, Database, Network, ShieldCheck, UserCheck, XCircle } from 'lucide-react';
import BulkActionToolbar from '../components/BulkActionToolbar';

const TriageQueue: React.FC = () => {
    const { cases, allCases, stats, setView, setSelectedCase, bulkUpdateCases, linkEntitiesToCase, assessEntity, approveCase, ingestCases } = useApp();
    const { user } = useAuth();
    
    const isInvestigator = user?.role === 'INVESTIGATOR';

    // Specialization Filtering Logic
    const filterBySpecialization = <T extends { subjects: { crimeTypologies?: string[] }[] }>(items: T[]): T[] => {
        if (user?.role === 'INVESTIGATOR' && user.typology) {
            return items.filter(item => {
                const typs = item.subjects.flatMap(s => s.crimeTypologies || []);
                // Visibility Rules: 
                // 1. Show if task matches analyst specialization
                // 2. Show if any subject in the task is uncategorized (needs initial assignment)
                // 3. Show if all subjects are uncategorized
                return typs.length === 0 || typs.includes(user.typology!);
            });
        }
        return items;
    };

    // Buckets
    const triageEntities = filterBySpecialization(cases.filter(c => c.status === 'TRIAGE'));
    const priorityCases = filterBySpecialization(allCases.filter(c => c.status === 'PRIORITY'));
    const hibernatedEntities = filterBySpecialization(allCases.filter(c => c.status === 'HIBERNATED'));
    const pendingApprovals = filterBySpecialization(allCases.filter(c => 
        c.status === 'PENDING_APPROVAL' || 
        c.status === 'PENDING_DELETION' || 
        c.pendingModification
    ));
    const hibernationCount = hibernatedEntities.length;

    // View States
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLinking, setIsLinking] = useState(false);
    const [targetCaseId, setTargetCaseId] = useState('');
    const { triageSubView: managerView, setTriageSubView: setManagerView, processModification, rejectCase } = useApp();
    
    // Approval specific tracking
    const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});
    const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

    const handleReject = (id: string) => {
        const note = rejectionNotes[id];
        if (!note || note.length < 5) return;
        rejectCase(id, note);
        setActiveRejectId(null);
    };

    // Scanning Simulation State
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0); // 0: Connect, 1: Retrieve, 2: Triage, 3: Results
    const [scanProgress, setScanProgress] = useState(0);
    const [scanResults, setScanResults] = useState<{ tasks: number; strs: number; cmrs: number; ctrs: number }>({ tasks: 0, strs: 0, cmrs: 0, ctrs: 0 });

    const handleStartScan = () => {
        setIsScanning(true);
        setScanStep(0);
        setScanProgress(0);
        setScanResults({ tasks: 0, strs: 0, cmrs: 0, ctrs: 0 });

        // Phase 1: Connecting (1.5s)
        const phase1Duration = 1500;
        const interval = 30; // ms
        let timer = 0;

        const progressInterval = setInterval(() => {
            timer += interval;
            setScanProgress(Math.min((timer / phase1Duration) * 100, 100));

            if (timer >= phase1Duration) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    // Phase 2: Retrieving — fetch new tasks from JSON (1s animation)
                    setScanStep(1);
                    setScanProgress(0);
                    let timer2 = 0;
                    const phase2Duration = 1000;

                    // Fetch new tasks in parallel with animation
                    fetch('/samples/NewTasksToIngest.json')
                        .then(res => res.ok ? res.json() : [])
                        .catch(() => [])
                        .then((newTasks: any[]) => {
                            // Compute counts from newly fetched tasks before dedup
                            const existingIds = new Set(allCases.map(c => c.id));
                            const trulyNew = newTasks.filter((t: any) => !existingIds.has(t.id));
                            const newReports = trulyNew.flatMap((t: any) => t.reports || []);
                            setScanResults({
                                tasks: trulyNew.length,
                                strs: newReports.filter((r: any) => r.type === 'STR').length,
                                cmrs: newReports.filter((r: any) => r.type === 'CMR').length,
                                ctrs: newReports.filter((r: any) => r.type === 'CTR').length,
                            });
                            ingestCases(newTasks);
                        });

                    const progressInterval2 = setInterval(() => {
                        timer2 += interval;
                        setScanProgress(Math.min((timer2 / phase2Duration) * 100, 100));
                        if (timer2 >= phase2Duration) {
                            clearInterval(progressInterval2);
                            setTimeout(() => {
                                // Phase 3: Triaging (1s)
                                setScanStep(2);
                                setScanProgress(0);
                                let timer3 = 0;
                                const phase3Duration = 1000;
                                const progressInterval3 = setInterval(() => {
                                    timer3 += interval;
                                    setScanProgress(Math.min((timer3 / phase3Duration) * 100, 100));
                                    if (timer3 >= phase3Duration) {
                                        clearInterval(progressInterval3);
                                        // Phase 4: Show results instead of dismissing
                                        setTimeout(() => {
                                            setScanStep(3);
                                            setScanProgress(100);
                                        }, 400);
                                    }
                                }, interval);
                            }, 200);
                        }
                    }, interval);
                }, 200);
            }
        }, interval);
    };

    const handleDismissScan = () => {
        setIsScanning(false);
        setScanStep(0);
        setScanProgress(0);
    };
    
    // Kafka Sync Simulation Logic
    const [isSyncingKafka, setIsSyncingKafka] = useState(false);
    const [kafkaSyncProgress, setKafkaSyncProgress] = useState(0);
    const [isSyncComplete, setIsSyncComplete] = useState(false);

    const handleSignOffAndEscalate = (entityId: string, action: 'ESCALATE' | 'HIBERNATE' | 'DISMISS' | 'APPROVE') => {
        setIsSyncingKafka(true);
        setKafkaSyncProgress(0);
        setIsSyncComplete(false);

        const duration = 1000; // 1s
        const interval = 20;
        let timer = 0;

        const progressInterval = setInterval(() => {
            timer += interval;
            setKafkaSyncProgress(Math.min((timer / duration) * 100, 100));

            if (timer >= duration) {
                clearInterval(progressInterval);
                setIsSyncComplete(true);
                
                // Finalize status immediately in the background
                if (action === 'APPROVE') {
                    approveCase(entityId);
                } else {
                    assessEntity(entityId, action as any);
                }
            }
        }, interval);
    };

    const handleCloseSyncModal = () => {
        setIsSyncingKafka(false);
        setIsSyncComplete(false);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === triageEntities.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(triageEntities.map(c => c.id));
        }
    };

    const toggleSelect = (id: string, e?: React.SyntheticEvent) => {
        if (e) e.stopPropagation();
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
                            {!isInvestigator && managerView !== 'SUMMARY' ? `${managerView.charAt(0) + managerView.slice(1).toLowerCase()} List Details` : 'Automated Triage Queue'}
                        </h2>
                        <p className="text-gray-500 mt-1 font-medium text-sm">
                            {!isInvestigator && managerView === 'SUMMARY' 
                                ? 'Operational oversight of ingestion pipelines and bypass registries' 
                                : 'Initial evidence assessment and risk scoring ingestion'}
                        </p>
                    </div>
                </div>

                {!isInvestigator && managerView === 'SUMMARY' && (
                    <button 
                        onClick={handleStartScan}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 flex items-center gap-3 transition-all hover:-translate-y-0.5"
                    >
                        <RefreshCw className="w-5 h-5 animate-spin-slow" />
                        Scan for latest tasks
                    </button>
                )}
            </div>

            {/* Manager Dashboard (Summary Tiles) */}
            {!isInvestigator && managerView === 'SUMMARY' && (
                <div className="space-y-6">
                    {/* Row 1: Pending Triage, Priority Bypasses, Hibernated */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Triage Bucket */}
                        <div onClick={() => setManagerView('TRIAGE')} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4"><Inbox className="w-5 h-5" /></div>
                                <div className="text-3xl font-black text-gray-900">{triageEntities.length}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Pending Triage</div>
                                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">Tasks with risk score between <span className="font-black text-blue-600">10</span> and <span className="font-black text-blue-600">150</span>, awaiting analyst assessment and evidence review.</p>
                                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-blue-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                    Expand Details <ChevronRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>

                        {/* Priority Bucket */}
                        <div onClick={() => setManagerView('PRIORITY')} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-200 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="p-3 bg-red-50 text-red-600 rounded-2xl w-fit mb-4"><ShieldAlert className="w-5 h-5" /></div>
                                <div className="text-3xl font-black text-gray-900">{priorityCases.length}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Priority Bypasses</div>
                                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">Auto-escalated: risk score exceeds <span className="font-black text-red-600">&gt; 150</span>. Sanctions matches, PEP exposure, or multiple high-severity hits.</p>
                                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-red-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                    Access List <ChevronRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>

                        {/* Hibernation Bucket */}
                        <div onClick={() => setManagerView('HIBERNATED')} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-200 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-4"><Clock className="w-5 h-5" /></div>
                                <div className="text-3xl font-black text-gray-900">{hibernationCount}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Hibernated</div>
                                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">Auto-deferred: risk score below <span className="font-black text-green-600">&lt; 10</span>. Geographic flags only, no behavioural anomalies. Background monitoring.</p>
                                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-green-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                    Access List <ChevronRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Review Approvals (full-width banner) */}
                    <div onClick={() => setManagerView('APPROVALS')} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0"><CheckCircle className="w-5 h-5" /></div>
                                <div>
                                    <div className="flex items-baseline gap-3">
                                        <div className="text-3xl font-black text-gray-900">{pendingApprovals.length}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Awaiting Sign-off</div>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Tasks escalated by analysts requiring managerial authorization to convert into formal investigation cases. Includes status changes, data corrections, and deletion requests.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform shrink-0">
                                Review Approvals <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Content / Investigator Stack */}
            {(isInvestigator || managerView !== 'SUMMARY') && (
                <div className="grid grid-cols-1 gap-8">
                    <div className="w-full">
                        <div className="space-y-4">
                            {/* Standard Triage List */}
                            {(isInvestigator || managerView === 'TRIAGE') && (
                                <>
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 mb-2"><Inbox className="w-6 h-6 text-blue-600" /> Pending Triage List</h3>
                                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-6 py-4 w-12 border-r border-gray-100">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedIds.length === triageEntities.length && triageEntities.length > 0}
                                                            onChange={toggleSelectAll}
                                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                    </th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Task ID & Target Entities</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Risk Score</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Operational Decisions</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Review Details</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 italic font-medium">
                                                {triageEntities.map(c => (
                                                    <tr key={c.id} className="hover:bg-blue-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-blue-600">
                                                        <td className="px-6 py-4 border-r border-gray-100">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedIds.includes(c.id)}
                                                                onChange={(e) => { e.stopPropagation(); toggleSelect(c.id); }}
                                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 cursor-pointer" onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}>
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors mt-0.5">
                                                                    <Inbox className="w-5 h-5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-black text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                                                        {c.subjects[0]?.name}
                                                                        {c.subjects.length > 1 && (
                                                                            <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[8px] border border-blue-100">+{c.subjects.length - 1} Entities</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{c.id}</div>
                                                                        {c.reports && c.reports.length > 0 && (
                                                                            <>
                                                                                <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>
                                                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                                                    {c.reports.length} report{c.reports.length > 1 ? 's' : ''}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                                        {Array.from(new Set(c.subjects.flatMap(s => s.crimeTypologies || []))).length > 0 ? (
                                                                            Array.from(new Set(c.subjects.flatMap(s => s.crimeTypologies || []))).map((typ, idx) => (
                                                                                <div key={idx} className="text-[9px] font-black flex items-center gap-1 text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                                                    <AlertTriangle className="w-2.5 h-2.5" />
                                                                                    {typ}
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                                                General Triage
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center cursor-pointer" onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}>
                                                            <span className="font-black px-2.5 py-1 rounded shadow-sm text-xs border text-blue-600 bg-blue-50 border-blue-100">
                                                                {Math.max(...c.subjects.map(s => s.riskProfile.totalScore))}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); assessEntity(c.id, 'ESCALATE'); }}
                                                                    title="Escalate to Case"
                                                                    className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <ShieldAlert className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); assessEntity(c.id, 'HIBERNATE'); }}
                                                                    title="Hibernate Entity"
                                                                    className="p-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <Clock className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); assessEntity(c.id, 'DISMISS'); }}
                                                                    title="Dismiss Lead"
                                                                    className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right cursor-pointer" onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}>
                                                            <div className="p-1.5 inline-block bg-gray-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-400">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {triageEntities.length === 0 && (
                                            <div className="p-12 text-center text-gray-400 font-bold italic w-full">
                                                Queue is currently empty.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Priority Detail View */}
                            {!isInvestigator && managerView === 'PRIORITY' && (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Case ID</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Investigation Title</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Analyst</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Lifecycle</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 italic font-medium">
                                                {priorityCases.map(pc => (
                                                    <tr key={pc.id} className="hover:bg-red-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-red-600 cursor-pointer" onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors mt-0.5">
                                                                    <ShieldAlert className="w-5 h-5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-black text-gray-900 flex items-center gap-2 group-hover:text-red-600 transition-colors">
                                                                        {pc.subjects[0]?.name}
                                                                        {pc.subjects.length > 1 && (
                                                                            <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] border border-red-100">+{pc.subjects.length - 1} Entities</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{pc.id}</div>
                                                                        {pc.reports && pc.reports.length > 0 && (
                                                                            <>
                                                                                <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>
                                                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                                                    {pc.reports.length} report{pc.reports.length > 1 ? 's' : ''}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                                        {Array.from(new Set(pc.subjects.flatMap(s => s.crimeTypologies || []))).length > 0 ? (
                                                                            Array.from(new Set(pc.subjects.flatMap(s => s.crimeTypologies || []))).map((typ, idx) => (
                                                                                <div key={idx} className="text-[9px] font-black flex items-center gap-1 text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                                                                    <AlertTriangle className="w-2.5 h-2.5" />
                                                                                    {typ}
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                                                Priority Bypass
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase">
                                                                    {(pc.analyst || 'UN')[0]}
                                                                </div>
                                                                <span className="text-xs font-bold text-gray-700">{pc.analyst || 'Unassigned'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="font-black px-2.5 py-1 rounded shadow-sm text-xs border text-red-600 bg-red-50 border-red-100">
                                                                {Math.max(...pc.subjects.map(s => s.riskProfile.totalScore))}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex justify-center">
                                                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] border border-red-100 flex items-center gap-1.5 font-bold uppercase w-fit"><ShieldAlert className="w-3 h-3" /> PRIORITY</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="p-1.5 inline-block bg-gray-50 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all text-gray-400">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {priorityCases.length === 0 && (
                                            <div className="p-12 border-t border-dashed border-gray-200 text-center text-gray-400 font-bold italic w-full">
                                                No Priority Bypass items currently active.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Hibernation Detail View */}
                            {!isInvestigator && managerView === 'HIBERNATED' && (
                                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Task ID & Target Entities</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Risk Score</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 italic font-medium">
                                                {hibernatedEntities.map(hc => (
                                                    <tr key={hc.id} className="hover:bg-green-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-green-500 cursor-pointer" onClick={() => { setSelectedCase(hc); setView('ANALYSIS'); }}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors mt-0.5">
                                                                    <Clock className="w-5 h-5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-black text-gray-900 flex items-center gap-2 group-hover:text-green-600 transition-colors">
                                                                        {hc.subjects[0]?.name}
                                                                        {hc.subjects.length > 1 && (
                                                                            <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[8px] border border-green-100 uppercase">+{hc.subjects.length - 1} Entities</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{hc.id}</div>
                                                                        {hc.reports && hc.reports.length > 0 && (
                                                                            <>
                                                                                <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>
                                                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                                                    {hc.reports.length} report{hc.reports.length > 1 ? 's' : ''}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                                        {Array.from(new Set(hc.subjects.flatMap(s => s.crimeTypologies || []))).length > 0 ? (
                                                                            Array.from(new Set(hc.subjects.flatMap(s => s.crimeTypologies || []))).map((typ, idx) => (
                                                                                <div key={idx} className="text-[9px] font-black flex items-center gap-1 text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                                                                    <AlertTriangle className="w-2.5 h-2.5" />
                                                                                    {typ}
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                                                Hibernated
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="font-black px-2.5 py-1 rounded shadow-sm text-xs border text-green-600 bg-green-50 border-green-100">
                                                                {Math.max(...hc.subjects.map(s => s.riskProfile.totalScore))}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="p-1.5 inline-block bg-gray-50 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-all text-gray-400">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {hibernatedEntities.length === 0 && (
                                            <div className="p-12 border-t border-dashed border-gray-200 text-center text-gray-400 font-bold italic w-full">
                                                No entities currently in hibernation.
                                            </div>
                                        )}
                                    </div>
                            )}

                            {/* Investigator-Only Priority Sidebar (Duplicate functionality for investigator vertical scroll) */}
                            {isInvestigator && priorityCases.length > 0 && (
                                <div className="mt-12 space-y-6">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-3"><ShieldAlert className="w-6 h-6 text-red-600" /> Priority Bypass List</h3>
                                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Case ID</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Investigation Title</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Analyst</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Lifecycle</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 italic font-medium">
                                                {priorityCases.map(pc => (
                                                    <tr key={pc.id} className="hover:bg-red-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-red-600 cursor-pointer" onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors mt-0.5">
                                                                    <ShieldAlert className="w-5 h-5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-black text-gray-900 flex items-center gap-2 group-hover:text-red-600 transition-colors">
                                                                        {pc.subjects[0]?.name}
                                                                        {pc.subjects.length > 1 && (
                                                                            <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] border border-red-100">+{pc.subjects.length - 1} Entities</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{pc.id}</div>
                                                                        {pc.reports && pc.reports.length > 0 && (
                                                                            <>
                                                                                <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>
                                                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                                                    {pc.reports.length} report{pc.reports.length > 1 ? 's' : ''}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                                        {Array.from(new Set(pc.subjects.flatMap(s => s.crimeTypologies || []))).length > 0 ? (
                                                                            Array.from(new Set(pc.subjects.flatMap(s => s.crimeTypologies || []))).map((typ, idx) => (
                                                                                <div key={idx} className="text-[9px] font-black flex items-center gap-1 text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                                                                    <AlertTriangle className="w-2.5 h-2.5" />
                                                                                    {typ}
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                                                Priority Bypass
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase">
                                                                    {(pc.analyst || 'UN')[0]}
                                                                </div>
                                                                <span className="text-xs font-bold text-gray-700">{pc.analyst || 'Unassigned'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="font-black px-2.5 py-1 rounded shadow-sm text-xs border text-red-600 bg-red-50 border-red-100">
                                                                {Math.max(...pc.subjects.map(s => s.riskProfile.totalScore))}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex justify-center">
                                                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] border border-red-100 flex items-center gap-1.5 font-bold uppercase w-fit"><ShieldAlert className="w-3 h-3" /> PRIORITY</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="p-1.5 inline-block bg-gray-50 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all text-gray-400">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {priorityCases.length === 0 && (
                                            <div className="p-12 border-t border-dashed border-gray-200 text-center text-gray-400 font-bold italic w-full">
                                                No Priority Bypass items currently active.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
                                    <div className="font-bold text-sm text-gray-900 tracking-tight flex items-center gap-2">
                                        {ic.subjects[0]?.name}
                                        {ic.subjects.length > 1 && (
                                            <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[8px] border border-blue-100">+{ic.subjects.length - 1} more</span>
                                        )}
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ic.id}</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleConfirmLink} disabled={!targetCaseId} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-lg">Confirm Merge & Link</button>
                    </div>
                </div>
            )}

            {/* Pending Approvals Detail View */}
            {!isInvestigator && managerView === 'APPROVALS' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 mb-2"><CheckCircle className="w-6 h-6 text-emerald-600" /> Pending Managerial Review</h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting Submissions</h3>
                            <div className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg border border-amber-200 uppercase tracking-[0.2em]">
                                {pendingApprovals.length} PENDING
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100 italic font-medium">
                            {pendingApprovals.map(pc => {
                                const isLinkClose = pc.pendingModification?.details?.targetCase;
                                const isDeletion = pc.status === 'PENDING_DELETION';

                                return (
                                    <div key={pc.id} className="p-6 transition-colors hover:bg-emerald-50/10 flex flex-col gap-4 border-l-4 border-l-transparent hover:border-l-emerald-600">
                                        <div className="flex justify-between items-start">
                                            <div className="cursor-pointer" onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-black text-gray-900 flex items-center gap-2 hover:text-emerald-600 transition-colors">
                                                            {(pc.subjects || [])[0]?.name || 'Unknown Entity'}
                                                            {(pc.subjects || []).length > 1 && (
                                                                <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] border border-emerald-100">+{(pc.subjects || []).length - 1} Entities</span>
                                                            )}
                                                            {isDeletion && (
                                                                <span className="text-[8px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-200 uppercase font-black tracking-widest">Deletion</span>
                                                            )}
                                                            {isLinkClose ? (
                                                                <span className="text-[8px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200 uppercase font-black tracking-widest">Merge</span>
                                                            ) : (pc.pendingModification && !isDeletion && (
                                                                <span className={`text-[8px] px-2 py-0.5 rounded border uppercase font-black tracking-widest ${pc.pendingModification.details.newValue === 'DISSEMINATED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                                    {pc.pendingModification.details.newValue === 'DISSEMINATED' ? 'Dissemination' : 'Closure'}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{pc.id}</div>
                                                            {pc.reports && pc.reports.length > 0 && (
                                                                <>
                                                                    <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>
                                                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                                        {pc.reports.length} report{pc.reports.length > 1 ? 's' : ''}
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>
                                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                                {isLinkClose ? `By: ${pc.pendingModification?.requestedBy}` : `Analyst: ${pc.analyst || 'Unassigned'}`}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                            {Array.from(new Set((pc.subjects || []).flatMap(s => s.crimeTypologies || []))).length > 0 ? (
                                                                Array.from(new Set((pc.subjects || []).flatMap(s => s.crimeTypologies || []))).map((typ, idx) => (
                                                                    <div key={idx} className="text-[9px] font-black flex items-center gap-1 text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                                        <AlertTriangle className="w-2.5 h-2.5" />
                                                                        {typ}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                                    Pending Review
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h4 className="text-3xl font-black text-red-600 tracking-tighter">
                                                    {(pc.subjects || []).length > 0 
                                                        ? Math.max(...(pc.subjects || []).map(s => s?.riskProfile?.totalScore || 0)) 
                                                        : 0}
                                                </h4>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Score</div>
                                            </div>
                                        </div>
                                        
                                        <div className={`p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 ${isLinkClose ? 'bg-amber-50 border border-amber-100 shadow-sm' : 'bg-gray-50'}`}>
                                            <div className="text-xs text-gray-500 font-bold flex items-center gap-3">
                                                {isLinkClose ? (
                                                    <>
                                                        <LinkIcon className="w-5 h-5 text-amber-500 shrink-0" />
                                                        <span>
                                                            <strong>{pc.pendingModification?.requestedBy}</strong> is requesting to merge this lead into master investigation 
                                                            <code className="mx-1 px-1.5 py-0.5 bg-white border border-amber-200 rounded text-amber-700 font-black">{pc.pendingModification?.details?.targetCase}</code>.
                                                        </span>
                                                    </>
                                                ) : pc.pendingModification?.details?.newValue === 'DISSEMINATED' ? (
                                                    <>
                                                        <ArrowRight className="w-5 h-5 text-emerald-500 shrink-0" />
                                                        <span>
                                                            <strong>{pc.pendingModification?.requestedBy}</strong> is requesting to disseminate findings to <strong>{pc.pendingModification?.details?.agency}</strong>. Please review the operational rationale.
                                                        </span>
                                                    </>
                                                ) : (
                                                    "Please verify the Analyst's mitigation overrides and evidence rationale before signing off on the Case creation pipeline."
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-blue-600 hover:text-blue-800 shadow-sm transition-all flex items-center gap-2 shrink-0 uppercase tracking-widest"
                                            >
                                                Review Assessment <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                                            {activeRejectId === pc.id ? (
                                                <div className="flex flex-1 items-center gap-3 animate-in slide-in-from-left-2 duration-300">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Enter rejection reason to push back to triage..." 
                                                        className="flex-1 px-4 py-3 text-xs font-bold border border-gray-200 rounded-xl shadow-inner focus:ring-4 focus:ring-red-50 focus:border-red-200 outline-none"
                                                        value={rejectionNotes[pc.id] || ''}
                                                        onChange={(e) => setRejectionNotes({ ...rejectionNotes, [pc.id]: e.target.value })}
                                                    />
                                                    <button onClick={() => setActiveRejectId(null)} className="px-4 py-2 text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-gray-600">Cancel</button>
                                                    <button 
                                                        onClick={() => handleReject(pc.id)}
                                                        className="px-6 py-3 bg-red-600 text-white text-[10px] uppercase tracking-widest font-black rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
                                                    >
                                                        Confirm Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            if (pc.pendingModification || pc.status === 'PENDING_DELETION') {
                                                                processModification(pc.id, false);
                                                            } else {
                                                                setActiveRejectId(pc.id);
                                                            }
                                                        }} 
                                                        className="px-6 py-3 bg-white border border-red-100 text-red-600 hover:bg-red-50 text-[10px] uppercase tracking-[0.2em] font-black rounded-xl shadow-sm transition-all flex items-center gap-2"
                                                    >
                                                        <XCircle className="w-4 h-4" /> REJECT
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (pc.pendingModification || pc.status === 'PENDING_DELETION') {
                                                                processModification(pc.id, true);
                                                            } else {
                                                                handleSignOffAndEscalate(pc.id, 'APPROVE');
                                                            }
                                                        }} 
                                                        className={`${(pc.pendingModification || pc.status === 'PENDING_DELETION') ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'} px-6 py-3 text-white text-[10px] uppercase tracking-[0.2em] font-black rounded-xl shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5`}
                                                    >
                                                        <UserCheck className="w-4 h-4" /> 
                                                        {isDeletion ? 'CONFIRM DELETION' : isLinkClose ? 'AUTHORIZE MERGE' : pc.pendingModification?.details?.newValue === 'DISSEMINATED' ? 'AUTHORIZE DISSEMINATION' : pc.pendingModification ? 'APPROVE CLOSURE' : 'SIGN-OFF & ESCALATE'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {pendingApprovals.length === 0 && (
                                <div className="p-20 text-center opacity-50 italic">
                                    <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h4 className="text-gray-500 font-black uppercase tracking-widest text-[10px]">No Escalations Pending Review</h4>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* Scanning Simulation Modal */}
            {isScanning && (
                <div className="fixed inset-0 z-[200] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 relative overflow-hidden">
                        {/* Animated Grid Background */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        <div className="relative z-10 text-center">
                            {scanStep < 3 ? (
                                <>
                                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 relative">
                                        {scanStep === 0 && <Network className="w-10 h-10 text-blue-600 animate-pulse" />}
                                        {scanStep === 1 && <Database className="w-10 h-10 text-blue-600 animate-bounce" />}
                                        {scanStep === 2 && <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />}

                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                                        {scanStep === 0 && "Connecting to Quantexa Platform"}
                                        {scanStep === 1 && "Retrieving Tasks"}
                                        {scanStep === 2 && "Automated Triaging"}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-400 mb-10">Please wait while we synchronize ingestion pipelines...</p>

                                    <div className="space-y-4">
                                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-75 ease-linear shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                                style={{ width: `${scanProgress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">System Sync in Progress</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{Math.round(scanProgress)}%</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Pulse-Sync Complete</h3>
                                    <p className="text-sm font-medium text-gray-400 mb-8">Successfully synchronized with Q Platform ingestion pipeline</p>

                                    {scanResults.tasks > 0 ? (
                                        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">New Items Discovered</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white rounded-xl p-3 border border-gray-100">
                                                    <div className="text-2xl font-black text-gray-900">{scanResults.tasks}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Tasks</div>
                                                </div>
                                                <div className="bg-white rounded-xl p-3 border border-gray-100">
                                                    <div className="text-2xl font-black text-blue-600">{scanResults.strs}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New STRs</div>
                                                </div>
                                                <div className="bg-white rounded-xl p-3 border border-gray-100">
                                                    <div className="text-2xl font-black text-teal-600">{scanResults.cmrs}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New CMRs</div>
                                                </div>
                                                <div className="bg-white rounded-xl p-3 border border-gray-100">
                                                    <div className="text-2xl font-black text-purple-600">{scanResults.ctrs}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New CTRs</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center">
                                            <p className="text-sm font-bold text-gray-400">No new tasks found in this scan cycle</p>
                                            <p className="text-xs text-gray-300 mt-1">All upstream data is already synchronized</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleDismissScan}
                                        className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        Acknowledge & Close
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Kafka Sync Simulation Modal */}
            {isSyncingKafka && (
                <div className="fixed inset-0 z-[300] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden border border-gray-100">
                        {/* Animated Mesh Gradient Background (Subtle) */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
                        </div>

                        <div className="relative z-10 text-center">
                            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 transition-all duration-500 ${isSyncComplete ? 'bg-red-50 scale-110' : 'bg-blue-50'}`}>
                                {!isSyncComplete ? (
                                    <Network className="w-12 h-12 text-blue-600 animate-pulse" />
                                ) : (
                                    <CheckCircle className="w-14 h-14 text-red-600" />
                                )}
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                                {!isSyncComplete ? "Sending Kafka Topic to Quantexa Platform" : "Case Doc updated Successfully"}
                            </h3>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10">
                                {!isSyncComplete ? "Broadcasting Decision decision.event.triage" : "Ingestion status: COMPLETE (RED-TICK)"}
                            </p>

                            <div className="space-y-4">
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-75 ease-linear ${isSyncComplete ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}
                                        style={{ width: `${kafkaSyncProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isSyncComplete ? 'text-red-600' : 'text-blue-600'}`}>
                                        {isSyncComplete ? 'BROADCAST COMPLETE' : 'KAFKA TRANSMISSION'}
                                    </span>
                                    <span className="text-[9px] font-black text-gray-400">{Math.round(kafkaSyncProgress)}%</span>
                                </div>
                            </div>

                            {isSyncComplete && (
                                <button 
                                    onClick={handleCloseSyncModal}
                                    className="w-full mt-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 animate-in fade-in slide-in-from-bottom-2 duration-500"
                                >
                                    Return to Queue
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TriageQueue;
