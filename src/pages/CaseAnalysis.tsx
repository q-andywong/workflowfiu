import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import MitigationScorecard from '../components/MitigationScorecard';
import STRViewer from '../components/STRViewer';
import { Download, AlertTriangle, X, FileText } from 'lucide-react';

const CaseAnalysis: React.FC = () => {
    const { cases, selectedCase, setSelectedCase, assessEntity, setView, saveFindings } = useApp();
    const [showSTRViewer, setShowSTRViewer] = useState<string | null>(null);
    const [showHistoricCase, setShowHistoricCase] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>('');
    
    // In modal mode, we strictly respect the selection
    const activeCase = selectedCase;
    const profile = activeCase?.subject;
    
    const [findings, setFindings] = useState(profile?.investigationFindings || '');

    // Sync findings when profile changes
    React.useEffect(() => {
        if (profile) setFindings(profile.investigationFindings || '');
    }, [profile?.id, profile?.investigationFindings]);
    
    // Close handler
    const handleClose = () => {
        setSelectedCase(null);
        setView('DASHBOARD'); // Fallback to Dashboard
    };

    if (!activeCase || !profile) {
        return null;
    }

    const isEntity = activeCase.id.startsWith('TASK-');
    const isCompany = profile.type === 'COMPANY';

    const handleActionSubmit = () => {
        if (!selectedAction) return;
        assessEntity(activeCase.id, selectedAction as 'ESCALATE' | 'HIBERNATE' | 'DISMISS');
    };

    return (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-md flex justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="bg-gray-100 w-full max-w-7xl rounded-2xl shadow-2xl flex flex-col h-[95vh] transform transition-all animate-in zoom-in duration-300 overflow-hidden relative border border-gray-200">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                            <span className="font-bold text-xs uppercase tracking-widest">Workspace</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">Intelligence Analysis: {profile.name}</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-900 font-black text-[11px] uppercase tracking-wider rounded border border-gray-200">
                                    <span className="text-gray-400">REF:</span> {activeCase.id}
                                </span>
                                <span className={`flex items-center gap-1.5 px-2 py-0.5 font-black text-[11px] uppercase tracking-wider rounded border ${
                                    activeCase.status === 'PRIORITY' ? 'bg-red-50 text-red-700 border-red-200' : 
                                    activeCase.status === 'ANALYSIS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                    <span className={activeCase.status === 'PRIORITY' ? 'text-red-300' : activeCase.status === 'ANALYSIS' ? 'text-blue-300' : 'text-amber-300'}>STATUS:</span> {activeCase.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                    {showSTRViewer && <STRViewer onClose={() => setShowSTRViewer(null)} strId={showSTRViewer} />}
                    {showHistoricCase && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[110] flex justify-center items-center p-6 overflow-y-auto">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full flex flex-col transform transition-all animate-in zoom-in duration-300">
                                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Historic Case Access</h2>
                                    <button onClick={() => setShowHistoricCase(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">✕</button>
                                </div>
                                <div className="p-10 text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Download className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <p className="text-[11px] font-black text-blue-600 mb-2 uppercase tracking-[0.2em]">ARCHIVED INTELLIGENCE</p>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">{showHistoricCase}</h3>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-md mx-auto">
                                        This case was previously investigated and archived. Due to compartmentalization firewalls, a formal request must be submitted to the registry to unseal the full evidentiary file.
                                    </p>
                                    <div className="mt-10 flex gap-4 justify-center">
                                        <button className="px-8 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-sm text-sm transition-all" onClick={() => setShowHistoricCase(null)}>Cancel</button>
                                        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg text-sm transition-all" onClick={() => setShowHistoricCase(null)}>Request Access</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2 mb-4">
                            LINE 1 - INITIAL REVIEW & MITIGATION
                        </div>

                        {activeCase.status === 'PENDING_APPROVAL' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <h3 className="text-sm font-bold text-amber-900">Awaiting Director Sign-off</h3>
                                        <p className="text-xs text-amber-700">This entity has been escalated. Investigation capabilities are frozen until formal Case creation is approved by the Operations Manager.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            
                            {/* FULL WIDTH TOP: Risk Scores & Investigation Findings */}
                            <div className="xl:col-span-12">
                                <div className="p-4 bg-gray-900 rounded-t-xl shrink-0">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Risk Scores and Investigation Findings</h3>
                                </div>
                                <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
                                   <MitigationScorecard entityId={activeCase.id} scorecard={profile.riskProfile} />
                                </div>
                            </div>

                            {/* MID ROW: Entity Summary & Risk Profile (50/50) */}
                            <div className="xl:col-span-6">
                                {/* Entity Summary Panel */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                                    <div className="p-4 border-b border-gray-200 bg-teal-50/30">
                                        <h3 className="font-black text-teal-800 tracking-tight text-[11px] uppercase">Entity Summary by Q-Assist</h3>
                                    </div>
                                    <div className="p-6 space-y-4 flex-1">
                                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Identified Target</div>
                                            <div className="text-sm font-black text-gray-900 text-right">{profile.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-widest">Contextual AI Insight</div>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                {profile.summary || 'Summary generation in progress...'} 
                                                <span className="block mt-3 text-gray-500 italic">
                                                    Q-Assist has cross-referenced this subject against {profile.linkedSTRs?.length || 0} relative intelligence nodes, resulting in a consolidated risk score of {profile.riskProfile.totalScore}. High-confidence matches suggest immediate scrutiny of {profile.occupation || 'transactional activity'}.
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="xl:col-span-6">
                                {/* Risk Profile Panel */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                                        <h3 className="font-black text-gray-900 tracking-tight text-[11px] uppercase">Risk Profile & Classifications</h3>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Analysis Type</div>
                                            <div className="text-xs font-black text-gray-900 uppercase">{isCompany ? 'Contractor Integrity' : 'Financial Conduct'}</div>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Crime Typology</div>
                                            <div className="flex flex-wrap gap-2 justify-end">
                                               {profile.crimeTypologies?.length ? profile.crimeTypologies.map((t, idx) => (
                                                   <span key={idx} className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-black rounded border border-red-100 uppercase tracking-tighter">
                                                       {t}
                                                   </span>
                                               )) : (
                                                   <span className="text-xs text-gray-400 font-medium italic">Pending Classification</span>
                                               )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Strategic Risk Score</div>
                                            <div className="text-2xl font-black text-red-600 tracking-tighter">{profile.riskProfile.totalScore}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Primary Risk Factors</div>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.riskProfile.factors.slice(0, 4).map(f => (
                                                   <span key={f.id} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded border border-gray-200 uppercase">
                                                       {f.factor}
                                                   </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE WIDE: Entity Profile */}
                        <div className="xl:col-span-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative mt-2">
                            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
                            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2 uppercase tracking-widest">
                                    Entity Particulars & Intelligent Profiling
                                </h3>
                                <div className="flex gap-2 text-xs font-bold text-gray-600">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded transition-colors shadow-sm"><Download className="w-3.5 h-3.5" /> Export XML</button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded transition-colors shadow-sm"><Download className="w-3.5 h-3.5" /> Export PDF</button>
                                </div>
                            </div>

                            <div className="p-8 space-y-10">
                                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.2em]">Investigator Analysis & Case Findings</h4>
                                    </div>
                                    <textarea 
                                        value={findings}
                                        onChange={(e) => setFindings(e.target.value)}
                                        placeholder="Record qualitative findings, network link analysis summaries, and initial conclusions here..."
                                        className="w-full h-32 p-4 bg-white border border-blue-100 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner resize-none"
                                    />
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => saveFindings(activeCase.id, findings)}
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded shadow-lg transition-all uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" /> Save Analysis Findings
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    {/* Left Column: Screening Status */}
                                    <div className="lg:col-span-4 space-y-8">
                                        <div>
                                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">AI Screening Status</h4>
                                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
                                                {[
                                                    { label: 'Foreign Adverse News / Sanctions', val: profile.screeningStatus?.sanctionsMatch || profile.screeningStatus?.adverseNewsForeign },
                                                    { label: 'Local Adverse News / Media', val: profile.screeningStatus?.adverseNewsLocal },
                                                    { label: 'Politically Exposed Person (PEP)', val: profile.screeningStatus?.isPEP },
                                                    { label: 'Relative / Close Associate (RCA)', val: profile.screeningStatus?.isPEPRelative }
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${item.val ? 'bg-red-600 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'bg-white border-gray-300'}`}>
                                                            {item.val && <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                                                        </div>
                                                        <span className={`text-[11px] font-bold tracking-tight leading-tight ${item.val ? 'text-red-700' : 'text-gray-500'}`}>
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="pt-2 border-t border-gray-200 flex items-start gap-3">
                                                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${(profile.screeningStatus && Object.values(profile.screeningStatus).every(v => !v)) ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300'}`}>
                                                        {(profile.screeningStatus && Object.values(profile.screeningStatus).every(v => !v)) && <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                                                    </div>
                                                    <span className={`text-[11px] font-bold tracking-tight leading-tight ${(profile.screeningStatus && Object.values(profile.screeningStatus).every(v => !v)) ? 'text-green-700' : 'text-gray-400'}`}>
                                                        None of the Above / Clean Profile
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {profile.aliases && profile.aliases.length > 0 && (
                                            <div>
                                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Known Aliases</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.aliases.map((alias, i) => (
                                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-100 uppercase">
                                                            {alias}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Key Details Grid */}
                                    <div className="lg:col-span-8">
                                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Identity & Particulars</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                            {[
                                                { label: 'Full Legal Name', val: profile.name },
                                                { label: 'Date of Birth / Reg', val: profile.dob || 'Unknown' },
                                                { label: 'ID / Passport / NRIC', val: profile.idNumber || 'Not Provided' },
                                                { label: 'Gender', val: profile.gender || 'N/A' },
                                                { label: 'Nationality / Citizen', val: profile.nationality },
                                                { label: 'Country of Birth', val: profile.countryOfBirth || 'Unknown' },
                                                { label: 'Tax Residency', val: profile.taxResidency || 'Unknown' },
                                                { label: 'Primary Occupation', val: profile.occupation || 'Private Sector' },
                                                { label: 'Entity Status', val: profile.status || 'Active' }
                                            ].map((detail, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{detail.label}</div>
                                                    <div className="text-sm font-black text-gray-800">{detail.val}</div>
                                                </div>
                                            ))}
                                            <div className="col-span-2 md:col-span-3 pt-4 border-t border-gray-50 space-y-2">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered / Residential Address</div>
                                                <div className="text-sm font-bold text-gray-600 italic">
                                                    {profile.fullAddress || 'Address verification required via site visit or utility record cross-reference.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Governance / Projects Tier */}
                                <div className="border-t border-gray-100 pt-10">
                                    {isCompany ? (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                            <div className="space-y-6">
                                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">UBO / Control</h4>
                                                <div className="space-y-3">
                                                    {profile.ubos?.map((ubo, i) => (
                                                        <div key={i} className="p-3 bg-teal-50/30 rounded-lg border border-teal-100 text-sm font-black text-teal-900">{ubo}</div>
                                                    )) || <div className="text-sm text-gray-400 italic">None recorded</div>}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Board of Directors</h4>
                                                <div className="space-y-2">
                                                    {profile.directors?.map((d, i) => (
                                                        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm font-bold text-gray-700">
                                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                            {d}
                                                        </div>
                                                    )) || <div className="text-sm text-gray-400 italic">None recorded</div>}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Significant Projects</h4>
                                                <div className="space-y-3">
                                                    {profile.involvedProjects?.map((proj, i) => (
                                                        <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                                            <div className="flex justify-between text-xs font-black text-gray-900 pb-1 border-b border-gray-50 mb-2">
                                                                <span>{proj.name}</span>
                                                                <span className="text-green-700">{proj.value}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px] font-bold">
                                                                <span className="text-gray-400">{proj.location}</span>
                                                                <span className={proj.status === 'Open' ? 'text-teal-600 uppercase' : 'text-gray-400 uppercase'}>{proj.status}</span>
                                                            </div>
                                                        </div>
                                                    )) || <div className="text-sm text-gray-400 italic">No project data</div>}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Commercial Interests & Affiliations</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                {profile.companiesAssociated?.map((c, i) => (
                                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all group">
                                                        <div className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">{c.role}</div>
                                                        <div className="text-sm font-black text-gray-900 group-hover:text-blue-700">{c.name}</div>
                                                    </div>
                                                )) || <div className="col-span-4 text-sm text-gray-400 italic">No formal affiliations identified in national registry.</div>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sub-Panels: History & Reports */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-gray-100 pt-10">
                                    <div className="bg-gray-50/30 p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Intelligence Case History</h4>
                                        <div className="space-y-3">
                                            {profile.previousCases?.map((pc, i) => (
                                                <div key={i} onClick={() => setShowHistoricCase(pc.id)} className="flex justify-between items-center p-3 bg-white hover:bg-gray-50 rounded-lg cursor-pointer transition-all border border-gray-200 group shadow-sm">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-gray-700 tracking-wider group-hover:text-blue-600">{pc.id}</span>
                                                        <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">{pc.status}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs font-black text-red-600">{pc.score}</span>
                                                        <span className="text-[10px] font-black text-blue-500 mt-1 bg-blue-50 px-2 py-0.5 rounded uppercase">Verified</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/30 p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Linked Regulatory Reports</h4>
                                        <div className="space-y-3">
                                            {profile.linkedSTRs?.map((str, i) => (
                                                <div key={i} onClick={() => setShowSTRViewer(str.id)} className="flex justify-between items-center p-3 bg-white hover:bg-gray-50 rounded-lg cursor-pointer transition-all border border-gray-200 group shadow-sm">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-gray-700 tracking-wider group-hover:text-blue-600">{str.id}</span>
                                                        <span className="text-[10px] text-gray-500 mt-1 font-black uppercase tracking-widest">{str.date}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs font-black text-gray-900">{str.amount}</span>
                                                        <span className="text-[10px] font-black text-amber-600 mt-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">{str.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM: Actions */}
                        <div className="xl:col-span-12 bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-start gap-2 shadow-sm mt-2">
                            <h4 className="text-sm font-bold text-gray-900">Case Actions</h4>
                            
                            {activeCase.status === 'PENDING_APPROVAL' ? (
                                <div className="w-full flex items-center justify-center p-4 bg-gray-100 rounded-lg border border-gray-200">
                                    <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" /> Locked Pending Approval
                                    </span>
                                </div>
                            ) : (activeCase.status === 'ANALYSIS' || activeCase.status === 'PRIORITY') ? (
                                <div className="flex flex-col md:flex-row gap-4 w-full justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-sm">Formal Case Investigation Active</h5>
                                        <p className="text-xs text-gray-500">Target entity has passed triage. Proceed with network analysis via external integration.</p>
                                    </div>
                                    <a 
                                        href={`https://demo.quantexa.com/banking/share/investigation?id=${activeCase.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-6 py-2.5 bg-[#100628] text-white text-sm font-bold rounded-lg shadow hover:bg-black transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M80 20C80 11.163 72.837 4 64 4H20C11.163 4 4 11.163 4 20V64C4 72.837 11.163 80 20 80H54" stroke="white" stroke-width="12" stroke-linecap="round"/>
                                            <path d="M50 84L80 84C88.837 84 96 76.837 96 68V34C96 25.163 88.837 18 80 18H76" stroke="white" stroke-width="12" stroke-linecap="round"/>
                                            <line x1="60" y1="64" x2="96" y2="100" stroke="#00D7BA" stroke-width="16" stroke-linecap="round"/>
                                        </svg>
                                        Open in Quantexa
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <select 
                                            value={selectedAction}
                                            onChange={e => setSelectedAction(e.target.value)}
                                            disabled={!isEntity}
                                            className="bg-white border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-80 p-2.5 shadow-sm disabled:opacity-50"
                                        >
                                            <option value="">Select an action...</option>
                                            {isEntity && (
                                                <>
                                                    <option value="ESCALATE">Escalate (Create Case)</option>
                                                    <option value="HIBERNATE">Hibernate (Monitor)</option>
                                                    <option value="DISMISS">Dismiss (No Risk Found)</option>
                                                </>
                                            )}
                                        </select>
                                        <button 
                                            onClick={handleActionSubmit}
                                            disabled={!selectedAction}
                                            className={`px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all whitespace-nowrap ${
                                                selectedAction 
                                                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                                            }`}
                                        >
                                            Submit Action
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-2">
                                        Please complete all required actions before dismissing the case.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseAnalysis;
;
