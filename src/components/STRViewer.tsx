import React, { useState } from 'react';
import { X, CheckSquare, Square, FileText } from 'lucide-react';

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

const Part1Reporting = () => (
  <div className="space-y-6">
    <SectionTitle topLine="Part I" title="Reporting Institution" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Institution Type" value="BANK - FULL BANK" />
      <Field label="Business Type" value="COMMERCIAL BANKING" />
      <Field label="Name of Reporting Institution" value="STANDARD COMMERCE BANK SINGAPORE" />
      <Field label="UEN of Reporting Institution" value="201209384G" />
      <Field label="Internal Reporting Reference Number" value="SCB-STR-2026-00142" />
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

const Part2Account = () => (
  <div className="space-y-6">
    <SectionTitle topLine="Part II" title="Account Information" />
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
      <CheckItem label="Are there account(s) involved in the suspicious activity you are reporting on? (Yes)" checked={true} />
    </div>
    
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h4 className="font-bold text-gray-800 text-sm">Account 1</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Account Number" value="093-847291-0" bg={false} />
          <Field label="Account Type" value="Corporate Current Account" bg={false} />
          <Field label="Currency" value="SGD" bg={false} />
          <Field label="Date Opened" value="12/04/2021" bg={false} />
          <Field label="Status" value="Active / On-going" bg={false} />
          <Field label="Current Balance" value="3,294,019.45" bg={false} />
        </div>
      </div>
    </div>
  </div>
);

const Part3Entity = () => (
  <div className="space-y-8">
    <SectionTitle topLine="Part III" title="Entity Profile (Entity 1)" />
    
    <div>
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Entity Particulars</h4>
      <div className="space-y-3 mb-6">
        <CheckItem label="Entity featured in foreign adverse news/sanction lists" checked={true} />
        <CheckItem label="Entity featured in local adverse news/sanction lists" checked={false} />
        <CheckItem label="Entity is a Politically Exposed Person (PEP)" checked={false} />
      </div>
      <div className="p-3 bg-blue-50 border border-blue-100 rounded text-sm font-semibold text-blue-800 mb-4 inline-block">
        Type: Business Entity / Corporation
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Registered Name" value="BALTIC FREIGHT LOGISTICS LLP" />
        <Field label="Country of Incorporation" value="Estonia" />
        <Field label="Date of Registration" value="04/09/2018" />
        <Field label="Registration Number" value="EST-9938-22A" />
      </div>
    </div>

    <div>
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Entity Employment / Financial Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Main Business Activity" value="Shipping and Freight Forwarding" />
        <Field label="Annual Income Range" value="> SGD 10,000,000" />
      </div>
    </div>
  </div>
);

const Part4Policy = () => (
  <div className="space-y-6">
    <SectionTitle topLine="Part IV" title="Policy Information" />
    <div className="p-8 text-center text-gray-500 font-semibold border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
      This section is not applicable to the filing institution / business type.
    </div>
  </div>
);

const Part5Transactions = () => (
  <div className="space-y-8">
    <SectionTitle topLine="Part V" title="Suspicious Transaction(s)" />
    
    <div>
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Transaction Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Total Amount Involved (Actual Transactions)" value="SGD 5,231,000.00" />
        <Field label="Total Amount Involved (Attempted/Rejected)" value="N/A" />
      </div>
    </div>
    
    <div>
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Details (Transaction 1)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Field label="Type of Transaction" value="Outward Remittance" />
        <Field label="Amount in Original Currency" value="USD 3,900,000.00" />
        <Field label="Transaction Date" value="14/11/2025" />
        <Field label="Country of Destination" value="Estonia" />
      </div>
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 mt-2">
        <h5 className="font-bold text-xs text-gray-700 uppercase tracking-widest mb-3">Counterparty Data</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <Field label="Counterparty Name" value="BALTIC FREIGHT LOGISTICS LLP" bg={false} />
           <Field label="Counterparty Bank Name" value="Swedbank AS" bg={false} />
           <Field label="Counterparty Account Number" value="EE982200293188" bg={false} />
           <Field label="IP Address" value="212.47.234.11" bg={false} />
        </div>
      </div>
    </div>

    <div>
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Instruments / Mechanisms</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
         <CheckItem label="Physical Currency" checked={false} />
         <CheckItem label="Domestic Wire Transfer" checked={false} />
         <CheckItem label="International Wire Transfer" checked={true} />
         <CheckItem label="Virtual Assets" checked={false} />
         <CheckItem label="Cheque" checked={false} />
      </div>
    </div>
  </div>
);

const Part6Reasons = () => (
  <div className="space-y-8">
    <SectionTitle topLine="Part VI" title="Reasons for Suspicion" />
    
    <div>
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Possible Type of Crime</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <h5 className="font-bold text-sm text-gray-900 border-b-2 border-gray-200 pb-1 mb-2">Terrorism and Threats to National Security</h5>
          <div className="space-y-2">
             <CheckItem label="Terrorism-financing" checked={false} />
             <CheckItem label="Terrorism-related sanctions" checked={true} />
          </div>
        </div>
        <div>
          <h5 className="font-bold text-sm text-gray-900 border-b-2 border-gray-200 pb-1 mb-2">Money Laundering</h5>
          <div className="space-y-2">
             <CheckItem label="Third Party Laundering" checked={false} />
             <CheckItem label="ML Involving fraudulent trade documents" checked={true} />
          </div>
        </div>
        <div>
          <h5 className="font-bold text-sm text-gray-900 border-b-2 border-gray-200 pb-1 mb-2">Fraud / Cheating</h5>
          <div className="space-y-2">
             <CheckItem label="Fictitious Invoice Financing" checked={true} />
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8">
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Categories of Suspicion</h4>
      <div className="space-y-4">
        <h5 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1">Fund Movement</h5>
        <div className="grid grid-cols-1 gap-2 pl-2">
           <CheckItem label="Unusual/Uneconomic movement of funds" checked={true} />
           <CheckItem label="International outward transfer of funds to high-risk jurisdictions" checked={true} />
        </div>
        <h5 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mt-4">Structuring/Layering of Transactions</h5>
        <div className="grid grid-cols-1 gap-2 pl-2">
           <CheckItem label="Transactions using separate entities to conceal the source of funds" checked={true} />
           <CheckItem label="Transactions with offshore companies" checked={true} />
        </div>
      </div>
    </div>

    <div className="mt-8">
      <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Detailed Narrative</h4>
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 leading-relaxed min-h-[150px] whitespace-pre-wrap">
        {`Client account was funded rapidly via multiple incoming credits from domestic shell structures over a 14-day period. \n\nUpon consolidation, total SGD equivalent was immediately converted to USD ($3.9M) and wired to "Baltic Freight Logistics LLP" via Swedbank AS, citing 'heavy machinery advance'. Screenings flagged the destination company as a sanctioned OFAC node participating in restricted strategic goods brokering.\n\nWe are lodging this report following compliance directives since no legitimate economic rationale was established and the entity refused to provide requested shipping documentation.`}
      </div>
    </div>
  </div>
);

const Part7Validation = () => (
  <div className="space-y-6">
    <SectionTitle topLine="Part VII" title="Validation Summary" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
        <span className="text-sm font-semibold text-gray-700">Reporting Institution Status</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Validated</span>
      </div>
      <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
        <span className="text-sm font-semibold text-gray-700">Account Information Status</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Validated</span>
      </div>
      <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
        <span className="text-sm font-semibold text-gray-700">Entity Profile Status</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Validated</span>
      </div>
      <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
        <span className="text-sm font-semibold text-gray-700">Suspicious Transactions Status</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Validated</span>
      </div>
      <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
        <span className="text-sm font-semibold text-gray-700">Reason for Suspicion Status</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Validated</span>
      </div>
    </div>
  </div>
);

// We will add the rest of the tabs sequentially.

interface STRViewerProps {
  onClose: () => void;
  strId: string;
}

const STRViewer: React.FC<STRViewerProps> = ({ onClose, strId }) => {
  const [activeTab, setActiveTab] = useState(1);

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
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl flex flex-col h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Suspicious Transaction Report</h2>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">Reference: {strId} • Source: SONAR Feed • Mode: Read-Only</div>
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
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white">
          <div className="max-w-4xl mx-auto">
            {activeTab === 1 && <Part1Reporting />}
            {activeTab === 2 && <Part2Account />}
            {activeTab === 3 && <Part3Entity />}
            {activeTab === 4 && <Part4Policy />}
            {activeTab === 5 && <Part5Transactions />}
            {activeTab === 6 && <Part6Reasons />}
            {activeTab === 7 && <Part7Validation />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default STRViewer;
