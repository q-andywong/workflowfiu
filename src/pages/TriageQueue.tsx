import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Inbox, Filter, ShieldAlert, ArrowRight, UserPlus, FileSearch, AlertTriangle, CheckCircle, Clock, Trash2, X, Link as LinkIcon, ChevronRight, RefreshCw, Database, Network } from 'lucide-react';
import BulkActionToolbar from '../components/BulkActionToolbar';

const TriageQueue: React.FC = () => {
    const { cases, allCases, stats, setView, setSelectedCase, bulkUpdateCases, linkEntitiesToCase, assessEntity, approveCase } = useApp();
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
    const pendingApprovals = filterBySpecialization(allCases.filter(c => c.status === 'PENDING_APPROVAL'));
    const hibernationCount = hibernatedEntities.length;

    // View States
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLinking, setIsLinking] = useState(false);
    const [targetCaseId, setTargetCaseId] = useState('');
    const [managerView, setManagerView] = useState<'SUMMARY' | 'TRIAGE' | 'PRIORITY' | 'HIBERNATED' | 'APPROVALS'>('SUMMARY');

    // Scanning Simulation State
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0); // 0: Connect, 1: Retrieve, 2: Triage
    const [scanProgress, setScanProgress] = useState(0);

    const handleStartScan = () => {
        setIsScanning(true);
        setScanStep(0);
        setScanProgress(0);

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
                    // Phase 2: Retrieving (1s)
                    setScanStep(1);
                    setScanProgress(0);
                    let timer2 = 0;
                    const phase2Duration = 1000;
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
                                        setTimeout(() => {
                                            setIsScanning(false);
                                            setScanStep(0);
                                            setScanProgress(0);
                                        }, 500);
                                    }
                                }, interval);
                            }, 200);
                        }
                    }, interval);
                }, 200);
            }
        }, interval);
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Triage Bucket */}
                    <div onClick={() => setManagerView('TRIAGE')} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4"><Inbox className="w-5 h-5" /></div>
                            <div className="text-3xl font-black text-gray-900">{triageEntities.length}</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Pending Triage</div>
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-blue-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Expand Details <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    {/* Pending Approvals Bucket */}
                    <div onClick={() => setManagerView('APPROVALS')} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4"><CheckCircle className="w-5 h-5" /></div>
                            <div className="text-3xl font-black text-gray-900">{pendingApprovals.length}</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Awaiting Sign-off</div>
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-emerald-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Review Approvals <ChevronRight className="w-3 h-3" />
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
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-red-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
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
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-green-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Access List <ChevronRight className="w-3 h-3" />
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
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                                                    <Inbox className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-black text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                                                        {c.subjects[0]?.name}
                                                                        {c.subjects.length > 1 && (
                                                                            <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[8px] border border-blue-100">+{c.subjects.length - 1} Entities</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.id}</div>
                                                                        
                                                                        {c.reports && c.reports.length > 0 && (
                                                                            <>
                                                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/5 border border-blue-500/10 rounded-lg shadow-sm">
                                                                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{c.reports[0].type}: {c.reports[0].id}</span>
                                                                                    {c.reports.length > 1 && (
                                                                                        <span className="text-[8px] font-black text-blue-400">+{c.reports.length - 1} more</span>
                                                                                    )}
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {Array.from(new Set(c.subjects.flatMap(s => s.crimeTypologies || []))).length > 0 ? (
                                                                            Array.from(new Set(c.subjects.flatMap(s => s.crimeTypologies || []))).map((typ, idx) => (
                                                                                <React.Fragment key={idx}>
                                                                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                                    <div className="text-[9px] font-black w-fit flex items-center gap-1.5 text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shadow-sm shrink-0">
                                                                                        <AlertTriangle className="w-2.5 h-2.5" />
                                                                                        {typ}
                                                                                    </div>
                                                                                </React.Fragment>
                                                                            ))
                                                                        ) : (
                                                                            <React.Fragment>
                                                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                                <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                                                                                    General Triage
                                                                                </div>
                                                                            </React.Fragment>
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
                                                            <span className="text-sm font-black text-gray-900 tracking-tight">{pc.id}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <div className="text-sm font-black text-gray-900 truncate group-hover:text-red-600 transition-colors flex items-center gap-2">
                                                                    {pc.title}
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                                                    {pc.reports && pc.reports.length > 0 && (
                                                                        <span className="text-[8px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 uppercase tracking-tighter">
                                                                            Source: {pc.reports[0].id}
                                                                        </span>
                                                                    )}
                                                                    {pc.subjects.map(s => (
                                                                        <span key={s.id} className="text-[8px] font-black text-white bg-gradient-to-r from-red-500 to-orange-500 px-1.5 py-0.5 rounded shadow-sm shadow-red-500/20 uppercase border border-red-400/30">
                                                                            {s.name}
                                                                        </span>
                                                                    ))}
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
                                                            <span className={`font-black px-2.5 py-1 rounded shadow-sm text-xs border ${
                                                                Math.max(...pc.subjects.map(s => s.riskProfile.totalScore)) > 100 
                                                                  ? 'text-red-600 bg-red-50 border-red-100' 
                                                                  : 'text-amber-600 bg-amber-50 border-amber-100'
                                                            }`}>
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
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                                                    <Clock className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-black text-gray-900 flex items-center gap-2 group-hover:text-green-600 transition-colors">
                                                                        {hc.subjects[0]?.name}
                                                                        {hc.subjects.length > 1 && (
                                                                            <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[8px] border border-green-100 uppercase">+ {hc.subjects.length - 1} Entities</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{hc.id}</div>
                                                                        {hc.reports && hc.reports.length > 0 && (
                                                                            <>
                                                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                                <div className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                                                    {hc.reports[0].type}: {hc.reports[0].id}
                                                                                </div>
                                                                            </>
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
                                                            <span className="text-sm font-black text-gray-900 tracking-tight">{pc.id}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <div className="text-sm font-black text-gray-900 truncate group-hover:text-red-600 transition-colors flex items-center gap-2">
                                                                    {pc.title}
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                                                    {pc.reports && pc.reports.length > 0 && (
                                                                        <span className="text-[8px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 uppercase tracking-tighter">
                                                                            Source: {pc.reports[0].id}
                                                                        </span>
                                                                    )}
                                                                    {pc.subjects.map(s => (
                                                                        <span key={s.id} className="text-[8px] font-black text-white bg-gradient-to-r from-red-500 to-orange-500 px-1.5 py-0.5 rounded shadow-sm shadow-red-500/20 uppercase border border-red-400/30">
                                                                            {s.name}
                                                                        </span>
                                                                    ))}
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
                                                            <span className={`font-black px-2.5 py-1 rounded shadow-sm text-xs border ${
                                                                Math.max(...pc.subjects.map(s => s.riskProfile.totalScore)) > 100 
                                                                  ? 'text-red-600 bg-red-50 border-red-100' 
                                                                  : 'text-amber-600 bg-amber-50 border-amber-100'
                                                            }`}>
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
                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Case ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Investigation Title</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Analyst Rationale</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Sign-off Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 italic font-medium">
                                {pendingApprovals.map(pc => (
                                    <tr key={pc.id} className="hover:bg-emerald-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-emerald-600">
                                        <td className="px-6 py-4" onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}>
                                            <span className="text-sm font-black text-gray-900 tracking-tight">{pc.id}</span>
                                        </td>
                                        <td className="px-6 py-4" onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}>
                                            <div>
                                                <div className="text-sm font-black text-gray-900 group-hover:text-emerald-600 transition-colors uppercase">
                                                    {pc.title}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5 font-black text-[9px] text-gray-400 uppercase tracking-widest">
                                                    Owner: <span className="text-gray-600">{pc.analyst || 'Unassigned'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4" onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}>
                                            <div className="text-[10px] font-bold text-gray-500 max-w-md line-clamp-2 italic">Awaiting final verification of evidence registry and STR bonding.</div>
                                        </td>
                                        <td className="px-6 py-4 text-center" onClick={() => { setSelectedCase(pc); setView('ANALYSIS'); }}>
                                            <span className="font-black px-2.5 py-1 rounded shadow-sm text-xs border text-emerald-600 bg-emerald-50 border-emerald-100">
                                                {pc.subjects.reduce((max, s) => Math.max(max, s.riskProfile.totalScore), 0)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleSignOffAndEscalate(pc.id, 'APPROVE'); }}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-500/10 flex items-center gap-2 ml-auto transition-all hover:-translate-y-0.5"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Sign-off & Escalate
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {pendingApprovals.length === 0 && (
                            <div className="p-12 text-center text-gray-400 font-bold italic w-full">
                                No cases awaiting sign-off.
                            </div>
                        )}
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
