import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import MitigationScorecard from '../components/MitigationScorecard';
import STRViewer from '../components/STRViewer';
import { Download, AlertTriangle } from 'lucide-react';

const CaseAnalysis: React.FC = () => {
    const { cases, selectedCase, assessEntity } = useApp();
    const [showSTRViewer, setShowSTRViewer] = useState(false);
    const [selectedAction, setSelectedAction] = useState<string>('');
    const activeCase = selectedCase || cases.find(c => c.status === 'ANALYSIS') || cases.find(c => c.status === 'TRIAGE') || cases[1];
    
    // Safety check if no case is active
    if (!activeCase) return <div className="p-8">No active entity found.</div>;

    const isEntity = activeCase.id.startsWith('TASK-');
    const profile = activeCase.subject;
    const isCompany = profile.type === 'COMPANY';

    const handleActionSubmit = () => {
        if (!selectedAction) return;
        assessEntity(activeCase.id, selectedAction as 'ESCALATE' | 'HIBERNATE' | 'DISMISS');
    };

    return (
        <div className="space-y-6 bg-gray-50/50 min-h-screen pb-12">
            {showSTRViewer && <STRViewer onClose={() => setShowSTRViewer(false)} strId={activeCase.id} />}
            
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2 mb-4">
                LINE 1 - INITIAL REVIEW & MITIGATION
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* LEFT TIER: Risk Scorecard & Mitigation */}
                <div className="xl:col-span-8">
                    <MitigationScorecard entityId={activeCase.id} scorecard={profile.riskProfile} />
                </div>

                {/* RIGHT TIER: Summaries */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Entity Details Panel */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 tracking-tight text-sm">Entity Details</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                                <div className="text-xs font-bold text-gray-500">Name</div>
                                <div className="text-sm font-medium text-gray-900 text-right max-w-[200px]">{profile.name}</div>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <div className="text-xs font-bold text-gray-500">Status</div>
                                <div className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded text-xs font-bold">{profile.status || 'Open'}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-teal-600 mb-2">Summary</div>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    {profile.summary || 'No summary available.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Risk Profile Panel */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-teal-400"></div>
                        <div className="p-4 border-b border-gray-200 pt-5">
                            <h3 className="font-bold text-gray-900 tracking-tight text-sm">Risk Profile</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <div className="text-xs font-medium text-gray-500">Risk Type</div>
                                <div className="text-xs font-medium text-gray-900">{isCompany ? 'Contractor Integrity Risk' : 'Financial Conduct Risk'}</div>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <div className="text-xs font-medium text-gray-500">Risk Score</div>
                                <div className="text-sm font-black text-red-600">{profile.riskProfile.totalScore}</div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500 mb-2">Key Factors</div>
                                <ul className="space-y-1.5 text-xs text-gray-700 list-disc pl-4 font-medium uppercase tracking-wide">
                                    {profile.riskProfile.factors.slice(0, 3).map(f => (
                                       <li key={f.id}>{f.category}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MIDDLE WIDE: Entity Profile */}
                <div className="xl:col-span-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative mt-2">
                    <div className="absolute top-0 left-0 w-full h-1 bg-teal-400"></div>
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 tracking-tight">
                            Entity Profile: <span className="font-medium text-gray-700">{profile.name}</span>
                        </h3>
                        <div className="flex gap-2 text-xs font-bold text-gray-600">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors shadow-sm"><Download className="w-3.5 h-3.5" /> Export XML</button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors shadow-sm"><Download className="w-3.5 h-3.5" /> Export PDF</button>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {profile.actionRequired && (
                            <div className="flex items-center justify-between p-4 bg-orange-50/50 border-l-4 border-l-orange-400 rounded-r-lg border border-orange-100">
                                <div>
                                    <div className="text-orange-800 font-bold text-sm mb-1">Action Required</div>
                                    <div className="text-orange-700 text-xs font-medium italic">{profile.actionRequired}</div>
                                </div>
                                <button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded shadow-sm transition-colors uppercase tracking-wider">
                                    Complete IDD Check
                                </button>
                            </div>
                        )}

                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-2">Key Information</h4>
                            <p className="text-sm text-gray-600">{isCompany ? `Registered as a cooperative society. Active since 1998.` : `Registered individual representing multiple entities. Occupation: ${profile.occupation}`}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                            {isCompany ? (
                                <>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Ultimate Beneficial Owners (UBO)</h4>
                                            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                                                {profile.ubos?.map((ubo, i) => <li key={i}>{ubo}</li>) || <li>None recorded</li>}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Shareholders</h4>
                                            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                                                {profile.shareholders?.map((sh, i) => <li key={i}>{sh}</li>) || <li>None recorded</li>}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Directors</h4>
                                            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                                                {profile.directors?.map((d, i) => <li key={i}>{d}</li>) || <li>None recorded</li>}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Involved Projects & Values</h4>
                                            <div className="space-y-3">
                                                {profile.involvedProjects?.map((proj, i) => (
                                                    <div key={i} className="flex flex-col border-b border-gray-100 pb-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-medium text-gray-700">{proj.name}</span>
                                                            <span className="font-bold text-green-700">{proj.value}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs mt-1">
                                                            <span className="text-gray-400">{proj.location}</span>
                                                            <span className={`font-bold ${proj.status === 'Open' ? 'text-green-600' : 'text-gray-500'}`}>{proj.status}</span>
                                                        </div>
                                                    </div>
                                                )) || <div className="text-sm text-gray-500 italic">No project data available.</div>}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6 col-span-2">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-3">Companies Associated</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {profile.companiesAssociated?.map((c, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <span className="text-sm font-bold text-gray-700">{c.name}</span>
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">{c.role}</span>
                                                </div>
                                            )) || <div className="text-sm text-gray-500">None recorded</div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sub-Panels: History */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3">All Entity Cases</h4>
                                <div className="space-y-2">
                                    {profile.previousCases?.map((pc, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border border-gray-200 group">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-700 tracking-wider group-hover:text-blue-600">{pc.id}</span>
                                                <span className="text-xs text-gray-500 mt-1">{pc.status}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-bold text-red-600">{pc.score}</span>
                                                <span className="text-[10px] font-bold text-blue-500 mt-1 bg-blue-50 px-2 rounded">Open</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3">Linked STRs</h4>
                                <div className="space-y-2">
                                    {profile.linkedSTRs?.map((str, i) => (
                                        <div key={i} onClick={() => setShowSTRViewer(true)} className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border border-gray-200 group">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-700 tracking-wider group-hover:text-blue-600">{str.id}</span>
                                                <span className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">{str.date}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-bold text-gray-900">{str.amount}</span>
                                                <span className="text-[10px] font-bold text-amber-600 mt-1 bg-amber-50 px-2 rounded border border-amber-100">{str.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* BOTTOM: Actions */}
                <div className="xl:col-span-12 bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col items-start gap-2 shadow-sm mt-2">
                    <h4 className="text-sm font-bold text-gray-900">Case Actions</h4>
                    <div className="flex gap-4 w-full md:w-auto">
                        <select 
                            value={selectedAction}
                            onChange={e => setSelectedAction(e.target.value)}
                            disabled={!isEntity}
                            className="bg-white border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-80 p-2.5 shadow-sm disabled:opacity-50"
                        >
                            <option value="">Select an action...</option>
                            {isEntity && (
                                <>
                                    <option value="ESCALATE">Escalate (Create Case)</option>
                                    <option value="HIBERNATE">Hibernate (Monitor)</option>
                                    <option value="DISMISS">Dismiss (No Risk Found)</option>
                                </>
                            )}
                        </select>
                        <button 
                            onClick={handleActionSubmit}
                            disabled={!selectedAction}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all ${
                                selectedAction 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                            }`}
                        >
                            Submit Action
                        </button>
                    </div>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-2">
                        Please complete all required actions before dismissing the case.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CaseAnalysis;
