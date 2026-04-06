import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Inbox, Filter, ShieldAlert, ArrowRight, UserPlus, FileSearch } from 'lucide-react';

const TriageQueue: React.FC = () => {
    const { cases, stats, setView, setSelectedCase } = useApp();
    // Triage strictly includes only pre-escalation entities
    const triageEntities = cases.filter(c => c.status === 'TRIAGE');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        Automated Triage Queue
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Initial evidence assessment and risk scoring ingestion</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                        <Filter className="w-4 h-4" />
                        Risk Threshold
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all focus:ring-4 focus:ring-blue-100">
                      Force Rescan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Showing {triageEntities.length} pending items</div>
                        <div className="hidden sm:flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <div className="w-40">Intelligence Subject</div>
                            <div className="w-24 text-center">Risk Score</div>
                            <div className="w-28 text-right">Actions</div>
                        </div>
                    </div>

                    {triageEntities.map(c => (
                        <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 group flex items-center justify-between hover:bg-gray-50 transition-colors border-l-4 border-l-blue-500 cursor-pointer">
                            <div className="flex items-center gap-4 sm:w-64">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                    <Inbox className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-sm font-bold text-gray-900 truncate">{c.subject.name}</div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{c.id}</div>
                                </div>
                            </div>

                            <div className="hidden sm:flex flex-col items-center w-24">
                                <div className="text-lg font-black text-blue-600">{c.subject.riskProfile.totalScore}</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confidence</div>
                            </div>

                            <div className="flex items-center justify-end gap-2 sm:w-28">
                                <button className="p-2 border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors">
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
                    ))}
                    
                    {triageEntities.length === 0 && (
                      <div className="p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center space-y-4">
                          <FileSearch className="w-10 h-10 mx-auto text-gray-400" />
                          <div className="text-sm font-bold text-gray-600">The ingestion queue is currently empty.</div>
                      </div>
                    )}
                </div>

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
            </div>
        </div>
    );
};

export default TriageQueue;
