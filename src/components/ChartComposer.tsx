import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { IntelligenceCase, IntelligenceChart, SuspiciousTransactionReport } from '../types';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, Plus, Trash2, Layout, BarChart as BarIcon, Target } from 'lucide-react';

interface ChartComposerProps {
  activeCase: IntelligenceCase;
  onSave: (chart: Partial<IntelligenceChart>) => void;
  onRemove: (chartId: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ChartComposer: React.FC<ChartComposerProps> = ({ activeCase, onSave, onRemove }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [newChart, setNewChart] = useState<Partial<IntelligenceChart>>({
    title: 'Investigation Data Trend',
    type: 'BAR',
    dataConfig: { xAxis: 'date', yAxis: 'amount', label: 'Transaction Value (USD)' }
  });

  // Prepare data for the chart based on the linked reports
  const chartData = useMemo(() => {
    const data = (activeCase.reports || []).map(r => ({
      date: r.date,
      amount: r.amount,
      risk: r.riskScore,
      id: r.id,
      type: r.type
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return data;
  }, [activeCase.reports]);

  // Aggregate data for Pie Charts (e.g., Risk Categories)
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    (activeCase.reports || []).forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [activeCase.reports]);

  const handleSave = () => {
    if (!newChart.title) return;
    onSave(newChart);
    setShowEditor(false);
  };

  const renderChart = (chart: IntelligenceChart | Partial<IntelligenceChart>) => {
    const data = chart.type === 'PIE' ? pieData : chartData;
    
    if (data.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest gap-2">
            <Layout className="w-8 h-8 opacity-20" />
            No investigative data linked for visualization
        </div>
      );
    }

    return (
      <div className="h-64 mt-4 bg-white/50 p-2 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === 'BAR' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" fontSize={10} fontWeight="bold" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis fontSize={10} fontWeight="bold" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#100628', color: 'white' }}
                itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px' }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          ) : chart.type === 'LINE' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" fontSize={10} fontWeight="bold" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis fontSize={10} fontWeight="bold" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#100628', color: 'white' }}
                itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px' }}
              />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#100628', color: 'white' }}
                itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" align="center" iconType="circle" payload={data.map((item, i) => ({ value: item.name, type: 'circle', id: item.name, color: COLORS[i % COLORS.length] }))} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Saved Analytics</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Visual representations of case intelligence</p>
            </div>
        </div>
        <button 
          onClick={() => setShowEditor(true)}
          className="px-4 py-2 bg-[#100628] text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-black transition-all"
        >
          <Plus className="w-3 h-3" />
          Create Chart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(activeCase.charts || []).map(chart => (
          <div key={chart.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm group hover:shadow-xl hover:border-blue-100 transition-all relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {chart.type === 'BAR' && <BarIcon className="w-3.5 h-3.5 text-blue-500" />}
                {chart.type === 'LINE' && <LineIcon className="w-3.5 h-3.5 text-red-500" />}
                {chart.type === 'PIE' && <PieIcon className="w-3.5 h-3.5 text- emerald-500" />}
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{chart.title}</span>
              </div>
              <button 
                onClick={() => onRemove(chart.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Generated: {new Date(chart.createdAt).toLocaleDateString()}</div>
            {renderChart(chart)}
          </div>
        ))}

        {(activeCase.charts || []).length === 0 && !showEditor && (
          <div className="col-span-full py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-10">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-blue-200" />
            </div>
            <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest">No Active Analytics</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2 max-w-xs leading-loose">
              Initiate visual data modeling to better represent investigative patterns and risk aggregates
            </p>
          </div>
        )}
      </div>

      {showEditor && (
        <div className="fixed inset-0 z-[110] bg-[#100628]/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Analytical Composer</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visualizing Case Intelligence</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowEditor(false)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Chart Definition</label>
                    <input 
                      type="text" 
                      value={newChart.title}
                      onChange={e => setNewChart(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="e.g., Transaction Velocity Report"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Visualization Archetype</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'BAR', icon: BarIcon, label: 'Bar' },
                        { id: 'LINE', icon: LineIcon, label: 'Trend' },
                        { id: 'PIE', icon: PieIcon, label: 'Ratio' }
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setNewChart(prev => ({ ...prev, type: type.id as any }))}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${newChart.type === type.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 hover:border-blue-200 text-gray-400'}`}
                        >
                          <type.icon className="w-6 h-6" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-6 flex flex-col">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Live Preview</label>
                  <div className="flex-grow flex items-center justify-center">
                    {renderChart(newChart)}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Impact Intelligence</div>
                    <p className="text-[10px] text-blue-800 font-bold leading-relaxed italic">
                        "Visualizing the transactional distribution across linked entities helps identify illicit structuring patterns."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setShowEditor(false)}
                className="px-6 py-3 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-all border border-gray-200 rounded-xl hover:bg-white"
              >
                Discard Draft
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Initialize Visualization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartComposer;
