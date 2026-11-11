import React from 'react';
import { useTravelStore, ToastItem } from '../../context/TravelStoreContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTravelStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast: ToastItem) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-sky-600 shrink-0" />
          );

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white border border-stone-200 rounded-lg shadow-lg shadow-stone-900/5 text-sm transition-all animate-in slide-in-from-bottom-2 duration-200"
          >
            {icon}
            <div className="flex-1 text-stone-800 leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
