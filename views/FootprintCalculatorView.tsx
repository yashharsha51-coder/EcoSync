import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface CalculatorState {
  vehicleType: string;
  commuteDistance: number;
  flights: number;
  electricity: number;
  heatingType: string;
  dietType: string;
  localSourcing: number;
  recycling: boolean;
  composting: boolean;
  trashBags: number;
}

interface FootprintCalculatorViewProps {
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  totalFootprint: number;
}

export const FootprintCalculatorView: React.FC<FootprintCalculatorViewProps> = ({ state, setState, totalFootprint }) => {
  const [activeTab, setActiveTab] = useState(1);

  const updateState = (key: keyof CalculatorState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 1, title: "Transportation", icon: "🚗" },
    { id: 2, title: "Home Energy", icon: "⚡" },
    { id: 3, title: "Diet & Food", icon: "🥗" },
    { id: 4, title: "Waste & Consumption", icon: "♻️" }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
      
      {/* Header Glass Card */}
      <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Annual Footprint Calculator</h1>
          <p className="text-sm text-slate-500 font-medium">Adjust your habits below to see the real-time impact on your footprint.</p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <div className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mb-1">Live Projection</div>
          <div className="text-4xl font-black text-teal-500 drop-shadow-sm">
            {totalFootprint.toFixed(2)}<span className="text-xl text-teal-600/50"> tCO₂e / yr</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Navigation Tabs */}
        <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0 relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                activeTab === tab.id 
                ? 'bg-white shadow-xl border-white text-slate-900 scale-105 z-20' 
                : 'bg-white/40 backdrop-blur-md border-white/60 text-slate-500 hover:bg-white/60 shadow-sm'
              }`}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold shadow-sm ${activeTab === tab.id ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                {tab.icon}
              </span>
              <span className="font-bold">{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white/60 backdrop-blur-3xl border border-white p-8 rounded-3xl shadow-xl relative overflow-hidden min-h-[400px]">
          
          {/* Tab 1: Transportation */}
          {activeTab === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  Vehicle Travel & Commute
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {['gasoline', 'hybrid', 'ev', 'public_transit'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => updateState('vehicleType', type)}
                      className={`py-3 px-2 rounded-xl font-bold text-xs transition-all shadow-sm border ${state.vehicleType === type ? 'bg-teal-500 text-white shadow-teal-500/30 border-teal-400' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                      {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
                
                <div className="text-xs font-bold text-slate-400 mb-4 flex justify-between items-center bg-white/50 p-4 rounded-xl border border-white">
                  <span>WEEKLY COMMUTE DISTANCE</span>
                  <span className="text-teal-600 font-black text-lg">{state.commuteDistance} <span className="text-sm font-bold text-teal-600/50">miles</span></span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" min="0" max="500" 
                    value={state.commuteDistance} onChange={(e) => updateState('commuteDistance', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>
              </div>
              <div className="border-t border-slate-200 pt-8">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex justify-between items-center bg-white/50 p-4 rounded-xl border border-white">
                  <div className="flex items-center gap-2">Annual Flights</div>
                  <span className="text-blue-600 font-black text-lg">{state.flights} <span className="text-sm font-bold text-blue-600/50">flights</span></span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" min="0" max="20" 
                    value={state.flights} onChange={(e) => updateState('flights', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Home Energy */}
          {activeTab === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex justify-between items-center bg-white/50 p-4 rounded-xl border border-white">
                  <div className="flex items-center gap-2">Monthly Electricity</div>
                  <span className="text-yellow-600 font-black text-lg">{state.electricity} <span className="text-sm font-bold text-yellow-600/50">kWh</span></span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" min="50" max="1000" 
                    value={state.electricity} onChange={(e) => updateState('electricity', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>
              </div>
              <div className="border-t border-slate-200 pt-8">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  Heating Source
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['natural_gas', 'electric', 'oil'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => updateState('heatingType', type)}
                      className={`py-4 rounded-xl font-bold text-sm transition-all shadow-sm border ${state.heatingType === type ? 'bg-orange-500 text-white shadow-orange-500/30 border-orange-400' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                      {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Diet & Food */}
          {activeTab === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  Primary Diet
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['meat_heavy', 'omnivore', 'vegetarian', 'vegan'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => updateState('dietType', type)}
                      className={`py-4 rounded-xl font-bold text-sm transition-all shadow-sm border ${state.dietType === type ? 'bg-green-500 text-white shadow-green-500/30 border-green-400' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                      {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-200 pt-8">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex justify-between items-center bg-white/50 p-4 rounded-xl border border-white">
                  <div className="flex items-center gap-2">Local Food Sourcing</div>
                  <span className="text-emerald-600 font-black text-lg">{state.localSourcing}<span className="text-sm font-bold text-emerald-600/50">%</span></span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" min="0" max="100" 
                    value={state.localSourcing} onChange={(e) => updateState('localSourcing', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 4: Waste & Consumption */}
          {activeTab === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className={`p-6 rounded-2xl border cursor-pointer transition-all shadow-sm ${state.recycling ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  onClick={() => updateState('recycling', !state.recycling)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-3xl">♻️</div>
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${state.recycling ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300'}`}>
                      {state.recycling && '✓'}
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">Active Recycler</div>
                  <div className="text-xs text-slate-500 mt-1">I consistently recycle paper, plastics, and glass.</div>
                </div>
                <div 
                  className={`p-6 rounded-2xl border cursor-pointer transition-all shadow-sm ${state.composting ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  onClick={() => updateState('composting', !state.composting)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-3xl">🌱</div>
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${state.composting ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300'}`}>
                      {state.composting && '✓'}
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">Active Composter</div>
                  <div className="text-xs text-slate-500 mt-1">I compost organic waste regularly.</div>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-8">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex justify-between items-center bg-white/50 p-4 rounded-xl border border-white">
                  <div className="flex items-center gap-2">Weekly Trash Bags (30L)</div>
                  <span className="text-slate-600 font-black text-lg">{state.trashBags} <span className="text-sm font-bold text-slate-600/50">bags</span></span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" min="0" max="10" 
                    value={state.trashBags} onChange={(e) => updateState('trashBags', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
