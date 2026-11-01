import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral' | 'warning'
  progress,
  progressColor = 'bg-purple-600',
}) => {
  return (
    <div className="app-card app-card-hover p-5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend || progress !== undefined) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {progress !== undefined && (
            <div className="mb-2">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Usage</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            {subtitle && (
              <span className="text-slate-500 dark:text-slate-400 truncate">
                {subtitle}
              </span>
            )}
            {trend && (
              <span
                className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                  trendType === 'positive'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : trendType === 'negative'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    : trendType === 'warning'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
