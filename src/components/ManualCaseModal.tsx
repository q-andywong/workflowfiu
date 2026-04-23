import React, { useState, useMemo } from 'react';
import { X, User, Briefcase, FileText, CheckCircle, Search, ArrowRight, ShieldAlert, BadgeCheck, Zap, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { MOCK_STRS, MOCK_ENTITIES } from '../constants';
import { PersonProfile } from '../types';

interface ManualCaseModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preSelectedReportIds?: string[];
}

const ManualCaseModal: React.FC<ManualCaseModalProps> = ({ onClose, onSuccess, preSelectedReportIds = [] }) => {
  const { createCase, allCases, setSelectedCase, setView } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Kafka Sync Simulation
  const [isSyncingKafka, setIsSyncingKafka] = useState(false);
  const [kafkaSyncProgress, setKafkaSyncProgress] = useState(0);
  const [isSyncComplete, setIsSyncComplete] = useState(false);

  const handleCreateCaseTrigger = () => {
    setIsSyncingKafka(true);
    setKafkaSyncProgress(0);
    setIsSyncComplete(false);

    const duration = 1000; // 1s
    const interval = 20;
    let timer = 0;

    const progressInterval = setInterval(() => {
        timer += interval;
        setKafkaSyncProgress(Math.min((timer / duration) * 100, 100));

        if (timer >= duration) {
            clearInterval(progressInterval);
            setIsSyncComplete(true);
        }
    }, interval);
  };
  
  // Step 1: Meta
  const [caseMeta, setCaseMeta] = useState({
    title: '',
    description: ''
  });

  // Step 2: Search & Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<PersonProfile[]>([]);
  const [isCreatingNewSubject, setIsCreatingNewSubject] = useState(false);
  
  // Manual Subject Form
  const [newSubject, setNewSubject] = useState<Partial<PersonProfile>>({
    name: '',
    type: 'INDIVIDUAL',
    nationality: 'Singaporean',
    idNumber: ''
  });

  const availableSubjects = useMemo(() => {
    const subjects: PersonProfile[] = [];
    const seenIds = new Set<string>();

    // From existing cases
    allCases.forEach(c => {
      c.subjects.forEach(s => {
        if (!seenIds.has(s.id)) {
          subjects.push(s);
          seenIds.add(s.id);
        }
      });
    });

    // From Master Entities List
    MOCK_ENTITIES.forEach(entity => {
      if (!seenIds.has(entity.id)) {
        // Find STRs for this entity to enrich the search results if possible
        const linkedSTRs = MOCK_STRS.filter(str => 
          str.id.includes(entity.idNumber || entity.name) || 
          entity.linkedSTRs?.some(ls => ls.id === str.id)
        ).map(str => ({ id: str.id, date: str.date, amount: `${str.amount.toLocaleString()} ${str.currency}`, type: str.type }));

        subjects.push({
          ...entity,
          linkedSTRs: [...(entity.linkedSTRs || []), ...linkedSTRs].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
        });
        seenIds.add(entity.id);
      }
    });

    return subjects;
  }, [allCases]);

  const filteredResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return availableSubjects.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.idNumber?.toLowerCase().includes(q)
    );
  }, [searchQuery, availableSubjects]);

  const toggleSubject = (subject: PersonProfile) => {
    setSelectedSubjects(prev => 
      prev.find(s => s.id === subject.id) 
        ? prev.filter(s => s.id !== subject.id)
        : [...prev, subject]
    );
  };

  const handleAddManualEntity = () => {
    if (!newSubject.name) return;
    const s: PersonProfile = {
      id: `MANUAL-${Date.now()}`,
      name: newSubject.name!,
      type: newSubject.type as any,
      nationality: newSubject.nationality || 'Unknown',
      idNumber: newSubject.idNumber || '',
      riskProfile: { totalScore: 0, status: 'GRAY PENDING', factors: [] }
    };
    setSelectedSubjects(prev => [...prev, s]);
    setIsCreatingNewSubject(false);
    setSearchQuery('');
    setNewSubject({ name: '', type: 'INDIVIDUAL', nationality: 'Singaporean', idNumber: '' });
  };

  const handleCreateCaseFinalize = () => {
    const newCase = createCase(
      selectedSubjects,
      caseMeta.description,
      caseMeta.title,
      preSelectedReportIds
    );
    
    setSelectedCase(newCase);
    setView('ANALYSIS');
    onSuccess();
    setIsSyncingKafka(false);
    setIsSyncComplete(false);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in duration-300 relative">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
               {step === 1 ? <FileText className="w-6 h-6" /> : step === 2 ? <Search className="w-6 h-6" /> : <BadgeCheck className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                {step === 1 ? 'Operational Intent' : step === 2 ? 'Intelligence Discovery' : 'Final Verification'}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                <span className={step === 1 ? 'text-blue-600' : ''}>Step 1</span>
                <span>/</span>
                <span className={step === 2 ? 'text-blue-600' : ''}>Step 2</span>
                <span>/</span>
                <span className={step === 3 ? 'text-blue-600' : ''}>Finish</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
              <div className="space-y-2">
                <h4 className="text-sm font-black text-gray-900 uppercase">1. Investigation Metadata</h4>
                <p className="text-xs text-gray-500 font-medium italic">Define the operational scope and focus of this manual inception.</p>
              </div>
              
              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Operation / Case Name</span>
                  <input 
                    type="text"
                    value={caseMeta.title}
                    onChange={e => setCaseMeta({...caseMeta, title: e.target.value})}
                    placeholder="e.g. Operation Goldcrest / Shell Entity Sweep 2026"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Operational Summary</span>
                  <textarea 
                    value={caseMeta.description}
                    onChange={e => setCaseMeta({...caseMeta, description: e.target.value})}
                    placeholder="Briefly describe the rationale for this manual case creation..."
                    className="w-full h-32 px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
                  />
                </label>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!caseMeta.title}
                  className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  Discovery Phase <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
              {!isCreatingNewSubject ? (
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-gray-900 uppercase">2. Intelligence Sweep</h4>
                    <p className="text-xs text-gray-500 font-medium italic">Search for existing entities in the national database or linked regulatory reports.</p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search entities by name or ID..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Results / Selected List */}
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar min-h-[100px]">
                    {searchQuery.length >= 2 ? (
                      filteredResults.length > 0 ? (
                        filteredResults.map(s => (
                          <div 
                            key={s.id}
                            onClick={() => toggleSubject(s)}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              selectedSubjects.find(sub => sub.id === s.id) 
                                ? 'bg-blue-50 border-blue-600 shadow-sm' 
                                : 'bg-white border-gray-100 hover:border-blue-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${selectedSubjects.find(sub => sub.id === s.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {s.type === 'COMPANY' ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900">{s.name}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.idNumber || 'No ID Record'}</div>
                              </div>
                            </div>
                            {selectedSubjects.find(sub => sub.id === s.id) && <CheckCircle className="w-5 h-5 text-blue-600" />}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-xs text-gray-400 font-bold uppercase italic tracking-widest">No matching database records found.</p>
                          <button 
                            onClick={() => setIsCreatingNewSubject(true)}
                            className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                            + Manually create new entity profile
                          </button>
                        </div>
                      )
                    ) : (
                      selectedSubjects.length > 0 ? (
                        <div className="space-y-2">
                           <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selected Investigation Targets ({selectedSubjects.length})</div>
                           {selectedSubjects.map(s => (
                             <div key={s.id} className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="text-blue-600 bg-white p-1.5 rounded-lg shadow-sm">
                                    {s.type === 'COMPANY' ? <Briefcase className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                  </div>
                                  <span className="text-xs font-bold text-blue-900">{s.name}</span>
                                </div>
                                <button onClick={() => toggleSubject(s)} className="text-blue-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-300 italic text-sm">Use search to find targets or create a new one below</div>
                      )
                    )}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-6 py-4 border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      disabled={selectedSubjects.length === 0}
                      className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-300 transition-all"
                    >
                      Verify Scope ({selectedSubjects.length})
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-300">
                   <div className="space-y-2">
                    <h4 className="text-sm font-black text-gray-900 uppercase">New Entity Creation</h4>
                    <p className="text-xs text-gray-500 font-medium italic">Manually seeding a new subject into the intelligence framework.</p>
                   </div>

                   <div className="space-y-4">
                     <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        {['INDIVIDUAL', 'COMPANY'].map(type => (
                          <button 
                            key={type}
                            onClick={() => setNewSubject({...newSubject, type: type as any})}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${newSubject.type === type ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            {type}
                          </button>
                        ))}
                     </div>

                     <label className="block">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Full Legal Name</span>
                        <input 
                          type="text"
                          value={newSubject.name}
                          onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                          placeholder="Individual or Company Name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                     </label>

                     <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">ID / NRIC / UEN</span>
                           <input 
                             type="text"
                             value={newSubject.idNumber}
                             onChange={e => setNewSubject({...newSubject, idNumber: e.target.value})}
                             placeholder="S1234567X"
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                           />
                        </label>
                        <label className="block">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nationality / Domicile</span>
                           <input 
                             type="text"
                             value={newSubject.nationality}
                             onChange={e => setNewSubject({...newSubject, nationality: e.target.value})}
                             placeholder="Singaporean"
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                           />
                        </label>
                     </div>
                   </div>

                   <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => { setIsCreatingNewSubject(false); setNewSubject({name: '', type: 'INDIVIDUAL', nationality: 'Singaporean', idNumber: ''}); }}
                        className="flex-1 py-3 border border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-xl"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAddManualEntity}
                        disabled={!newSubject.name}
                        className="flex-1 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 disabled:bg-gray-200 transition-all"
                      >
                        Add to Investigation
                      </button>
                   </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
               <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-100">
                    <BadgeCheck className="w-8 h-8" />
                 </div>
                 <h4 className="text-lg font-black text-gray-900 uppercase">Ready for Inception</h4>
                 <p className="text-xs text-gray-500 font-medium italic max-w-xs mx-auto">Please verify the investigation scope before finalizing the intelligence record.</p>
               </div>

               <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Operational ID</div>
                    <div className="text-sm font-bold text-gray-900 uppercase tracking-tighter">{caseMeta.title}</div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Targets ({selectedSubjects.length})</div>
                    <div className="grid grid-cols-1 gap-2">
                       {selectedSubjects.map(s => (
                         <div key={s.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                {s.type === 'COMPANY' ? <Briefcase className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-xs font-bold text-gray-700">{s.name}</span>
                            </div>
                            <span className="text-[9px] font-black text-gray-400 uppercase">{s.idNumber || 'S-NEW'}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="px-6 py-4 border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleCreateCaseTrigger}
                    className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    Incept Investigation <CheckCircle className="w-4 h-4" />
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Kafka Sync Simulation Modal */}
        {isSyncingKafka && (
          <div className="fixed inset-0 z-[300] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden border border-gray-100">
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
                  </div>

                  <div className="relative z-10 text-center">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all duration-500 ${isSyncComplete ? 'bg-red-50 scale-110' : 'bg-blue-50'}`}>
                          {!isSyncComplete ? (
                              <Zap className="w-10 h-10 text-blue-600 animate-pulse" />
                          ) : (
                              <Check className="w-12 h-12 text-red-600" strokeWidth={4} />
                          )}
                      </div>

                      <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">
                          {!isSyncComplete ? 'Broadcasting Manual Case Inception' : 'Case Synchronized Successfully'}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
                          {!isSyncComplete ? 'Broadcasting: case.event.manual_inception' : 'Ingestion status: COMPLETE (RED-TICK)'}
                      </p>

                      <div className="space-y-4">
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                  className={`h-full transition-all duration-75 ease-linear ${isSyncComplete ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}
                                  style={{ width: `${kafkaSyncProgress}%` }}
                              ></div>
                          </div>
                          <div className="flex justify-between items-center px-1">
                              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isSyncComplete ? 'text-red-600' : 'text-blue-600'}`}>
                                  {isSyncComplete ? 'BROADCAST COMPLETE' : 'KAFKA TRANSMISSION'}
                              </span>
                              <span className="text-[8px] font-black text-gray-400">{Math.round(kafkaSyncProgress)}%</span>
                          </div>
                      </div>

                      {isSyncComplete && (
                          <button 
                              onClick={handleCreateCaseFinalize}
                              className="w-full mt-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 animate-in fade-in slide-in-from-bottom-2 duration-500"
                          >
                              Continue to Investigation
                          </button>
                      )}
                  </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualCaseModal;
