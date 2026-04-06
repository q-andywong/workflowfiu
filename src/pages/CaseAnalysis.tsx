import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Scorecard from '../components/Scorecard';
import STRViewer from '../components/STRViewer';
import { 
  Network, Search, FileText, Send, UserCheck, 
  MapPin, ShieldCheck, ExternalLink, Database, 
  TrendingUp, ArrowRight 
} from 'lucide-react';

const CaseAnalysis: React.FC = () => {
    const { cases, selectedCase, assessEntity } = useApp();
    const [showSTRViewer, setShowSTRViewer] = useState(false);
    const activeCase = selectedCase || cases.find(c => c.status === 'ANALYSIS') || cases.find(c => c.status === 'TRIAGE') || cases[1];
    const isEntity = activeCase.id.startsWith('TASK-');

    return (
        <div className="space-y-6">
            {showSTRViewer && <STRViewer onClose={() => setShowSTRViewer(false)} strId={activeCase.id} />}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-blue-700">
                        <TrendingUp className="w-6 h-6" />
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{isEntity ? 'Task Assessment Workbench' : 'Intelligence Analysis Workbench'}</h2>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                         <span className="px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-600 font-bold rounded uppercase tracking-wider">{isEntity ? 'Pending Task' : 'Active Case'}: {activeCase.id}</span>
                         <span className="text-gray-400 font-bold">/</span>
                         <span className="font-semibold text-gray-900">{activeCase.title}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowSTRViewer(true)}
                        className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <FileText className="w-4 h-4 text-gray-400" />
                        View Source STR
                    </button>
                    {!isEntity && (
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                          <Send className="w-4 h-4" />
                          Request Dissemination
                      </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Network className="w-5 h-5 text-blue-600" />
                                Transaction Link Analysis
                            </h3>
                            <button className="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-blue-600">Expand Workspace</button>
                        </div>
                        <div className="flex-1 bg-gray-50 relative flex items-center justify-center p-8 overflow-hidden rounded-b-xl border-b-2 border-b-white">
                             <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>
                             <div className="relative text-center space-y-6 max-w-lg z-10 p-8 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                                 <div className="flex items-center justify-center gap-8">
                                     <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-lg font-bold text-blue-800 shadow-md">TB</div>
                                     <ArrowRight className="w-8 h-8 text-gray-400 font-bold" />
                                     <div className="w-16 h-16 rounded-full bg-white border-2 border-green-500 flex items-center justify-center text-lg font-bold text-green-800 shadow-md">SH</div>
                                 </div>
                                 <p className="text-sm text-gray-600 font-medium leading-relaxed italic bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                     Link Analysis shows a direct financial flow from <strong>Tobias Black</strong> to <strong>Sunstar Holdings</strong> (BVI Shell Corp). Multiple STRs from 3 domestic banks indicate structuring patterns.
                                 </p>
                                 <button className="px-5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-bold transition-all shadow-sm">Generate Custom Interactive Network</button>
                             </div>
                        </div>
                        <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-4 overflow-x-auto no-scrollbar rounded-b-xl">
                             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border border-gray-200">Entity Resolution: OK</div>
                             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border border-gray-200">Geo-Risk: BALTICS</div>
                             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-[10px] font-bold text-amber-700 uppercase tracking-wider whitespace-nowrap">Structuring Pattern: HIGH</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                                <Search className="w-4 h-4" /> Intelligence Summary
                             </h4>
                             <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                 <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                     Detailed review of Subject {activeCase.subject.name} indicates a deliberate pattern of domestic fund aggregation followed by international layering. Large-scale domestic cash deposits were observed at HSBC and UOB, subsequently transferred to shell entities in the British Virgin Islands. 
                                 </p>
                                 <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                     Secondary analysis indicates the subject has links to known High Risk Persons (HRP) identified in recent Operation Diamond investigations.
                                 </p>
                             </div>
                         </div>
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Checklist Compliance
                             </h4>
                             <div className="space-y-2.5">
                                 {[
                                     { label: 'UBO Identification', status: 'COMPLETE', color: 'green' },
                                     { label: 'Sanctions Screening', status: 'CLEAN', color: 'blue' },
                                     { label: 'Link Analysis (Layer 3)', status: 'IN_PROGRESS', color: 'amber' },
                                     { label: 'Dissemination Pack Draft', status: 'PENDING', color: 'gray' }
                                 ].map(check => (
                                     <div key={check.label} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
                                         <span className="text-sm font-semibold text-gray-700">{check.label}</span>
                                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-${check.color}-50 text-${check.color}-700 border border-${check.color}-200`}>{check.status}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                     <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <UserCheck className="w-4 h-4" /> Subject Risk Profile
                        </h4>
                        <Scorecard scorecard={activeCase.subject.riskProfile} title={activeCase.subject.name} />
                     </div>

                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-gray-100">
                            <MapPin className="w-16 h-16" />
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-2 relative z-10">Subject Metadata</h4>
                        <div className="grid grid-cols-2 gap-y-4 relative z-10">
                            {[
                                { k: 'Nationality', v: activeCase.subject.nationality },
                                { k: 'Occupation', v: activeCase.subject.occupation },
                                { k: 'Entity Type', v: 'Natural Person' },
                                { k: 'Source', v: 'SONAR / FIU-HUB' },
                                { k: 'Residence', v: 'Singapore, D10' },
                                { k: 'Tax Status', v: 'Compliant' }
                            ].map(meta => (
                                <div key={meta.k}>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{meta.k}</div>
                                    <div className="text-sm font-bold text-gray-900 mt-0.5">{meta.v}</div>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white text-blue-600 rounded-md shadow-sm border border-blue-100">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-blue-900">Analyst Recommendation</h4>
                        </div>
                        <p className="text-sm text-blue-800 bg-white p-4 rounded-lg border border-blue-100 shadow-sm leading-relaxed mb-5">
                            "Subject Profile indicates a moderate risk of domestic tax facilitation. Requesting immediate dissemination to MAS (AML Supervision) for a regulatory probe into the subject's related corporate entities."
                        </p>
                        {isEntity ? (
                            <div className="flex flex-col gap-3">
                                <button onClick={() => assessEntity(activeCase.id, 'ESCALATE')} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Escalate (Create Case)
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                   <button onClick={() => assessEntity(activeCase.id, 'HIBERNATE')} className="w-full py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-lg transition-all shadow-sm text-sm">
                                      Hibernate
                                   </button>
                                   <button onClick={() => assessEntity(activeCase.id, 'DISMISS')} className="w-full py-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold rounded-lg transition-all shadow-sm text-sm">
                                      Dismiss
                                   </button>
                                </div>
                            </div>
                        ) : (
                            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Escalate for Approval
                            </button>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default CaseAnalysis;
