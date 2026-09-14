import React, { useState } from "react";
import { CalculatorInputs, CalculationResults } from "../types";
import { TECHNOLOGY_MOVES, C_SUITE_SIX_QUESTIONS } from "../data/technologyMoves";
import {
  TrendingUp,
  ShieldAlert,
  Layers,
  Scale,
  DollarSign,
  HelpCircle,
  Building,
} from "lucide-react";

interface ExecutiveFinancialLensesProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
  onUpdateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
}

export const ExecutiveFinancialLenses: React.FC<ExecutiveFinancialLensesProps> = ({
  inputs,
  results,
  onUpdateInput,
}) => {
  const [activeLens, setActiveLens] = useState<"capital" | "value" | "pl" | "six_questions">("capital");

  const techMove =
    TECHNOLOGY_MOVES[inputs.technologyMove] || TECHNOLOGY_MOVES.ai_workflows;

  const financialFluency = results?.financialFluency || ({} as any);
  const plImpact = financialFluency.plImpact || ({} as any);
  const capexVsOpex = financialFluency.capexVsOpex || ({} as any);
  const unitEconomics = financialFluency.unitEconomics || ({} as any);

  return (
    <div id="executive-lenses-card" className="rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm text-blue-950">
      {/* Header with C-Suite Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-blue-950 tracking-tight">
              Executive Financial Fluency & Decision Lenses
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-bold">
              Corporate Finance Framework
            </span>
          </div>
          <p className="text-xs text-blue-800 mt-1">
            Translate technology decisions into investment return, margin expansion, growth, and unit economics.
          </p>
        </div>
      </div>

      {/* Strategic Technology Move Callout */}
      <div className="mt-4 p-4 rounded-xl border border-slate-300 bg-slate-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-700" />
            Technology Move: {techMove.label}
          </span>
          <span className="text-[11px] font-mono text-blue-800 font-medium">
            Key Indicators: {techMove.metricsToWatch.join(" • ")}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 text-xs">
          <div>
            <span className="text-blue-900 font-semibold">Business Mechanism: </span>
            <span className="text-blue-950">{techMove.businessMechanism}</span>
          </div>
          <div>
            <span className="text-blue-900 font-semibold">Economic Effect: </span>
            <span className="text-emerald-700 font-bold">{techMove.economicEffect}</span>
          </div>
        </div>
      </div>

      {/* Lens Navigation Tabs */}
      <div className="mt-5 flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-300">
        {[
          { id: "capital", label: "Cost & Capital Discipline", icon: Scale },
          { id: "value", label: "Value Creation & Scale", icon: TrendingUp },
          { id: "pl", label: "P&L Income Statement Impact", icon: DollarSign },
          { id: "six_questions", label: "Six C-Suite Questions", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeLens === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-lens-${tab.id}`}
              onClick={() => setActiveLens(tab.id as typeof activeLens)}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-blue-900 hover:bg-slate-200 hover:text-blue-950"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* LENS 1: COST & CAPITAL DISCIPLINE */}
      {activeLens === "capital" && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* NPV */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">Net Present Value (NPV)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold border border-blue-300">
                  @{inputs.discountRatePct}% Hurdle
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-2">
                ${(financialFluency.npv ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                Discounted net cash flows minus initial investment over 5 years.
              </p>
            </div>

            {/* IRR */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">Internal Rate of Return (IRR)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Hurdle: {inputs.discountRatePct}%
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-blue-900 mt-2">
                {financialFluency.irr ?? 0}%
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                Discount rate at which NPV = 0, evaluated against hurdle rate.
              </p>
            </div>

            {/* 5-Year TCO */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">5-Year Lifecycle TCO</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-blue-950 font-bold border border-slate-300">
                  Full Spend
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-blue-950 mt-2">
                ${(financialFluency.fiveYearTco ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                Upfront build plus 5 years of inference tokens, infrastructure, and ops.
              </p>
            </div>

            {/* Payback */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">Break-Even Payback</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold border border-blue-300">
                  S-Curve
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-blue-900 mt-2">
                {results.paybackPeriodMonths ?? 0} Months
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                Month cumulative returns eclipse development and operational spend.
              </p>
            </div>
          </div>

          {/* CapEx vs. OpEx Deep Dive */}
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-2 flex items-center justify-between">
              <span>CapEx vs. OpEx Accounting Treatment (FASB ASC 350-40)</span>
              <span className="text-[11px] font-semibold text-blue-800">
                Capitalized Dev: {inputs.capexPercentage}%
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-blue-900 font-semibold">Capitalized Asset (Balance Sheet):</div>
                <div className="text-base font-bold font-mono text-blue-950 mt-1">
                  ${(capexVsOpex.capitalizedDev ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-blue-800 mt-1">
                  Eligible development costs capitalized on balance sheet.
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-blue-900 font-semibold">Annual Amortization:</div>
                <div className="text-base font-bold font-mono text-blue-950 mt-1">
                  ${(capexVsOpex.annualAmortization ?? 0).toLocaleString()}/yr
                </div>
                <div className="text-[11px] text-blue-800 mt-1">
                  3-year straight-line non-cash period expense against Operating Margin.
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-blue-900 font-semibold">Period Operating Expense (OpEx):</div>
                <div className="text-base font-bold font-mono text-rose-700 mt-1">
                  ${(capexVsOpex.annualOpex ?? 0).toLocaleString()}/yr
                </div>
                <div className="text-[11px] text-blue-800 mt-1">
                  Cloud compute, model tokens, vector DB & continuous operations.
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 pt-2 border-t border-slate-200 text-xs">
              <span className="text-blue-950 font-bold">Adjust Capitalization %:</span>
              <input
                type="range"
                id="slider-capex-percentage"
                min="0"
                max="100"
                step="5"
                value={inputs.capexPercentage}
                onChange={(e) => onUpdateInput("capexPercentage", Number(e.target.value))}
                className="w-48 h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-mono text-blue-900 font-bold">{inputs.capexPercentage}%</span>
            </div>
          </div>
        </div>
      )}

      {/* LENS 2: VALUE CREATION & SCALE */}
      {activeLens === "value" && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* ARR Uplift */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">ARR / Contracted Value</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Growth
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-2">
                +${(financialFluency.arrImpact ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                Contracted recurring revenue expansion and conversion lift.
              </p>
            </div>

            {/* Gross Margin Expansion */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">Gross Margin Impact</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold border border-blue-300">
                  Efficiency
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-blue-950 mt-2">
                {plImpact.postAiGrossMarginPct ?? 0}%
                <span className="text-xs ml-1.5 text-emerald-700 font-bold">
                  {(plImpact.grossMarginDeltaBps ?? 0) > 0 ? "+" : ""}{plImpact.grossMarginDeltaBps ?? 0} bps
                </span>
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                Baseline {plImpact.baselineGrossMarginPct ?? 0}% &rarr; Post-AI {plImpact.postAiGrossMarginPct ?? 0}%.
              </p>
            </div>

            {/* Operating Margin */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">Operating Margin (EBIT)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold border border-blue-300">
                  Leverage
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-blue-950 mt-2">
                {plImpact.postAiOperatingMarginPct ?? 0}%
                <span className="text-xs ml-1.5 text-emerald-700 font-bold">
                  (+{plImpact.operatingMarginDeltaBps ?? 0} bps)
                </span>
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                Operating income expansion from automated workflow efficiencies.
              </p>
            </div>

            {/* EBITDA Leverage */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">EBITDA Leverage</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Operating
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-2">
                +${(plImpact.ebitdaImpact ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                Annual supplemental operating leverage contribution.
              </p>
            </div>
          </div>

          {/* Unit Economics Card */}
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-2">
              Unit Economics & LTV:CAC Leverage
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-blue-900 text-[11px] font-sans font-semibold">Cost per Query / API:</div>
                <div className="text-sm font-bold text-blue-950 mt-1">
                  ${(unitEconomics.costPerQuery ?? 0).toFixed(4)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-blue-900 text-[11px] font-sans font-semibold">Monthly Cost / Seat:</div>
                <div className="text-sm font-bold text-blue-950 mt-1">
                  ${Math.round((unitEconomics.annualCostPerSeat ?? 0) / 12)}/mo
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-blue-900 text-[11px] font-sans font-semibold">Annual Value / Seat:</div>
                <div className="text-sm font-bold text-emerald-700 mt-1">
                  ${(unitEconomics.annualValuePerSeat ?? 0).toLocaleString()}/yr
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-blue-900 text-[11px] font-sans font-semibold">Monthly Net Value / Seat:</div>
                <div className="text-sm font-bold text-blue-900 mt-1">
                  +${(unitEconomics.monthlyNetValuePerSeat ?? 0).toLocaleString()}/mo
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LENS 3: P&L INCOME STATEMENT IMPACT TABLE */}
      {activeLens === "pl" && (
        <div className="mt-5 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-200 bg-slate-100 text-blue-950 font-bold">
                <tr>
                  <th className="p-3 font-sans">P&L Line Item (Enterprise Level)</th>
                  <th className="p-3 text-right">Pre-AI Baseline</th>
                  <th className="p-3 text-right">Post-AI (Transformed)</th>
                  <th className="p-3 text-right">Dollar Variance</th>
                  <th className="p-3 text-right font-sans">Strategic Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-blue-900">
                <tr>
                  <td className="p-3 font-sans font-bold text-blue-950 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-700" />
                    Enterprise Revenue / ARR
                  </td>
                  <td className="p-3 text-right">${(plImpact.baselineRevenue ?? 0).toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    ${(plImpact.postAiRevenue ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-emerald-700 font-bold">
                    +${(financialFluency.arrImpact ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-sans text-blue-800 text-[11px]">
                    Contract expansion & conversion lift
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-blue-950">
                    Cost of Goods Sold (COGS)
                  </td>
                  <td className="p-3 text-right">
                    ${((plImpact.baselineRevenue ?? 0) - (plImpact.baselineGrossProfit ?? 0)).toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-rose-700">
                    ${((plImpact.postAiRevenue ?? 0) - (plImpact.postAiGrossProfit ?? 0)).toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-rose-700 font-bold">
                    +${(
                      (plImpact.postAiRevenue ?? 0) -
                      (plImpact.postAiGrossProfit ?? 0) -
                      ((plImpact.baselineRevenue ?? 0) - (plImpact.baselineGrossProfit ?? 0))
                    ).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-sans text-blue-800 text-[11px]">
                    Customer-facing AI tokens & cloud infrastructure
                  </td>
                </tr>
                <tr className="bg-slate-50 font-semibold">
                  <td className="p-3 font-sans text-blue-950 font-bold">
                    Gross Profit & Margin %
                  </td>
                  <td className="p-3 text-right text-blue-900">
                    ${(plImpact.baselineGrossProfit ?? 0).toLocaleString()} ({plImpact.baselineGrossMarginPct ?? 0}%)
                  </td>
                  <td className="p-3 text-right text-emerald-700 font-bold">
                    ${(plImpact.postAiGrossProfit ?? 0).toLocaleString()} ({plImpact.postAiGrossMarginPct ?? 0}%)
                  </td>
                  <td className="p-3 text-right text-emerald-700 font-bold">
                    {(plImpact.grossMarginDeltaBps ?? 0) > 0 ? "+" : ""}{plImpact.grossMarginDeltaBps ?? 0} bps
                  </td>
                  <td className="p-3 text-right font-sans text-blue-900 text-[11px]">
                    Gross Margin efficiency
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-blue-950">
                    Operating Expenses (OpEx)
                  </td>
                  <td className="p-3 text-right">
                    ${((plImpact.baselineGrossProfit ?? 0) - (plImpact.baselineOperatingIncome ?? 0)).toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-blue-900">
                    ${((plImpact.postAiGrossProfit ?? 0) - (plImpact.postAiOperatingIncome ?? 0)).toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-emerald-700 font-bold">
                    -${(
                      (plImpact.baselineGrossProfit ?? 0) -
                      (plImpact.baselineOperatingIncome ?? 0) -
                      ((plImpact.postAiGrossProfit ?? 0) - (plImpact.postAiOperatingIncome ?? 0))
                    ).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-sans text-blue-800 text-[11px]">
                    Labor capacity unlocked + defect deflection
                  </td>
                </tr>
                <tr className="bg-slate-50 font-semibold">
                  <td className="p-3 font-sans text-blue-950 font-bold">
                    Operating Income & Operating Margin %
                  </td>
                  <td className="p-3 text-right text-blue-900">
                    ${(plImpact.baselineOperatingIncome ?? 0).toLocaleString()} ({plImpact.baselineOperatingMarginPct ?? 0}%)
                  </td>
                  <td className="p-3 text-right text-blue-950 font-bold">
                    ${(plImpact.postAiOperatingIncome ?? 0).toLocaleString()} ({plImpact.postAiOperatingMarginPct ?? 0}%)
                  </td>
                  <td className="p-3 text-right text-emerald-700 font-bold">
                    +{(plImpact.operatingMarginDeltaBps ?? 0)} bps
                  </td>
                  <td className="p-3 text-right font-sans text-emerald-700 text-[11px] font-bold">
                    Operating leverage expansion
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-emerald-800 font-bold">
                    EBITDA Contribution
                  </td>
                  <td className="p-3 text-right text-blue-800">—</td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    +${(plImpact.ebitdaImpact ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    +${(plImpact.ebitdaImpact ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-sans text-blue-800 text-[11px]">
                    Cash flow leverage + capitalized amortization
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-blue-900">
            <strong className="text-blue-950">Core Principle: </strong>
            <em>Explain the concrete financial mechanism: what changed in revenue, COGS, margin, risk, or capital efficiency.</em>
          </div>
        </div>
      )}

      {/* LENS 4: SIX C-SUITE QUESTIONS */}
      {activeLens === "six_questions" && (
        <div className="mt-5 space-y-3">
          <div className="text-xs text-blue-800 mb-2 font-medium">
            Standard decision criteria for executive committee and board approval:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {C_SUITE_SIX_QUESTIONS.map((q) => {
              let answer = "";
              if (q.key === "outcome") {
                answer = inputs.businessOutcome || `Automates cognitive workflow bottlenecks, unlocking ${(results.annualHoursSaved ?? 0).toLocaleString()} hours (≈${results.fteEquivalent ?? 0} FTEs) and reducing cycle time.`;
              } else if (q.key === "economics") {
                answer = `5-Year TCO is $${(financialFluency.fiveYearTco ?? 0).toLocaleString()} generating $${(results.fiveYearProjections ?? []).reduce((s, p) => s + (p?.benefits ?? 0), 0).toLocaleString()} in gross benefits. Year 1 Net ROI is ${results.firstYearNetRoi ?? 0}% with ${results.paybackPeriodMonths ?? 0}-month payback.`;
              } else if (q.key === "plCash") {
                answer = `Reflected in +$${(financialFluency.arrImpact ?? 0).toLocaleString()} ARR, +${plImpact.operatingMarginDeltaBps ?? 0} bps operating margin expansion, and $${(capexVsOpex.capitalizedDev ?? 0).toLocaleString()} capitalized software asset.`;
              } else if (q.key === "assumptions") {
                answer = `Evaluated under ${(inputs.scenario || "expected").toUpperCase()} scenario (${inputs.adoptionRate ?? 0}% target adoption, $${inputs.tokenCostPerMillion ?? 0}/1M tokens, and ${inputs.discountRatePct ?? 0}% hurdle rate yielding $${(financialFluency.npv ?? 0).toLocaleString()} NPV).`;
              } else if (q.key === "evidenceGate") {
                answer = inputs.evidenceGate || "Evidence Gate: Pilot sprint validation, latency <1.0s, user adoption >50% within 45 days, and defect deflection rate >18%.";
              } else if (q.key === "owner") {
                answer = inputs.executiveOwner || "Lead Product Manager & Head of Engineering";
              }

              return (
                <div
                  key={q.key}
                  id={`c-suite-question-${q.key}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-300">
                        {q.number} {q.title.toUpperCase()}
                      </span>
                      <ShieldAlert className="w-4 h-4 text-blue-700" />
                    </div>
                    <h5 className="text-xs font-bold text-blue-950 mt-2">
                      {q.question}
                    </h5>
                    <p className="text-[11px] text-blue-800 mt-1 italic">
                      {q.guidance}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-blue-950 uppercase tracking-wider block mb-1">
                      Modeled Executive Answer:
                    </span>
                    <div className="text-xs text-blue-950 bg-white p-2.5 rounded-lg border border-slate-200 font-sans leading-relaxed">
                      {answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
