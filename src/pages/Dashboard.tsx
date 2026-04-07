import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ManagerDashboard from '../components/ManagerDashboard';
import InvestigatorDashboard from '../components/InvestigatorDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'MANAGER';

  return (
    <div className="min-h-screen">
      {isManager ? (
        <ManagerDashboard />
      ) : (
        <InvestigatorDashboard />
      )}
    </div>
  );
};

export default Dashboard;
