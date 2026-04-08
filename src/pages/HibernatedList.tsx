import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Filter, ShieldCheck, ArrowRight, FileSearch, Clock } from 'lucide-react';
import { IntelligenceCase } from '../types';

const HibernatedList: React.FC = () => {
    const { cases, setSelectedCase, setView } = useApp();
    const { user } = useAuth();
    
    // Hibernated includes only low-risk items (<10) that were auto-triaged or manually moved
    const hibernatedEntities = cases.filter((c: IntelligenceCase) => {
        const isHibernated = c.status === 'HIBERNATED';
        if (!isHibernated) return false;
        
        if (user?.role === 'INVESTIGATOR' && user.typology) {
            const typs = c.subjects.flatMap(s => s.crimeTypologies || []);
            return typs.length === 0 || typs.includes(user.typology);
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        Hibernated List
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Low-risk entities and automated monitoring tasks</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-4">
                    <div className="px-4 pb-2 border-b border-gray-200 mb-2">
                        <div className="flex items-center gap-4">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{hibernatedEntities.length} Entities in Baseline Monitoring</div>
                        </div>
                    </div>

                    {hibernatedEntities.map(c => (
                        <div key={c.id} 
                            onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer border-l-4 border-l-green-500"
                        >
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        {c.subjects[0]?.name}
                                        {c.subjects.length > 1 && (
                                            <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[8px] border border-green-100 uppercase">+ {c.subjects.length - 1} Entities</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.id}</div>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                        <div className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                            Low Risk / Hibernated
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <div className="text-lg font-black text-green-600">
                                        {Math.max(...c.subjects.map(s => s.riskProfile.totalScore))}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Max Risk</div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300" />
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
