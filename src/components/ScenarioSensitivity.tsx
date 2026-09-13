import React from "react";
import { ScenarioType, CalculatorInputs } from "../types";
import { calculateRoi } from "../utils/calculator";
import { ShieldCheck, Target, Sparkles, ArrowRight } from "lucide-react";

interface ScenarioSensitivityProps {
  inputs: CalculatorInputs;
  currentScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
}

export const ScenarioSensitivity: React.FC<ScenarioSensitivityProps> = ({
  inputs,
  currentScenario,
  onSelectScenario,
}) => {
  const scenarios: { id: ScenarioType; title: string; subtitle: string; icon: typeof ShieldCheck; tag: string }[] = [
    {
      id: "conservative",
      title: "Conservative (CFO Baseline)",
      subtitle: "Discounted adoption (-15%), +10% cost contingency buffer, conservative time conversion.",
      icon: ShieldCheck,
      tag: "Best for Finance Approval",
    },
    {
      id: "balanced",
      title: "Balanced (Expected)",
      subtitle: "Baseline target adoption curve, realistic 5-stream value realization.",
      icon: Target,
      tag: "Target Operating Plan",
    },
    {
      id: "optimistic",
      title: "Optimistic (High Leverage)",
      subtitle: "Fast adoption (+15%), top-decile productivity acceleration, minimal friction.",
      icon: Sparkles,
      tag: "Top Performer Benchmark",
    },
  ];

  // Pre-calculate all three scenarios for side-by-side comparison
  const conservativeResults = calculateRoi({ ...inputs, scenario: "conservative" });
  const balancedResults = calculateRoi({ ...inputs, scenario: "balanced" });
  const optimisticResults = calculateRoi({ ...inputs, scenario: "optimistic" });

  const getResultsForScenario = (sc: ScenarioType) => {
    if (sc === "conservative") return conservativeResults;
    if (sc === "optimistic") return optimisticResults;
    return balancedResults;
  };

  return (
    <div id="scenario-sensitivity-card" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
      <div className="pb-4 border-b border-slate-800">
        <h3 className="text-base font-semibold text-white">Scenario Sensitivity & Risk Modeling</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Evaluate risk resilience across adoption variances. Compare your CFO-defensible baseline against expected delivery.
        </p>
      </div>

      {/* Scenario Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {scenarios.map((sc) => {
          const isSelected = currentScenario === sc.id;
          const res = getResultsForScenario(sc.id);
          const Icon = sc.icon;

          return (
            <div
              key={sc.id}
              id={`scenario-card-${sc.id}`}
              onClick={() => onSelectScenario(sc.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50"
                  : "border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-950/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {sc.tag}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                </div>

                <h4 className={`text-sm font-semibold ${isSelected ? "text-white" : "text-slate-200"}`}>
                  {sc.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {sc.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Year 1 Net ROI:</span>
                  <span className={`font-bold ${(res?.firstYearNetRoi ?? 0) > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {res?.firstYearNetRoi ?? 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Break-Even Payback:</span>
                  <span className="text-slate-200 font-bold">
                    {res?.paybackPeriodMonths ?? 0} mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Net Value Created:</span>
                  <span className="text-white font-bold">
                    ${(res?.firstYearNetValue ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-sans">FTE Capacity Unlocked:</span>
                  <span className="text-indigo-300">
                    {res?.fteEquivalent ?? 0} FTEs
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-center">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium font-sans ${
                      isSelected ? "text-indigo-400" : "text-slate-400"
                    }`}
                  >
                    {isSelected ? "Active Scenario" : "Select Scenario"}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-side Comparative Table */}
      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
            <tr>
              <th className="p-3 font-medium font-sans">Comparison Metric</th>
              <th className="p-3 text-right">Conservative</th>
              <th className="p-3 text-right">Balanced</th>
              <th className="p-3 text-right">Optimistic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr>
              <td className="p-3 font-sans text-slate-400">Net 1st-Year Benefit ($)</td>
              <td className="p-3 text-right font-medium text-slate-200">
                ${(conservativeResults?.benefits?.totalAnnualBenefit ?? 0).toLocaleString()}
              </td>
              <td className="p-3 text-right font-medium text-white">
                ${(balancedResults?.benefits?.totalAnnualBenefit ?? 0).toLocaleString()}
              </td>
              <td className="p-3 text-right font-medium text-emerald-400">
                ${(optimisticResults?.benefits?.totalAnnualBenefit ?? 0).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-sans text-slate-400">Total 1st-Year AI TCO ($)</td>
              <td className="p-3 text-right font-medium text-slate-400">
                ${(conservativeResults?.costs?.totalFirstYearCost ?? 0).toLocaleString()}
              </td>
              <td className="p-3 text-right font-medium text-slate-400">
                ${(balancedResults?.costs?.totalFirstYearCost ?? 0).toLocaleString()}
              </td>
              <td className="p-3 text-right font-medium text-slate-400">
                ${(optimisticResults?.costs?.totalFirstYearCost ?? 0).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-sans text-slate-400">Net 1st-Year ROI (%)</td>
              <td className="p-3 text-right font-bold text-slate-200">
                {conservativeResults?.firstYearNetRoi ?? 0}%
              </td>
              <td className="p-3 text-right font-bold text-indigo-300">
                {balancedResults?.firstYearNetRoi ?? 0}%
              </td>
              <td className="p-3 text-right font-bold text-emerald-400">
                {optimisticResults?.firstYearNetRoi ?? 0}%
              </td>
            </tr>
            <tr>
              <td className="p-3 font-sans text-slate-400">Payback Period</td>
              <td className="p-3 text-right text-slate-200">
                {conservativeResults?.paybackPeriodMonths ?? 0} months
              </td>
              <td className="p-3 text-right text-white">
                {balancedResults?.paybackPeriodMonths ?? 0} months
              </td>
              <td className="p-3 text-right text-emerald-300">
                {optimisticResults?.paybackPeriodMonths ?? 0} months
              </td>
            </tr>
            <tr>
              <td className="p-3 font-sans text-slate-400">Cost-to-Value Multiplier</td>
              <td className="p-3 text-right text-slate-300 font-bold">
                1 : ${conservativeResults?.costToValueRatio ?? 0}
              </td>
              <td className="p-3 text-right text-indigo-300 font-bold">
                1 : ${balancedResults?.costToValueRatio ?? 0}
              </td>
              <td className="p-3 text-right text-emerald-400 font-bold">
                1 : ${optimisticResults?.costToValueRatio ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
