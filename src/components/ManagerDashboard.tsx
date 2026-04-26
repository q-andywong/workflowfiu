import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  AreaChart, Area, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import {
  TrendingUp, Users, CheckCircle2,
  ArrowUpRight, ArrowDownRight, CheckSquare
} from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const { stats, cases, setView, setReportTypeFilter } = useApp();

  // Compute report type counts from actual case data
  const allReports = cases.flatMap(c => c.reports || []);
  const strCount = allReports.filter((r: any) => r.type === 'STR').length;
  const ctrCount = allReports.filter((r: any) => r.type === 'CTR').length;
  const cmrCount = allReports.filter((r: any) => r.type === 'CMR').length;

  // Distribute actual counts across a 7-day simulated traffic pattern
  const dayWeights = [1.2, 1.4, 1.3, 1.6, 1.5, 0.8, 0.6]; // Mon-Sun weighting
  const totalWeight = dayWeights.reduce((a, b) => a + b, 0);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trafficData = dayNames.map((name, i) => ({
    name,
    str: Math.round((strCount * dayWeights[i] / totalWeight) * 5),
    ctr: Math.round((ctrCount * dayWeights[i] / totalWeight) * 5),
    cmr: Math.round((cmrCount * dayWeights[i] / totalWeight) * 5),
  }));

  // Compute typology distribution from actual case subjects
  const typologyCounts: Record<string, number> = {};
  cases.forEach(c => {
    (c.subjects || []).forEach((s: any) => {
      (s.crimeTypologies || []).forEach((t: string) => {
        typologyCounts[t] = (typologyCounts[t] || 0) + 1;
      });
    });
  });
  const typologyColors: Record<string, string> = {
    'Money Laundering': '#0d9488',
    'Terrorism Financing': '#dc2626',
    'Sanctions Evasion': '#f97316',
    'Fraud / Cheating': '#6366f1',
  };
  const totalTypologyHits = Object.values(typologyCounts).reduce((a, b) => a + b, 0) || 1;
  const typologyData = Object.entries(typologyCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      value: Math.round((count / totalTypologyHits) * 100),
      color: typologyColors[name] || '#4b5563',
    }));

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass, onClick }: any) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4 transition-all hover:shadow-md ${onClick ? 'cursor-pointer hover:border-blue-300' : ''}`}>
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard title="Incoming STRs" value={strCount} icon={TrendingUp} trend="up" trendValue={12.5} colorClass="bg-blue-50 text-blue-600" onClick={() => { setReportTypeFilter('STR'); setView('STR_DIRECTORY'); }} />
        <StatCard title="Incoming CTRs" value={ctrCount} icon={TrendingUp} trend="up" trendValue={4.2} colorClass="bg-orange-50 text-orange-600" onClick={() => { setReportTypeFilter('CTR'); setView('STR_DIRECTORY'); }} />
        <StatCard title="Incoming CMRs" value={cmrCount} icon={TrendingUp} trend="up" trendValue={8.1} colorClass="bg-gray-100 text-gray-600" onClick={() => { setReportTypeFilter('CMR'); setView('STR_DIRECTORY'); }} />
        <StatCard title="Active Cases" value={stats.activeAnalyses} icon={Users} trend="up" trendValue={3.6} colorClass="bg-teal-50 text-teal-700" onClick={() => setView('DIRECTORY')} />
        <StatCard title="Pending Approval" value={cases.filter(c => c.status === 'PENDING_APPROVAL').length} icon={CheckSquare} trend="up" trendValue={2.4} colorClass="bg-amber-50 text-amber-600" onClick={() => setView('TRIAGE', 'APPROVALS')} />
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
              <AreaChart data={trafficData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorMgrStr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMgrCtr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMgrCmr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#9ca3af" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '700', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="str" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorMgrStr)" />
                <Area type="monotone" dataKey="ctr" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorMgrCtr)" />
                <Area type="monotone" dataKey="cmr" stroke="#9ca3af" strokeWidth={3} fillOpacity={1} fill="url(#colorMgrCmr)" />
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
                  data={typologyData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {typologyData.map((entry, index) => (
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
            {typologyData.map((item) => (
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
            <h4 className="font-black text-sm text-amber-900 uppercase tracking-widest cursor-pointer hover:text-amber-900 transition-colors" onClick={() => setView('TRIAGE', 'APPROVALS')}>
              {cases.filter(c => c.status === 'PENDING_APPROVAL').length} Escalations Pending Sign-off
            </h4>
            <p className="text-sm text-amber-700 mt-1 font-medium">Analysts are awaiting formal authorization to convert escalated Tasks into active Investigation Cases.</p>
          </div>
        </div>
        <button 
          onClick={() => setView('TRIAGE', 'APPROVALS')}
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
