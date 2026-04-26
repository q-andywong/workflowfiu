import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Send, FileCheck, Archive, ClipboardCheck, AlertCircle, TrendingUp, Clock, ArrowRight, AlertTriangle, Search } from 'lucide-react';
import { FeedbackOutcome } from '../types';

const Dissemination: React.FC = () => {
  const { cases, addFeedback, setSelectedCase, setView } = useApp();
  const disseminatedCases = cases.filter(c => c.disseminations && c.disseminations.length > 0);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'CLOSED'>('ACTIVE');

  // Split by case status: active = still DISSEMINATED, closed = CLOSED cases with dissemination records
  const activeDisseminated = disseminatedCases.filter(c => c.status === 'DISSEMINATED');
  const closedDisseminated = disseminatedCases.filter(c => c.status === 'CLOSED' || c.status === 'DISMISSED');
  const displayedCases = activeTab === 'ACTIVE' ? activeDisseminated : closedDisseminated;

  // Compute stats from actual dissemination data
  const allDisseminations = disseminatedCases.flatMap(c => c.disseminations || []);
  const withFeedback = allDisseminations.filter(d => d.feedback);
  const pendingFeedback = allDisseminations.filter(d => !d.feedback);
  const utilityRate = allDisseminations.length > 0
    ? Math.round((withFeedback.length / allDisseminations.length) * 100 * 10) / 10
    : 0;
  const avgFeedbackDays = withFeedback.length > 0
    ? Math.round(withFeedback.reduce((sum, d) => {
        const dissDate = new Date(d.date).getTime();
        const fbDate = new Date(d.feedback!.receivedDate).getTime();
        return sum + (fbDate - dissDate) / (1000 * 60 * 60 * 24);
      }, 0) / withFeedback.length)
    : 0;
  const actionableOutcomes = withFeedback.filter(d =>
    d.feedback!.outcome === 'CONVICTION' || d.feedback!.outcome === 'ASSET_SEIZURE'
  ).length;

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
             Active Items ({activeDisseminated.length})
           </button>
           <button
             onClick={() => setActiveTab('CLOSED')}
             className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'CLOSED' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Closed Items ({closedDisseminated.length})
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-blue-500 border border-gray-200">
            <TrendingUp className="w-5 h-5 text-blue-500 mb-3" />
            <div className="text-2xl font-black text-gray-900">{utilityRate}%</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Feedback Response Rate</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-green-500 border border-gray-200">
            <ClipboardCheck className="w-5 h-5 text-green-500 mb-3" />
            <div className="text-2xl font-black text-gray-900">{actionableOutcomes}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Actionable Outcomes</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-amber-400 border border-gray-200">
            <Clock className="w-5 h-5 text-amber-500 mb-3" />
            <div className="text-2xl font-black text-gray-900">{avgFeedbackDays} Days</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Avg. Feedback Latency</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-red-500 border border-gray-200">
            <AlertCircle className="w-5 h-5 text-red-500 mb-3" />
            <div className="text-2xl font-black text-gray-900">{pendingFeedback.length}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Pending LEA Responses</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {displayedCases.map(c =>
            (c.disseminations || []).map(d => (
              <div
                key={d.id}
                className="hover:bg-blue-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-purple-600 cursor-pointer"
                onClick={() => { setSelectedCase(c); setView('ANALYSIS'); }}
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Send className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-black text-gray-900 group-hover:text-purple-600 transition-colors shrink-0">
                        {c.subjects[0]?.name}
                        {c.subjects.length > 1 && (
                          <span className="ml-2 bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-[8px] border border-purple-100">+{c.subjects.length - 1} Entities</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                        {d.agency}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 shrink-0">
                        {new Date(d.date).toLocaleDateString()}
                      </span>
                      {d.feedback ? (
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${getOutcomeColor(d.feedback.outcome)}`}>
                          {d.feedback.outcome.replace(/_/g, ' ')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-700 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded border border-amber-200 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          Awaiting Feedback
                        </span>
                      )}
                      <span className={`font-black px-2.5 py-1 rounded shadow-sm text-xs border ${
                        Math.max(...c.subjects.map(s => s.riskProfile.totalScore)) > 100
                          ? 'text-red-600 bg-red-50 border-red-100'
                          : 'text-amber-600 bg-amber-50 border-amber-100'
                      }`}>
                        {Math.max(...c.subjects.map(s => s.riskProfile.totalScore))}
                      </span>
                      <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-all text-gray-400">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 ml-14">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{c.id}</div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                      {c.reports?.length || 0} report{(c.reports?.length || 0) !== 1 ? 's' : ''}
                    </div>
                    {c.analyst && (
                      <>
                        <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>
                        <div className="text-[9px] font-bold text-gray-400 shrink-0">{c.analyst}</div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2 ml-14">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded border border-purple-200 uppercase tracking-widest">Disseminated</span>
                    {Array.from(new Set(c.subjects.flatMap(s => s.crimeTypologies || []))).map((typ, idx) => (
                      <div key={idx} className="text-[9px] font-black flex items-center gap-1 text-gray-500 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {typ}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}

          {displayedCases.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <Search className="w-12 h-12 text-gray-300 mx-auto" />
              <div className="text-gray-500 font-bold">
                {activeTab === 'ACTIVE' ? 'No active disseminated cases.' : 'No closed disseminated cases.'}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dissemination;
