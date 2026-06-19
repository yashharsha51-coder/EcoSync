import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

export const DailyTrackerView: React.FC = () => {
  const [completedActions, setCompletedActions] = useState<number[]>([]);

  const actions = [
    { id: 1, title: 'Used public transit or carpooled', category: 'Transportation', co2Saved: 2.4 },
    { id: 2, title: 'Brought a reusable coffee cup', category: 'Waste', co2Saved: 0.2 },
    { id: 3, title: 'Ate a completely plant-based meal', category: 'Diet', co2Saved: 1.5 },
    { id: 4, title: 'Turned off AC/Heat when leaving', category: 'Energy', co2Saved: 3.1 },
    { id: 5, title: 'Line-dried clothes instead of dryer', category: 'Energy', co2Saved: 1.8 },
  ];

  const toggleAction = (id: number) => {
    if (completedActions.includes(id)) {
      setCompletedActions(completedActions.filter(a => a !== id));
    } else {
      setCompletedActions([...completedActions, id]);
    }
  };

  const totalSaved = completedActions.reduce((acc, id) => {
    const action = actions.find(a => a.id === id);
    return acc + (action?.co2Saved || 0);
  }, 0);

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20 relative z-20">
      
      {/* Header Widget */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={14} className="text-slate-400" />
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Daily Checklist</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Sustainability Tracker</h2>
          <p className="text-sm text-slate-500 font-medium">Log your eco-friendly actions today to dynamically boost your global score.</p>
        </div>
        
        <div className="mt-6 md:mt-0 bg-slate-50 border border-slate-100 p-5 rounded-xl flex items-center gap-6 shadow-sm min-w-[200px]">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">CO₂ Prevented</div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{totalSaved.toFixed(1)} <span className="text-sm text-slate-400 font-medium">kg</span></div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-emerald-500 flex items-center justify-center font-bold text-xs text-slate-700 bg-white shadow-sm">
            {completedActions.length}/{actions.length}
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="flex flex-col gap-3">
        {actions.map((action, idx) => {
          const isCompleted = completedActions.includes(action.id);
          
          return (
            <motion.div 
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => toggleAction(action.id)}
              className={`group flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer ${
                isCompleted 
                  ? 'bg-emerald-50/50 border-emerald-200' 
                  : 'bg-white/80 backdrop-blur-md border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                  isCompleted ? 'bg-emerald-500 text-white shadow-sm' : 'border-2 border-slate-300 text-transparent group-hover:border-slate-400'
                }`}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <div className={`font-semibold text-base transition-colors ${isCompleted ? 'text-emerald-900' : 'text-slate-900'}`}>
                    {action.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-slate-500">{action.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50 uppercase tracking-wide">
                      -{action.co2Saved} kg CO₂
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4 shadow-sm mt-4">
        <Info className="text-slate-400 mt-0.5 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1">How tracking affects your score</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every action you log is instantly transmitted to your live CarbonSense profile, offsetting your calculated baseline footprint. Consistent tracking over 7 days grants a permanent multiplier to your Global Ranking.
          </p>
        </div>
      </div>

    </div>
  );
};
