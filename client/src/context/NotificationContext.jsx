import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toasts Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          let bgClass = 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-700';
          let IconComponent = CheckCircle2;
          let iconColor = 'text-emerald-400 dark:text-emerald-600';

          if (toast.type === 'error') {
            bgClass = 'bg-rose-600 text-white border-rose-500';
            IconComponent = AlertCircle;
            iconColor = 'text-white';
          } else if (toast.type === 'info') {
            bgClass = 'bg-purple-600 text-white border-purple-500';
            IconComponent = Info;
            iconColor = 'text-purple-200';
          } else if (toast.type === 'success') {
            bgClass = 'bg-emerald-600 text-white border-emerald-500';
            IconComponent = CheckCircle2;
            iconColor = 'text-white';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${bgClass}`}
            >
              <div className="flex items-center gap-2.5">
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded-lg focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
