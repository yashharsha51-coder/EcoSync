import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export const AnalyticsView: React.FC = () => {
  const benchmarkData = [
    { name: 'Transport', current: 4.2, target: 2.5 },
    { name: 'Energy', current: 3.8, target: 2.0 },
    { name: 'Food', current: 2.5, target: 1.5 },
    { name: 'Goods', current: 1.5, target: 1.0 },
    { name: 'Services', current: 1.0, target: 0.8 },
  ];

  const timelineData = [
    { day: 'Mon', savings: 1.2 },
    { day: 'Tue', savings: 2.4 },
    { day: 'Wed', savings: 1.8 },
    { day: 'Thu', savings: 3.2 },
    { day: 'Fri', savings: 2.1 },
    { day: 'Sat', savings: 4.5 },
    { day: 'Sun', savings: 3.8 },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
      
      <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-3xl shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Performance Analytics</h1>
          <p className="text-sm text-slate-500 font-medium">Deep dive into your carbon emission trends and historical savings data.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Top Row: Benchmarks & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-3xl p-8 flex flex-col gap-6 shadow-xl">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Key Performance Indicators</div>
            
            <div className="border-b border-white/60 pb-4">
              <div className="text-xs text-slate-500 mb-1 font-semibold">Total Reductions (YTD)</div>
              <div className="text-3xl font-black text-teal-600 drop-shadow-sm">342<span className="text-sm text-teal-600/50"> kg</span></div>
            </div>
            
            <div className="border-b border-white/60 pb-4">
              <div className="text-xs text-slate-500 mb-1 font-semibold">Carbon Efficiency Score</div>
              <div className="text-3xl font-black text-blue-600 drop-shadow-sm">A-<span className="text-sm text-blue-600/50"> Tier</span></div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1 font-semibold">Top Performing Category</div>
              <div className="text-xl font-bold text-slate-800">Transportation</div>
              <div className="text-[10px] text-slate-400 mt-1">Due to 14 active public transit logs.</div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/60 backdrop-blur-3xl border border-white rounded-3xl p-8 shadow-xl">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Category Carbon Benchmarking</div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} barGap={8}>
                  <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                  <Bar dataKey="current" fill="#0f172a" radius={[6,6,0,0]} barSize={40} name="Your Projected Emissions" />
                  <Bar dataKey="target" fill="#cbd5e1" radius={[6,6,0,0]} barSize={40} name="Eco Target Benchmark" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-900 rounded-sm"></div> Your Emissions</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-300 rounded-sm"></div> Target Benchmark</div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Timeline & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-3xl border border-white rounded-3xl p-8 shadow-xl">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Daily Actions Savings Timeline</div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                  <Line type="monotone" dataKey="savings" stroke="#14b8a6" strokeWidth={4} dot={{fill: '#14b8a6', strokeWidth: 2, r: 5, stroke: '#ffffff'}} style={{ filter: 'drop-shadow(0px 5px 5px rgba(20, 184, 166, 0.3))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-[10px] text-slate-500 font-semibold mt-4">
              Daily action logs registered during the past 7 days.
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-3xl p-8 flex flex-col gap-6 shadow-xl">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Carbon Trends & Insights</div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500 shrink-0 text-sm border border-teal-100 shadow-sm">🚗</div>
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">Daily Commutes</div>
                <div className="text-[11px] text-slate-500 leading-relaxed font-medium">Your weekly vehicle travel is a primary source of emissions. Try working from home or riding transit.</div>
              </div>
            </div>

            <div className="flex gap-4 items-start mt-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 text-sm border border-blue-100 shadow-sm">⚡</div>
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">Clean Energy Share</div>
                <div className="text-[11px] text-slate-500 leading-relaxed font-medium">Your grid is roughly 30% clean electricity. Upgrading this share further requires major annual grid changes.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
