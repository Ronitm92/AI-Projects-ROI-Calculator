import React, { useState } from "react";
import { CalculatorInputs, CalculationResults, TechnologyMoveType } from "../types";
import { TECHNOLOGY_MOVES } from "../data/technologyMoves";
import { PRESET_ARCHETYPES } from "../data/benchmarks";
import { MODEL_COST_TIERS } from "../data/modelPricing";
import { OnDemandUseCaseModal } from "./OnDemandUseCaseModal";
import {
  Briefcase,
  Cpu,
  Landmark,
  Sparkles,
  Sliders,
  DollarSign,
  Users,
  Clock,
  Zap,
  Globe,
  RotateCcw,
} from "lucide-react";

interface MultiStakeholderInputHubProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
  onUpdateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  onUpdateWeights: (weights: CalculatorInputs["streamWeights"]) => void;
  onLoadPreset: (presetId: string) => void;
  onApplyCustomInputs?: (custom: Partial<CalculatorInputs>) => void;
  selectedProjectId?: string | null;
  isProjectSelected?: boolean;
}

export const MultiStakeholderInputHub: React.FC<MultiStakeholderInputHubProps> = ({
  inputs,
  results,
  onUpdateInput,
  onUpdateWeights,
  onLoadPreset,
  onApplyCustomInputs,
  selectedProjectId,
  isProjectSelected = true,
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
    <div id="multi-stakeholder-hub" className="rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm text-blue-950">
      {/* Top Banner: Dynamic Custom Project Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800 border border-blue-300">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-blue-950 tracking-tight">
              Feature Parameters & Stakeholder Inputs
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Web Search & Dynamic On-Demand Generator Trigger Button */}
          <button
            id="btn-open-on-demand-research"
            type="button"
            onClick={() => setIsOnDemandModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            title="Research and generate a custom AI feature ROI model on demand using Gemini and Google Search"
          >
            <Globe className="w-3.5 h-3.5 text-blue-200" />
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>On-Demand AI + Web Search</span>
          </button>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-blue-900 font-bold hidden sm:inline">Project:</span>
            <select
              id="select-preset-archetype"
              value={selectedProjectId || ""}
              onChange={(e) => {
                if (e.target.value === "__ON_DEMAND_RESEARCH__") {
                  setIsOnDemandModalOpen(true);
                } else if (e.target.value) {
                  onLoadPreset(e.target.value);
                }
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-blue-950 hover:border-blue-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold shadow-xs"
            >
              <option value="" disabled>
                -- Select a Project to Begin ({PRESET_ARCHETYPES.length} Available) --
              </option>
              <option
                value="__ON_DEMAND_RESEARCH__"
                className="text-blue-900 font-bold bg-blue-100"
              >
                + Research New Use Case On-Demand (AI + Web Search)...
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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
        <div className="md:col-span-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-950 mb-1">
            Feature or Project Name
          </label>
          <input
            id="input-feature-name"
            type="text"
            value={inputs.featureName}
            onChange={(e) => onUpdateInput("featureName", e.target.value)}
            placeholder="e.g. Enterprise Knowledge Copilot, Support Auto-Triage..."
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="md:col-span-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-950 mb-1">
            Strategic Technology Move
          </label>
          <select
            id="select-technology-move"
            value={inputs.technologyMove}
            onChange={(e) =>
              onUpdateInput("technologyMove", e.target.value as TechnologyMoveType)
            }
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            {techMovesList.map((tm) => (
              <option key={tm.id} value={tm.id}>
                {tm.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Selection Required Notice */}
      {!isProjectSelected && (
        <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs text-blue-950 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <span>Select a project from the dropdown above or enter a project name to calculate ROI and enable Export/Download.</span>
          </div>
        </div>
      )}

      {/* Role Navigation Tabs */}
      <div className="mt-4 flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-300">
        <button
          id="tab-btn-pm"
          onClick={() => setActiveTab("pm")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "pm"
              ? "bg-blue-800 text-white shadow-xs"
              : "text-blue-900 hover:text-blue-950 hover:bg-slate-200"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Product Manager</span>
        </button>

        <button
          id="tab-btn-eng"
          onClick={() => setActiveTab("eng")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "eng"
              ? "bg-blue-800 text-white shadow-xs"
              : "text-blue-900 hover:text-blue-950 hover:bg-slate-200"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Engineering Lead</span>
        </button>

        <button
          id="tab-btn-cfo"
          onClick={() => setActiveTab("cfo")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "cfo"
              ? "bg-blue-800 text-white shadow-xs"
              : "text-blue-900 hover:text-blue-950 hover:bg-slate-200"
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Business Head & CFO</span>
        </button>

        <button
          id="tab-btn-streams"
          onClick={() => setActiveTab("streams")}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "streams"
              ? "bg-blue-800 text-white shadow-xs"
              : "text-blue-900 hover:text-blue-950 hover:bg-slate-200"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Target Team / Seats */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-700" />
                  Target Seats / Users
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Number of team members or customer seats using the feature.
              </p>
            </div>

            {/* Hours Saved Per Person Per Week */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  Hours Saved / Person / Wk
                </label>
                <span className="text-xs font-mono text-emerald-700 font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-blue-800 mt-1 font-mono font-medium">
                <span>0.5h</span>
                <span>{inputs.hoursSavedPerWeek}h</span>
                <span>25h</span>
              </div>
            </div>

            {/* Adoption Rate % */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-700" />
                  Target Adoption Rate
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Active users: {Math.round(inputs.teamSize * (inputs.adoptionRate / 100))} of {inputs.teamSize} seats.
              </p>
            </div>

            {/* ARR / Direct Revenue Uplift */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  ARR / Revenue Uplift ($/yr)
                </label>
                <span className="text-xs font-mono text-emerald-700 font-bold">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Incremental ARR from new monetization, add-on tier, or upsells.
              </p>
            </div>

            {/* Retention & Churn Reduction Lift % */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Retention / Churn Lift
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Reduces customer churn, strengthening Net Retention Rate (NRR).
              </p>
            </div>

            {/* Monthly Queries Per User */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Monthly Queries / Seat
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Architecture Pattern */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <label className="block text-xs font-bold text-blue-950 mb-1.5">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="rag_agent">RAG & Knowledge Retrieval Agent</option>
                <option value="llm_copilot">In-App Copilot / Chat Assistant</option>
                <option value="fine_tuned">Domain Fine-Tuned Model</option>
                <option value="autonomous_workflow">Autonomous Multi-Agent Workflow</option>
              </select>
              <p className="text-[11px] text-blue-800 mt-1">
                Determines inference intensity and vector search requirements.
              </p>
            </div>

            {/* Upfront Build Cost */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Upfront Build & Eval Cost ($)
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Engineering sprints, prompt engineering, evals, security reviews.
              </p>
            </div>

            {/* Software Capitalization Rate (CapEx %) */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  CapEx Capitalization % (ASC 350-40)
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                ${Math.round((inputs.oneTimeDevCost ?? 0) * ((inputs.capexPercentage ?? 80) / 100)).toLocaleString()} capitalized & amortized over 3 years.
              </p>
            </div>

            {/* Avg Tokens Per Query */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Avg Tokens / Query
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Prompt context window + generated response length.
              </p>
            </div>

            {/* Token Pricing per 1M Tokens */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Model Cost ($/1M Tokens)
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
                  ${inputs.tokenCostPerMillion.toFixed(2)} / 1M
                </span>
              </div>
              <input
                id="input-eng-tokencost"
                type="number"
                min="0.05"
                max="50"
                step="0.05"
                value={inputs.tokenCostPerMillion}
                onChange={(e) =>
                  onUpdateInput("tokenCostPerMillion", Math.max(0.01, Number(e.target.value)))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {MODEL_COST_TIERS.map((tier) => {
                  const isSelected = Math.abs(inputs.tokenCostPerMillion - tier.costPerMillion) < 0.05;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => onUpdateInput("tokenCostPerMillion", tier.costPerMillion)}
                      className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-800 text-white border-blue-900 shadow-sm"
                          : "bg-white text-blue-900 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="truncate">{tier.name.split(" ")[0]}</span>
                        <span className="font-mono font-extrabold">${tier.costPerMillion.toFixed(2)}</span>
                      </div>
                      <div className={`text-[9px] truncate font-medium ${isSelected ? "text-blue-100" : "text-blue-700"}`}>
                        {tier.representativeModels.split(",")[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vector DB & Cloud Infra */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Annual Vector DB & Cloud Infra ($)
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Vector database, embeddings cache, API gateway.
              </p>
            </div>

            {/* Annual Maintenance & Evals */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Annual Maintenance & Evals ($)
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Enterprise Baseline Revenue */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Enterprise Baseline Revenue ($/yr)
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
                  ${(((inputs?.companyRevenue ?? 0) / 1_000_000)).toFixed(1)}M
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Current annual revenue baseline before AI initiative.
              </p>
            </div>

            {/* Baseline Gross Margin % */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Baseline Gross Margin %
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                (Revenue - COGS) / Revenue. Typical SaaS is 65-80%.
              </p>
            </div>

            {/* Baseline Operating Margin % */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Baseline Operating Margin %
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Operating income / Revenue before AI operating savings.
              </p>
            </div>

            {/* Blended Hourly Labor Rate ($/hr) */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Blended Labor Cost ($/hr)
                </label>
                <span className="text-xs font-mono text-emerald-700 font-bold">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Fully loaded wage and benefits per knowledge worker.
              </p>
            </div>

            {/* Corporate Hurdle Rate (Discount Rate for NPV) */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-950">
                  Corporate Hurdle Rate (NPV Discount)
                </label>
                <span className="text-xs font-mono text-blue-900 font-bold">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Used to discount future cash flows into today's dollars.
              </p>
            </div>

            {/* Executive Owner */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <label className="block text-xs font-bold text-blue-950 mb-1.5">
                Executive Sponsor / Owner
              </label>
              <input
                id="input-cfo-owner"
                type="text"
                value={inputs.executiveOwner || ""}
                onChange={(e) => onUpdateInput("executiveOwner", e.target.value)}
                placeholder="e.g. VP Product & Engineering"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-blue-800 mt-1">
                Accountable executive leader for ongoing financial performance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. 5 VALUE STREAMS SECTION */}
      {/* ============================================================ */}
      {activeTab === "streams" && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-end">
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
              className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
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
                color: "text-emerald-700",
              },
              {
                key: "qualityImprovement" as const,
                label: "2. Quality & Accuracy",
                sub: "Rework prevention",
                val: inputs?.streamWeights?.qualityImprovement ?? 25,
                dollars: results?.benefits?.qualityImprovement ?? 0,
                color: "text-blue-900",
              },
              {
                key: "innovationVelocity" as const,
                label: "3. Innovation Velocity",
                sub: "Faster GTM & ARR",
                val: inputs?.streamWeights?.innovationVelocity ?? 15,
                dollars: results?.benefits?.innovationVelocity ?? 0,
                color: "text-blue-950",
              },
              {
                key: "learningUpskilling" as const,
                label: "4. Knowledge & Ramp",
                sub: "Onboarding speed",
                val: inputs?.streamWeights?.learningUpskilling ?? 10,
                dollars: results?.benefits?.learningUpskilling ?? 0,
                color: "text-blue-800",
              },
              {
                key: "retentionWellbeing" as const,
                label: "5. Talent Wellbeing",
                sub: "Burnout reduction",
                val: inputs?.streamWeights?.retentionWellbeing ?? 10,
                dollars: results?.benefits?.retentionWellbeing ?? 0,
                color: "text-blue-900",
              },
            ].map((stream) => (
              <div
                key={stream.key}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950">
                      {stream.label}
                    </span>
                    <span className={`text-xs font-mono font-bold ${stream.color}`}>
                      {stream.val}%
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-800 mt-0.5">{stream.sub}</div>
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-[11px] font-mono text-blue-950 font-bold mt-1.5">
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
