import React from 'react';
import DashboardUI, { EcoSyncResponse } from '../components/DashboardUI';

interface DashboardViewProps {
  data: EcoSyncResponse | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, isLoading, onRefresh }) => {
  return (
    <div className="w-full h-full relative">
      <DashboardUI data={data} isLoading={isLoading} onRefresh={onRefresh} />
    </div>
  );
};

export default DashboardView;
