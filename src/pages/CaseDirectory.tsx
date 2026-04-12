import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { CaseStatus } from '../types';
import ManualCaseModal from '../components/ManualCaseModal';
import { FolderGit2, ArrowRight, PlusCircle, ShieldAlert, ArrowUpDown, ArrowUp, ArrowDown, Search, UserMinus, UserCheck, X } from 'lucide-react';
import { MOCK_INVESTIGATORS } from '../constants';

const CaseDirectory: React.FC = () => {
    const { allCases, setSelectedCase, setView } = useApp();
    const { user } = useAuth();
    const [showCreateModal, setShowCreateModal] = React.useState(false);

    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'desc' });
    const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [reassigningId, setReassigningId] = React.useState<string | null>(null);
    const { reassignCase } = useApp();

    // The Master Directory filters out Triage/Dismissed and enforces privacy for STAGING drafts
    const registry = React.useMemo(() => {
        let filtered = allCases.filter(c => {
            // Exclude system drops
            if (['TRIAGE', 'DISMISSED', 'HIBERNATED'].includes(c.status)) return false;
            
            // Privacy Guard: STAGING cases are ONLY visible to their owner
            if (c.status === 'STAGING') {
                if (c.analyst !== user?.name) return false;
            }

            // Specialization Guard: Investigators only see items matching their typology or uncategorized ones
            if (user?.role === 'INVESTIGATOR' && user.typology) {
                const typs = c.subjects.flatMap(s => s.crimeTypologies || []);
                if (typs.length > 0 && !typs.includes(user.typology)) return false;
            }
            
            return true;
        });

        // Apply Status Filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(c => c.status === statusFilter);
        }

        // Apply Search Filter (ID or Title)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c => 
                c.id.toLowerCase().includes(query) || 
                c.title.toLowerCase().includes(query) ||
                c.analyst?.toLowerCase().includes(query) ||
                c.subjects.some(s => s.name.toLowerCase().includes(query))
            );
        }

        // Apply Sorting
        if (sortConfig) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                switch (sortConfig.key) {
                    case 'id':
                        aValue = a.id;
                        bValue = b.id;
                        break;
                    case 'title':
                        aValue = a.title;
                        bValue = b.title;
                        break;
                    case 'analyst':
                        aValue = a.analyst || '';
                        bValue = b.analyst || '';
                        break;
                    case 'score':
                        aValue = Math.max(...a.subjects.map(s => s.riskProfile.totalScore));
                        bValue = Math.max(...b.subjects.map(s => s.riskProfile.totalScore));
                        break;
                    case 'status':
                        aValue = a.status;
                        bValue = b.status;
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [allCases, user, sortConfig, statusFilter, searchQuery]);

    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const getStatusBadge = (status: CaseStatus) => {
        switch(status) {
            case 'STAGING':
                return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded border border-amber-200 uppercase tracking-widest flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> Draft</span>;
            case 'PENDING_APPROVAL':
                return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded border border-blue-200 uppercase tracking-widest">Awaiting Review</span>;
            case 'ANALYSIS':
                return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded border border-emerald-200 uppercase tracking-widest">Ongoing</span>;
            case 'PRIORITY':
                return <span className="px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-black rounded border border-red-200 uppercase tracking-widest animate-pulse">Critical</span>;
            case 'DISSEMINATED':
                return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded border border-purple-200 uppercase tracking-widest">Disseminated</span>;
            case 'CLOSED':
                return <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded border border-gray-300 uppercase tracking-widest">Closed</span>;
            default:
                return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded uppercase tracking-widest">{status}</span>;
        }
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig?.key !== column) return <ArrowUpDown className="w-3 h-3 opacity-30 ml-2" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-600 ml-2" /> : <ArrowDown className="w-3 h-3 text-blue-600 ml-2" />;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <FolderGit2 className="w-6 h-6 text-blue-600" /> Case Listing
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Centralized operational oversight of all active and historical investigative assets</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Initiate Case
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by ID, Title, Subject, or Analyst..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded flex items-center gap-1.5 hover:bg-gray-50 outline-none"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="STAGING">Drafts</option>
                            <option value="PENDING_APPROVAL">Awaiting Review</option>
                            <option value="ANALYSIS">Ongoing</option>
                            <option value="PRIORITY">Critical/Priority</option>
                            <option value="DISSEMINATED">Disseminated</option>
                            <option value="CLOSED">Closed/Resolved</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('id')}>
                                    <div className="flex items-center">Case ID <SortIcon column="id" /></div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('title')}>
                                    <div className="flex items-center">Investigation Title <SortIcon column="title" /></div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('analyst')}>
                                    <div className="flex items-center">Assigned Analyst <SortIcon column="analyst" /></div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('score')}>
                                    <div className="flex items-center justify-center">Score <SortIcon column="score" /></div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('status')}>
                                    <div className="flex items-center justify-center">Lifecycle <SortIcon column="status" /></div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic font-medium">
                            {registry.map(c => (
                                <tr 
                                    key={c.id} 
                                    onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                                    className="hover:bg-blue-50/30 cursor-pointer transition-all group border-l-4 border-l-transparent hover:border-l-blue-600"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-gray-900 tracking-tight">{c.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                                {c.title}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                                {c.subjects.map(s => (
                                                    <span key={s.id} className="text-[8px] font-black text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-1.5 py-0.5 rounded shadow-sm shadow-blue-500/20 uppercase border border-blue-400/30">
                                                        {s.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase">
                                                {(c.analyst || 'UN')[0]}
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{c.analyst || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`font-black px-2.5 py-1 rounded shadow-sm text-xs border ${
                                            Math.max(...c.subjects.map(s => s.riskProfile.totalScore)) > 100 
                                              ? 'text-red-600 bg-red-50 border-red-100' 
                                              : 'text-amber-600 bg-amber-50 border-amber-100'
                                        }`}>
                                            {Math.max(...c.subjects.map(s => s.riskProfile.totalScore))}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            {getStatusBadge(c.status)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user?.role === 'MANAGER' && (
                                                <div className="relative">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setReassigningId(reassigningId === c.id ? null : c.id); }}
                                                        className={`p-1.5 rounded-lg transition-all ${reassigningId === c.id ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-600'}`}
                                                        title="Re-assign Analyst"
                                                    >
                                                        <UserMinus className="w-4 h-4" />
                                                    </button>
                                                    
                                                    {reassigningId === c.id && (
                                                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200" onClick={e => e.stopPropagation()}>
                                                            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Re-assignment Target</span>
                                                                <button onClick={() => setReassigningId(null)} className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                            <div className="p-2 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                                                                {MOCK_INVESTIGATORS.map(inv => (
                                                                    <button
                                                                        key={inv.name}
                                                                        onClick={() => { reassignCase(c.id, inv.name); setReassigningId(null); }}
                                                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex flex-col group relative ${c.analyst === inv.name ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <span className="font-black tracking-tight">{inv.name}</span>
                                                                            {c.analyst === inv.name ? <UserCheck className="w-4 h-4" /> : <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                                                                        </div>
                                                                        <div className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${c.analyst === inv.name ? 'text-blue-200' : 'text-gray-400 group-hover:text-blue-400'}`}>
                                                                            {inv.typology} Specialist
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="p-3 bg-blue-50/30 border-t border-gray-50">
                                                                <p className="text-[9px] text-blue-800/60 font-medium italic text-center">Case history and audit trail will be preserved.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <button 
                                                onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                                                className="p-1.5 bg-gray-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-gray-400"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {registry.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <Search className="w-12 h-12 text-gray-300 mx-auto" />
                            <div className="text-gray-500 font-bold">No cases exist within the active directory framework.</div>
                        </div>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <ManualCaseModal 
                    onClose={() => setShowCreateModal(false)} 
                    onSuccess={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
};

export default CaseDirectory;
