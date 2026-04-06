import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, User, ShieldAlert, ChevronRight, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [showTypologies, setShowTypologies] = useState(false);

  const crimeTypes = [
    "Tax Evasion",
    "Money Laundering",
    "Fraud / Cheating",
    "Terrorism Financing",
    "Cybercrime",
    "Sanctions Evasion"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          <ShieldAlert className="w-12 h-12 text-blue-500 mx-auto mb-4 relative z-10" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight relative z-10">STRO STARS</h1>
          <p className="text-gray-400 mt-2 text-sm relative z-10">Restricted Case Management System</p>
        </div>

        {/* Action Panel */}
        <div className="p-8 space-y-6">
          {!showTypologies ? (
            <>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Authorization Required</h2>
                <p className="text-sm text-gray-500">Please select your operational clearance matrix to deploy the interface.</p>
              </div>

              <div className="space-y-4 pt-2">
                <button 
                  onClick={() => login('MANAGER')}
                  className="w-full text-left p-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all group flex items-start gap-4 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-blue-900">Login as Operations Manager</div>
                    <div className="text-xs font-semibold text-blue-700 mt-0.5">Tier 1 • Full System Visibility</div>
                  </div>
                </button>

                <button 
                  onClick={() => setShowTypologies(true)}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all group flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-700 text-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Login as Investigator</div>
                      <div className="text-xs font-medium text-gray-600 mt-0.5">Tier 2 • Typology-Restricted View</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => setShowTypologies(false)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Select Typology</h2>
                  <p className="text-xs text-gray-500">Choose your assigned operational domain.</p>
                </div>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {crimeTypes.map(crime => (
                  <button
                    key={crime}
                    onClick={() => login('INVESTIGATOR', crime)}
                    className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 font-semibold text-sm text-gray-700 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    {crime}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Secure Connection verified to STRO SONAR
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
