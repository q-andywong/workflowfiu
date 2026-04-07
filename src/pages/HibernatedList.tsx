import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Moon, Filter, ShieldCheck, ArrowRight, FileSearch, Clock } from 'lucide-react';

const HibernatedList: React.FC = () => {
    const { cases, setSelectedCase, setView } = useApp();
    
    // Hibernated includes only low-risk items (<10) that were auto-triaged or manually moved
    const hibernatedEntities = cases.filter(c => c.status === 'HIBERNATED');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        Hibernation Registry
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Low-risk entities and automated monitoring tasks</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                        <Filter className="w-4 h-4" />
                        Re-scan All
                    </button>
                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold flex items-center gap-2 border border-green-100">
                        <ShieldCheck className="w-4 h-4" />
                        Automated Mode
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Showing {hibernatedEntities.length} hibernated items</div>
                        <div className="hidden sm:flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <div className="w-40">Intelligence Subject</div>
                            <div className="w-24 text-center">Last Score</div>
                            <div className="w-28 text-right">Actions</div>
                        </div>
                    </div>

                    {hibernatedEntities.map(c => (
                        <div key={c.id} className="flex flex-col gap-2">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 group flex items-center justify-between hover:bg-gray-50 transition-colors border-l-4 border-l-green-400 cursor-pointer">
                                <div className="flex items-center gap-4 sm:w-64">
                                    <div className="w-10 h-10 rounded-lg border border-green-100 bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                        <Moon className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-sm font-bold text-gray-900 truncate">{c.subject.name}</div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{c.id}</div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex flex-col items-center w-24">
                                    <div className="text-lg font-black text-green-600">{c.subject.riskProfile.totalScore}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Score: LOW</div>
                                </div>

                                <div className="flex items-center justify-end gap-2 sm:w-28">
                                    <div className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Scheduled Rescan">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <button 
                                      onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                                      className="p-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors border border-gray-200 shadow-sm"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {hibernatedEntities.length === 0 && (
                      <div className="p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center space-y-4">
                          <FileSearch className="w-10 h-10 mx-auto text-gray-400" />
                          <div className="text-sm font-bold text-gray-600">No entities are currently in hibernation.</div>
                      </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           Hibernation Logic
                        </h3>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                Entities with a consolidated risk score **below 10** are automatically moved to this registry. 
                            </p>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-xs font-bold text-gray-600 space-y-2">
                                <div className="flex justify-between">
                                    <span>Monitoring Period</span>
                                    <span>90 Days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rescan Trigger</span>
                                    <span>New Report Ingestion</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HibernatedList;
