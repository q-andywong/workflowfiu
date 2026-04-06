import React from 'react';
import { Scorecard as ScorecardType } from '../types';
import { ChevronRight, ShieldAlert, Award, Globe, Briefcase } from 'lucide-react';

interface ScorecardProps {
  scorecard: ScorecardType;
  title: string;
}

const Scorecard: React.FC<ScorecardProps> = ({ scorecard, title }) => {
  const getCategoryIcon = (category: string) => {
    if (category.includes('Jurisdiction')) return <Globe className="w-4 h-4" />;
    if (category.includes('Sector')) return <Briefcase className="w-4 h-4" />;
    if (category.includes('Asset')) return <Award className="w-4 h-4" />;
    return <ShieldAlert className="w-4 h-4" />;
  };

  const getScoreColor = (score: number | string) => {
    if (typeof score === 'string') return 'text-red-600';
    if (score >= 20) return 'text-red-600';
    if (score >= 15) return 'text-amber-600';
    return 'text-blue-600';
  };

  const getStatusStyle = (status: string) => {
    if (status.includes('RED')) return 'bg-red-50 text-red-700 border-red-200';
    if (status.includes('AMBER')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
            {scorecard.totalScore}
          </div>
          <h4 className="font-bold text-gray-900 tracking-tight">{title} <span className="font-medium text-gray-500">Risk Profile</span></h4>
        </div>
        <div className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${getStatusStyle(scorecard.status)}`}>
          {scorecard.status}
        </div>
      </div>

      <div className="p-2 space-y-1">
        {scorecard.factors.map((factor) => (
          <div key={factor.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-md bg-gray-100 text-gray-500 group-hover:text-blue-600 transition-colors border border-gray-200 group-hover:border-blue-200">
                {getCategoryIcon(factor.category)}
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{factor.category}</div>
                <div className="text-sm font-semibold text-gray-900 mt-0.5">{factor.factor}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`text-sm font-bold ${getScoreColor(factor.score)}`}>
                {factor.score === 'N/A' ? 'CRITICAL' : `+${factor.score}`}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence Score: 0.94</div>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
          Detailed Evidence Analysis
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Scorecard;
