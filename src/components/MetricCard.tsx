import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  colorTheme: "indigo" | "emerald" | "amber" | "cyan" | "violet";
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  label,
  value,
  subValue,
  icon: Icon,
  colorTheme,
  tooltip,
}) => {
  const themeStyles = {
    indigo: {
      border: "border-slate-300 hover:border-blue-500",
      badge: "text-blue-900 bg-blue-100 border-blue-300",
      iconBg: "bg-blue-100 text-blue-800",
      highlight: "text-blue-900",
    },
    emerald: {
      border: "border-slate-300 hover:border-emerald-500",
      badge: "text-emerald-900 bg-emerald-100 border-emerald-300",
      iconBg: "bg-emerald-100 text-emerald-800",
      highlight: "text-emerald-900",
    },
    amber: {
      border: "border-slate-300 hover:border-amber-500",
      badge: "text-amber-900 bg-amber-100 border-amber-300",
      iconBg: "bg-amber-100 text-amber-800",
      highlight: "text-amber-900",
    },
    cyan: {
      border: "border-slate-300 hover:border-blue-500",
      badge: "text-blue-900 bg-blue-100 border-blue-300",
      iconBg: "bg-blue-100 text-blue-800",
      highlight: "text-blue-900",
    },
    violet: {
      border: "border-slate-300 hover:border-indigo-500",
      badge: "text-indigo-900 bg-indigo-100 border-indigo-300",
      iconBg: "bg-indigo-100 text-indigo-800",
      highlight: "text-indigo-900",
    },
  }[colorTheme];

  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 ${themeStyles.border}`}
      title={tooltip}
    >
      <div className="relative flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
          {label}
        </span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${themeStyles.iconBg}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-950 font-mono">
          {value}
        </span>
      </div>
      {subValue && (
        <div className="mt-1.5 text-xs text-blue-800 font-medium truncate">
          {subValue}
        </div>
      )}
    </div>
  );
};
