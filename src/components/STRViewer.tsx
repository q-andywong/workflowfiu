import React, { useState } from 'react';
import { X, CheckSquare, Square, FileText, AlertCircle, Send, ExternalLink, AlertTriangle, ShieldCheck, ShieldX, CreditCard, Building2, DollarSign, ArrowRightLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { STR_CRIME_TYPES, STR_SUSPICION_CATEGORIES, MOCK_CASES, MOCK_CMRS, MOCK_CTRS, MOCK_STRS_FULL, MockSTRFull, STRAccountInfo } from '../constants';
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

const ScreeningBadge = ({ label, flagged }: { label: string; flagged: boolean }) => (
  <div className={`flex items-center gap-2 p-3 rounded-lg border ${flagged ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
    {flagged ? <ShieldX className="w-4 h-4 text-red-500 shrink-0" /> : <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
    <span className={`text-xs font-bold ${flagged ? 'text-red-800' : 'text-emerald-800'}`}>{label}</span>
  </div>
);

const Part1Reporting = ({ report, fullSTR }: { report: SuspiciousTransactionReport; fullSTR?: MockSTRFull }) => {
  const tab = fullSTR?.tabI_reportingInstitution;
  return (
    <div className="space-y-6">
      <SectionTitle topLine="Part I" title="Reporting Institution" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Institution Type" value={tab?.institutionType || 'BANK - FULL BANK'} />
        <Field label="Business Type" value={tab?.businessType || 'COMMERCIAL BANKING'} />
        <Field label="Name of Reporting Institution" value={tab?.nameOfReportingInstitution || report.institution} />
        <Field label="UEN of Reporting Institution" value={tab?.UEN || '201209384G'} />
        <Field label="Internal Reporting Reference Number" value={tab?.internalReportingReferenceNumber || `SCB-${report.id}`} />
        <Field label="Notice Reference Number" value={tab?.noticeReferenceNumber || 'N/A'} />
      </div>

      <div className="mt-8">
        <SectionTitle title="Contact Officer Particulars" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" value={tab?.contactOfficer?.name || 'Tan Wei Ming'} />
          <Field label="Designation" value={tab?.contactOfficer?.designation || 'Compliance VP'} />
          <Field label="Direct Contact Number" value={tab?.contactOfficer?.directContactNumber || '+65 67123984'} />
          <Field label="Email" value={tab?.contactOfficer?.email || 'weiming.tan@scb.com.sg'} />
        </div>
      </div>
    </div>
  );
};

const AccountCard = ({ account, isPrimary }: { account: STRAccountInfo; isPrimary?: boolean }) => (
  <div className={`border rounded-xl p-5 space-y-4 ${account.amlAlertTriggered ? 'border-red-200 bg-red-50/20' : 'border-gray-100 bg-gray-50/30'}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${account.amlAlertTriggered ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          <CreditCard className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-black text-gray-900 tracking-tight">{account.accountNumber}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isPrimary ? 'Primary Account' : 'Additional Account'}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${account.accountStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
          {account.accountStatus}
        </span>
        {account.amlAlertTriggered && (
          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> AML ALERT
          </span>
        )}
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <Field label="Account Type" value={account.accountType} />
      <Field label="Currency" value={account.currency} />
      <Field label="Opening Date" value={account.openingDate} />
      {account.productType && <Field label="Product Type" value={account.productType} />}
      {account.branch && <Field label="Branch" value={account.branch} />}
      {account.accountHolderName && <Field label="Account Holder" value={account.accountHolderName} />}
      {account.bankRiskRating !== undefined && <Field label="Bank Risk Rating" value={String(account.bankRiskRating)} />}
      {account.priorFilingCount !== null && account.priorFilingCount !== undefined && (
        <Field label="Prior Filing Count" value={
          <span className={account.priorFilingCount > 0 ? 'text-amber-600 font-black' : ''}>
            {account.priorFilingCount}
          </span>
        } />
      )}
      {account.contactNumber && <Field label="Contact Number" value={account.contactNumber} />}
    </div>
    {account.additionalAccountsOnSameHolding && account.additionalAccountsOnSameHolding.length > 0 && (
      <div className="mt-4 pl-4 border-l-2 border-blue-200 space-y-3">
        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Additional Accounts on Same Holding</div>
        {account.additionalAccountsOnSameHolding.map((sub, idx) => (
          <AccountCard key={idx} account={sub} />
        ))}
      </div>
    )}
  </div>
);

const Part2AccountInfo = ({ fullSTR }: { fullSTR: MockSTRFull }) => (
  <div className="space-y-6">
    <SectionTitle topLine="Part II" title="Account Information" />
    <div className="flex items-center gap-3 mb-2">
      <Building2 className="w-5 h-5 text-blue-600" />
      <span className="text-sm font-bold text-gray-700">{fullSTR.tabII_accountInformation.length} account(s) linked to this report</span>
    </div>
    <div className="space-y-4">
      {fullSTR.tabII_accountInformation.map((account, idx) => (
        <AccountCard key={idx} account={account} isPrimary={idx === 0} />
      ))}
    </div>
  </div>
);

const formatAddress = (addr: any): string => {
  if (!addr) return '-';
  if (typeof addr === 'string') return addr;
  const parts = [addr.block, addr.streetName, addr.unitNumber, addr.city || addr.postalCode ? `S${addr.postalCode}` : undefined, addr.country].filter(Boolean);
  return parts.join(', ');
};

const Part3EntityInfo = ({ fullSTR }: { fullSTR: MockSTRFull }) => {
  const entity = fullSTR.tabIII_entityInformation;
  const isNaturalPerson = entity.entityType === 'Natural Person';
  const screening = entity.screeningResults;

  return (
    <div className="space-y-6">
      <SectionTitle topLine="Part III" title="Entity Information" />

      <div className="flex items-center gap-3 mb-2">
        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${isNaturalPerson ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
          {entity.entityType}
        </span>
      </div>

      {isNaturalPerson ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" value={entity.fullName} />
            <Field label="Date of Birth" value={entity.dateOfBirth || '-'} />
            <Field label="Gender" value={entity.gender || '-'} />
            <Field label="Nationality" value={entity.nationality || '-'} />
            <Field label="Identification Type" value={entity.identificationType || '-'} />
            <Field label="Identification Number" value={entity.identificationNumber || '-'} />
            {entity.occupation && <Field label="Occupation" value={entity.occupation} />}
            {entity.employer && <Field label="Employer" value={entity.employer} />}
          </div>
          {entity.residentialAddress && (
            <div>
              <SectionTitle title="Residential Address" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entity.residentialAddress.block && <Field label="Block" value={entity.residentialAddress.block} />}
                {entity.residentialAddress.streetName && <Field label="Street Name" value={entity.residentialAddress.streetName} />}
                {entity.residentialAddress.unitNumber && <Field label="Unit Number" value={entity.residentialAddress.unitNumber} />}
                {entity.residentialAddress.postalCode && <Field label="Postal Code" value={entity.residentialAddress.postalCode} />}
                <Field label="Country" value={entity.residentialAddress.country || '-'} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Company Name" value={entity.companyName || entity.fullName} />
            <Field label="Registration Number" value={entity.companyRegistrationNumber || '-'} />
            <Field label="Country of Incorporation" value={entity.countryOfIncorporation || '-'} />
            {entity.principalBusinessActivity && <Field label="Principal Business Activity" value={entity.principalBusinessActivity} />}
          </div>
          {entity.registeredAddress && (
            <div>
              <SectionTitle title="Registered Address" />
              <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-md">
                <span className="block text-sm font-semibold text-gray-900">{formatAddress(entity.registeredAddress)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {screening && (
        <div className="mt-6">
          <SectionTitle title="Screening Results" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ScreeningBadge label="Politically Exposed Person (PEP)" flagged={screening.isPEP} />
            <ScreeningBadge label="PEP Relative / Close Associate" flagged={screening.isPEPRelative} />
            <ScreeningBadge label="Adverse News (Foreign)" flagged={screening.adverseNewsForeign} />
            <ScreeningBadge label="Adverse News (Local)" flagged={screening.adverseNewsLocal} />
            <ScreeningBadge label="Sanctions Match" flagged={screening.sanctionsMatch} />
          </div>
        </div>
      )}

      {entity.additionalParties && entity.additionalParties.length > 0 && (
        <div className="mt-6">
          <SectionTitle title="Additional Parties" />
          <div className="space-y-3">
            {entity.additionalParties.map((party: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-50/50 border border-gray-100 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Name" value={party.fullName || party.companyName || '-'} />
                  <Field label="Type" value={party.entityType || '-'} />
                  {party.relationship && <Field label="Relationship" value={party.relationship} />}
                  {party.nationality && <Field label="Nationality" value={party.nationality} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Part5Transactions = ({ fullSTR }: { fullSTR: MockSTRFull }) => {
  const txn = fullSTR.tabIV_suspiciousTransactions;

  return (
    <div className="space-y-6">
      <SectionTitle topLine="Part V" title="Suspicious Transaction(s)" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Surveillance Period</div>
          <div className="text-sm font-bold text-amber-900">{txn.transactionPeriod.from} — {txn.transactionPeriod.to}</div>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Total Suspicious Amount</div>
          <div className="text-lg font-black text-red-900">{txn.totalSuspiciousAmount.currency} {txn.totalSuspiciousAmount.amount.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Transaction Count</div>
          <div className="text-lg font-black text-blue-900">{txn.transactions.length}</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-[9px] font-black text-gray-500 uppercase tracking-widest">#</th>
              <th className="px-4 py-3 text-left text-[9px] font-black text-gray-500 uppercase tracking-widest">Date</th>
              <th className="px-4 py-3 text-left text-[9px] font-black text-gray-500 uppercase tracking-widest">Type</th>
              <th className="px-4 py-3 text-left text-[9px] font-black text-gray-500 uppercase tracking-widest">Channel</th>
              <th className="px-4 py-3 text-right text-[9px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
              <th className="px-4 py-3 text-left text-[9px] font-black text-gray-500 uppercase tracking-widest">Counterparty</th>
              <th className="px-4 py-3 text-left text-[9px] font-black text-gray-500 uppercase tracking-widest">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {txn.transactions.map((t, idx) => {
              const isLarge = t.amount >= 50000;
              const isCrossBorder = t.type.toLowerCase().includes('cross-border') || t.channel.toLowerCase().includes('cmr') || t.channel.toLowerCase().includes('cbni');
              return (
                <tr key={idx} className={`hover:bg-gray-50/50 transition-colors ${isLarge ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 text-xs text-gray-400 font-bold">{idx + 1}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-900 whitespace-nowrap">{t.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-900">{t.type}</span>
                      {isCrossBorder && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-black uppercase">Cross-Border</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{t.channel}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-bold ${isLarge ? 'text-red-600' : 'text-gray-900'}`}>
                      {t.currency} {t.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">{t.counterparty}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[250px]">{t.remarks}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 border-gray-300">
              <td colSpan={4} className="px-4 py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Suspicious Amount</td>
              <td className="px-4 py-3 text-right text-sm font-black text-red-600">{txn.totalSuspiciousAmount.currency} {txn.totalSuspiciousAmount.amount.toLocaleString()}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const Part6Reasons = ({ report, fullSTR }: { report: SuspiciousTransactionReport; fullSTR?: MockSTRFull }) => (
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
        {fullSTR?.tabV_reasonsForSuspicion?.detailedNarrative || report.narrative || "No narrative provided for this intelligence node."}
      </div>
    </div>

    {fullSTR?.tabV_reasonsForSuspicion?.legalBasis && (
      <div className="mt-4">
        <h4 className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded uppercase tracking-wider mb-4">Legal Basis</h4>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-semibold text-blue-800">
          {fullSTR.tabV_reasonsForSuspicion.legalBasis}
        </div>
      </div>
    )}
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

  // Lookup full structured STR data
  const fullSTR = MOCK_STRS_FULL.find(s => s.reportId === searchId);

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
            {activeTab === 1 && <Part1Reporting report={report} fullSTR={fullSTR} />}
            {activeTab === 2 && (fullSTR ? <Part2AccountInfo fullSTR={fullSTR} /> : <GenericPart title="Account Information" part="Part II" />)}
            {activeTab === 3 && (fullSTR ? <Part3EntityInfo fullSTR={fullSTR} /> : <GenericPart title="Entity Profile" part="Part III" />)}
            {activeTab === 4 && <GenericPart title="Policy Information" part="Part IV" />}
            {activeTab === 5 && (fullSTR ? <Part5Transactions fullSTR={fullSTR} /> : <GenericPart title="Suspicious Transaction(s)" part="Part V" />)}
            {activeTab === 6 && <Part6Reasons report={report} fullSTR={fullSTR} />}
            {activeTab === 7 && <GenericPart title="Validation Summary" part="Part VII" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default STRViewer;
