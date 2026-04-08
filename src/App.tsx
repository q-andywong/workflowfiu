import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import TriageQueue from './pages/TriageQueue';
import PriorityWorkbench from './pages/PriorityWorkbench';
import HibernatedList from './pages/HibernatedList';
import STRDirectory from './pages/STRDirectory';
import CaseAnalysis from './pages/CaseAnalysis';
import Dissemination from './pages/Dissemination';
import ApprovalsQueue from './pages/ApprovalsQueue';
import CaseDirectory from './pages/CaseDirectory';
import Login from './pages/Login';
import './styles/index.css';

const AppContent: React.FC = () => {
  const { view, previousView } = useApp();

  const renderView = () => {
    const activeTab = view === 'ANALYSIS' ? previousView : view;
    switch (activeTab) {
      case 'DASHBOARD': return <Dashboard />;
      case 'TRIAGE': return <TriageQueue />;
      case 'HIBERNATED': return <HibernatedList />;
      case 'PRIORITY': return <PriorityWorkbench />;
      case 'DISSEMINATION': return <Dissemination />;
      case 'APPROVALS': return <ApprovalsQueue />;
      case 'DIRECTORY': return <CaseDirectory />;
      case 'STR_DIRECTORY': return <STRDirectory />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      
      {/* Global Analysis Modal Overlay */}
      {view === 'ANALYSIS' && <CaseAnalysis />}
    </div>
  );
};

const RootRouter: React.FC = () => {
  const { user } = useAuth();
  return !user ? <Login /> : <AppContent />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <RootRouter />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
