import React from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  CheckSquare, 
  LineChart, 
  Trophy,
  LogOut
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface SidebarLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, activeView, setActiveView }) => {
  
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'calculator', icon: Calculator, label: 'Footprint Calculator' },
    { id: 'tracker', icon: CheckSquare, label: 'Daily Tracker' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'analytics', icon: LineChart, label: 'Analytics' },
  ];

  const handleLogout = () => {
    signOut(auth);
    window.location.reload();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      
      {/* Sidebar */}
      <div className="w-72 bg-white/40 backdrop-blur-3xl border-r border-white/60 flex flex-col justify-between shadow-xl relative z-20">
        <div>
          {/* Logo */}
          <div className="p-8 pb-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
              <span className="text-slate-800 text-xl font-black">E</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">CarbonSense</h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Carbon Compass</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 px-4">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-white shadow-sm border border-slate-200 text-slate-900' 
                      : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-teal-500" : ""} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile / Bottom */}
        <div className="p-4 flex flex-col gap-4">
          <div className="bg-white/60 backdrop-blur-md border border-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden flex items-center justify-center font-bold text-slate-600">
                {(auth.currentUser?.displayName || auth.currentUser?.email || 'US').substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-slate-900 truncate">{auth.currentUser?.displayName || 'Eco User'}</div>
                <div className="text-[10px] text-slate-500 font-medium truncate">{auth.currentUser?.email}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        <div className="p-10 min-h-full">
          {children}
        </div>
      </div>

    </div>
  );
};
