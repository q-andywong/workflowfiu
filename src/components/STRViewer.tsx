import React, { useState } from 'react';
import { X, CheckSquare, Square, FileText, AlertCircle, Send, ExternalLink } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { STR_CRIME_TYPES, STR_SUSPICION_CATEGORIES, MOCK_CASES, MOCK_CMRS, MOCK_CTRS } from '../constants';
import { SuspiciousTransactionReport, IntelligenceCase } from '../types';
import CMRViewer from './CMRViewer';
import CTRViewer from './CTRViewer';

// Reusable UI Components for Read-Only Presentation
const Field = ({ label, value, bg = true }: { label: string, value: string | React.ReactNode, bg?: boolean }) => (
  <div className={`p-3 ${bg ? 'bg-gray-50/50' : ''} border border-gray-100 rounded-md`}>
    <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</span>
    <span className="block text-sm font-semibold text-gray-900">{value || '-'}</span>
  </div>
);

const CheckItem = ({ label, checked }: { label: string, checked: boolean }) => (
  <div className="flex items-start gap-2">
    {checked ? <CheckSquare className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> : <Square className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />}
    <span className={`text-sm ${checked ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>{label}</span>
  </div>
);

const SectionTitle = ({ topLine, title }: { topLine?: string, title: string }) => (
  <div className="mb-4">
    {topLine && <div className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">{topLine}</div>}
    <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-200">{title}</h3>
  </div>
);

const Part1Reporting = ({ report }: { report: SuspiciousTransactionReport }) => (
  <div className="space-y-6">
    <SectionTitle topLine="Part I" title="Reporting Institution" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Institution Type" value="BANK - FULL BANK" />
      <Field label="Business Type" value="COMMERCIAL BANKING" />
      <Field label="Name of Reporting Institution" value={report.institution} />
      <Field label="UEN of Reporting Institution" value="201209384G" />
      <Field label="Internal Reporting Reference Number" value={`SCB-${report.id}`} />
      <Field label="Notice Reference Number" value="N/A" />
    </div>
    
    <div className="mt-8">
      <SectionTitle title="Contact Officer Particulars" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name" value="Tan Wei Ming" />
        <Field label="Designation" value="Compliance VP" />
        <Field label="Direct Contact Number" value="+65 67123984" />
        <Field label="Email" value="weiming.tan@scb.com.sg" />
      </div>
    </div>
  </div>
);

const Part6Reasons = ({ report }: { report: SuspiciousTransactionReport }) => (
  <div className="space-y-8">
    <SectionTitle topLine="Part VI" title="Reasons for Suspicion" />
    
    <div>
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Possible Type of Crime</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {Object.entries(STR_CRIME_TYPES).map(([key, cat]: [string, any]) => (
          <div key={key}>
            <h5 className="font-bold text-sm text-gray-900 border-b-2 border-gray-200 pb-1 mb-2">{cat.label}</h5>
            <div className="space-y-2">
              {cat.items.map((item: any) => (
                <CheckItem 
                  key={item.id} 
                  label={item.label} 
                  checked={report.crimeTypes?.includes(item.id) || false} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="mt-8">
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Categories of Suspicion</h4>
      <div className="space-y-6">
        {Object.entries(STR_SUSPICION_CATEGORIES).map(([key, cat]: [string, any]) => (
          <div key={key}>
            <h5 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-3">{cat.label}</h5>
            <div className="grid grid-cols-1 gap-2 pl-2">
              {cat.items.map((item: any) => (
                <CheckItem 
                  key={item.id} 
                  label={item.label} 
                  checked={report.suspicionCategories?.includes(item.id) || false} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-8">
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Detailed Narrative</h4>
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 leading-relaxed min-h-[150px] whitespace-pre-wrap">
        {report.narrative || "No narrative provided for this intelligence node."}
      </div>
    </div>
  </div>
);

// Other parts remain mostly static for visual demonstration but use the report ID
const GenericPart = ({ title, part }: { title: string, part: string }) => (
  <div className="space-y-6">
    <SectionTitle topLine={part} title={title} />
    <div className="p-12 text-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
      Visual reconstruction for this section is based on standard operational templates.
    </div>
  </div>
);

interface STRViewerProps {
  onClose: () => void;
  strId: string;
}

const STRViewer: React.FC<STRViewerProps> = ({ onClose, strId }) => {
  const { allCases } = useApp();
  const [activeTab, setActiveTab] = useState(6); // Default to Reasons for Suspicion to show work

  const searchId = strId.trim();

  // Primary lookup in the App Context
  let report = allCases
    .flatMap(c => c.reports || [])
    .find(r => r.id === searchId);

  // Desperate fallback to the raw mock data if context pool resolution fails
  // (Safeguard against potential state synchronization delays)
  if (!report) {
    report = MOCK_CASES
      .flatMap((c: IntelligenceCase) => c.reports || [])
      .find((r: SuspiciousTransactionReport) => r.id === searchId);
  }

  // Route CMR/CTR to dedicated viewers if full structured data exists
  if (report?.type === 'CMR') {
    const hasCMRData = MOCK_CMRS.some(c => c.reportId === searchId);
    if (hasCMRData) return <CMRViewer onClose={onClose} reportId={searchId} />;
  }
  if (report?.type === 'CTR') {
    const hasCTRData = MOCK_CTRS.some(c => c.reportId === searchId);
    if (hasCTRData) return <CTRViewer onClose={onClose} reportId={searchId} />;
  }

  if (!report) {
    const availableIds = allCases.flatMap(c => (c.reports || []).map(r => r.id)).slice(0, 5);
    return (
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-bold">Report Not Found</h2>
          <p className="text-gray-500 text-sm font-medium"> The intelligence report <span className="text-red-600 font-bold bg-red-50 px-1 rounded">"{searchId}"</span> could not be retrieved from the current context pool. </p>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-100">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">eSONAR External Gateway</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Direct communication with filing institution</p>
              </div>
            </div>
            <button 
              onClick={() => {
                alert('INTEGRATION HOOK: Communication request dispatched to eSONAR Portal. Filer will be notified to provide supplementary narrative for ' + searchId);
              }}
              className="px-6 py-3 bg-white border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Request Filer Clarification
            </button>
          </div>
          <button onClick={onClose} className="w-full py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors shadow-lg">Close</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 1, name: 'Reporting Institution' },
    { id: 2, name: 'Account Information' },
    { id: 3, name: 'Entity Information' },
    { id: 4, name: 'Policy Information' },
    { id: 5, name: 'Suspicious Transactions' },
    { id: 6, name: 'Reasons for Suspicion' },
    { id: 7, name: 'Validation Summary' }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col h-[90vh] transform transition-all animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Intelligence Report Reconstruction</h2>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">Reference: {strId} • Source: Digitized Ingestion • Status: {report.status}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 shrink-0 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold transition-colors duration-200 whitespace-nowrap focus:outline-none ${
                activeTab === tab.id
                  ? 'border-b-2 border-amber-400 text-gray-900 bg-white shadow-sm'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {activeTab === 1 && <Part1Reporting report={report} />}
            {activeTab === 2 && <GenericPart title="Account Information" part="Part II" />}
            {activeTab === 3 && <GenericPart title="Entity Profile" part="Part III" />}
            {activeTab === 4 && <GenericPart title="Policy Information" part="Part IV" />}
            {activeTab === 5 && <GenericPart title="Suspicious Transaction(s)" part="Part V" />}
            {activeTab === 6 && <Part6Reasons report={report} />}
            {activeTab === 7 && <GenericPart title="Validation Summary" part="Part VII" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default STRViewer;
