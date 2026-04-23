import React, { useState } from 'react';
import { X, Briefcase, Globe, AlertTriangle, CheckCircle2, ArrowRightLeft, Shield, Package } from 'lucide-react';
import { MockCMR, CbniItem, MOCK_CMRS } from '../constants';

// ─── Re-usable Field Component (teal theme) ──────────────────────────────────
const Field = ({ label, value }: { label: string; value?: string | React.ReactNode }) => (
  <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-md">
    <span className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">{label}</span>
    <span className="block text-sm font-semibold text-gray-900">{value || '—'}</span>
  </div>
);

const SectionTitle = ({ topLine, title }: { topLine?: string; title: string }) => (
  <div className="mb-5">
    {topLine && <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded inline-block mb-1">{topLine}</div>}
    <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-teal-100">{title}</h3>
  </div>
);

const RedFlagBadge = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
    <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
    <span className="text-xs font-semibold text-red-800">{text}</span>
  </div>
);

// ─── Address formatter ────────────────────────────────────────────────────────
const formatAddress = (addr: any): string => {
  if (!addr) return '—';
  if (typeof addr === 'string') return addr;
  const parts = [addr.block, addr.streetName, addr.unitNumber, addr.city, addr.postalCode ? `S${addr.postalCode}` : undefined, addr.country].filter(Boolean);
  return parts.join(', ') + (addr.temporaryAccommodation ? ' (Temporary)' : '');
};

// ─── TAB 1: Personal Particulars ─────────────────────────────────────────────
const Tab1Particulars = ({ cmr }: { cmr: MockCMR }) => (
  <div className="space-y-6">
    <SectionTitle topLine="Part I — NP728" title="Personal Particulars of Declarant" />
    {cmr.partI.identificationNote && (
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <Briefcase className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <span className="text-sm font-semibold text-amber-800">{cmr.partI.identificationNote}</span>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Full Name (as in passport/ID)" value={cmr.partI.declarantFullName} />
      <Field label="Identification Type" value={cmr.partI.identificationType} />
      <Field label="Identification Number" value={cmr.partI.identificationNumber} />
      <Field label="Country / Region of Issue" value={cmr.partI.countryOfIssue} />
      <Field label="Occupation / Profession" value={cmr.partI.occupation} />
    </div>
    <div className="mt-4">
      <SectionTitle title="Address Details" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Permanent Address" value={formatAddress(cmr.partI.permanentAddress)} />
        <Field
          label="Address in Singapore"
          value={
            cmr.partI.addressInSingapore
              ? typeof cmr.partI.addressInSingapore === 'string'
                ? cmr.partI.addressInSingapore
                : (cmr.partI.addressInSingapore as any).checkboxNotApplicable
                  ? `☑ Not Applicable — ${(cmr.partI.addressInSingapore as any).note}`
                  : formatAddress(cmr.partI.addressInSingapore)
              : '—'
          }
        />
      </div>
    </div>
  </div>
);

// ─── CBNI Row Card ────────────────────────────────────────────────────────────
const CbniCard = ({ item, index }: { item: CbniItem; index: number }) => {
  const isSanctioned = item.source?.sanctionsNote;
  const isBearerInstrument = item.cbniType.toLowerCase().includes('bearer') || item.cbniType.toLowerCase().includes('cheque');
  return (
    <div className={`border rounded-xl p-4 space-y-4 ${isSanctioned ? 'border-red-300 bg-red-50/30' : isBearerInstrument ? 'border-amber-300 bg-amber-50/20' : 'border-teal-100 bg-gray-50/40'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${isSanctioned ? 'bg-red-500 text-white' : 'bg-teal-600 text-white'}`}>{index + 1}</div>
          <div>
            <div className="font-bold text-sm text-gray-900">{item.cbniType}</div>
            {isBearerInstrument && <div className="text-[10px] font-black text-amber-600 uppercase tracking-wider">⚠ Bearer Instrument — High Risk</div>}
            {isSanctioned && <div className="text-[10px] font-black text-red-600 uppercase tracking-wider">🚨 {item.source?.sanctionsNote}</div>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-black text-gray-900">{item.currency} {item.amount.toLocaleString()}</div>
          {item.amountEquivSGD && <div className="text-xs text-gray-500 font-semibold">≈ SGD {item.amountEquivSGD.toLocaleString()}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Country Carried From" value={item.countryCarriedFrom} />
        <Field label="Owned by Declarant" value={item.ownedBySelf ? '☑ Yes — declarant is the owner' : '☐ No — third party owns the CBNI'} />
        <div className="md:col-span-2">
          <Field label="Purpose of Movement" value={item.purposeOfMovement} />
        </div>
      </div>

      {(!item.ownedBySelf && (item.source || item.recipient)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-teal-100">
          {item.source && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Source of CBNI</div>
              <div className="text-sm font-bold text-gray-900">{item.source.businessName || 'Unknown'}</div>
              <div className="text-xs text-gray-600 mt-0.5">{item.source.entityType} · {item.source.relationship}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.source.address?.city}, {item.source.address?.country}</div>
              {item.source.sanctionsNote && (
                <div className="mt-2 text-[10px] font-black text-red-600 bg-red-100 px-2 py-1 rounded">{item.source.sanctionsNote}</div>
              )}
            </div>
          )}
          {item.recipient && (
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2">Recipient of CBNI</div>
              <div className="text-sm font-bold text-gray-900">{item.recipient.businessName || 'Unknown'}</div>
              <div className="text-xs text-gray-600 mt-0.5">{item.recipient.entityType} · {item.recipient.relationship}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.recipient.address?.city}, {item.recipient.address?.country}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TAB 2: CBNI Information ──────────────────────────────────────────────────
const Tab2CBNI = ({ cmr }: { cmr: MockCMR }) => (
  <div className="space-y-6">
    <SectionTitle topLine="Part II — NP728" title="Information on Physical Currency & Bearer Negotiable Instruments (CBNI)" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Field label="Movement Direction" value={cmr.partII.movementDirection} />
      <Field label="Country Travelled From" value={cmr.partII.countryFrom} />
      <Field label="Flight / Vehicle / Vessel" value={cmr.partII.flightVehicleVessel} />
      <Field label="Date of Arrival" value={cmr.partII.dateOfArrival} />
      <Field label="Time of Arrival" value={cmr.partII.timeOfArrival} />
      <Field label="Total CBNI Value (SGD equiv)" value={`SGD ${cmr.partII.totalEquivSGD.toLocaleString()}`} />
    </div>

    <div>
      <h4 className="text-sm font-black text-gray-700 bg-teal-50 border border-teal-100 px-3 py-2 rounded-lg uppercase tracking-wider mb-4 flex items-center gap-2">
        <Package className="w-4 h-4 text-teal-600" />
        CBNI Item(s) — {cmr.partII.cbniItems.length} declared
      </h4>
      <div className="space-y-4">
        {cmr.partII.cbniItems.map((item, i) => (
          <CbniCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  </div>
);

// ─── TAB 3: Declaration + FIU Annotations ────────────────────────────────────
const Tab3Declaration = ({ cmr }: { cmr: MockCMR }) => {
  const isCritical = cmr.fiu_annotations.priorityLevel === 'CRITICAL';
  return (
    <div className="space-y-6">
      <SectionTitle topLine="Part III — NP728" title="Declaration & Submission" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Report Number" value={cmr.partIII.reportNumber} />
        <Field label="Submitted Via" value={cmr.partIII.submittedVia} />
        <Field label="Date of Submission" value={cmr.partIII.dateOfSubmission} />
        <Field label="Submission Status" value={cmr.partIII.submissionStatus} />
      </div>
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${cmr.partIII.declarationChecked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 ${cmr.partIII.declarationChecked ? 'text-green-500' : 'text-gray-300'}`} />
        <div>
          <div className="text-sm font-bold text-gray-900">{cmr.partIII.declarationText}</div>
          <div className="text-xs text-gray-500 mt-0.5">{cmr.partIII.declarationChecked ? 'Declaration confirmed by declarant.' : 'Declaration not yet confirmed.'}</div>
        </div>
      </div>

      {/* FIU Intelligence Overlay */}
      <div className={`mt-4 rounded-xl border p-5 space-y-4 ${isCritical ? 'border-red-300 bg-red-50/40' : 'border-amber-200 bg-amber-50/30'}`}>
        <div className="flex items-center gap-2">
          <Shield className={`w-5 h-5 ${isCritical ? 'text-red-600' : 'text-amber-600'}`} />
          <h4 className={`text-sm font-black uppercase tracking-widest ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
            FIU Intelligence Overlay {isCritical && '— CRITICAL PRIORITY'}
          </h4>
        </div>
        <div className="space-y-2">
          {cmr.fiu_annotations.redFlags.map((flag, i) => <RedFlagBadge key={i} text={flag} />)}
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-200">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest self-center mr-1">Linked Scores:</span>
          {cmr.fiu_annotations.linkedScores.map(score => (
            <span key={score} className="px-2 py-0.5 bg-white border border-teal-200 text-teal-700 text-[10px] font-black rounded uppercase tracking-wider">{score}</span>
          ))}
        </div>
        <div className="text-xs text-gray-600 font-semibold pt-1">
          Linked STR: <span className="font-black text-gray-900">{cmr.fiu_annotations.linkedSTR}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main CMRViewer ───────────────────────────────────────────────────────────
interface CMRViewerProps { onClose: () => void; reportId: string; }

const CMRViewer: React.FC<CMRViewerProps> = ({ onClose, reportId }) => {
  const [activeTab, setActiveTab] = useState(1);
  const cmr = MOCK_CMRS.find(c => c.reportId === reportId);

  if (!cmr) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
          <h2 className="text-xl font-bold">CMR Not Found</h2>
          <p className="text-gray-500 text-sm">The CMR record <span className="font-black text-teal-700 bg-teal-50 px-1 rounded">"{reportId}"</span> could not be found in the local data pool.</p>
          <button onClick={onClose} className="w-full py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors">Close</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 1, label: 'Personal Particulars' },
    { id: 2, label: 'CBNI Details' },
    { id: 3, label: 'Declaration & FIU Notes' },
  ];

  const isCritical = cmr.fiu_annotations.priorityLevel === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[90vh] transform transition-all animate-in zoom-in duration-300">

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 rounded-t-xl ${isCritical ? 'bg-red-50 border-red-200' : 'bg-teal-50 border-teal-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-600 text-white' : 'bg-teal-600 text-white'}`}>
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Cash Movement Report</h2>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded border uppercase tracking-widest ${isCritical ? 'bg-red-100 text-red-700 border-red-300' : 'bg-teal-100 text-teal-700 border-teal-200'}`}>CMR · NP728</span>
                {isCritical && <span className="px-2 py-0.5 text-[10px] font-black rounded bg-red-600 text-white uppercase tracking-widest animate-pulse">⚠ CRITICAL</span>}
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
                {cmr.reportId} · {cmr.linkedSubjectName} · Score: {cmr.scorecardOverallScore}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/60 rounded-full transition-colors text-gray-500 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-semibold transition-colors duration-200 whitespace-nowrap focus:outline-none ${
                activeTab === tab.id
                  ? 'border-b-2 border-teal-500 text-teal-700 bg-white shadow-sm'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white">
          <div className="max-w-4xl mx-auto">
            {activeTab === 1 && <Tab1Particulars cmr={cmr} />}
            {activeTab === 2 && <Tab2CBNI cmr={cmr} />}
            {activeTab === 3 && <Tab3Declaration cmr={cmr} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMRViewer;
