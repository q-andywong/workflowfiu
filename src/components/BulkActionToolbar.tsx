import React from 'react';
import { X, CheckCircle, Database, Trash2, Clock } from 'lucide-react';

interface BulkAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'danger' | 'warning' | 'default';
}

interface BulkActionToolbarProps {
  selectedCount: number;
  onClear: () => void;
  actions: BulkAction[];
}

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({ selectedCount, onClear, actions }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-300">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 p-2 flex items-center gap-6 min-w-[500px]">
        <div className="flex items-center gap-4 px-4 border-r border-gray-700">
          <button 
            onClick={onClear}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <div className="whitespace-nowrap">
            <span className="text-sm font-black text-blue-400">{selectedCount}</span>
            <span className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-widest">selected</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                action.variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                action.variant === 'danger' ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30' :
                action.variant === 'warning' ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/30' :
                'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkActionToolbar;
