import React, { useState } from "react";
import { CalculatorInputs, CalculationResults, TechnologyMoveType } from "../types";
import { TECHNOLOGY_MOVES } from "../data/technologyMoves";
import { PRESET_ARCHETYPES } from "../data/benchmarks";
import { OnDemandUseCaseModal } from "./OnDemandUseCaseModal";
import {
  Briefcase,
  Cpu,
  Landmark,
  Layers,
  Sparkles,
  FileSpreadsheet,
  RotateCcw,
  Sliders,
  DollarSign,
  Users,
  Clock,
  Zap,
  Globe,
  Search,
} from "lucide-react";

interface MultiStakeholderInputHubProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
  onUpdateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  onUpdateWeights: (weights: CalculatorInputs["streamWeights"]) => void;
  onLoadPreset: (presetId: string) => void;
  onApplyCustomInputs?: (custom: Partial<CalculatorInputs>) => void;
}

export const MultiStakeholderInputHub: React.FC<MultiStakeholderInputHubProps> = ({
  inputs,
  results,
  onUpdateInput,
  onUpdateWeights,
  onLoadPreset,
  onApplyCustomInputs,
}) => {
  const [activeTab, setActiveTab] = useState<"pm" | "eng" | "cfo" | "streams">("pm");
  const [isOnDemandModalOpen, setIsOnDemandModalOpen] = useState<boolean>(false);

  const techMovesList = Object.values(TECHNOLOGY_MOVES);

  const handleApplyGeneratedUseCase = (custom: Partial<CalculatorInputs>) => {
    if (onApplyCustomInputs) {
      onApplyCustomInputs(custom);
    } else {
      if (custom.streamWeights) {
        onUpdateWeights(custom.streamWeights);
      }
      Object.entries(custom).forEach(([key, val]) => {
        if (key !== "streamWeights" && val !== undefined) {
          onUpdateInput(key as keyof CalculatorInputs, val);
        }
      });
    }
  };

  return (
    <div id="multi-stakeholder-hub" className="rounded-xl border border-slate-800 bg-slate-900/95 p-5 backdrop-blur-sm shadow-xl">
      {/* Top Banner: Dynamic Custom Project Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Dynamic Feature ROI Modeling & Stakeholder Inputs
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build a custom ROI model for any AI project or feature by gathering inputs across PM, Engineering, and Finance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Web Search & Dynamic On-Demand Generator Trigger Button */}
          <button
            id="btn-open-on-demand-research"
            type="button"
            onClick={() => setIsOnDemandModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer border border-indigo-400/30"
            title="Research and generate a custom AI feature ROI model on demand using Gemini and Google Search"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-100" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>On-Demand AI + Web Search</span>
          </button>

          {/* Quick Preset Selector with On-Demand Option */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Template:</span>
            <select
              id="select-preset-archetype"
              value=""
              onChange={(e) => {
                if (e.target.value === "__ON_DEMAND_RESEARCH__") {
                  setIsOnDemandModalOpen(true);
                } else if (e.target.value) {
                  onLoadPreset(e.target.value);
                }
              }}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-indigo-500/30 text-xs text-indigo-200 hover:border-indigo-400 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium shadow-sm"
            >
              <option value="" disabled>
                Load Enterprise AI Template ({PRESET_ARCHETYPES.length} Available)...
              </option>
              <option
                value="__ON_DEMAND_RESEARCH__"
                className="text-indigo-400 font-bold bg-indigo-950/80"
              >
                ✨ + Research New Use Case On-Demand (AI + Web Search)...
              </option>
              <optgroup label="Customer Support & CX Agents">
                {PRESET_ARCHETYPES.filter((p) => p.industryId === "customer_support_bpo").map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.badge}]
                  </option>
                ))}
              </optgroup>
              <optgroup label="Engineering Velocity & Infrastructure">
                {PRESET_ARCHETYPES.filter((p) => p.industryId === "software_saas" || p.industryId === "it_managed_services").map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.badge}]
                  </option>
                ))}
              </optgroup>
              <optgroup label="Finance, Legal & Risk Compliance">
                {PRESET_ARCHETYPES.filter((p) => p.industryId === "fintech_banking" || p.industryId === "legal_tech").map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.badge}]
                  </option>
                ))}
              </optgroup>
              <optgroup label="Healthcare, Industrial & Enterprise Ops">
                {PRESET_ARCHETYPES.filter((p) => p.industryId === "healthcare_pharma" || p.industryId === "manufacturing_supply" || p.industryId === "ecommerce_retail" || p.industryId === "professional_services").map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.badge}]
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Feature Name & Strategic Move Bar */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/70">
        <div className="md:col-span-6">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Feature or Project Name
          </label>
          <input
            id="input-feature-name"
            type="text"
            value={inputs.featureName}
            onChange={(e) => onUpdateInput("featureName", e.target.value)}
            placeholder="e.g. Enterprise RAG Copilot, Support Ticket Auto-Triage..."
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-6">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Strategic Technology Move</span>
            <span className="text-[10px] font-mono text-indigo-400 lowercase">Page 9 Matrix</span>
          </label>
          <select
            id="select-technology-move"
            value={inputs.technologyMove}
            onChange={(e) =>
              onUpdateInput("technologyMove", e.target.value as TechnologyMoveType)
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {techMovesList.map((tm) => (
              <option key={tm.id} value={tm.id}>
                {tm.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="mt-4 flex flex-wrap items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
        <button
          id="tab-btn-pm"
          onClick={() => setActiveTab("pm")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "pm"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Product Manager</span>
        </button>

        <button
          id="tab-btn-eng"
          onClick={() => setActiveTab("eng")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "eng"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Engineering Lead</span>
        </button>

        <button
          id="tab-btn-cfo"
          onClick={() => setActiveTab("cfo")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "cfo"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Business Head & CFO</span>
        </button>

        <button
          id="tab-btn-streams"
          onClick={() => setActiveTab("streams")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "streams"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>5 Value Streams</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. PRODUCT MANAGER (PM) SECTION */}
      {/* ============================================================ */}
      {activeTab === "pm" && (
        <div className="mt-4 space-y-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="font-semibold text-indigo-300">PM Ownership: </span>
            Scope, target user headcount, adoption ramp, weekly productivity savings, and ARR impact.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Target Team / Seats */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Target Seats / Users
                </label>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {inputs.teamSize} seats
                </span>
              </div>
              <input
                id="input-pm-teamsize"
                type="number"
                min="1"
                max="10000"
                value={inputs.teamSize}
                onChange={(e) => onUpdateInput("teamSize", Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Number of team members or customer seats using the feature.
              </p>
            </div>

            {/* Hours Saved Per Person Per Week */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Hours Saved / Person / Wk
                </label>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {inputs.hoursSavedPerWeek} hrs/wk
                </span>
              </div>
              <input
                id="slider-pm-hourssaved"
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={inputs.hoursSavedPerWeek}
                onChange={(e) => onUpdateInput("hoursSavedPerWeek", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0.5h</span>
                <span>{inputs.hoursSavedPerWeek}h</span>
                <span>25h</span>
              </div>
            </div>

            {/* Adoption Rate % */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Target Adoption Rate
                </label>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {inputs.adoptionRate}%
                </span>
              </div>
              <input
                id="slider-pm-adoptionrate"
                type="range"
                min="10"
                max="100"
                step="5"
                value={inputs.adoptionRate}
                onChange={(e) => onUpdateInput("adoptionRate", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Active users: {Math.round(inputs.teamSize * (inputs.adoptionRate / 100))} of {inputs.teamSize} seats.
              </p>
            </div>

            {/* ARR / Direct Revenue Uplift */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  ARR / Revenue Uplift ($/yr)
                </label>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ${(inputs.annualRevenueUplift ?? 0).toLocaleString()}
                </span>
              </div>
              <input
                id="input-pm-revenueuplift"
                type="number"
                min="0"
                step="5000"
                value={inputs.annualRevenueUplift}
                onChange={(e) =>
                  onUpdateInput("annualRevenueUplift", Math.max(0, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Incremental ARR from new monetization, add-on tier, or upsells.
              </p>
            </div>

            {/* Retention & Churn Reduction Lift % */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Retention / Churn Lift
                </label>
                <span className="text-xs font-mono text-indigo-300 font-bold">
                  +{inputs.retentionUpliftPct || 0}%
                </span>
              </div>
              <input
                id="slider-pm-retentionlift"
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={inputs.retentionUpliftPct || 0}
                onChange={(e) => onUpdateInput("retentionUpliftPct", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Reduces churn, strengthening Net Retention Rate (NRR).
              </p>
            </div>

            {/* Monthly Queries Per User */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Monthly Queries / Seat
                </label>
                <span className="text-xs font-mono text-slate-200 font-bold">
                  {inputs.monthlyQueriesPerUser} calls/mo
                </span>
              </div>
              <input
                id="input-pm-monthlyqueries"
                type="number"
                min="10"
                max="5000"
                step="20"
                value={inputs.monthlyQueriesPerUser}
                onChange={(e) =>
                  onUpdateInput("monthlyQueriesPerUser", Math.max(1, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Estimated frequency of AI invocations per active user.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ENGINEERING LEAD & ARCHITECTURE SECTION */}
      {/* ============================================================ */}
      {activeTab === "eng" && (
        <div className="mt-4 space-y-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="font-semibold text-indigo-300">Engineering Ownership: </span>
            Architecture stack, upfront build cost, CapEx capitalization, model tokens, vector DB & maintenance.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Architecture Pattern */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                AI Architecture Pattern
              </label>
              <select
                id="select-eng-architecture"
                value={inputs.architectureType}
                onChange={(e) =>
                  onUpdateInput(
                    "architectureType",
                    e.target.value as CalculatorInputs["architectureType"]
                  )
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="rag_agent">RAG & Knowledge Retrieval Agent</option>
                <option value="llm_copilot">In-App Copilot / Chat Assistant</option>
                <option value="fine_tuned">Domain Fine-Tuned Model</option>
                <option value="autonomous_workflow">Autonomous Multi-Agent Workflow</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Determines inference intensity and vector search requirements.
              </p>
            </div>

            {/* Upfront Build Cost */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Upfront Build & Eval Cost ($)
                </label>
                <span className="text-xs font-mono text-indigo-300 font-bold">
                  ${(inputs.oneTimeDevCost ?? 0).toLocaleString()}
                </span>
              </div>
              <input
                id="input-eng-devcost"
                type="number"
                min="0"
                step="5000"
                value={inputs.oneTimeDevCost}
                onChange={(e) =>
                  onUpdateInput("oneTimeDevCost", Math.max(0, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Sprints, prompt engineering, evals, security reviews.
              </p>
            </div>

            {/* Software Capitalization Rate (CapEx %) */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  CapEx Capitalization % (ASC 350-40)
                </label>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {inputs.capexPercentage}%
                </span>
              </div>
              <input
                id="slider-eng-capex"
                type="range"
                min="0"
                max="100"
                step="5"
                value={inputs.capexPercentage}
                onChange={(e) => onUpdateInput("capexPercentage", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                ${Math.round((inputs.oneTimeDevCost ?? 0) * ((inputs.capexPercentage ?? 80) / 100)).toLocaleString()} capitalized & amortized over 3 years.
              </p>
            </div>

            {/* Avg Tokens Per Query */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Avg Tokens / Query
                </label>
                <span className="text-xs font-mono text-slate-200 font-bold">
                  {(inputs.avgTokensPerQuery ?? 0).toLocaleString()}
                </span>
              </div>
              <input
                id="input-eng-tokensperquery"
                type="number"
                min="100"
                max="20000"
                step="250"
                value={inputs.avgTokensPerQuery}
                onChange={(e) =>
                  onUpdateInput("avgTokensPerQuery", Math.max(100, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Prompt context window + generated response length.
              </p>
            </div>

            {/* Token Pricing per 1M Tokens */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Model Cost ($/1M Tokens)
                </label>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  ${inputs.tokenCostPerMillion}
                </span>
              </div>
              <input
                id="input-eng-tokencost"
                type="number"
                min="0.05"
                max="50"
                step="0.10"
                value={inputs.tokenCostPerMillion}
                onChange={(e) =>
                  onUpdateInput("tokenCostPerMillion", Math.max(0.01, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex gap-1.5 mt-2">
                {[
                  { label: "Flash ($0.15)", val: 0.15 },
                  { label: "Standard ($0.60)", val: 0.60 },
                  { label: "Pro ($2.50)", val: 2.50 },
                ].map((tier) => (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => onUpdateInput("tokenCostPerMillion", tier.val)}
                    className="flex-1 py-0.5 px-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:border-slate-700"
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vector DB & Cloud Infra */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Annual Vector DB & Cloud Infra ($)
                </label>
                <span className="text-xs font-mono text-slate-200 font-bold">
                  ${(inputs.annualInfraCost ?? 0).toLocaleString()}
                </span>
              </div>
              <input
                id="input-eng-infracost"
                type="number"
                min="0"
                step="1000"
                value={inputs.annualInfraCost}
                onChange={(e) =>
                  onUpdateInput("annualInfraCost", Math.max(0, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Vector database, embeddings cache, API gateway.
              </p>
            </div>

            {/* Annual Maintenance & Evals */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Annual Maintenance & Evals ($)
                </label>
                <span className="text-xs font-mono text-slate-200 font-bold">
                  ${(inputs.annualMaintenanceCost ?? 0).toLocaleString()}
                </span>
              </div>
              <input
                id="input-eng-maintenancecost"
                type="number"
                min="0"
                step="1000"
                value={inputs.annualMaintenanceCost}
                onChange={(e) =>
                  onUpdateInput("annualMaintenanceCost", Math.max(0, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Prompt regression evals, model updates, human oversight.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. BUSINESS HEAD & CFO SECTION */}
      {/* ============================================================ */}
      {activeTab === "cfo" && (
        <div className="mt-4 space-y-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="font-semibold text-indigo-300">Finance & Executive Ownership: </span>
            Corporate baseline revenue, hurdle rate for NPV, gross/operating margins, labor cost, and governance.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Enterprise Baseline Revenue */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Enterprise Baseline Revenue ($/yr)
                </label>
                <span className="text-xs font-mono text-slate-200 font-bold">
                  ${(inputs.companyRevenue / 1_000_000).toFixed(1)}M
                </span>
              </div>
              <input
                id="input-cfo-companyrevenue"
                type="number"
                min="100000"
                step="500000"
                value={inputs.companyRevenue}
                onChange={(e) =>
                  onUpdateInput("companyRevenue", Math.max(10000, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Current annual revenue baseline before AI initiative.
              </p>
            </div>

            {/* Baseline Gross Margin % */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Baseline Gross Margin %
                </label>
                <span className="text-xs font-mono text-indigo-300 font-bold">
                  {inputs.baselineGrossMarginPct}%
                </span>
              </div>
              <input
                id="slider-cfo-grossmargin"
                type="range"
                min="20"
                max="95"
                step="1"
                value={inputs.baselineGrossMarginPct}
                onChange={(e) =>
                  onUpdateInput("baselineGrossMarginPct", Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                (Revenue - COGS) / Revenue. Typical SaaS is 65-80%.
              </p>
            </div>

            {/* Baseline Operating Margin % */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Baseline Operating Margin %
                </label>
                <span className="text-xs font-mono text-slate-200 font-bold">
                  {inputs.baselineOperatingMarginPct}%
                </span>
              </div>
              <input
                id="slider-cfo-operatingmargin"
                type="range"
                min="0"
                max="40"
                step="1"
                value={inputs.baselineOperatingMarginPct}
                onChange={(e) =>
                  onUpdateInput("baselineOperatingMarginPct", Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                EBIT / Revenue before AI operating savings.
              </p>
            </div>

            {/* Blended Hourly Labor Rate ($/hr) */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Blended Labor Cost ($/hr)
                </label>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ${inputs.hourlyRate}/hr
                </span>
              </div>
              <input
                id="input-cfo-hourlyrate"
                type="number"
                min="15"
                max="500"
                step="5"
                value={inputs.hourlyRate}
                onChange={(e) =>
                  onUpdateInput("hourlyRate", Math.max(1, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Fully loaded wage + benefits per knowledge worker.
              </p>
            </div>

            {/* Corporate Hurdle Rate (Discount Rate for NPV) */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Corporate Hurdle Rate (NPV Disc.)
                </label>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {inputs.discountRatePct}%
                </span>
              </div>
              <input
                id="slider-cfo-discountrate"
                type="range"
                min="4"
                max="25"
                step="1"
                value={inputs.discountRatePct}
                onChange={(e) => onUpdateInput("discountRatePct", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used to discount future cash flows into today's dollars (Page 3).
              </p>
            </div>

            {/* Executive Owner */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Executive Sponsor / Owner
              </label>
              <input
                id="input-cfo-owner"
                type="text"
                value={inputs.executiveOwner || ""}
                onChange={(e) => onUpdateInput("executiveOwner", e.target.value)}
                placeholder="e.g. VP Product & Engineering"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Question 6: Accountable leader for ongoing economics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. 5 VALUE STREAMS SECTION (AI4SP METHODOLOGY) */}
      {/* ============================================================ */}
      {activeTab === "streams" && (
        <div className="mt-4 space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>
              <strong className="text-slate-200">AI4SP 5-Value Streams: </strong>
              Calibrate how organizational value is distributed across the 5 dimensions.
            </span>
            <button
              onClick={() =>
                onUpdateWeights({
                  directProductivity: 40,
                  qualityImprovement: 25,
                  innovationVelocity: 15,
                  learningUpskilling: 10,
                  retentionWellbeing: 10,
                })
              }
              className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Balanced 40/25/15/10/10
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                key: "directProductivity" as const,
                label: "1. Direct Productivity",
                sub: "Labor & hours saved",
                val: inputs?.streamWeights?.directProductivity ?? 40,
                dollars: results?.benefits?.directProductivity ?? 0,
                color: "text-emerald-400",
              },
              {
                key: "qualityImprovement" as const,
                label: "2. Quality & Defect Red.",
                sub: "Rework prevention",
                val: inputs?.streamWeights?.qualityImprovement ?? 25,
                dollars: results?.benefits?.qualityImprovement ?? 0,
                color: "text-indigo-400",
              },
              {
                key: "innovationVelocity" as const,
                label: "3. Innovation Velocity",
                sub: "Faster GTM & ARR",
                val: inputs?.streamWeights?.innovationVelocity ?? 15,
                dollars: results?.benefits?.innovationVelocity ?? 0,
                color: "text-purple-400",
              },
              {
                key: "learningUpskilling" as const,
                label: "4. Knowledge & Ramp",
                sub: "Onboarding speed",
                val: inputs?.streamWeights?.learningUpskilling ?? 10,
                dollars: results?.benefits?.learningUpskilling ?? 0,
                color: "text-amber-400",
              },
              {
                key: "retentionWellbeing" as const,
                label: "5. Talent Wellbeing",
                sub: "Burnout reduction",
                val: inputs?.streamWeights?.retentionWellbeing ?? 10,
                dollars: results?.benefits?.retentionWellbeing ?? 0,
                color: "text-rose-400",
              },
            ].map((stream) => (
              <div
                key={stream.key}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {stream.label}
                    </span>
                    <span className={`text-xs font-mono font-bold ${stream.color}`}>
                      {stream.val}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{stream.sub}</div>
                </div>

                <div className="mt-3">
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={stream.val}
                    onChange={(e) => {
                      const currentWeights = inputs?.streamWeights || {
                        directProductivity: 40,
                        qualityImprovement: 25,
                        innovationVelocity: 15,
                        learningUpskilling: 10,
                        retentionWellbeing: 10,
                      };
                      onUpdateWeights({
                        ...currentWeights,
                        [stream.key]: Number(e.target.value),
                      });
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-[11px] font-mono text-slate-300 font-semibold mt-1">
                    ${(stream.dollars ?? 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* On-Demand AI Use Case & Web Search Research Modal */}
      <OnDemandUseCaseModal
        isOpen={isOnDemandModalOpen}
        onClose={() => setIsOnDemandModalOpen(false)}
        onApplyUseCase={handleApplyGeneratedUseCase}
        currentIndustryId={inputs.industryId}
      />
    </div>
  );
};
