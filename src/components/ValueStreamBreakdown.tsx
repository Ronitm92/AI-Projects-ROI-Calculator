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
      color: "from-blue-500 to-indigo-500",
      barBg: "bg-blue-500",
      textColor: "text-blue-400",
      description: "Hours saved from routine labor, summarization, query answering, and automated ticket triage.",
    },
    {
      key: "qualityImprovement" as const,
      name: "Quality & Error Reduction",
      value: safeBenefits.qualityImprovement,
      weight: safeWeights.qualityImprovement,
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-500",
      barBg: "bg-emerald-500",
      textColor: "text-emerald-400",
      description: "Prevention of costly rework, bug fixes, defect escapes, and escalations via automated validation.",
    },
    {
      key: "innovationVelocity" as const,
      name: "Innovation & Velocity",
      value: safeBenefits.innovationVelocity,
      weight: safeWeights.innovationVelocity,
      icon: Rocket,
      color: "from-purple-500 to-pink-500",
      barBg: "bg-purple-500",
      textColor: "text-purple-400",
      description: "Faster time-to-market for revenue-generating features, rapid experimentation, and unlocked capacity.",
    },
    {
      key: "learningUpskilling" as const,
      name: "Knowledge & Learning",
      value: safeBenefits.learningUpskilling,
      weight: safeWeights.learningUpskilling,
      icon: GraduationCap,
      color: "from-amber-500 to-orange-500",
      barBg: "bg-amber-500",
      textColor: "text-amber-400",
      description: "Accelerated employee onboarding, reduced dependency on senior staff, and instant context retrieval.",
    },
    {
      key: "retentionWellbeing" as const,
      name: "Wellbeing & Retention",
      value: safeBenefits.retentionWellbeing,
      weight: safeWeights.retentionWellbeing,
      icon: Heart,
      color: "from-rose-500 to-red-500",
      barBg: "bg-rose-500",
      textColor: "text-rose-400",
      description: "Cognitive relief from soul-crushing repetitive work, reduced burnout, and lower costly employee turnover.",
    },
  ];

  const totalBenefit = safeBenefits.totalAnnualBenefit || 1;

  return (
    <div id="value-streams-card" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-white">AI4SP 5-Value Stream Breakdown</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic value translation beyond naive 1:1 time savings. Adjust weights to match organizational priorities.
          </p>
        </div>
        <button
          onClick={handleReset}
          id="reset-weights-btn"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2.5 py-1 rounded-md border border-slate-800 hover:border-slate-700 bg-slate-950"
          title="Reset to selected industry benchmarks"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Industry Default
        </button>
      </div>

      {/* Stacked Proportional Bar */}
      <div className="mt-4">
        <div className="h-3.5 w-full rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
          {streams.map((s) => {
            const pct = Math.round((s.value / totalBenefit) * 100);
            if (pct <= 0) return null;
            return (
              <div
                key={s.key}
                style={{ width: `${(s.value / totalBenefit) * 100}%` }}
                className={`h-full ${s.barBg} transition-all duration-300 relative group`}
                title={`${s.name}: $${(s.value ?? 0).toLocaleString()} (${pct}%)`}
              />
            );
          })}
        </div>
      </div>

      {/* Stream Cards Grid */}
      <div className="mt-5 space-y-3.5">
        {streams.map((stream) => {
          const pct = Math.round(((stream.value ?? 0) / totalBenefit) * 100);
          const Icon = stream.icon;

          return (
            <div
              key={stream.key}
              id={`stream-${stream.key}`}
              className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3.5 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-900 border border-slate-800 ${stream.textColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 truncate">
                      {stream.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {stream.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold font-mono text-white">
                    ${(stream.value ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {pct}% of annual value
                  </div>
                </div>
              </div>

              {/* Slider for stream weight */}
              <div className="mt-3 flex items-center gap-3 pt-2 border-t border-slate-900">
                <span className="text-[11px] font-mono text-slate-400 w-16">
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
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <span className="text-slate-400 font-medium">Total 1st-Year Annual Value:</span>
        <span className="text-emerald-400 font-bold font-mono text-sm">
          ${(safeBenefits.totalAnnualBenefit ?? 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};
