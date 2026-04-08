import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { view, setView } = useApp();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
            <h1 className="text-xl font-bold text-gray-900">
              STRO STARS
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900 block">{user?.name}</span>
              <span className="text-xs text-gray-500 block">{user?.title}</span>
            </div>
            <img className="h-10 w-10 rounded-full border border-gray-200" src={`https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+')}&background=f3f4f6&color=374151`} alt="User avatar" />
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-900 transition-colors duration-200 ml-1 focus:outline-none"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex border-t border-gray-200 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setView('DASHBOARD')}
            className={`px-4 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${
              view === 'DASHBOARD'
                ? 'border-b-2 border-amber-400 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          {user?.role !== 'INVESTIGATOR' && (
            <button
              onClick={() => setView('APPROVALS')}
              className={`px-4 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${
                view === 'APPROVALS'
                  ? 'border-b-2 border-amber-400 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Approvals Queue
            </button>
          )}
          <button
            onClick={() => setView('TRIAGE')}
            className={`px-4 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${
              view === 'TRIAGE'
                ? 'border-b-2 border-amber-400 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Triage Queue
          </button>
          <button
            onClick={() => setView('HIBERNATED')}
            className={`px-4 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${
              view === 'HIBERNATED'
                ? 'border-b-2 border-amber-400 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Hibernated List
          </button>
          <button
            onClick={() => setView('DIRECTORY')}
            className={`px-4 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${
              view === 'DIRECTORY'
                ? 'border-b-2 border-amber-400 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Case Directory
          </button>
          <button
            onClick={() => setView('STR_DIRECTORY')}
            className={`px-4 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${
              view === 'STR_DIRECTORY'
                ? 'border-b-2 border-amber-400 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            STR/CTR/CMR Directory
          </button>
          <button
            onClick={() => setView('DISSEMINATION')}
            className={`px-4 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${
              view === 'DISSEMINATION'
                ? 'border-b-2 border-amber-400 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Dissemination Tracker
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
