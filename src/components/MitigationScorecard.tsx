import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Scorecard, RiskFactor } from '../types';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface MitigationProps {
  entityId: string;
  scorecard: Scorecard;
}

const MitigationScorecard: React.FC<MitigationProps> = ({ entityId, scorecard }) => {
  const { saveMitigation } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mitigationForms, setMitigationForms] = useState<Record<string, { category: string, notes: string }>>({});

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSave = (factor: RiskFactor) => {
    const form = mitigationForms[factor.id] || { category: '', notes: '' };
    saveMitigation(entityId, factor.id, form.category, form.notes);
    // Visual flash or collapse could go here
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
        <h3 className="font-bold text-gray-900 tracking-tight">Risk Scorecard & Investigation Findings</h3>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Risk Score</span>
              <span className="text-2xl font-black text-red-600 tracking-tighter">{scorecard.totalScore}</span>
           </div>
           <div className="w-px h-6 bg-gray-200"></div>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Factors</span>
              <span className="text-xl font-black text-gray-900 tracking-tighter">{scorecard.factors.length}</span>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-200 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        <div className="col-span-1 text-center"></div>
        <div className="col-span-2 text-center">Score</div>
        <div className="col-span-9">Description</div>
      </div>

      <div className="divide-y divide-gray-100 bg-white">
        {scorecard.factors.map(factor => {
           const isExpanded = expandedId === factor.id;
           const currentForm = mitigationForms[factor.id] || { category: factor.mitigation?.category || '', notes: factor.mitigation?.notes || '' };

           return (
             <div key={factor.id} className="flex flex-col">
               <div 
                 className={`grid grid-cols-12 px-6 py-4 items-center cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}
                 onClick={() => handleExpand(factor.id)}
               >
                 <div className="col-span-1 text-center text-gray-400">
                   {isExpanded ? <ChevronUp className="w-4 h-4 mx-auto" /> : <ChevronDown className="w-4 h-4 mx-auto" />}
                 </div>
                 <div className="col-span-2 text-center flex items-center justify-center gap-2 text-red-600 font-bold">
                   <AlertTriangle className="w-4 h-4" fill="currentColor" stroke="white" />
                   {factor.score === 'N/A' ? 'CRIT' : factor.score}
                 </div>
                 <div className="col-span-9 font-bold text-gray-700 text-sm tracking-wide">
                   {factor.category.toUpperCase()}
                 </div>
               </div>

               {isExpanded && (
                 <div className="px-10 pb-6 pt-2 bg-gray-50 border-t border-gray-100 flex flex-col gap-6 relative">
                    <div className="flex gap-4 items-start">
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">DESC</div>
                       <div className="w-px h-full min-h-[20px] bg-gray-200"></div>
                       <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide leading-relaxed">
                          {factor.factor}
                       </p>
                    </div>

                    <div className="ml-12 space-y-4 pt-4 border-t border-gray-200">
                       <h5 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">Action</h5>
                       
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</label>
                         <select 
                           value={currentForm.category}
                           onChange={(e) => setMitigationForms(prev => ({ ...prev, [factor.id]: { ...currentForm, category: e.target.value } }))}
                           className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                         >
                           <option value="">Select a category...</option>
                           <option value="RFI_SENT">RFI sent to bank for more information</option>
                           <option value="ICR_COMPLETED">Intelligence Cross-Reference (ICR) Completed</option>
                           <option value="STR_CTR_SEARCH">Strategic STR/CTR Database Search</option>
                           <option value="EXTERNAL_VAL">External Database Validation (WorldCheck/Gisec)</option>
                           <option value="REG_DISCLOSURE">Regulatory Disclosure / SOP Triggered</option>
                           <option value="OPEN_PRIORITY">Remaining Open / Priority Analysis</option>
                         </select>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Notes</label>
                         <textarea 
                           placeholder="Enter mitigation details, actions taken, and rationale..."
                           value={currentForm.notes}
                           onChange={(e) => setMitigationForms(prev => ({ ...prev, [factor.id]: { ...currentForm, notes: e.target.value } }))}
                           className="w-full p-3 h-24 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                         />
                       </div>

                       <div className="flex justify-end mt-2">
                         <button 
                           onClick={() => handleSave(factor)}
                           className={`px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${
                             factor.mitigation 
                               ? 'bg-gray-200 text-gray-500 hover:bg-gray-300' 
                               : 'bg-blue-600 text-white hover:bg-blue-700'
                           }`}
                         >
                           {factor.mitigation ? 'Saved' : 'Save Mitigation'}
                         </button>
                       </div>
                    </div>
                 </div>
               )}
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default MitigationScorecard;
