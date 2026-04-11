import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  AreaChart, Area, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Send, CheckCircle2, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, FileText, CheckSquare
} from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const { stats, cases, setView } = useApp();

  const mockTrafficData = [
    { name: 'Mon', str: 45, ctr: 32, cmr: 12 },
    { name: 'Tue', str: 52, ctr: 41, cmr: 15 },
    { name: 'Wed', str: 48, ctr: 38, cmr: 10 },
    { name: 'Thu', str: 61, ctr: 45, cmr: 18 },
    { name: 'Fri', str: 55, ctr: 39, cmr: 14 },
    { name: 'Sat', str: 32, ctr: 21, cmr: 8 },
    { name: 'Sun', str: 28, ctr: 18, cmr: 5 },
  ];

  const mockTypologyData = [
    { name: 'Money Laundering', value: 45, color: '#0d9488' },
    { name: 'Terrorism Financing', value: 15, color: '#dc2626' },
    { name: 'Bribery', value: 25, color: '#f97316' },
    { name: 'Tax Evasion', value: 15, color: '#4b5563' },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-teal-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {trendValue}%
        </div>
      </div>
      <div>
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">{title}</div>
        <div className="text-2xl font-black text-gray-900 mt-2 tracking-tight">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Intelligence Command</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium italic">High-level oversight of ingested Q Platform reports and operational outputs</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-gray-100">
            <FileText className="w-4 h-4 text-gray-400" />
            Executive Summary
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Incoming STRs" value={stats.totalIncoming} icon={TrendingUp} trend="up" trendValue={12.5} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Active Analyses" value={stats.activeAnalyses} icon={Users} trend="up" trendValue={4.2} colorClass="bg-orange-50 text-orange-600" onClick={() => setView('DIRECTORY')} />
        <StatCard title="Disseminated" value={stats.disseminatedTotal} icon={Send} trend="up" trendValue={8.1} colorClass="bg-teal-50 text-teal-700" />
        <StatCard title="Global Success" value={`${stats.successRate}%`} icon={CheckCircle2} trend="up" trendValue={2.4} colorClass="bg-gray-100 text-gray-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Reporting Traffic (7D)</h3>
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-600"></div> STR</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> CTR</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div> CMR</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrafficData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorMgrStr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMgrCtr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '700', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="str" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorMgrStr)" />
                <Area type="monotone" dataKey="ctr" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorMgrCtr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-100 pb-6">Typology Mix</h3>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockTypologyData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {mockTypologyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ background: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ fontWeight: '700', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-8 pt-4 border-t border-gray-50">
            {mockTypologyData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-bold text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ background: item.color }}></div>
                  {item.name}
                </div>
                <div className="text-gray-900">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border-l-8 border-l-amber-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white text-amber-600 rounded-xl shadow-sm border border-amber-100 shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm text-amber-900 uppercase tracking-widest cursor-pointer hover:text-amber-900 transition-colors" onClick={() => setView('APPROVALS')}>
              {cases.filter(c => c.status === 'PENDING_APPROVAL').length} Escalations Pending Sign-off
            </h4>
            <p className="text-sm text-amber-700 mt-1 font-medium">Analysts are awaiting formal authorization to convert escalated Tasks into active Investigation Cases.</p>
          </div>
        </div>
        <button 
          onClick={() => setView('APPROVALS')}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-100 transition-all focus:ring-4 focus:ring-amber-100 w-full sm:w-auto uppercase tracking-wider"
        >
          Review Pipeline
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border-l-8 border-l-green-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white text-green-600 rounded-xl shadow-sm border border-green-100 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm text-green-900 uppercase tracking-widest">Hibernation List: {cases.filter(c => c.status === 'HIBERNATED').length} Entities</h4>
            <p className="text-sm text-green-700 mt-1 font-medium">Auto-triage has successfully moved low-risk subjects into background monitoring. No manual review is required.</p>
          </div>
        </div>
        <button 
          onClick={() => setView('HIBERNATED')}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-100 transition-all focus:ring-4 focus:ring-green-100 w-full sm:w-auto uppercase tracking-wider"
        >
          Audit List
        </button>
      </div>
    </div>
  );
};

export default ManagerDashboard;
