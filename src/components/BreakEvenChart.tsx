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
    <div id="break-even-chart-card" className="rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm text-blue-950">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-blue-950">Cumulative Cash Flow & Break-Even Timeline</h3>
            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
              Payback in {effectivePayback} {effectivePayback === 1 ? "month" : "months"}
            </span>
          </div>
          <p className="text-xs text-blue-800 mt-1">
            Models S-curve organizational adoption ramp against cumulative upfront build and operational FinOps spend.
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-300">
          {([12, 24, 36] as const).map((h) => (
            <button
              key={h}
              id={`horizon-btn-${h}`}
              onClick={() => setHorizon(h)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                horizon === h
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-blue-900 hover:bg-slate-200"
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
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
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
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono font-medium"
                >
                  ${(((val ?? 0) / 1000)).toFixed(0)}k
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
                  className="fill-slate-600 text-[10px] font-mono font-medium"
                >
                  M{p.month}
                </text>
              );
            })}

          {/* Lines */}
          {/* Cumulative Benefit Line (Blue) */}
          <path
            d={benefitPath}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cumulative Cost Line (Rose) */}
          <path
            d={costPath}
            fill="none"
            stroke="#e11d48"
            strokeWidth="2"
            strokeDasharray="6 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Break-even beacon */}
          {breakEvenPoint && (
            <g transform={`translate(${getX(breakEvenPoint.month)}, ${getY(breakEvenPoint.cumulativeBenefit)})`}>
              <circle r="12" fill="#1d4ed8" fillOpacity="0.2" className="animate-pulse" />
              <circle r="6" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
              <line
                x1="0"
                y1="10"
                x2="0"
                y2={innerHeight - getY(breakEvenPoint.cumulativeBenefit) + padding.top}
                stroke="#1d4ed8"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <rect
                x="-48"
                y="-32"
                width="96"
                height="22"
                rx="6"
                fill="#ffffff"
                stroke="#1d4ed8"
                strokeWidth="1.5"
                className="shadow-sm"
              />
              <text
                x="0"
                y="-17"
                textAnchor="middle"
                className="fill-blue-950 text-[9px] font-bold tracking-wider font-mono"
              >
                PAYBACK: M{breakEvenPoint.month}
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
                stroke="#1d4ed8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoveredData.month)}
                cy={getY(hoveredData.cumulativeBenefit)}
                r="4"
                fill="#1d4ed8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={getX(hoveredData.month)}
                cy={getY(hoveredData.cumulativeCost)}
                r="4"
                fill="#e11d48"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Floating details badge if hovering */}
        {hoveredData && (
          <div
            className="pointer-events-none absolute top-4 right-4 rounded-xl border border-slate-300 bg-white/95 p-3.5 shadow-xl backdrop-blur-md text-xs font-mono"
            style={{ minWidth: "180px" }}
          >
            <div className="font-bold text-blue-950 pb-1.5 border-b border-slate-200 flex justify-between items-center">
              <span>Month {hoveredData.month}</span>
              {hoveredData.isBreakEven ? (
                <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-sans font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Profitable
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 flex items-center gap-1 font-sans font-bold">
                  <AlertCircle className="w-3 h-3" /> Amortizing
                </span>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-blue-900">
                <span className="flex items-center gap-1.5 font-sans font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-700 inline-block" />
                  Benefit:
                </span>
                <span className="text-blue-950 font-bold">
                  ${(hoveredData.cumulativeBenefit ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-blue-900">
                <span className="flex items-center gap-1.5 font-sans font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                  Cost:
                </span>
                <span className="text-rose-700 font-bold">
                  ${(hoveredData.cumulativeCost ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-200 font-bold">
                <span className="text-blue-950 font-sans">Net Cash:</span>
                <span
                  className={
                    (hoveredData.netCashFlow ?? 0) >= 0
                      ? "text-emerald-700 font-bold"
                      : "text-rose-700 font-bold"
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
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-5 rounded-full bg-blue-700" />
            <span className="text-blue-950 font-semibold">Cumulative Value (5 Streams)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-5 border-b-2 border-dashed border-rose-600" />
            <span className="text-blue-950 font-semibold">Cumulative TCO (Build + FinOps)</span>
          </div>
        </div>

        <div className="text-blue-800 font-medium">
          Hover across points to inspect monthly cash flow balance.
        </div>
      </div>
    </div>
  );
};
