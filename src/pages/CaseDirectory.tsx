import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { CaseStatus } from '../types';
import ManualCaseModal from '../components/ManualCaseModal';
import { FolderGit2, ArrowRight, PlusCircle, ShieldAlert } from 'lucide-react';

const CaseDirectory: React.FC = () => {
    const { cases, setSelectedCase, setView } = useApp();
    const { user } = useAuth();
    const [showCreateModal, setShowCreateModal] = React.useState(false);

    // The Master Directory filters out Triage/Dismissed and enforces privacy for STAGING drafts
    const registry = cases.filter(c => {
        // Exclude system drops
        if (['TRIAGE', 'DISMISSED', 'HIBERNATED'].includes(c.status)) return false;
        
        // Privacy Guard: STAGING cases are ONLY visible to their owner
        if (c.status === 'STAGING') {
            return c.analyst === user?.name;
        }
        
        return true;
    });

    const getStatusBadge = (status: CaseStatus) => {
        switch(status) {
            case 'STAGING':
                return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded border border-amber-200 uppercase tracking-widest flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> Draft</span>;
            case 'PENDING_APPROVAL':
                return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200">AWAITING REVIEW</span>;
            case 'ANALYSIS':
                return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200">ONGOING</span>;
            case 'PRIORITY':
                return <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded border border-red-200">CRITICAL</span>;
            case 'DISSEMINATED':
                return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded border border-purple-200">DISSEMINATED</span>;
            case 'CLOSED':
                return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded border border-gray-300">CLOSED</span>;
            default:
                return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Master Case Directory</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-blue-600" />
                        Centralized registry of all instantiated intelligence cases across the entire operational lifecycle
                    </p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create New Case
                </button>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 p-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <div className="col-span-2">Case ID</div>
                    <div className="col-span-3">Investigation Title</div>
                    <div className="col-span-3">Assigned Analyst</div>
                    <div className="col-span-1 text-center">Score</div>
                    <div className="col-span-2 text-center">Lifecycle Status</div>
                    <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-gray-100">
                    {registry.map(c => (
                        <div 
                            key={c.id} 
                            onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                            className="grid grid-cols-12 p-4 items-center hover:bg-blue-50/50 cursor-pointer transition-colors group"
                        >
                            <div className="col-span-2 font-bold text-gray-900 text-sm tracking-wider">{c.id}</div>
                            <div className="col-span-3">
                                <div className="text-sm font-bold text-gray-900 truncate">{c.title}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{c.subject.name}</div>
                            </div>
                            <div className="col-span-3 text-sm text-gray-500">{c.analyst || 'Unassigned'}</div>
                            <div className="col-span-1 text-center text-sm flex justify-center">
                                <span className="font-black text-red-600 bg-red-50 px-2 py-0.5 rounded shadow-sm">
                                    {c.subject.riskProfile.totalScore}
                                </span>
                            </div>
                            <div className="col-span-2 flex justify-center">
                                {getStatusBadge(c.status)}
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <button className="text-gray-400 group-hover:text-blue-600 transition-colors p-1">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {registry.length === 0 && (
                        <div className="p-16 text-center text-gray-500 font-bold">
                            No cases exist within the active directory framework.
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
