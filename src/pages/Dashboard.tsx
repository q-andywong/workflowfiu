import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  AreaChart, Area, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Send, CheckCircle2, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, FileText
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stats, setView } = useApp();

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
    { name: 'Money Laundering', value: 45, color: '#0d9488' }, // teal-600
    { name: 'Terrorism Financing', value: 15, color: '#dc2626' }, // red-600
    { name: 'Bribery', value: 25, color: '#f97316' }, // orange-500
    { name: 'Tax Evasion', value: 15, color: '#4b5563' }, // gray-600
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-md ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-teal-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {trendValue}%
        </div>
      </div>
      <div>
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{title}</div>
        <div className="text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Intelligence Overview
          </h2>
          <p className="text-gray-500 text-sm mt-1">Providing downstream case management and intelligence insights from ingested SONAR reports</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-semibold flex items-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-100">
            <FileText className="w-4 h-4 text-gray-400" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Incoming STRs" value={stats.totalIncoming} icon={TrendingUp} trend="up" trendValue={12.5} colorClass="bg-teal-50 text-teal-700" />
        <StatCard title="Active Analyses" value={stats.activeAnalyses} icon={Users} trend="up" trendValue={4.2} colorClass="bg-orange-50 text-orange-600" />
        <StatCard title="Disseminations" value={stats.disseminatedTotal} icon={Send} trend="up" trendValue={8.1} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Success Rate" value={`${stats.successRate}%`} icon={CheckCircle2} trend="up" trendValue={2.4} colorClass="bg-gray-100 text-gray-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
            <h3 className="text-[13px] font-bold text-gray-700">Reporting Traffic (Last 7 Days)</h3>
            <div className="flex gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-teal-600"></div> STR</span>
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div> CTR</span>
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-gray-400"></div> CMR</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrafficData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorStr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#111827', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                  itemStyle={{ fontWeight: '600' }}
                />
                <Area type="monotone" dataKey="str" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorStr)" />
                <Area type="monotone" dataKey="ctr" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorCtr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 flex flex-col">
          <h3 className="text-[13px] font-bold text-gray-700 mb-6 border-b border-gray-100 pb-4">Typology Distribution</h3>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockTypologyData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {mockTypologyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#111827', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                  itemStyle={{ fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {mockTypologyData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 font-medium text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }}></div>
                  {item.name}
                </div>
                <div className="font-semibold text-gray-900">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white text-red-600 rounded border border-red-100 shadow-sm shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[13px] text-red-800 uppercase tracking-widest">Immediate Action Required: {stats.priorityAlerts} Critical Cases</h4>
            <p className="text-sm text-red-700 mt-0.5 font-medium">High-confidence Sanctions/Terrorism Financing matches have been identified.</p>
          </div>
        </div>
        <button 
          onClick={() => setView('PRIORITY')}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-200 w-full sm:w-auto"
        >
          Open Workbench
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
