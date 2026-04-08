import React, { useState, useMemo } from 'react';
import { X, User, Briefcase, Globe, FileText, CheckCircle, Search, AlertCircle, ArrowRight, ShieldAlert, BadgeCheck, Eye, ChevronLeft, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ManualCaseModalProps {
  onClose: () => void;
  preSelectedReportIds?: string[];
  onSuccess: () => void;
}

const ManualCaseModal: React.FC<ManualCaseModalProps> = ({ onClose, preSelectedReportIds = [], onSuccess }) => {
  const { createCase, allCases, setSelectedCase, setView } = useApp();
  const [step, setStep] = useState<'DISCOVERY' | 'ENTRY'>('DISCOVERY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [previewItem, setPreviewItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    nationality: 'Singaporean',
    occupation: '',
    title: preSelectedReportIds.length > 0 ? `Investigation into ${preSelectedReportIds.length} Linked Reports` : ''
  });

  const searchResults = useMemo(() => {
    if (searchQuery.length < 3) return [];
    const query = searchQuery.toLowerCase();
    return allCases.filter(c => 
      c.subject.name.toLowerCase().includes(query) || 
      c.subject.idNumber?.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query)
    );
  }, [searchQuery, allCases]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = createCase(
      {
        name: formData.name,
        idNumber: formData.idNumber,
        nationality: formData.nationality,
        occupation: formData.occupation
      },
      preSelectedReportIds,
      formData.title
    );
    
    // Auto-Pivot to the newly created case dossier
    setSelectedCase(newCase);
    setView('ANALYSIS');
    onSuccess();
  };

  const handleProceed = () => {
    if (selectedResult) {
      setFormData({
        ...formData,
        name: selectedResult.subject.name,
        idNumber: selectedResult.subject.idNumber || '',
        nationality: selectedResult.subject.nationality || 'Singaporean',
        occupation: selectedResult.subject.occupation || ''
      });
    } else {
      setFormData({...formData, name: searchQuery});
    }
    setStep('ENTRY');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in duration-300 relative">
        
        {/* Preview Overlay */}
        {previewItem && (
          <div className="absolute inset-0 z-50 bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <button onClick={() => setPreviewItem(null)} className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-800 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Discovery
              </button>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Intelligence Snapshot</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{previewItem.subject.name}</h2>
                  <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{previewItem.id} • {previewItem.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-red-600 tracking-tighter">{previewItem.subject.riskProfile.totalScore}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Risk Score</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-[8px]">Nationality</div>
                   <div className="text-sm font-bold text-gray-800">{previewItem.subject.nationality}</div>
                 </div>
                 <div className="space-y-1">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-[8px]">Sector</div>
                   <div className="text-sm font-bold text-gray-800">{previewItem.subject.occupation || 'N/A'}</div>
                 </div>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-blue-800 uppercase tracking-widest">
                   <Info className="w-4 h-4" /> Operational History
                 </div>
                 <p className="text-xs text-blue-900 leading-relaxed font-medium italic">
                   "Subject linked to {previewItem.reports?.length || 0} regulatory reports. Current investigation is handled by {previewItem.analyst || 'Unassigned'}."
                 </p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
               <button 
                onClick={() => { setSelectedResult(previewItem); setPreviewItem(null); }}
                className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <BadgeCheck className="w-4 h-4" /> Select this Profile
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                {step === 'DISCOVERY' ? 'Intelligence Discovery' : 'Manual Case Creation'}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {step === 'DISCOVERY' ? 'Mandatory Collision Check' : 'STRO Intelligence Generation'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'DISCOVERY' ? (
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Entity Information</span>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by Name, NRIC, or Case ID..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all shadow-inner"
                  />
                </div>
              </label>

              {/* Search Results */}
              <div className="min-h-[200px] max-h-[350px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {searchQuery.length >= 3 && searchResults.length > 0 && (
                  <>
                    <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                       <AlertCircle className="w-3 h-3" /> Potential Collisions Detected
                    </div>
                    {searchResults.map(c => (
                      <div 
                        key={c.id}
                        onClick={() => setSelectedResult(c === selectedResult ? null : c)}
                        className={`p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                          selectedResult?.id === c.id ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/10' : 'border-amber-100 bg-amber-50/30 hover:bg-amber-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg shadow-sm transition-colors ${selectedResult?.id === c.id ? 'bg-blue-600 text-white' : 'bg-white text-amber-600'}`}>
                             {selectedResult?.id === c.id ? <BadgeCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{c.subject.name}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.id} • {c.status}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={(e) => { e.stopPropagation(); setPreviewItem(c); }}
                             className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                           >
                             <Eye className="w-4 h-4" />
                           </button>
                           <ArrowRight className={`w-4 h-4 transition-all ${selectedResult?.id === c.id ? 'text-blue-600 translate-x-1' : 'text-gray-300'}`} />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {searchQuery.length >= 3 && searchResults.length === 0 && (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                       <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">No Existing Collisions Found</div>
                    <p className="text-xs text-gray-500 px-8">No investigations or leads currently match this entity in the STRO registry.</p>
                  </div>
                )}

                {searchQuery.length < 3 && (
                  <div className="py-12 text-center text-gray-400 italic text-sm">
                    Enter at least 3 characters to begin intelligence sweep...
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-50">
               <button 
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleProceed}
                className={`flex-1 py-4 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg ${
                  searchQuery.length >= 3 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {selectedResult ? 'Use Selected Profile' : 'Proceed to Manual Inception'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 animate-in slide-in-from-right-10 duration-500">
            {selectedResult && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Linked Operational Profile</div>
                    <div className="text-sm font-bold text-blue-900">{selectedResult.subject.name}</div>
                  </div>
                </div>
                <button type="button" onClick={() => { setSelectedResult(null); setStep('DISCOVERY'); }} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Change</button>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Target Subject Name</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Full Legal Name"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">ID / NRIC Number</span>
                    <input 
                      type="text"
                      value={formData.idNumber}
                      onChange={e => setFormData({...formData, idNumber: e.target.value})}
                      placeholder="S1234567X"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nationality</span>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type="text"
                        value={formData.nationality}
                        onChange={e => setFormData({...formData, nationality: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Occupation / Sector</span>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input 
                      type="text"
                      value={formData.occupation}
                      onChange={e => setFormData({...formData, occupation: e.target.value})}
                      placeholder="e.g. Precious Metals Dealer"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </label>
              </div>

              {preSelectedReportIds.length > 0 && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Linked Intelligence Bundle</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preSelectedReportIds.map(id => (
                      <span key={id} className="px-2 py-0.5 bg-white text-[10px] font-bold text-blue-600 rounded border border-blue-200 uppercase tracking-tighter shadow-sm">{id}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setStep('DISCOVERY')}
                className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                Back to Search
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Create Case
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManualCaseModal;
