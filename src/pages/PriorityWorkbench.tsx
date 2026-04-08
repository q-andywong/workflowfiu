import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Zap, Clock, UserPlus, ExternalLink, ArrowRight } from 'lucide-react';
import { IntelligenceCase } from '../types';

const PriorityWorkbench: React.FC = () => {
  const { cases, setSelectedCase, setView } = useApp();
  const { user } = useAuth();
  
  const priorityCases = cases.filter((c: IntelligenceCase) => {
    const isPriority = c.status === 'PRIORITY';
    if (!isPriority) return false;
    
    if (user?.role === 'INVESTIGATOR' && user.typology) {
        const typs = c.subjects.flatMap(s => s.crimeTypologies || []);
        return typs.length === 0 || typs.includes(user.typology);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-3 text-red-600 mb-1">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Priority Bypass List</h2>
          </div>
          <p className="text-gray-500 font-medium text-sm">Immediate assessment of "Above Risk Appetite" intelligence hits</p>
        </div>
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-2 rounded-lg shadow-sm">
          <Zap className="w-4 h-4 text-red-600 fill-red-600" />
          <div className="text-xs font-bold text-red-800 tracking-wider">REAL-TIME MONITORING ACTIVE</div>
        </div>
      </div>

      {priorityCases.length === 0 ? (
        <div className="bg-white p-20 text-center space-y-6 rounded-xl border border-gray-200 shadow-sm">
          <ShieldAlert className="w-16 h-16 mx-auto text-gray-300" />
          <div className="text-lg font-bold text-gray-600">No priority alerts currently active</div>
          <p className="text-gray-500 max-w-md mx-auto italic text-sm">All critical triggers have been triaged or escalated for investigation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {priorityCases.map((c) => (
            <div 
              key={c.id} 
              onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer border-l-4 border-l-red-600"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    {c.subjects[0]?.name}
                    {c.subjects.length > 1 && (
                      <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] border border-red-100 uppercase">+ {c.subjects.length - 1} Entities</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.id}</div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      Priority Bypass
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <UserPlus className="w-2.5 h-2.5" />
                      {c.analyst || 'Unallocated'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div>
                  <div className="text-lg font-black text-red-600">
                    {Math.max(...c.subjects.map(s => s.riskProfile.totalScore))}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Max Risk</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityWorkbench;
