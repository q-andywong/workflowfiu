import React from 'react';
import { useApp } from '../contexts/AppContext';
import Scorecard from '../components/Scorecard';
import { ShieldAlert, Zap, Clock, UserPlus, ExternalLink } from 'lucide-react';

const PriorityWorkbench: React.FC = () => {
  const { cases } = useApp();
  const priorityCases = cases.filter(c => c.status === 'PRIORITY');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-3 text-red-600 mb-1">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Priority Analytics Workbench</h2>
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
        <div className="grid grid-cols-1 gap-8">
          {priorityCases.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-md border-t-4 border-t-red-600 overflow-hidden outline outline-1 outline-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-4 bg-gray-50 p-6 sm:p-8 border-r border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                       <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded shadow-sm uppercase tracking-widest">Immediate</span>
                       <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">{c.id}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{c.subject.name}</h3>
                    <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6">{c.title}</p>
                    
                    <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Detected {new Date(c.createdAt).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                            <UserPlus className="w-4 h-4 text-gray-400" />
                            Assigned to {c.analyst}
                        </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <button className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        Initiate Immediate Freeze
                    </button>
                    <button className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        Cross-Reference Databases
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-8 p-6 sm:p-8 bg-white">
                  <div className="flex items-center justify-between mb-6">
                     <h4 className="text-sm font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        Triggered Risk Factors
                     </h4>
                     <button className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider">View Full Subject Dossier</button>
                  </div>
                  <Scorecard scorecard={c.subject.riskProfile} title={c.subject.name} />
                  
                  <div className="mt-8 p-5 bg-red-50 rounded-lg border border-red-100 flex gap-4 items-start shadow-sm">
                    <div className="p-2 bg-white rounded border border-red-200 shrink-0">
                      <ShieldAlert className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Automation Summary</h5>
                      <p className="text-sm text-red-900 leading-relaxed">
                          Subject <strong>"{c.subject.name}"</strong> has been automatically flagged due to a direct match on the <strong>Office of Foreign Assets Control (OFAC)</strong> sanctions list. High-volume cross-border transfers (&gt; $5M) from high-risk Baltic jurisdictions were detected within the last 24 hours. <strong>SONAR risk signal ingested:</strong> Prompt manual dissemination to CAD Financial Investigation Division recommended.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityWorkbench;
