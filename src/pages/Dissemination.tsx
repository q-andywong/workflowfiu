import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Send, FileCheck, HelpCircle, Archive, ClipboardCheck, AlertCircle, TrendingUp, Filter, Clock, ExternalLink } from 'lucide-react';
import { FeedbackOutcome } from '../types';

const Dissemination: React.FC = () => {
  const { cases, addFeedback, setSelectedCase, setView } = useApp();
  const disseminatedCases = cases.filter(c => c.disseminations && c.disseminations.length > 0);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');

  const getOutcomeColor = (outcome: FeedbackOutcome) => {
    switch (outcome) {
      case 'CONVICTION': return 'bg-green-50 text-green-700 border-green-200';
      case 'ASSET_SEIZURE': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ONGOING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'NO_OFFENCE_FOUND': return 'bg-gray-100 text-gray-600 border-gray-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            Intelligence Dissemination & Feedback
          </h2>
          <p className="text-gray-500 mt-1 font-medium text-sm">Tracking the operational impact of FIU financial intelligence</p>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
           <button 
             onClick={() => setActiveTab('ACTIVE')}
             className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'ACTIVE' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Active Items
           </button>
           <button 
             onClick={() => setActiveTab('ARCHIVED')}
             className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'ARCHIVED' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Archived
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-blue-500 border border-gray-200">
            <TrendingUp className="w-5 h-5 text-blue-500 mb-3" />
            <div className="text-2xl font-black text-gray-900">78.4%</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Intelligence Utility Rate</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-green-500 border border-gray-200">
            <ClipboardCheck className="w-5 h-5 text-green-500 mb-3" />
            <div className="text-2xl font-black text-gray-900">$42.5M</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Assets Seized via FIU</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-amber-400 border border-gray-200">
            <Clock className="w-5 h-5 text-amber-500 mb-3" />
            <div className="text-2xl font-black text-gray-900">12 Days</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Avg. Feedback Latency</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-red-500 border border-gray-200">
            <AlertCircle className="w-5 h-5 text-red-500 mb-3" />
            <div className="text-2xl font-black text-gray-900">15</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Pending LEA Responses</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-200">
           <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
             <Filter className="w-3 h-3" /> Filtered by: All Agencies
           </div>
           <div className="hidden md:flex gap-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             <div className="w-[30%]">Intelligence Subject</div>
             <div className="w-[20%]">Agency / Date</div>
             <div className="w-[30%]">Outcomes & Feedback</div>
             <div className="w-[20%]">Actions</div>
           </div>
        </div>

        {disseminatedCases.map(c => (
          <div key={c.id} className="space-y-4">
            {c.disseminations.map(d => (
              <div key={d.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-shadow">
                <div className="w-full md:w-[30%]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                       <FileCheck className="w-5 h-5 text-blue-600" />
                    </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          {c.id}
                        </span>
                        <div className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                          {c.subjects[0]?.name}
                          {c.subjects.length > 1 && ` (+${c.subjects.length - 1} more)`}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate max-w-[200px]">{c.title}</div>
                  </div>
                </div>

                <div className="w-full md:w-[20%]">
                  <div className="inline-flex items-center px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                    {d.agency}
                  </div>
                  <div className="text-xs font-medium text-gray-500">Sent {new Date(d.date).toLocaleDateString()}</div>
                </div>

                <div className="w-full md:w-[30%]">
                  {d.feedback ? (
                    <div className="space-y-1.5">
                       <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${getOutcomeColor(d.feedback.outcome)}`}>
                         {d.feedback.outcome.replace(/_/g, ' ')}
                       </div>
                       <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-2 bg-gray-50 p-2 rounded border border-gray-100">
                         "{d.feedback.notes}"
                       </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 border border-dashed border-gray-300 p-2 rounded-lg bg-gray-50">
                        <Archive className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Feedback Loop</span>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-[20%] flex justify-end gap-2">
                  <button 
                    onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-black text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
                  >
                    View Intelligence
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

       <div className="mt-12 p-8 bg-blue-50 border border-blue-100 rounded-xl text-center flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm">
           <div className="flex items-center gap-5 text-left">
             <div className="p-4 bg-white text-blue-600 rounded-full shadow-sm border border-blue-100">
               <Send className="w-8 h-8" />
             </div>
             <div>
                 <h4 className="text-lg font-bold text-blue-900">Egmont Group Connectivity</h4>
                 <p className="text-sm text-blue-800 font-medium mt-1">Initiate cross-border intelligence pooling via the international secure portal.</p>
             </div>
           </div>
           <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap">
               Access Secure Portal
               <ExternalLink className="w-4 h-4" />
           </button>
       </div>
    </div>
  );
};

export default Dissemination;
