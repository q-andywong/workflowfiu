import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Inbox, Filter, ShieldAlert, ArrowRight, UserPlus, FileSearch, AlertTriangle, CheckCircle, Clock, Trash2, X, Link as LinkIcon, ChevronRight } from 'lucide-react';
import BulkActionToolbar from '../components/BulkActionToolbar';

const TriageQueue: React.FC = () => {
    const { cases, allCases, stats, setView, setSelectedCase, bulkUpdateCases, linkEntitiesToCase } = useApp();
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
                    <div onClick={() => setManagerView('PRIORITY')} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-200 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl w-fit mb-6"><ShieldAlert className="w-6 h-6" /></div>
                            <div className="text-4xl font-black text-gray-900">{priorityCases.length}</div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Priority Bypass Hits</div>
                            <p className="text-xs text-gray-400 mt-4 font-medium italic">Critical alerts that bypassed standard triage protocols.</p>
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-red-600 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
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
                                Access List <ChevronRight className="w-4 h-4" />
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
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access</th>
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
                                                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                        <div className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                                            Low Risk / Hibernated
                                                                        </div>
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
        </div>
    );
};

export default TriageQueue;
