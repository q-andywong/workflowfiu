import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { MOCK_STRS } from '../constants';
import { FileText, Search, Filter, Download, ExternalLink, AlertCircle, PlusCircle, Link, Calendar, DollarSign, Settings2, Trash2, Check, ChevronDown, X as XIcon } from 'lucide-react';
import STRViewer from '../components/STRViewer';
import BulkActionToolbar from '../components/BulkActionToolbar';
import ManualCaseModal from '../components/ManualCaseModal';

interface QueryRule {
    id: string;
    field: 'date' | 'amount' | 'name' | 'riskScore' | 'type';
    operator: 'between' | 'gt' | 'lt' | 'contains' | 'eq';
    value: any;
    valueEnd?: any;
}

const STRDirectory: React.FC = () => {
    const { allCases, reportTypeFilter, setReportTypeFilter } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSTR, setSelectedSTR] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Query Builder State
    const [activeRules, setActiveRules] = useState<QueryRule[]>([]);
    const [isAddingRule, setIsAddingRule] = useState(false);
    const [newRule, setNewRule] = useState<Partial<QueryRule>>({ field: 'name', operator: 'contains' });

    // Apply report type filter from dashboard card click
    useEffect(() => {
        if (reportTypeFilter) {
            setActiveRules([{
                id: `filter-${reportTypeFilter}`,
                field: 'type',
                operator: 'eq',
                value: reportTypeFilter,
            }]);
            setReportTypeFilter(null);
        }
    }, [reportTypeFilter, setReportTypeFilter]);

    const getSubjectForSTR = React.useCallback((strId: string) => {
        const linkedCase = allCases.find(c => 
            c.reports?.some(r => r.id === strId) || 
            c.subjects?.some(s => s.linkedSTRs?.some(ls => ls.id === strId))
        );
        if (linkedCase) {
            const subject = linkedCase.subjects?.find(s => s.linkedSTRs?.some(ls => ls.id === strId));
            if (subject) return subject.name;
            return linkedCase.subjects?.[0]?.name || 'Unknown / Unlinked';
        }
        return 'Unknown / Unlinked';
    }, [allCases]);

    const getFieldOperators = (field: string) => {
        switch (field) {
            case 'amount': return [
                { id: 'gt', label: 'Greater Than' },
                { id: 'lt', label: 'Less Than' },
                { id: 'eq', label: 'Equals' }
            ];
            case 'date': return [{ id: 'between', label: 'Between Range' }];
            case 'riskScore': return [{ id: 'gt', label: 'Greater Than' }];
            case 'name': return [{ id: 'contains', label: 'Contains' }];
            case 'type': return [{ id: 'eq', label: 'Equals' }];
            default: return [];
        }
    };
    
    const addRule = () => {
        if (!newRule.field || !newRule.operator || !newRule.value) return;
        const rule: QueryRule = {
            id: `rule-${Date.now()}`,
            field: newRule.field as any,
            operator: newRule.operator as any,
            value: newRule.value,
            valueEnd: newRule.valueEnd
        };
        setActiveRules(prev => [...prev, rule]);
        setNewRule({ field: 'name', operator: 'contains' });
        setIsAddingRule(false);
    };

    const removeRule = (id: string) => {
        setActiveRules(prev => prev.filter(r => r.id !== id));
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredSTRs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSTRs.map(s => s.id));
        }
    };

    const handleExportCSV = () => {
        const headers = ["Report ID", "Subject", "Date", "Institution", "Amount", "Currency", "Type", "Risk Score"];
        const rows = filteredSTRs.map(str => [
            str.id,
            getSubjectForSTR(str.id).replace(/"/g, '""'), // Escape quotes for CSV
            str.date,
            str.institution.replace(/"/g, '""'),
            str.amount,
            str.currency,
            str.type,
            str.riskScore
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `intelligence_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Intelligence filtering engine using rule-based cumulative logic
    const filteredSTRs = React.useMemo(() => {
        return MOCK_STRS.filter(str => {
            // 1. Initial Intelligence Sweep (Free-text search)
            const matchesSearch = str.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                str.institution.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (!matchesSearch) return false;

            // 2. Multi-Vector Rule Validation (AND logic)
            return activeRules.every(rule => {
                const subjectName = getSubjectForSTR(str.id).toLowerCase();
                
                switch (rule.field) {
                    case 'name':
                        return subjectName.includes(String(rule.value).toLowerCase());
                    case 'type':
                        return str.type === rule.value;
                    case 'amount':
                        const amt = str.amount;
                        const val = Number(rule.value);
                        if (rule.operator === 'gt') return amt > val;
                        if (rule.operator === 'lt') return amt < val;
                        if (rule.operator === 'eq') return amt === val;
                        return true;
                    case 'riskScore':
                        return str.riskScore > Number(rule.value);
                    case 'date':
                        const parseDate = (dStr: string) => {
                            if (!dStr) return 0;
                            if (dStr.includes('-')) {
                                const [y, m, d] = dStr.split('-').map(Number);
                                return new Date(y, m - 1, d).getTime();
                            }
                            const [d, m, y] = dStr.split('/').map(Number);
                            return new Date(y, m - 1, d).getTime();
                        };
                        const strTime = parseDate(str.date);
                        if (rule.operator === 'between') {
                            const start = parseDate(rule.value);
                            const end = parseDate(rule.valueEnd);
                            return strTime >= start && strTime <= end;
                        }
                        return true;
                    default:
                        return true;
                }
            });
        });
    }, [searchTerm, activeRules, getSubjectForSTR]);

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
                        STR/CTR/CMR Listing
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Comprehensive repository of all suspicious transaction reports</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by Report ID, Institution..." 
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsAddingRule(!isAddingRule)}
                                className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${
                                    isAddingRule ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <Settings2 className="w-4 h-4" />
                                Advanced Query
                            </button>
                            <button 
                                onClick={handleExportCSV}
                                className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50"
                            >
                                <Download className="w-4 h-4" />
                                Export as CSV
                            </button>
                        </div>
                    </div>

                    {/* Active Filter Pills */}
                    {activeRules.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200/60 mt-2">
                            {activeRules.map(rule => (
                                <div key={rule.id} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-xs font-black uppercase tracking-wider animate-in fade-in zoom-in duration-200">
                                    <span className="opacity-60">{rule.field}:</span> 
                                    <span>{rule.operator} {rule.value} {rule.valueEnd ? `~ ${rule.valueEnd}` : ''}</span>
                                    <button onClick={() => removeRule(rule.id)} className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors">
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => setActiveRules([])} className="text-xs font-bold text-red-600 hover:underline px-2">Clear All</button>
                        </div>
                    )}

                    {/* Rule Builder Panel */}
                    {isAddingRule && (
                        <div className="p-5 mt-2 bg-white border border-blue-100 rounded-xl shadow-lg ring-4 ring-blue-50/50 animate-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <PlusCircle className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Construct Intelligence Rule</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Attribute</label>
                                    <select 
                                        value={newRule.field}
                                        onChange={(e) => {
                                            const field = e.target.value as any;
                                            setNewRule({ ...newRule, field, operator: getFieldOperators(field)[0].id as any, value: '', valueEnd: '' });
                                        }}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    >
                                        <option value="name">Subject Name</option>
                                        <option value="type">Report Type</option>
                                        <option value="amount">Transaction Amount</option>
                                        <option value="date">Date Range</option>
                                        <option value="riskScore">Risk Score</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Operator</label>
                                    <select 
                                        value={newRule.operator}
                                        onChange={(e) => setNewRule({ ...newRule, operator: e.target.value as any })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    >
                                        {getFieldOperators(newRule.field || 'name').map(op => (
                                            <option key={op.id} value={op.id}>{op.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={newRule.operator === 'between' ? 'md:col-span-1' : 'md:col-span-1'}>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                                        {newRule.field === 'date' ? 'Start Date' : 'Value'}
                                    </label>
                                    <div className="relative">
                                        {newRule.field === 'amount' && <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />}
                                        {newRule.field === 'type' ? (
                                            <select 
                                                value={newRule.value || ''}
                                                onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            >
                                                <option value="">Select Type...</option>
                                                <option value="STR">STR</option>
                                                <option value="CTR">CTR</option>
                                                <option value="CMR">CMR</option>
                                            </select>
                                        ) : (
                                            <input 
                                                type={newRule.field === 'date' ? 'date' : (newRule.field === 'amount' || newRule.field === 'riskScore' ? 'number' : 'text')} 
                                                placeholder={newRule.field === 'date' ? 'Select Date' : 'Enter value...'}
                                                value={newRule.value || ''}
                                                onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                                                className={`w-full ${newRule.field === 'amount' ? 'pl-9' : 'px-4'} py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                                            />
                                        )}
                                    </div>
                                </div>

                                {newRule.operator === 'between' && (
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">End Date</label>
                                        <input 
                                            type="date" 
                                            value={newRule.valueEnd || ''}
                                            onChange={(e) => setNewRule({ ...newRule, valueEnd: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button 
                                        onClick={addRule}
                                        className="flex-1 py-3 bg-blue-600 text-white font-black text-[10px] rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                                    >
                                        <Check className="w-4 h-4" /> Add Rule
                                    </button>
                                    <button 
                                        onClick={() => setIsAddingRule(false)}
                                        className="py-3 px-4 bg-gray-100 text-gray-500 font-bold text-[10px] rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                                <tr key={str.id} className={`hover:bg-blue-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-blue-600 ${selectedIds.includes(str.id) ? 'bg-blue-50/50' : ''}`}>
                                    <td className="px-6 py-4 border-r border-gray-100">
                                        <input 
                                            type="checkbox"
                                            checked={selectedIds.includes(str.id)}
                                            onChange={() => toggleSelect(str.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedSTR(str.id)}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{str.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedSTR(str.id)}>
                                        <div className="text-sm font-bold text-gray-700">{getSubjectForSTR(str.id)}</div>
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedSTR(str.id)}>
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">{str.date}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right cursor-pointer" onClick={() => setSelectedSTR(str.id)}>
                                        <div className="text-sm font-black text-gray-900 tracking-tight">{str.amount.toLocaleString()} {str.currency}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center cursor-pointer" onClick={() => setSelectedSTR(str.id)}>
                                        <span className={`px-2 py-0.5 text-[10px] font-black rounded shadow-sm border uppercase ${
                                            str.type === 'STR' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            str.type === 'CTR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-teal-50 text-teal-700 border-teal-200'
                                        }`}>
                                            {str.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center cursor-pointer" onClick={() => setSelectedSTR(str.id)}>
                                        <div className={`font-black px-2.5 py-1 rounded shadow-sm text-xs border w-10 mx-auto ${
                                            str.riskScore > 80 ? 'text-red-600 bg-red-50 border-red-100' :
                                            str.riskScore > 50 ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                            'text-green-600 bg-green-50 border-green-100'
                                        }`}>
                                            {str.riskScore}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right cursor-pointer" onClick={() => setSelectedSTR(str.id)}>
                                        <div className="p-1.5 inline-block bg-gray-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-400">
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
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
