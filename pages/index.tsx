import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

import { AuthScreen } from '../components/AuthScreen';
import { SidebarLayout } from '../components/SidebarLayout';
import { DashboardView } from '../views/DashboardView';
import { FootprintCalculatorView, CalculatorState } from '../views/FootprintCalculatorView';
import { DailyTrackerView } from '../views/DailyTrackerView';
import { LeaderboardView } from '../views/LeaderboardView';
import { AnalyticsView } from '../views/AnalyticsView';

// Use dynamic import for 3D component to avoid SSR issues
const Environment3D = dynamic(() => import('../components/Environment3D'), {
  ssr: false,
});

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [devModeBypass, setDevModeBypass] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const [isLoading, setIsLoading] = useState(false);

  // Lifted Calculator State
  const [calcState, setCalcState] = useState<CalculatorState>({
    vehicleType: 'gasoline',
    commuteDistance: 150,
    flights: 0,
    electricity: 300,
    heatingType: 'natural_gas',
    dietType: 'omnivore',
    localSourcing: 20,
    recycling: true,
    composting: false,
    trashBags: 2
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  // Compute the live eco data based on the calcState
  const ecoData = useMemo(() => {
    // Calculate total emissions in kg CO2e per year
    const transportTotal = calcState.commuteDistance * 52 * (calcState.vehicleType === 'gasoline' ? 0.4 : calcState.vehicleType === 'hybrid' ? 0.2 : 0) + calcState.flights * 500;
    const energyTotal = calcState.electricity * 12 * 0.4 + (calcState.heatingType === 'natural_gas' ? 2400 : calcState.heatingType === 'electric' ? 1200 : 3600);
    const dietTotal = 365 * (calcState.dietType === 'meat_heavy' ? 3.3 : calcState.dietType === 'omnivore' ? 2.5 : calcState.dietType === 'vegetarian' ? 1.5 : 1.0) * ((100 - calcState.localSourcing * 0.5) / 100);
    const wasteTotal = calcState.trashBags * 52 * 5 - (calcState.recycling ? 200 : 0) - (calcState.composting ? 150 : 0);
    
    const totalAnnual = transportTotal + energyTotal + dietTotal + wasteTotal;
    
    // Scale down to "kg per day" for dashboard readability
    const transportDaily = transportTotal / 365;
    const energyDaily = energyTotal / 365;
    const dietDaily = dietTotal / 365;
    const wasteDaily = wasteTotal / 365;
    const totalDaily = totalAnnual / 365;
    
    // Base score is 100, drops by 2 for every daily kg over 5
    const score = Math.max(0, Math.min(100, Math.round(100 - (Math.max(0, totalDaily - 5) * 3))));

    const recommendations = [];
    if (calcState.vehicleType === 'gasoline' && calcState.commuteDistance > 100) {
      recommendations.push("Consider replacing 2 car commutes with public transit to lower your high transport impact.");
    }
    if (calcState.dietType === 'meat_heavy') {
      recommendations.push("A plant-based dinner twice a week could significantly improve your diet score.");
    }
    if (!calcState.composting) {
      recommendations.push("Start composting organic waste. It's an easy way to eliminate a chunk of your waste footprint.");
    }
    if (recommendations.length === 0) {
      recommendations.push("Your sustainability habits are excellent. Keep utilizing natural light and local sourcing!");
    }

    return {
      totalAnnual: totalAnnual / 1000, // Return in tonnes for the calculator
      dashboardData: {
        carbon_footprint: {
          total_estimated_kg_co2_per_day: totalDaily,
          breakdown: [
            { category: "Transport", amount: transportDaily, severity: transportDaily > 4 ? "High" : transportDaily > 2 ? "Medium" : "Low" },
            { category: "Energy", amount: energyDaily, severity: energyDaily > 3 ? "High" : energyDaily > 1.5 ? "Medium" : "Low" },
            { category: "Diet", amount: dietDaily, severity: dietDaily > 2.5 ? "High" : dietDaily > 1.5 ? "Medium" : "Low" },
            { category: "Waste", amount: Math.max(0, wasteDaily), severity: wasteDaily > 1 ? "Medium" : "Low" }
          ].sort((a,b) => b.amount - a.amount)
        },
        sustainability_score: score,
        ai_recommendations: recommendations,
        environment_state_vector: score / 100,
        suggested_lighting_hex: "#14b8a6" // Always keep the stunning teal/green color
      }
    };
  }, [calcState]);

  // Simulate network fetch for the Dashboard "Sync" button
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // --- Real-time Firestore Sync for Leaderboard ---
  useEffect(() => {
    if (!user || !authLoaded) return;
    
    // Dynamically import to keep bundle clean
    import('firebase/firestore').then(({ doc, setDoc }) => {
      const db = require('../lib/firebase').db;
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, {
        name: user.displayName || user.email?.split('@')[0] || 'Eco User',
        email: user.email,
        score: ecoData.dashboardData.sustainability_score,
        footprint: ecoData.dashboardData.carbon_footprint.total_estimated_kg_co2_per_day,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => console.error("Firebase sync error:", err));
    });
  }, [ecoData, user, authLoaded]);

  if (!authLoaded) return <div className="h-screen w-screen bg-slate-50 text-slate-900 flex items-center justify-center font-bold">Loading CarbonSense...</div>;

  if (!user && !devModeBypass) {
    return <AuthScreen onLogin={() => setDevModeBypass(true)} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView data={ecoData.dashboardData} isLoading={isLoading} onRefresh={handleRefresh} />;
      case 'calculator':
        return <FootprintCalculatorView state={calcState} setState={setCalcState} totalFootprint={ecoData.totalAnnual} />;
      case 'tracker':
        return <DailyTrackerView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView data={ecoData.dashboardData} isLoading={isLoading} onRefresh={handleRefresh} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/30">
      <Head>
        <title>CarbonSense | Carbon Compass</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Z-0: The stunning 4K 3D Glass Environment */}
      <Environment3D 
        environmentStateVector={ecoData.dashboardData.environment_state_vector} 
        lightingHex={ecoData.dashboardData.suggested_lighting_hex}
        particleDensity={150} 
      />

      {/* Z-10: Glassmorphism UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto h-full">
          <SidebarLayout activeView={activeView} setActiveView={setActiveView}>
            {renderActiveView()}
          </SidebarLayout>
        </div>
      </div>
    </div>
  );
}
