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

                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Overview & Entity Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Max Risk</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Analysis Profile</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 italic font-medium">
                                {hibernatedEntities.map(c => (
                                    <tr key={c.id} className="hover:bg-green-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-green-500 cursor-pointer" onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-gray-900 flex items-center gap-2 group-hover:text-green-600 transition-colors">
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
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-black px-2.5 py-1 rounded shadow-sm text-xs border text-green-600 bg-green-50 border-green-100">
                                                {Math.max(...c.subjects.map(s => s.riskProfile.totalScore))}
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
                            <div className="p-12 border-t border-dashed border-gray-200 text-center space-y-4 w-full">
                                <FileSearch className="w-10 h-10 mx-auto text-gray-400" />
                                <div className="text-sm font-bold text-gray-600">No entities are currently in hibernation.</div>
                            </div>
                        )}
                    </div>
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
