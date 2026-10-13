import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isCritical = toast.type === 'critical';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
              isCritical
                ? 'bg-red-950/90 border-[#D74757]/40 text-red-50'
                : isWarning
                ? 'bg-amber-950/90 border-[#D99824]/40 text-amber-50'
                : isSuccess
                ? 'bg-[#111C28]/95 border-[#79E8CE]/40 text-white'
                : 'bg-[#111C28]/95 border-[#007F82]/30 text-white'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isCritical ? (
                <AlertCircle className="w-5 h-5 text-[#D74757]" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5 text-[#D99824]" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-[#79E8CE]" />
              ) : (
                <Info className="w-5 h-5 text-[#659BFF]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-wide">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
