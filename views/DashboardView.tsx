import React from 'react';
import DashboardUI, { EcoSyncResponse } from '../components/DashboardUI';

interface DashboardViewProps {
  data: EcoSyncResponse | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, isLoading, onRefresh }) => {
  // Provide a safe fallback for the UI component to prevent TS errors
  const safeData = data || {
    carbon_footprint: { total_estimated_kg_co2_per_day: 0, breakdown: [] },
    sustainability_score: 0,
    ai_recommendations: [],
    environment_state_vector: 0,
    suggested_lighting_hex: "#ffffff"
  } as unknown as EcoSyncResponse;

  return (
    <div className="w-full h-full relative">
      <DashboardUI data={safeData} isLoading={isLoading} onRefresh={onRefresh} />
    </div>
  );
};

export default DashboardView;
