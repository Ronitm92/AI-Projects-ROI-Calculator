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
      subtitle: "Adoption discounted (-15%), +10% cost contingency buffer, conservative time conversion.",
      icon: ShieldCheck,
      tag: "Finance Defensible",
    },
    {
      id: "balanced",
      title: "Balanced (Target Plan)",
      subtitle: "Baseline target adoption curve, realistic 5-stream value realization.",
      icon: Target,
      tag: "Operating Plan",
    },
    {
      id: "optimistic",
      title: "Optimistic (High Leverage)",
      subtitle: "Accelerated adoption (+15%), top-decile productivity speed, minimal friction.",
      icon: Sparkles,
      tag: "High Adoption",
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
    <div id="scenario-sensitivity-card" className="rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm text-blue-950">
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-base sm:text-lg font-bold text-blue-950">Scenario Sensitivity & Stress Testing</h3>
        <p className="text-xs text-blue-800 mt-1">
          Evaluate risk resilience across adoption and cost variances. Compare finance-defensible baselines with expected delivery.
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
                  ? "border-blue-700 bg-blue-50/70 shadow-md ring-2 ring-blue-600/30"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono border ${
                    isSelected ? "bg-blue-100 text-blue-900 border-blue-300" : "bg-white text-blue-900 border-slate-300"
                  }`}>
                    {sc.tag}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? "text-blue-800" : "text-slate-400"}`} />
                </div>

                <h4 className="text-sm font-bold text-blue-950">
                  {sc.title}
                </h4>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                  {sc.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-blue-900 font-sans font-medium">Year 1 Net ROI:</span>
                  <span className={`font-bold ${(res?.firstYearNetRoi ?? 0) > 0 ? "text-emerald-700" : "text-rose-700"}`}>
                    {res?.firstYearNetRoi ?? 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-900 font-sans font-medium">Break-Even Payback:</span>
                  <span className="text-blue-950 font-bold">
                    {res?.paybackPeriodMonths ?? 0} mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-900 font-sans font-medium">Net Value Created:</span>
                  <span className="text-blue-950 font-bold">
                    ${(res?.firstYearNetValue ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-blue-800 font-sans">FTE Capacity Unlocked:</span>
                  <span className="text-blue-900 font-bold">
                    {res?.fteEquivalent ?? 0} FTEs
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-center">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold font-sans ${
                      isSelected ? "text-blue-800" : "text-blue-600"
                    }`}
                  >
                    {isSelected ? "Active Scenario" : "Select Scenario"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-side Comparative Table */}
      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-slate-200 bg-slate-100 text-blue-950 font-bold">
            <tr>
              <th className="p-3 font-sans">Comparison Metric</th>
              <th className="p-3 text-right">Conservative</th>
              <th className="p-3 text-right">Balanced</th>
              <th className="p-3 text-right">Optimistic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-blue-900">
            <tr>
              <td className="p-3 font-sans font-medium text-blue-950">Net 1st-Year Benefit ($)</td>
              <td className="p-3 text-right font-medium text-blue-900">
                ${(conservativeResults?.benefits?.totalAnnualBenefit ?? 0).toLocaleString()}
              </td>
              <td className="p-3 text-right font-bold text-blue-950">
                ${(balancedResults?.benefits?.totalAnnualBenefit ?? 0).toLocaleString()}
              </td>
              <td className="p-3 text-right font-bold text-emerald-700">
                ${(optimisticResults?.benefits?.totalAnnualBenefit ?? 0).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-sans font-medium text-blue-950">Total 1st-Year AI TCO ($)</td>
              <td className="p-3 text-right font-medium text-rose-700">
                ${(conservativeResults?.costs?.totalFirstYearCost ?? 0).toLocaleString()}
              </td>
              <td className="p-3 text-right font-medium text-rose-700">
                ${(balancedResults?.costs?.totalFirstYearCost ?? 0).toLocaleString()}
              </td>
              <td className="p-3 text-right font-medium text-rose-700">
                ${(optimisticResults?.costs?.totalFirstYearCost ?? 0).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-sans font-medium text-blue-950">Net 1st-Year ROI (%)</td>
              <td className="p-3 text-right font-bold text-blue-900">
                {conservativeResults?.firstYearNetRoi ?? 0}%
              </td>
              <td className="p-3 text-right font-bold text-blue-950">
                {balancedResults?.firstYearNetRoi ?? 0}%
              </td>
              <td className="p-3 text-right font-bold text-emerald-700">
                {optimisticResults?.firstYearNetRoi ?? 0}%
              </td>
            </tr>
            <tr>
              <td className="p-3 font-sans font-medium text-blue-950">Payback Period</td>
              <td className="p-3 text-right text-blue-900">
                {conservativeResults?.paybackPeriodMonths ?? 0} months
              </td>
              <td className="p-3 text-right text-blue-950 font-bold">
                {balancedResults?.paybackPeriodMonths ?? 0} months
              </td>
              <td className="p-3 text-right text-emerald-700 font-bold">
                {optimisticResults?.paybackPeriodMonths ?? 0} months
              </td>
            </tr>
            <tr>
              <td className="p-3 font-sans font-medium text-blue-950">Cost-to-Value Multiplier</td>
              <td className="p-3 text-right text-blue-900 font-bold">
                1 : ${conservativeResults?.costToValueRatio ?? 0}
              </td>
              <td className="p-3 text-right text-blue-950 font-bold">
                1 : ${balancedResults?.costToValueRatio ?? 0}
              </td>
              <td className="p-3 text-right text-emerald-700 font-bold">
                1 : ${optimisticResults?.costToValueRatio ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
