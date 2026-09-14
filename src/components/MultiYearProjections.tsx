import React, { useState } from "react";
import { YearProjection } from "../types";
import { Calendar, TrendingUp } from "lucide-react";

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
      className="rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm text-blue-950"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-blue-950 tracking-tight">
              {viewHorizon}-Year Financial Horizon & Compounding Returns
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-900 font-bold">
              Discounted @ {discountRatePct}%
            </span>
          </div>
          <p className="text-xs text-blue-800 mt-1">
            Upfront build absorbs in Year 1, unlocking compounding operational leverage in subsequent years.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 3-Yr vs 5-Yr Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold">
            <button
              onClick={() => setViewHorizon(3)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewHorizon === 3
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-blue-900 hover:bg-slate-200"
              }`}
            >
              3-Year
            </button>
            <button
              onClick={() => setViewHorizon(5)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewHorizon === 5
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-blue-900 hover:bg-slate-200"
              }`}
            >
              5-Year (Full TCO)
            </button>
          </div>

          <span className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
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
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-950 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-blue-700" />
                    Year {p.year}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-300 text-blue-900 font-bold">
                    {p.effectiveAdoptionRate}% adopt
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] text-blue-800 font-medium">Net Operating Value:</div>
                  <div className="text-lg font-bold font-mono text-blue-950 mt-0.5">
                    ${(p.netValue ?? 0).toLocaleString()}
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs font-mono border-t border-slate-200 pt-2.5">
                  <div className="flex justify-between text-blue-900">
                    <span>Gross Value:</span>
                    <span className="text-blue-950 font-bold">${(p.benefits ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-blue-900">
                    <span>FinOps Spend:</span>
                    <span className="text-rose-700 font-bold">${(p.costs ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-blue-900">
                    <span>Annual Net ROI:</span>
                    <span className="text-emerald-700 font-bold">{p.roi}%</span>
                  </div>
                  <div className="flex justify-between text-blue-800 pt-1.5 border-t border-slate-200 text-[11px]">
                    <span className="text-blue-900 font-medium">Discounted:</span>
                    <span className="text-blue-950 font-bold font-mono">
                      ${(p.discountedCashFlow ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress visual */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="flex justify-between text-[10px] font-mono text-blue-800 font-medium mb-1">
                  <span>Cumulative Net:</span>
                  <span className="text-blue-950 font-bold">
                    ${(p.cumulativeNetValue ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                  <div
                    style={{ width: `${barHeight}%` }}
                    className="h-full bg-blue-700 rounded-full transition-all duration-500"
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
