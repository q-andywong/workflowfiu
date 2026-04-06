import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import TriageQueue from './pages/TriageQueue';
import PriorityWorkbench from './pages/PriorityWorkbench';
import CaseAnalysis from './pages/CaseAnalysis';
import Dissemination from './pages/Dissemination';
import Login from './pages/Login';
import './styles/index.css';

const AppContent: React.FC = () => {
  const { view } = useApp();

  const renderView = () => {
    switch (view) {
      case 'DASHBOARD': return <Dashboard />;
      case 'TRIAGE': return <TriageQueue />;
      case 'PRIORITY': return <PriorityWorkbench />;
      case 'ANALYSIS': return <CaseAnalysis />;
      case 'DISSEMINATION': return <Dissemination />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {renderView()}
      </main>
    </div>
  );
};

const RootRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Login />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RootRouter />
    </AuthProvider>
  );
};

export default App;
