import React, { useState, useMemo } from "react";
import { MonthDataPoint } from "../types";
import { TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

interface BreakEvenChartProps {
  timeline: MonthDataPoint[];
  paybackMonths?: number;
  paybackPeriodMonths?: number;
}

export const BreakEvenChart: React.FC<BreakEvenChartProps> = ({
  timeline,
  paybackMonths,
  paybackPeriodMonths,
}) => {
  const effectivePayback = paybackMonths ?? paybackPeriodMonths ?? 12;
  const [horizon, setHorizon] = useState<12 | 24 | 36>(24);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const visiblePoints = useMemo(() => {
    return timeline.slice(0, horizon);
  }, [timeline, horizon]);

  // Chart dimensions
  const width = 760;
  const height = 300;
  const padding = { top: 25, right: 30, bottom: 40, left: 65 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Max value calculation for Y axis
  const maxVal = useMemo(() => {
    const highest = Math.max(
      ...visiblePoints.map((p) => Math.max(p.cumulativeBenefit, p.cumulativeCost))
    );
    return Math.ceil((highest * 1.1) / 10000) * 10000 || 50000;
  }, [visiblePoints]);

  // Scales
  const getX = (month: number) => {
    return padding.left + ((month - 1) / (horizon - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return padding.top + innerHeight - (val / maxVal) * innerHeight;
  };

  // SVG Line paths
  const benefitPath = useMemo(() => {
    return visiblePoints.reduce((acc, p, idx) => {
      const x = getX(p.month);
      const y = getY(p.cumulativeBenefit);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");
  }, [visiblePoints, horizon, maxVal]);

  const costPath = useMemo(() => {
    return visiblePoints.reduce((acc, p, idx) => {
      const x = getX(p.month);
      const y = getY(p.cumulativeCost);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");
  }, [visiblePoints, horizon, maxVal]);

  // Break-even crossover point
  const breakEvenPoint = visiblePoints.find((p) => p.month === effectivePayback);

  const hoveredData = hoveredMonth
    ? visiblePoints.find((p) => p.month === hoveredMonth)
    : null;

  return (
    <div id="break-even-chart-card" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Cumulative Cash Flow & Break-Even Timeline</h3>
            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              <TrendingUp className="w-3 h-3" />
              Payback in {effectivePayback} {effectivePayback === 1 ? "month" : "months"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Models S-curve organizational adoption ramp and ongoing AI infrastructure operational spend.
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1 border border-slate-800">
          {([12, 24, 36] as const).map((h) => (
            <button
              key={h}
              id={`horizon-btn-${h}`}
              onClick={() => setHorizon(h)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                horizon === h
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {h}M
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative mt-4 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[580px] select-none"
          onMouseLeave={() => setHoveredMonth(null)}
        >
          <defs>
            <linearGradient id="benefitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + innerHeight * (1 - ratio);
            const val = Math.round(maxVal * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  ${(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Month X axis labels */}
          {visiblePoints
            .filter((_, i) => (horizon === 12 ? i % 1 === 0 : horizon === 24 ? i % 2 === 0 : i % 3 === 0))
            .map((p) => {
              const x = getX(p.month);
              return (
                <text
                  key={p.month}
                  x={x}
                  y={height - 15}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  M{p.month}
                </text>
              );
            })}

          {/* Lines */}
          {/* Cumulative Benefit Line (Emerald) */}
          <path
            d={benefitPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cumulative Cost Line (Rose) */}
          <path
            d={costPath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="6 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Break-even beacon */}
          {breakEvenPoint && (
            <g transform={`translate(${getX(breakEvenPoint.month)}, ${getY(breakEvenPoint.cumulativeBenefit)})`}>
              <circle r="12" fill="#10b981" fillOpacity="0.2" className="animate-pulse" />
              <circle r="6" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
              <line
                x1="0"
                y1="10"
                x2="0"
                y2={innerHeight - getY(breakEvenPoint.cumulativeBenefit) + padding.top}
                stroke="#10b981"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <rect
                x="-45"
                y="-32"
                width="90"
                height="22"
                rx="4"
                fill="#0f172a"
                stroke="#10b981"
                strokeWidth="1"
              />
              <text
                x="0"
                y="-18"
                textAnchor="middle"
                className="fill-emerald-400 text-[9px] font-semibold tracking-wider font-mono"
              >
                BREAK-EVEN: M{breakEvenPoint.month}
              </text>
            </g>
          )}

          {/* Hover interaction targets */}
          {visiblePoints.map((p) => {
            const x = getX(p.month);
            return (
              <rect
                key={p.month}
                x={x - innerWidth / (horizon * 2)}
                y={padding.top}
                width={innerWidth / horizon}
                height={innerHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredMonth(p.month)}
              />
            );
          })}

          {/* Hover tooltip pointer line */}
          {hoveredData && (
            <g>
              <line
                x1={getX(hoveredData.month)}
                y1={padding.top}
                x2={getX(hoveredData.month)}
                y2={padding.top + innerHeight}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoveredData.month)}
                cy={getY(hoveredData.cumulativeBenefit)}
                r="4"
                fill="#10b981"
              />
              <circle
                cx={getX(hoveredData.month)}
                cy={getY(hoveredData.cumulativeCost)}
                r="4"
                fill="#f43f5e"
              />
            </g>
          )}
        </svg>

        {/* Floating details badge if hovering */}
        {hoveredData && (
          <div
            className="pointer-events-none absolute top-4 right-4 rounded-lg border border-slate-700 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md text-xs font-mono"
            style={{ minWidth: "170px" }}
          >
            <div className="font-semibold text-slate-300 pb-1 border-b border-slate-800 flex justify-between items-center">
              <span>Month {hoveredData.month} Status</span>
              {hoveredData.isBreakEven ? (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3 h-3" /> Profitable
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-sans">
                  <AlertCircle className="w-3 h-3" /> Amortizing
                </span>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Benefit:
                </span>
                <span className="text-emerald-300 font-medium">
                  ${(hoveredData.cumulativeBenefit ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  Cost:
                </span>
                <span className="text-rose-300 font-medium">
                  ${(hoveredData.cumulativeCost ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800/80 font-bold">
                <span className="text-slate-300">Net Flow:</span>
                <span
                  className={
                    (hoveredData.netCashFlow ?? 0) >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                >
                  {(hoveredData.netCashFlow ?? 0) >= 0 ? "+" : ""}$
                  {(hoveredData.netCashFlow ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Summary */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/70 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Cumulative Value (5 Streams)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-b-2 border-dashed border-rose-500" />
            <span className="text-slate-300">Cumulative TCO (Dev + Infra + FinOps)</span>
          </div>
        </div>

        <div className="text-slate-400">
          Tip: Hover across points to inspect monthly cash balance.
        </div>
      </div>
    </div>
  );
};
