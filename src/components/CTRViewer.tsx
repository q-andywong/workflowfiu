import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Building2, Coins, User, Shield, Gem } from 'lucide-react';
import { MockCTR, CashTransaction, MOCK_CTRS } from '../constants';

// ─── Re-usable Field Component (purple theme) ─────────────────────────────────
const Field = ({ label, value }: { label: string; value?: string | React.ReactNode }) => (
  <div className="p-3 bg-purple-50/40 border border-purple-100 rounded-md">
    <span className="block text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">{label}</span>
    <span className="block text-sm font-semibold text-gray-900">{value || '—'}</span>
  </div>
);

const SectionTitle = ({ topLine, title }: { topLine?: string; title: string }) => (
  <div className="mb-5">
    {topLine && <div className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-block mb-1">{topLine}</div>}
    <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-purple-100">{title}</h3>
  </div>
);

const RedFlagBadge = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
    <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
    <span className="text-xs font-semibold text-red-800">{text}</span>
  </div>
);

const formatAddress = (addr: any): string => {
  if (!addr) return '—';
  if (typeof addr === 'string') return addr;
  const parts = [addr.block, addr.streetName, addr.unitNumber, addr.city, addr.postalCode ? `S${addr.postalCode}` : undefined, addr.country].filter(Boolean);
  return parts.join(', ');
};

// ─── TAB 1: Reporting Institution ────────────────────────────────────────────
const Tab1Institution = ({ ctr }: { ctr: MockCTR }) => (
  <div className="space-y-6">
    <SectionTitle topLine="Part I — NP784" title="Reporting Institution's Information" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="md:col-span-2">
        <Field label="Name of Reporting Institution" value={ctr.partI.reportingInstitution.name} />
      </div>
      <Field label="Registration Number (UEN)" value={ctr.partI.reportingInstitution.registrationNumber} />
      <Field label="Country of Registration" value={ctr.partI.reportingInstitution.countryOfRegistration} />
      <div className="md:col-span-2">
        <Field label="Institution Type" value={ctr.partI.reportingInstitution.institutionType} />
      </div>
      <Field label="Internal Reference Number" value={ctr.partI.reportingInstitution.internalReferenceNumber} />
      <Field label="Reporting Officer" value="[Auto-populated from CorpPass upon SONAR submission]" />
    </div>
    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
      <p className="text-xs text-purple-700 font-semibold leading-relaxed">
        <strong>NP784 Guidance:</strong> The reference number is system-populated when the CTR is successfully submitted on the SONAR filing platform. The reporting officer's identifying information is based on the particulars associated with the logged-in CorpPass account. Greyed fields are auto-populated and do not require manual entry.
      </p>
    </div>
  </div>
);

// ─── Transaction Row Card ─────────────────────────────────────────────────────
const TransactionCard = ({ txn, index }: { txn: CashTransaction; index: number }) => {
  const isLoss = txn.remarks.toLowerCase().includes('loss');
  const isMirror = txn.remarks.toLowerCase().includes('mirror');
  return (
    <div className={`border rounded-xl p-4 space-y-4 ${isMirror || isLoss ? 'border-amber-200 bg-amber-50/20' : 'border-purple-100 bg-gray-50/30'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm font-black">
            {txn.transactionNumber}
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900">{txn.commodityType}</div>
            <div className="text-xs text-gray-500">{txn.transactionDate} · {txn.transactionType}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-gray-500 uppercase tracking-wider">{txn.cashAmount.label}</div>
          <div className="text-xl font-black text-gray-900">{txn.cashAmount.currency} {txn.cashAmount.amount.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Commodity" value={txn.commodityDescription} />
        <Field label="Quantity" value={`${txn.quantity} ${txn.unitOfMeasure}`} />
        <Field label="Payment Mode" value={txn.paymentMode} />
        <Field label="Transacting Officer" value={`${txn.transactingOfficerName} (${txn.transactingOfficerDesignation})`} />
      </div>

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Remarks / FIU Notes</div>
        <p className="text-xs text-gray-800 font-medium leading-relaxed">{txn.remarks}</p>
      </div>
    </div>
  );
};

// ─── TAB 2: Cash Transactions ─────────────────────────────────────────────────
const Tab2Transactions = ({ ctr }: { ctr: MockCTR }) => (
  <div className="space-y-6">
    <SectionTitle topLine="Part II — NP784" title="Details of Cash Transaction(s)" />
    {ctr.partII.totalCash && (
      <div className="flex items-center gap-4 p-4 bg-purple-600 text-white rounded-xl">
        <Coins className="w-8 h-8 shrink-0" />
        <div>
          <div className="text-xs font-black uppercase tracking-widest opacity-70">Total Cash Amount (Primary Transaction)</div>
          <div className="text-2xl font-black">{ctr.partII.totalCash.currency} {ctr.partII.totalCash.amount.toLocaleString()}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs font-black uppercase tracking-widest opacity-70">No. of Transactions</div>
          <div className="text-2xl font-black">{ctr.partII.cashTransactions.length}</div>
        </div>
      </div>
    )}
    <div className="space-y-4">
      {ctr.partII.cashTransactions.map((txn, i) => (
        <TransactionCard key={i} txn={txn} index={i} />
      ))}
    </div>
  </div>
);

// ─── TAB 3: Transacting Person ────────────────────────────────────────────────
const Tab3TransactingPerson = ({ ctr }: { ctr: MockCTR }) => (
  <div className="space-y-6">
    <SectionTitle topLine="Part III — NP784" title="Identity of the Person Who Transacted in Cash" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="md:col-span-2">
        <Field label="Entity Type" value={ctr.partIII.personWhoTransacted.isIndividualOrBusiness === 'Individual' ? '☑ Individual — triggers Part IV (Person Owner details)' : '☑ Business — triggers Part V (Business Owner details)'} />
      </div>
    </div>
    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-semibold">
      {ctr.partIII.personWhoTransacted.isIndividualOrBusiness === 'Individual'
        ? '→ See Part IV tab for the identity of the person who owns the cash / commodity.'
        : '→ See Part V tab for the identity of the business entity that owns the cash / commodity.'}
    </div>
  </div>
);

// ─── TAB 4: Cash Owner (Person or Business) ───────────────────────────────────
const Tab4Owner = ({ ctr }: { ctr: MockCTR }) => {
  const p4 = ctr.partIV?.personOwnerOfCash;
  const p5 = ctr.partV?.businessOwnerOfCash;
  return (
    <div className="space-y-6">
      {p4 && (
        <>
          <SectionTitle topLine="Part IV — NP784" title="Identity of the Person Who Owns the Cash / Commodity" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="First Name" value={p4.firstName} />
            <Field label="Last Name" value={p4.lastName} />
            <Field label="Date of Birth" value={p4.dateOfBirth} />
            <Field label="Nationality" value={p4.nationality} />
            <Field label="Identification Type" value={p4.identificationType} />
            <Field label="Identification Number" value={p4.identificationNumber} />
            <div className="md:col-span-2">
              <Field label="Permanent Address" value={formatAddress(p4.permanentAddress)} />
            </div>
            <div className="md:col-span-2">
              <Field label="Relationship to Transacting Person" value={p4.relationshipToTransactor} />
            </div>
          </div>
        </>
      )}
      {p5 && (
        <>
          <SectionTitle topLine="Part V — NP784" title="Identity of the Business That Owns the Cash / Commodity" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Field label="Business Name" value={p5.businessName} />
            </div>
            <Field label="Registration Number (UEN)" value={p5.registrationNumber} />
            <Field label="Country of Incorporation" value={p5.countryOfIncorporation} />
            <div className="md:col-span-2">
              <Field label="Business Nature / Principal Activity" value={p5.businessNature} />
            </div>
            <Field label="PSMD Business?" value={p5.isPSMD ? '☑ Yes' : '☐ No — not a PSMD entity'} />
            <Field label="Relationship to Transactor" value={p5.relationshipToTransactor} />
            <div className="md:col-span-2">
              <Field label="Registered / Principal Address" value={formatAddress(p5.principalAddress)} />
            </div>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Authorised Representative</div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Name" value={p5.authorisedRepresentative.name} />
              <Field label="ID Number" value={p5.authorisedRepresentative.identification} />
              <Field label="Designation" value={p5.authorisedRepresentative.designation} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── TAB 5: Declaration + FIU Overlay ────────────────────────────────────────
const Tab5Declaration = ({ ctr }: { ctr: MockCTR }) => (
  <div className="space-y-6">
    <SectionTitle topLine="Part VI — NP784" title="Declaration & Submission Details" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Report Number" value={ctr.partVI.reportNumber} />
      <Field label="Submitted Via" value={ctr.partVI.submittedVia} />
      <Field label="Date of Declaration" value={ctr.partVI.dateOfDeclaration} />
      <Field label="Submission Status" value={ctr.partVI.submissionStatus} />
    </div>
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${ctr.partVI.declarationChecked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
      <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 ${ctr.partVI.declarationChecked ? 'text-green-500' : 'text-gray-300'}`} />
      <div>
        <div className="text-sm font-bold text-gray-900">{ctr.partVI.declarationText}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          {ctr.partVI.declarationChecked ? 'Form validated and declaration confirmed via SONAR.' : 'Pending validation.'}
        </div>
      </div>
    </div>

    {/* FIU Intelligence Overlay */}
    <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-amber-600" />
        <h4 className="text-sm font-black uppercase tracking-widest text-amber-700">FIU Intelligence Overlay</h4>
      </div>
      <div className="space-y-2">
        {ctr.fiu_annotations.redFlags.map((flag, i) => <RedFlagBadge key={i} text={flag} />)}
      </div>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-200">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest self-center mr-1">Linked Scores:</span>
        {ctr.fiu_annotations.linkedScores.map(score => (
          <span key={score} className="px-2 py-0.5 bg-white border border-purple-200 text-purple-700 text-[10px] font-black rounded uppercase tracking-wider">{score}</span>
        ))}
      </div>
      <div className="text-xs text-gray-600 font-semibold pt-1">
        Linked STR: <span className="font-black text-gray-900">{ctr.fiu_annotations.linkedSTR}</span>
      </div>
    </div>
  </div>
);

// ─── Main CTRViewer ───────────────────────────────────────────────────────────
interface CTRViewerProps { onClose: () => void; reportId: string; }

const CTRViewer: React.FC<CTRViewerProps> = ({ onClose, reportId }) => {
  const [activeTab, setActiveTab] = useState(1);
  const ctr = MOCK_CTRS.find(c => c.reportId === reportId);

  if (!ctr) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center">
          <AlertTriangle className="w-12 h-12 text-purple-500" />
          <h2 className="text-xl font-bold">CTR Not Found</h2>
          <p className="text-gray-500 text-sm">The CTR record <span className="font-black text-purple-700 bg-purple-50 px-1 rounded">"{reportId}"</span> could not be found in the local data pool.</p>
          <button onClick={onClose} className="w-full py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors">Close</button>
        </div>
      </div>
    );
  }

  const hasPart4 = !!ctr.partIV;
  const hasPart5 = !!ctr.partV;
  const ownerLabel = hasPart4 ? 'Person Owner (IV)' : hasPart5 ? 'Business Owner (V)' : 'Cash Owner';

  const tabs = [
    { id: 1, label: 'Reporting Institution' },
    { id: 2, label: 'Cash Transactions' },
    { id: 3, label: 'Transacting Person' },
    { id: 4, label: ownerLabel },
    { id: 5, label: 'Declaration & FIU Notes' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[90vh] transform transition-all animate-in zoom-in duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 shrink-0 rounded-t-xl bg-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 text-white rounded-lg">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Cash Transaction Report</h2>
                <span className="px-2 py-0.5 text-[10px] font-black rounded border uppercase tracking-widest bg-purple-100 text-purple-700 border-purple-200">CTR · NP784</span>
                <span className="px-2 py-0.5 text-[10px] font-black rounded bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-widest">{ctr.partI.reportingInstitution.institutionType.split('—')[0].trim()}</span>
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
                {ctr.reportId} · {ctr.linkedSubjectName} · Score: {ctr.scorecardOverallScore}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/60 rounded-full transition-colors text-gray-500 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 shrink-0 no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold transition-colors duration-200 whitespace-nowrap focus:outline-none ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-700 bg-white shadow-sm'
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
            {activeTab === 1 && <Tab1Institution ctr={ctr} />}
            {activeTab === 2 && <Tab2Transactions ctr={ctr} />}
            {activeTab === 3 && <Tab3TransactingPerson ctr={ctr} />}
            {activeTab === 4 && <Tab4Owner ctr={ctr} />}
            {activeTab === 5 && <Tab5Declaration ctr={ctr} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTRViewer;
