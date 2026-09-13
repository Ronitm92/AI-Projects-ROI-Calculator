import React, { useState } from "react";
import { YearProjection } from "../types";
import { Calendar, TrendingUp, Layers, CheckCircle2 } from "lucide-react";

interface MultiYearProjectionsProps {
  projections: YearProjection[];
  discountRatePct: number;
}

export const MultiYearProjections: React.FC<MultiYearProjectionsProps> = ({
  projections,
  discountRatePct,
}) => {
  const [viewHorizon, setViewHorizon] = useState<3 | 5>(5);

  const displayedProjections = projections.slice(0, viewHorizon);
  const maxNetVal = Math.max(
    ...displayedProjections.map((p) => p.cumulativeNetValue),
    1000
  );

  const finalYear = displayedProjections[displayedProjections.length - 1];

  return (
    <div
      id="multi-year-projections-card"
      className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-sm shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white tracking-tight">
              {viewHorizon}-Year Financial Horizon & Compounding Value
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              Discounted @ {discountRatePct}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Initial build costs amortize in Year 1, unlocking compounding operational leverage in Years 2 through 5.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 3-Yr vs 5-Yr Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewHorizon(3)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewHorizon === 3
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              3-Year
            </button>
            <button
              onClick={() => setViewHorizon(5)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewHorizon === 5
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              5-Year (Full TCO)
            </button>
          </div>

          <span className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            Cum. Net: ${(finalYear?.cumulativeNetValue ?? 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 gap-3.5 mt-4 ${
          viewHorizon === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-5"
        }`}
      >
        {displayedProjections.map((p) => {
          const barHeight = Math.max(
            15,
            Math.round(((p?.cumulativeNetValue ?? 0) / (maxNetVal || 1)) * 100)
          );

          return (
            <div
              key={p.year}
              id={`year-card-${p.year}`}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    Year {p.year}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {p.effectiveAdoptionRate}% adopt
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] text-slate-400">Net Operating Value:</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    ${(p.netValue ?? 0).toLocaleString()}
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs font-mono border-t border-slate-900 pt-2.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Benefits:</span>
                    <span className="text-slate-200">${(p.benefits ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>FinOps Costs:</span>
                    <span className="text-rose-400">${(p.costs ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Annual Net ROI:</span>
                    <span className="text-indigo-300 font-bold">{p.roi}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-900/80 text-[11px]">
                    <span className="text-slate-500">Discounted:</span>
                    <span className="text-emerald-300/90 font-mono">
                      ${(p.discountedCashFlow ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress visual */}
              <div className="mt-4 pt-3 border-t border-slate-900">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Cum. Net:</span>
                  <span className="text-white font-bold">
                    ${(p.cumulativeNetValue ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${barHeight}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
