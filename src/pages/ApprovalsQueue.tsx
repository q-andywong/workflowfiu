import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ShieldCheck, ArrowRight, UserCheck, XCircle, Link as LinkIcon } from 'lucide-react';

const ApprovalsQueue: React.FC = () => {
    const { cases, approveCase, rejectCase, setSelectedCase, setView, processModification } = useApp();
    const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});
    const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

    const pendingApprovals = cases.filter(c => 
        c.status === 'PENDING_APPROVAL' || 
        c.status === 'PENDING_DELETION' || 
        c.pendingModification
    );

    const handleReject = (id: string) => {
        const note = rejectionNotes[id];
        if (!note || note.length < 5) return;
        rejectCase(id, note);
        setActiveRejectId(null);
    };

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manager Approvals</h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Review escalated intelligence entities and authorize formal Case status
                </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Awaiting Submissions</h3>
                    <div className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 uppercase tracking-widest">
                        {pendingApprovals.length} PENDING
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {pendingApprovals.map(c => {
                        const isLinkClose = c.pendingModification?.details?.targetCase;
                        const isDeletion = c.status === 'PENDING_DELETION';

                        return (
                            <div key={c.id} className="p-6 transition-colors hover:bg-gray-50 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-wrap">
                                            {c.title}
                                            {isDeletion && (
                                                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-200 shrink-0 uppercase font-black">Deletion Request</span>
                                            )}
                                            {isLinkClose ? (
                                                <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200 shrink-0 uppercase font-black">Handshake Merge</span>
                                            ) : (c.pendingModification && !isDeletion && (
                                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200 shrink-0 uppercase font-black">Closure Approval</span>
                                            ))}
                                        </h4>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-[8px]">Target Entity</span>
                                                <span className="text-sm font-semibold text-gray-700">{c.subject.name}</span>
                                            </div>

                                            {isLinkClose ? (
                                                <>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">Requestor</span>
                                                        <span className="text-sm font-black text-gray-900">{c.pendingModification?.requestedBy}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Original Owner</span>
                                                        <span className="text-sm font-semibold text-gray-700">{c.pendingModification?.details.originalOwner}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Submitting Analyst</span>
                                                    <span className="text-sm font-semibold text-gray-700">{c.analyst || 'Unassigned'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-3xl font-black text-red-600 tracking-tighter">{c.subject.riskProfile.totalScore}</h4>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Risk Score</div>
                                    </div>
                                </div>
                                
                                <div className={`p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 ${isLinkClose ? 'bg-amber-50 border border-amber-100' : 'bg-gray-100'}`}>
                                    <div className="text-sm text-gray-600 font-medium flex items-center gap-3">
                                        {isLinkClose ? (
                                            <>
                                                <LinkIcon className="w-5 h-5 text-amber-500 shrink-0" />
                                                <span>
                                                    <strong>{c.pendingModification?.requestedBy}</strong> is requesting to merge this lead into master investigation 
                                                    <code className="mx-1 px-1.5 py-0.5 bg-white border border-amber-200 rounded text-amber-700 font-bold">{c.pendingModification?.details.targetCase}</code>.
                                                </span>
                                            </>
                                        ) : (
                                            "Please verify the Analyst's mitigation overrides and evidence rationale before signing off on the Case creation pipeline."
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-blue-600 hover:text-blue-800 shadow-sm transition-colors flex items-center gap-2 shrink-0"
                                    >
                                        Review Assessment <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                                    {activeRejectId === c.id ? (
                                        <div className="flex flex-1 items-center gap-3">
                                            <input 
                                                type="text" 
                                                placeholder="Enter rejection reason to push back to triage..." 
                                                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={rejectionNotes[c.id] || ''}
                                                onChange={(e) => setRejectionNotes({ ...rejectionNotes, [c.id]: e.target.value })}
                                            />
                                            <button onClick={() => setActiveRejectId(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Cancel</button>
                                            <button 
                                                onClick={() => handleReject(c.id)}
                                                className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-red-700"
                                            >
                                                Confirm Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    if (c.pendingModification || c.status === 'PENDING_DELETION') {
                                                        processModification(c.id, false);
                                                    } else {
                                                        setActiveRejectId(c.id);
                                                    }
                                                }} 
                                                className="px-6 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" /> REJECT
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (c.pendingModification || c.status === 'PENDING_DELETION') {
                                                        processModification(c.id, true);
                                                    } else {
                                                        approveCase(c.id);
                                                    }
                                                }} 
                                                className={`${(c.pendingModification || c.status === 'PENDING_DELETION') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} px-6 py-2 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2`}
                                            >
                                                <UserCheck className="w-4 h-4" /> 
                                                {isDeletion ? 'CONFIRM DELETION' : isLinkClose ? 'AUTHORIZE MERGE' : c.pendingModification ? 'APPROVE CLOSURE' : 'SIGN-OFF & ESCALATE'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {pendingApprovals.length === 0 && (
                        <div className="p-16 text-center">
                            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-gray-500 font-bold">No Escalations Pending Review</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApprovalsQueue;
