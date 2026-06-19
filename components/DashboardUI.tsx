import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Leaf, AlertCircle, TrendingDown } from 'lucide-react';

export interface CarbonSenseResponse {
  carbon_footprint: {
    total_estimated_kg_co2_per_day: number;
    breakdown: { category: string; amount: number; severity: string }[];
  };
  sustainability_score: number;
  ai_recommendations: string[];
  environment_state_vector: number;
  suggested_lighting_hex: string;
}

interface DashboardUIProps {
  data: CarbonSenseResponse;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const DashboardUI: React.FC<DashboardUIProps> = ({ data, onRefresh, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations'>('overview');

  if (!data) {
    return (
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20 relative z-10 items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <div className="text-slate-500 font-semibold tracking-wide text-sm mt-4">Syncing Ecosystem Data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20 relative z-10">
      
      {/* Top Hero Card - Refined */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-slate-400" />
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Live Analysis</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Ecosystem Health</h1>
          <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
            Your daily activities are constantly shaping the environment. Maintain a high sustainability score to keep the ecosystem pristine.
          </p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              disabled={isLoading}
              className="mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Syncing...' : 'Sync Latest Data'}
            </button>
          )}
        </div>

        <div className="flex flex-col items-start lg:items-end bg-slate-50 border border-slate-100 p-6 rounded-xl min-w-[200px]">
          <div className="text-xs text-slate-500 font-medium mb-1">Sustainability Score</div>
          <div className="text-5xl font-bold text-slate-900 tracking-tighter mb-2">{Math.round(data.sustainability_score)}</div>
          <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <TrendingDown size={14} className="text-emerald-500" /> Top 15% User
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid - Refined */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between"
        >
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">Daily CO₂ Footprint</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{data.carbon_footprint.total_estimated_kg_co2_per_day.toFixed(1)} <span className="text-sm font-medium text-slate-400">kg</span></div>
          <div className="text-xs text-slate-400">Estimated average from provided data</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between md:col-span-2"
        >
          <div className="flex gap-6 mb-6 border-b border-slate-100 pb-3">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`text-sm font-medium transition-colors pb-3 -mb-[13px] border-b-2 ${activeTab === 'overview' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              Breakdown
            </button>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className={`text-sm font-medium transition-colors pb-3 -mb-[13px] border-b-2 ${activeTab === 'recommendations' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              AI Insights
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.carbon_footprint.breakdown.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900 capitalize mb-1">{item.category}</div>
                    <div className={`text-[10px] font-semibold uppercase tracking-wider ${
                      item.severity === 'High' ? 'text-rose-500' : 
                      item.severity === 'Medium' ? 'text-amber-500' : 
                      'text-emerald-500'
                    }`}>
                      {item.severity} Impact
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-800">{item.amount.toFixed(1)}<span className="text-xs text-slate-400 font-medium ml-1">kg</span></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="flex flex-col gap-2">
              {data.ai_recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-3">
                  <AlertCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-slate-600 leading-relaxed">{rec}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Real-time Telemetry Grid - Refined */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
            <MapPin size={20} className="text-slate-700" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium mb-0.5">Live Telemetry Node</div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">Bangalore, India</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
            <Leaf size={20} className="text-slate-700" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-500 font-medium mb-0.5">Trees Needed to Offset</div>
            <div className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {Math.max(1, Math.round((data.carbon_footprint.total_estimated_kg_co2_per_day * 365) / 22))} <span className="text-xs font-medium text-slate-400">trees/year</span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100/50 ml-auto">Based on footprint</span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default DashboardUI;
