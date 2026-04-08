import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  CheckCircle2, AlertTriangle, ArrowUpRight, FileText, 
  Hourglass, ClipboardList, CheckSquare, BarChart3
} from 'lucide-react';

const InvestigatorDashboard: React.FC = () => {
  const { stats, cases, setSelectedCase, setView } = useApp();
  const { user } = useAuth();

  const resolutionTrendData = [
    { month: 'Oct', resolved: 12, avgTime: 5.2 },
    { month: 'Nov', resolved: 18, avgTime: 4.8 },
    { month: 'Dec', resolved: 15, avgTime: 5.5 },
    { month: 'Jan', resolved: 22, avgTime: 4.1 },
    { month: 'Feb', resolved: 19, avgTime: 4.3 },
    { month: 'Mar', resolved: 28, avgTime: 3.8 },
    { month: 'Apr', resolved: stats.casesClosed, avgTime: stats.avgResolutionTime },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:border-gray-300 ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">{title}</div>
        <div className="text-3xl font-black text-gray-900 mt-1 tracking-tight">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {user?.typology || 'Intelligence'} Dashboard
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Real-time tracking of operational queues and case resolution metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-gray-100">
            <FileText className="w-4 h-4 text-gray-400" />
            Performance Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Triage Queue" 
          value={stats.triagesInQueue} 
          icon={ClipboardList} 
          colorClass="bg-blue-50 text-blue-600" 
          onClick={() => setView('TRIAGE')}
        />
        <StatCard 
          title="Awaiting Approval" 
          value={stats.pendingApproval} 
          icon={Hourglass} 
          colorClass="bg-amber-50 text-amber-600" 
          onClick={() => setView('DIRECTORY')}
        />
        <StatCard 
          title="Active Cases" 
          value={stats.activeAnalyses} 
          icon={CheckSquare} 
          colorClass="bg-teal-50 text-teal-600" 
          onClick={() => setView('DIRECTORY')}
        />
        <StatCard 
          title="Resolved" 
          value={stats.casesClosed} 
          icon={CheckCircle2} 
          colorClass="bg-gray-100 text-gray-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Resolution Trends</h3>
              <p className="text-xs text-gray-500 font-medium">Completed cases vs. average time to close over the last 6 months</p>
            </div>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Resolved Cases</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resolutionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorResolvedInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#9ca3af" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="resolved" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorResolvedInv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="bg-[#100628] rounded-2xl p-8 flex-1 flex flex-col justify-between text-white shadow-lg relative overflow-hidden">
             <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
             <div>
                <div className="p-3 bg-white/10 rounded-xl w-fit mb-6 backdrop-blur-md">
                   <Hourglass className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-blue-200 uppercase tracking-[0.2em] mb-2 text-center lg:text-left">Efficiency Index</h3>
                <div className="text-5xl font-black mb-2 text-center lg:text-left">{stats.avgResolutionTime} <span className="text-lg font-bold text-blue-400">days</span></div>
                <p className="text-sm text-blue-100/60 font-medium leading-relaxed text-center lg:text-left">
                   Average duration from initial ingestion to case closure. 
                   <span className="text-blue-300 ml-1">↓ 12% improvement from last quarter</span>
                </p>
             </div>
             <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">SLA Compliance</span>
                   <span className="text-xs font-bold text-blue-400">94.2%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                   <div className="bg-blue-500 h-full w-[94.2%] rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                </div>
             </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setView('DIRECTORY')}>
             <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                   <BarChart3 className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-sm font-bold text-gray-900 tracking-tight">Access Directory</div>
             </div>
             <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border-l-8 border-l-green-500">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-white text-green-600 rounded-xl shadow-sm border border-green-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm text-green-900 uppercase tracking-widest leading-none">Automated Hibernation Active</h4>
            <p className="text-sm text-green-700 mt-2 font-semibold">{cases.filter((c: any) => c.status === 'HIBERNATED').length} entities successfully moved to low-risk monitoring.</p>
          </div>
        </div>
        <button onClick={() => setView('HIBERNATED')} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 transition-all focus:ring-4 focus:ring-green-100 w-full sm:w-auto uppercase tracking-wider">View Hibernated List</button>
      </div>

      {/* Hibernated Registry Overview [UPDATED] */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-100 px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-1.5 bg-green-500 rounded text-white font-black text-[10px] uppercase tracking-tighter shadow-[0_0_10px_rgba(34,197,94,0.5)]">HIBERNATED</div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Recent Auto-Triaged Entities ({cases.filter((c: any) => c.status === 'HIBERNATED').length})</h3>
           </div>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Low Risk • Auto-Resolved</p>
        </div>
        <div className="divide-y divide-gray-100">
           {cases.filter((c: any) => c.status === 'HIBERNATED').map((hibCase: any) => (
             <div key={hibCase.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-green-400 uppercase leading-none">Score</span>
                      <span className="text-lg font-black text-green-600 leading-none mt-1">{hibCase.subject.riskProfile.totalScore}</span>
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                         <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{hibCase.subject.name}</h4>
                         <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-black uppercase tracking-widest">{hibCase.id}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-1">Status: <span className="text-green-600 font-bold uppercase tracking-widest">{hibCase.status}</span> • Territory: {hibCase.subject.nationality}</p>
                   </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCase(hibCase);
                    setView('ANALYSIS');
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 text-xs font-black rounded-lg transition-all shadow-sm group-hover:shadow-md"
                >
                   Review Profile
                   <ArrowUpRight className="w-4 h-4" />
                </button>
             </div>
           ))}
           {cases.filter((c: any) => c.status === 'HIBERNATED').length === 0 && (
             <div className="p-8 text-center text-gray-400 text-sm font-medium">No entities currently in hibernation.</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default InvestigatorDashboard;
