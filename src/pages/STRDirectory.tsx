import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { MOCK_STRS } from '../constants';
import { FileText, Search, Filter, Download, ExternalLink, AlertCircle, PlusCircle, Link } from 'lucide-react';
import STRViewer from '../components/STRViewer';
import BulkActionToolbar from '../components/BulkActionToolbar';
import ManualCaseModal from '../components/ManualCaseModal';

const STRDirectory: React.FC = () => {
    const { allCases } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSTR, setSelectedSTR] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Combine mock master list with any dynamic reports and find associated subjects
    const filteredSTRs = MOCK_STRS.filter(str => 
        str.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        str.institution.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSubjectForSTR = (strId: string) => {
        const linkedCase = allCases.find(c => 
            c.reports.some(r => r.id === strId) || 
            c.subject.linkedSTRs?.some(ls => ls.id === strId)
        );
        return linkedCase?.subject.name || 'Unknown / Unlinked';
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredSTRs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSTRs.map(s => s.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const bulkActions = [
        { 
            label: 'Create Case from Selection', 
            icon: <PlusCircle className="w-4 h-4" />, 
            onClick: () => setShowCreateModal(true),
            variant: 'primary' as const 
        },
        { 
            label: 'Link to Existing', 
            icon: <Link className="w-4 h-4" />, 
            onClick: () => alert('Feature coming in next update: Linking to existing cases.'),
            variant: 'default' as const 
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        STR Master Registry
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Comprehensive repository of all suspicious transaction reports</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                        Export Registry
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all">
                        Upload Batch
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by STR ID or Institution..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded flex items-center gap-1.5 hover:bg-gray-50"><Filter className="w-3.5 h-3.5" /> All Types</button>
                        <button className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded flex items-center gap-1.5 hover:bg-gray-50"><AlertCircle className="w-3.5 h-3.5" /> High Risk Only</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.length === filteredSTRs.length && filteredSTRs.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Report ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked Subject</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Risk</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSTRs.map(str => (
                                <tr key={str.id} className={`hover:bg-blue-50/30 transition-colors group ${selectedIds.includes(str.id) ? 'bg-blue-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox"
                                            checked={selectedIds.includes(str.id)}
                                            onChange={() => toggleSelect(str.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-white transition-colors">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-gray-900 tracking-tight">{str.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-700">{getSubjectForSTR(str.id)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">{str.date}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-black text-gray-900 tracking-tight">{str.amount.toLocaleString()} {str.currency}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 text-[10px] font-black rounded border uppercase ${
                                            str.type === 'STR' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            str.type === 'CTR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-teal-50 text-teal-700 border-teal-200'
                                        }`}>
                                            {str.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`text-sm font-black ${
                                            str.riskScore > 80 ? 'text-red-600' :
                                            str.riskScore > 50 ? 'text-amber-600' :
                                            'text-green-600'
                                        }`}>
                                            {str.riskScore}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedSTR(str.id)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredSTRs.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <Search className="w-12 h-12 text-gray-300 mx-auto" />
                            <div className="text-gray-500 font-medium">No reports matches your search criteria.</div>
                        </div>
                    )}
                </div>
            </div>

            <BulkActionToolbar 
                selectedCount={selectedIds.length}
                onClear={() => setSelectedIds([])}
                actions={bulkActions}
            />

            {selectedSTR && <STRViewer onClose={() => setSelectedSTR(null)} strId={selectedSTR} />}
            
            {showCreateModal && (
                <ManualCaseModal 
                    onClose={() => setShowCreateModal(false)} 
                    preSelectedReportIds={selectedIds} 
                    onSuccess={() => {
                        setShowCreateModal(false);
                        setSelectedIds([]);
                    }}
                />
            )}
        </div>
    );
};

export default STRDirectory;
