import React, { useState } from 'react';
import { IntelligenceCase, Attachment, IntelligenceChart } from '../types';
import { FileText, Check, Package, Eye, ChevronRight, Image as ImageIcon, BarChart3, Clock, User, ShieldCheck, Download, ExternalLink } from 'lucide-react';

interface ReportBuilderProps {
  activeCase: IntelligenceCase;
  onPackage: (reportData: any) => void;
  onClose: () => void;
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({ activeCase, onPackage, onClose }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>(activeCase.attachments?.map(a => a.id) || []);
  const [selectedCharts, setSelectedCharts] = useState<string[]>(activeCase.charts?.map(c => c.id) || []);
  const [synopsis, setSynopsis] = useState(activeCase.findings || '');

  const toggleAttachment = (id: string) => {
    setSelectedAttachments(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const toggleChart = (id: string) => {
    setSelectedCharts(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const selectedAttachmentsList = activeCase.attachments?.filter(a => selectedAttachments.includes(a.id)) || [];
  const selectedChartsList = activeCase.charts?.filter(c => selectedCharts.includes(c.id)) || [];

  return (
    <div className="fixed inset-0 z-[120] bg-[#100628]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col group">
        
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#100628] flex items-center justify-center shadow-2xl shadow-blue-200">
                    <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Dissemination Report Compiler
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-200 shadow-sm">v4.2 Analysis</span>
                    </h2>
                    <div className="flex items-center gap-4 mt-1.5">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Build: 4 mins</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Governance Verified</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-8 relative z-10">
                <div className="flex items-center gap-2">
                    {[1, 2].map((s) => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-blue-600' : 'w-4 bg-gray-200'}`}></div>
                    ))}
                </div>
                <button onClick={onClose} className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all">
                    <Trash2 className="w-6 h-6" />
                </button>
            </div>
        </div>

        <div className="flex-grow flex overflow-hidden">
            {step === 1 ? (
                <div className="flex-grow flex overflow-hidden">
                    {/* Left: Intelligence Selection */}
                    <div className="w-2/5 border-r border-gray-100 overflow-y-auto p-10 space-y-10 bg-gray-50/30">
                        <section className="space-y-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <ImageIcon className="w-3.5 h-3.5" /> Evidentiary Assets
                            </h3>
                            <div className="space-y-2">
                                {(activeCase.attachments || []).map(a => (
                                    <button 
                                        key={a.id}
                                        onClick={() => toggleAttachment(a.id)}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedAttachments.includes(a.id) ? 'bg-white border-blue-600 shadow-lg shadow-blue-50' : 'bg-transparent border-transparent hover:bg-gray-100/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedAttachments.includes(a.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className={`text-[11px] font-black uppercase tracking-tight ${selectedAttachments.includes(a.id) ? 'text-gray-900' : 'text-gray-500'}`}>{a.name}</div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{a.type.split('/')[1]} • {(a.size / 1024).toFixed(1)} KB</div>
                                            </div>
                                        </div>
                                        {selectedAttachments.includes(a.id) && <Check className="w-4 h-4 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <BarChart3 className="w-3.5 h-3.5" /> Analytical Visualizations
                            </h3>
                            <div className="space-y-2">
                                {(activeCase.charts || []).map(c => (
                                    <button 
                                        key={c.id}
                                        onClick={() => toggleChart(c.id)}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedCharts.includes(c.id) ? 'bg-white border-blue-600 shadow-lg shadow-blue-50' : 'bg-transparent border-transparent hover:bg-gray-100/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedCharts.includes(c.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <BarChart3 className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className={`text-[11px] font-black uppercase tracking-tight ${selectedCharts.includes(c.id) ? 'text-gray-900' : 'text-gray-500'}`}>{c.title}</div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{c.type} Visualization</div>
                                            </div>
                                        </div>
                                        {selectedCharts.includes(c.id) && <Check className="w-4 h-4 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Synopsis Builder */}
                    <div className="flex-grow p-10 flex flex-col bg-white">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" /> Executive Intelligence Synopsis
                        </label>
                        <textarea 
                            value={synopsis}
                            onChange={(e) => setSynopsis(e.target.value)}
                            className="flex-grow w-full p-8 border-2 border-gray-100 rounded-[2rem] text-sm font-medium leading-relaxed bg-gray-50/30 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:italic"
                            placeholder="Draft the final intelligence conclusion here. This narrative will be the primary text for the external dissemination partner."
                        ></textarea>
                        
                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={() => setStep(2)}
                                className="px-10 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:translate-x-1"
                            >
                                Preview Report <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto bg-gray-100/50 p-12">
                    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-[3rem] overflow-hidden border border-gray-200 min-h-screen mb-20 animate-in zoom-in-95 duration-500">
                        {/* Report Letterhead */}
                        <div className="p-16 border-b-8 border-[#100628]">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Republic of Singapore</div>
                                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase max-w-md leading-tight">Forensic Intelligence Dissemination</h1>
                                    <div className="mt-6 flex items-center gap-4">
                                        <span className="text-xs font-bold text-gray-500">Case ID: <span className="text-gray-900 text-sm font-black">{activeCase.id}</span></span>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                        <span className="text-xs font-bold text-gray-500">Date: <span className="text-gray-900 text-sm font-black">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</span></span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-3xl mb-4 ml-auto">FIU</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">Internal Security Registry<br/>Confidential / Analyst Eyes Only</div>
                                </div>
                            </div>

                            <section className="space-y-6">
                                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100 pb-3 flex items-center gap-3">
                                    <Target className="w-4 h-4 text-blue-600" /> Operational Synopsis
                                </h2>
                                <p className="text-gray-800 text-sm font-medium leading-[2] text-justify first-letter:text-4xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-blue-600">
                                    {synopsis}
                                </p>
                            </section>

                            <section className="mt-16 space-y-8">
                                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100 pb-3">Attached Evidence & Visuals</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedAttachmentsList.map(a => (
                                        <div key={a.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                            <FileText className="w-6 h-6 text-gray-400" />
                                            <div>
                                                <div className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{a.name}</div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{a.uploadedAt} • Digital Hash Verified</div>
                                            </div>
                                        </div>
                                    ))}
                                    {selectedChartsList.map(c => (
                                        <div key={c.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                            <BarChart3 className="w-6 h-6 text-blue-500" />
                                            <div>
                                                <div className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{c.title}</div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Analytical Model • High Fidelity</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Digitally Signed By</div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xs font-black text-blue-600">SL</div>
                                        <div>
                                            <div className="text-sm font-black text-gray-900 tracking-tight">Lead Investigator Lim</div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">FIU Operations Bureau</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-3 text-center">QR Verification Hash</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-50">
                        <button 
                            onClick={() => setStep(1)}
                            className="px-8 py-4 bg-white text-gray-900 text-xs font-black uppercase tracking-widest rounded-2xl shadow-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-3"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Edit
                        </button>
                        <button 
                            onClick={() => onPackage({ synopsis, selectedAttachments, selectedCharts })}
                            className="px-10 py-4 bg-[#100628] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-2xl flex items-center gap-4 hover:translate-y-[-4px] hover:shadow-blue-200/50 transition-all"
                        >
                            <Download className="w-5 h-5" /> Finalize & Disseminate
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
