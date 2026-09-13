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
      border: "border-indigo-500/20 hover:border-indigo-500/40",
      glow: "from-indigo-500/10 to-transparent",
      badge: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      iconBg: "bg-indigo-500/10 text-indigo-400",
      highlight: "text-indigo-300",
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      glow: "from-emerald-500/10 to-transparent",
      badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      highlight: "text-emerald-300",
    },
    amber: {
      border: "border-amber-500/20 hover:border-amber-500/40",
      glow: "from-amber-500/10 to-transparent",
      badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      iconBg: "bg-amber-500/10 text-amber-400",
      highlight: "text-amber-300",
    },
    cyan: {
      border: "border-cyan-500/20 hover:border-cyan-500/40",
      glow: "from-cyan-500/10 to-transparent",
      badge: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      iconBg: "bg-cyan-500/10 text-cyan-400",
      highlight: "text-cyan-300",
    },
    violet: {
      border: "border-violet-500/20 hover:border-violet-500/40",
      glow: "from-violet-500/10 to-transparent",
      badge: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      iconBg: "bg-violet-500/10 text-violet-400",
      highlight: "text-violet-300",
    },
  }[colorTheme];

  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-xl border bg-slate-900/70 p-5 backdrop-blur-md transition-all duration-200 ${themeStyles.border}`}
      title={tooltip}
    >
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${themeStyles.glow} blur-xl`}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${themeStyles.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono">
          {value}
        </span>
      </div>
      {subValue && (
        <div className="mt-2 text-xs text-slate-400 font-medium">
          {subValue}
        </div>
      )}
    </div>
  );
};
