import React from "react";
import { StreamBreakdown } from "../types";
import { Zap, ShieldCheck, Rocket, GraduationCap, Heart, RotateCcw } from "lucide-react";

interface ValueStreamBreakdownProps {
  benefits?: StreamBreakdown;
  streamWeights?: {
    directProductivity: number;
    qualityImprovement: number;
    innovationVelocity: number;
    learningUpskilling: number;
    retentionWellbeing: number;
  };
  weights?: {
    directProductivity: number;
    qualityImprovement: number;
    innovationVelocity: number;
    learningUpskilling: number;
    retentionWellbeing: number;
  };
  onWeightChange?: (key: keyof NonNullable<ValueStreamBreakdownProps["streamWeights"]>, value: number) => void;
  onUpdateWeights?: (weights: NonNullable<ValueStreamBreakdownProps["streamWeights"]>) => void;
  onResetWeights?: () => void;
}

export const ValueStreamBreakdown: React.FC<ValueStreamBreakdownProps> = ({
  benefits,
  streamWeights,
  weights,
  onWeightChange,
  onUpdateWeights,
  onResetWeights,
}) => {
  const safeWeights = {
    directProductivity: streamWeights?.directProductivity ?? weights?.directProductivity ?? 40,
    qualityImprovement: streamWeights?.qualityImprovement ?? weights?.qualityImprovement ?? 25,
    innovationVelocity: streamWeights?.innovationVelocity ?? weights?.innovationVelocity ?? 15,
    learningUpskilling: streamWeights?.learningUpskilling ?? weights?.learningUpskilling ?? 10,
    retentionWellbeing: streamWeights?.retentionWellbeing ?? weights?.retentionWellbeing ?? 10,
  };

  const safeBenefits = {
    directProductivity: benefits?.directProductivity ?? 0,
    qualityImprovement: benefits?.qualityImprovement ?? 0,
    innovationVelocity: benefits?.innovationVelocity ?? 0,
    learningUpskilling: benefits?.learningUpskilling ?? 0,
    retentionWellbeing: benefits?.retentionWellbeing ?? 0,
    totalAnnualBenefit: benefits?.totalAnnualBenefit ?? 0,
  };

  const handleWeightChange = (
    key: keyof typeof safeWeights,
    val: number
  ) => {
    if (onWeightChange) {
      onWeightChange(key, val);
    } else if (onUpdateWeights) {
      onUpdateWeights({
        ...safeWeights,
        [key]: val,
      });
    }
  };

  const handleReset = () => {
    if (onResetWeights) {
      onResetWeights();
    } else if (onUpdateWeights) {
      onUpdateWeights({
        directProductivity: 40,
        qualityImprovement: 25,
        innovationVelocity: 15,
        learningUpskilling: 10,
        retentionWellbeing: 10,
      });
    }
  };

  const streams = [
    {
      key: "directProductivity" as const,
      name: "Direct Productivity",
      value: safeBenefits.directProductivity,
      weight: safeWeights.directProductivity,
      icon: Zap,
      barBg: "bg-blue-600",
      textColor: "text-blue-700",
      description: "Hours saved from routine manual workflows, synthesis, document triage, and automated routing.",
    },
    {
      key: "qualityImprovement" as const,
      name: "Quality & Defect Prevention",
      value: safeBenefits.qualityImprovement,
      weight: safeWeights.qualityImprovement,
      icon: ShieldCheck,
      barBg: "bg-emerald-600",
      textColor: "text-emerald-700",
      description: "Prevention of costly rework, defect escapes, and customer escalations via automated verification.",
    },
    {
      key: "innovationVelocity" as const,
      name: "Innovation & Cycle Time",
      value: safeBenefits.innovationVelocity,
      weight: safeWeights.innovationVelocity,
      icon: Rocket,
      barBg: "bg-indigo-600",
      textColor: "text-indigo-700",
      description: "Accelerated time-to-market for revenue initiatives and unlocked organizational bandwidth.",
    },
    {
      key: "learningUpskilling" as const,
      name: "Knowledge & Onboarding",
      value: safeBenefits.learningUpskilling,
      weight: safeWeights.learningUpskilling,
      icon: GraduationCap,
      barBg: "bg-amber-600",
      textColor: "text-amber-700",
      description: "Accelerated employee ramp time, reduced dependency on key experts, and context retrieval.",
    },
    {
      key: "retentionWellbeing" as const,
      name: "Retention & Organizational Health",
      value: safeBenefits.retentionWellbeing,
      weight: safeWeights.retentionWellbeing,
      icon: Heart,
      barBg: "bg-slate-600",
      textColor: "text-slate-700",
      description: "Mitigation of repetitive manual fatigue, burnout reduction, and lower key talent replacement costs.",
    },
  ];

  const totalBenefit = safeBenefits.totalAnnualBenefit || 1;

  return (
    <div id="value-streams-card" className="rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm text-blue-950">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-blue-950">5-Value Stream Financial Breakdown</h3>
          <p className="text-xs text-blue-800 mt-1">
            Multidimensional value allocation across direct time release, quality control, velocity, and retention.
          </p>
        </div>
        <button
          onClick={handleReset}
          id="reset-weights-btn"
          className="flex items-center gap-1.5 text-xs text-blue-900 hover:text-blue-950 font-bold transition-all px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 cursor-pointer"
          title="Reset to benchmark weights"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Benchmarks</span>
        </button>
      </div>

      {/* Stacked Proportional Bar */}
      <div className="mt-4">
        <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex border border-slate-300">
          {streams.map((s) => {
            const pct = Math.round((s.value / totalBenefit) * 100);
            if (pct <= 0) return null;
            return (
              <div
                key={s.key}
                style={{ width: `${(s.value / totalBenefit) * 100}%` }}
                className={`h-full ${s.barBg} transition-all duration-300 relative`}
                title={`${s.name}: $${(s.value ?? 0).toLocaleString()} (${pct}%)`}
              />
            );
          })}
        </div>
      </div>

      {/* Stream Cards Grid */}
      <div className="mt-5 space-y-3">
        {streams.map((stream) => {
          const pct = Math.round(((stream.value ?? 0) / totalBenefit) * 100);
          const Icon = stream.icon;

          return (
            <div
              key={stream.key}
              id={`stream-${stream.key}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all hover:border-slate-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-300 ${stream.textColor} shadow-xs`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-blue-950 truncate">
                      {stream.name}
                    </h4>
                    <p className="text-[11px] text-blue-800 line-clamp-1">
                      {stream.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold font-mono text-blue-950">
                    ${(stream.value ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-blue-800 font-semibold">
                    {pct}% of annual value
                  </div>
                </div>
              </div>

              {/* Slider for stream weight */}
              <div className="mt-3 flex items-center gap-3 pt-2.5 border-t border-slate-200">
                <span className="text-xs font-mono font-bold text-blue-950 w-24">
                  Weight: {stream.weight}%
                </span>
                <input
                  type="range"
                  id={`weight-slider-${stream.key}`}
                  min="0"
                  max="60"
                  step="5"
                  value={stream.weight}
                  onChange={(e) => handleWeightChange(stream.key, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
        <span className="text-blue-950 font-bold">Total Modeled 1st-Year Value:</span>
        <span className="text-emerald-700 font-bold font-mono text-base">
          ${(safeBenefits.totalAnnualBenefit ?? 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};
