import React, { useState } from "react";
import { CalculatorInputs } from "../types";
import {
  X,
  Sparkles,
  Globe,
  Search,
  Check,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Layers,
  Sliders,
  DollarSign,
  Users,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface OnDemandUseCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyUseCase: (customInputs: Partial<CalculatorInputs>) => void;
  currentIndustryId?: string;
}

interface GeneratedUseCaseData {
  featureName: string;
  industryId: string;
  technologyMove: "ai_workflows" | "modernization" | "product_improvement" | "platform_scale" | "new_product";
  architectureType: "rag_agent" | "llm_copilot" | "fine_tuned" | "autonomous_workflow";
  description: string;
  teamSize: number;
  hourlyRate: number;
  hoursSavedPerWeek: number;
  adoptionRate: number;
  annualRevenueUplift?: number;
  retentionUpliftPct?: number;
  oneTimeDevCost: number;
  capexPercentage?: number;
  monthlyQueriesPerUser: number;
  avgTokensPerQuery: number;
  tokenCostPerMillion: number;
  annualInfraCost: number;
  annualMaintenanceCost: number;
  companyRevenue?: number;
  baselineGrossMarginPct?: number;
  baselineOperatingMarginPct?: number;
  discountRatePct?: number;
  businessOutcome?: string;
  evidenceGate?: string;
  executiveOwner?: string;
  streamWeights: {
    directProductivity: number;
    qualityImprovement: number;
    innovationVelocity: number;
    learningUpskilling: number;
    retentionWellbeing: number;
  };
  researchSynthesis?: string;
  sources?: Array<{ title: string; uri: string }>;
}

const INSPIRATION_USE_CASES = [
  {
    label: "Autonomous Insurance Claims Processing",
    industry: "fintech_banking",
    scale: "Enterprise (250 seats)",
    query: "Autonomous First-Notice-of-Loss and damage evaluation agent for P&C insurance claims",
  },
  {
    label: "Clinical Documentation & Scribe AI",
    industry: "healthcare_pharma",
    scale: "Enterprise (150 clinicians)",
    query: "Ambient clinical scribe and ICD-10 medical coding auditor for hospital outpatient care",
  },
  {
    label: "Automated Contract Redline & Audit",
    industry: "legal_tech",
    scale: "Mid-Market (45 attorneys)",
    query: "Automated contract redline, clause deviation auditor, and M&A diligence copilot",
  },
  {
    label: "Autonomous DevOps Incident Triage",
    industry: "software_saas",
    scale: "Enterprise (120 engineers)",
    query: "Self-healing incident triage agent that investigates telemetry logs and proposes PR fixes",
  },
  {
    label: "Omnichannel Customer Support Voice Agent",
    industry: "customer_support_bpo",
    scale: "Enterprise (400 tier-1 agents)",
    query: "Real-time voice AI assistant deflecting complex billing, return, and cancellation inquiries",
  },
  {
    label: "Supply Chain Disruption Early-Warning",
    industry: "manufacturing_supply",
    scale: "Enterprise (85 logistics managers)",
    query: "Predictive supply chain disruption analyzer and supplier purchase order renegotiation agent",
  },
];

export const OnDemandUseCaseModal: React.FC<OnDemandUseCaseModalProps> = ({
  isOpen,
  onClose,
  onApplyUseCase,
  currentIndustryId,
}) => {
  const [query, setQuery] = useState("");
  const [industryHint, setIndustryHint] = useState(currentIndustryId || "");
  const [scaleHint, setScaleHint] = useState("Enterprise (100-350 seats)");
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedUseCaseData | null>(null);
  const [dataSource, setDataSource] = useState<string>("");

  if (!isOpen) return null;

  const handleSelectInspiration = (item: (typeof INSPIRATION_USE_CASES)[0]) => {
    setQuery(item.query);
    setIndustryHint(item.industry);
    setScaleHint(item.scale);
  };

  const handleResearch = async () => {
    if (!query.trim()) {
      setError("Please describe an AI use case or feature to research.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);
    setLoadingStep(1);

    const stepTimer1 = setTimeout(() => setLoadingStep(2), 1200);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 2800);

    try {
      const response = await fetch("/api/research-use-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          industryHint: industryHint || undefined,
          scaleHint,
          enableWebSearch,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to research AI use case.");
      }

      setGeneratedResult(data.useCase);
      setDataSource(data.source || "search-grounded");
    } catch (err: unknown) {
      console.error("On-demand research error:", err);
      const msg = err instanceof Error ? err.message : "Failed to research use case.";
      setError(msg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleApply = () => {
    if (!generatedResult) return;

    onApplyUseCase({
      featureName: generatedResult.featureName,
      featureDescription: generatedResult.description,
      industryId: generatedResult.industryId,
      technologyMove: generatedResult.technologyMove,
      architectureType: generatedResult.architectureType,
      teamSize: generatedResult.teamSize,
      hourlyRate: generatedResult.hourlyRate,
      hoursSavedPerWeek: generatedResult.hoursSavedPerWeek,
      adoptionRate: generatedResult.adoptionRate,
      annualRevenueUplift: generatedResult.annualRevenueUplift ?? 0,
      retentionUpliftPct: generatedResult.retentionUpliftPct ?? 2.5,
      oneTimeDevCost: generatedResult.oneTimeDevCost,
      capexPercentage: generatedResult.capexPercentage ?? 70,
      monthlyQueriesPerUser: generatedResult.monthlyQueriesPerUser,
      avgTokensPerQuery: generatedResult.avgTokensPerQuery,
      tokenCostPerMillion: generatedResult.tokenCostPerMillion,
      annualInfraCost: generatedResult.annualInfraCost,
      annualMaintenanceCost: generatedResult.annualMaintenanceCost,
      companyRevenue: generatedResult.companyRevenue ?? 25000000,
      baselineGrossMarginPct: generatedResult.baselineGrossMarginPct ?? 70,
      baselineOperatingMarginPct: generatedResult.baselineOperatingMarginPct ?? 20,
      discountRatePct: generatedResult.discountRatePct ?? 10,
      businessOutcome: generatedResult.businessOutcome,
      evidenceGate: generatedResult.evidenceGate,
      executiveOwner: generatedResult.executiveOwner,
      streamWeights: generatedResult.streamWeights || {
        directProductivity: 40,
        qualityImprovement: 25,
        innovationVelocity: 15,
        learningUpskilling: 10,
        retentionWellbeing: 10,
      },
    });

    onClose();
  };

  return (
    <div
      id="on-demand-use-case-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
              <Globe className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  On-Demand AI Use Case & Web Search ROI Generator
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini + Google Search
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Input any AI initiative to perform live web research on industry labor rates, token economics, and financial levers.
              </p>
            </div>
          </div>
          <button
            id="close-on-demand-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Dynamic Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                <span>1. Describe the AI Feature, Initiative, or Use Case</span>
                <span className="text-[11px] text-indigo-400 normal-case font-normal">
                  Natural language description
                </span>
              </label>
              <div className="relative">
                <textarea
                  id="input-use-case-query"
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Multimodal AI insurance claims adjuster that evaluates car accident photos, estimates repair labor, and writes draft payout memos..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-medium shadow-inner"
                />
              </div>
            </div>

            {/* Quick Inspiration Chips */}
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-2">
                Or choose from rapid inspiration archetypes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INSPIRATION_USE_CASES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectInspiration(item)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Domain & Scale Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Industry / Domain Sector
                </label>
                <select
                  id="select-use-case-industry"
                  value={industryHint}
                  onChange={(e) => setIndustryHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">Auto-Detect from Use Case</option>
                  <option value="customer_support_bpo">Customer Support & BPO</option>
                  <option value="software_saas">Software & SaaS Engineering</option>
                  <option value="fintech_banking">FinTech, Banking & Lending</option>
                  <option value="healthcare_pharma">Healthcare, Pharma & Clinical</option>
                  <option value="manufacturing_supply">Manufacturing & Supply Chain</option>
                  <option value="legal_tech">Legal Tech, Contract & Diligence</option>
                  <option value="ecommerce_retail">E-Commerce & Digital Retail</option>
                  <option value="professional_services">Professional & Advisory Services</option>
                  <option value="it_managed_services">IT Managed Services & DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Deployment Scale
                </label>
                <select
                  id="select-use-case-scale"
                  value={scaleHint}
                  onChange={(e) => setScaleHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Pilot / Team (15-30 seats)">Pilot / Focused Team (15-30 seats)</option>
                  <option value="Mid-Market (50-150 seats)">Mid-Market (50-150 seats)</option>
                  <option value="Enterprise (150-500 seats)">Enterprise (150-500 seats)</option>
                  <option value="Global Corporate (500-2,000 seats)">Global Corporate (500-2,000 seats)</option>
                </select>
              </div>
            </div>

            {/* Web Search Grounding Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Live Web Search Grounding
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Retrieves current industry labor benchmarks, salary figures, and model inference API pricing.
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-web-search-grounding"
                  type="checkbox"
                  checked={enableWebSearch}
                  onChange={(e) => setEnableWebSearch(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                id="submit-research-use-case-btn"
                type="button"
                onClick={handleResearch}
                disabled={isLoading || !query.trim()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>
                      {loadingStep === 1
                        ? "Querying Web Benchmarks & Labor Economics..."
                        : loadingStep === 2
                        ? "Synthesizing Token Sizing & Infra Costs..."
                        : "Balancing 5 Value Streams & CapEx..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Research & Generate Feature ROI Model</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Result Preview */}
          {generatedResult && (
            <div
              id="generated-use-case-result"
              className="mt-6 pt-5 border-t border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Modeled AI Feature Proposal
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Engine:{" "}
                  <span className="text-emerald-400 font-semibold">
                    {dataSource === "gemini-search-grounded"
                      ? "Gemini + Google Search Grounding"
                      : "Enterprise Heuristic Engine"}
                  </span>
                </span>
              </div>

              {/* Proposed Title & Tagline */}
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-base font-bold text-white">
                    {generatedResult.featureName}
                  </h5>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Move: {generatedResult.technologyMove.replace("_", " ")}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Arch: {generatedResult.architectureType.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {generatedResult.description}
                </p>
              </div>

              {/* Modeled Parameters Bento Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium mb-1">
                    <Users className="w-3 h-3 text-indigo-400" />
                    <span>Impacted Workforce</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {generatedResult.teamSize} seats
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ${generatedResult.hourlyRate}/hr blended wage
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium mb-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Hours Saved / Seat</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {generatedResult.hoursSavedPerWeek} hrs/wk
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {generatedResult.adoptionRate}% target adoption
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium mb-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Upfront Dev (CapEx)</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    ${(generatedResult.oneTimeDevCost || 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {generatedResult.capexPercentage ?? 70}% capitalizable
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium mb-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>FinOps & Token Burn</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    ${generatedResult.tokenCostPerMillion}/M tok
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ${(generatedResult.annualInfraCost || 0).toLocaleString()}/yr infra
                  </div>
                </div>
              </div>

              {/* Value Streams Breakdown Bar */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Calculated 5 Value Stream Allocations
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">
                    Normalized 100%
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-semibold">
                  <div className="bg-emerald-500/20 text-emerald-300 py-1 rounded border border-emerald-500/30">
                    Productivity {generatedResult.streamWeights?.directProductivity}%
                  </div>
                  <div className="bg-indigo-500/20 text-indigo-300 py-1 rounded border border-indigo-500/30">
                    Quality {generatedResult.streamWeights?.qualityImprovement}%
                  </div>
                  <div className="bg-purple-500/20 text-purple-300 py-1 rounded border border-purple-500/30">
                    Velocity {generatedResult.streamWeights?.innovationVelocity}%
                  </div>
                  <div className="bg-amber-500/20 text-amber-300 py-1 rounded border border-amber-500/30">
                    Learning {generatedResult.streamWeights?.learningUpskilling}%
                  </div>
                  <div className="bg-rose-500/20 text-rose-300 py-1 rounded border border-rose-500/30">
                    Retention {generatedResult.streamWeights?.retentionWellbeing}%
                  </div>
                </div>
              </div>

              {/* Research Synthesis & Sources */}
              {generatedResult.researchSynthesis && (
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white block mb-1">
                    Economic & Market Synthesis:
                  </span>
                  {generatedResult.researchSynthesis}
                </div>
              )}

              {/* Web Sources / Grounding Links */}
              {generatedResult.sources && generatedResult.sources.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                    Grounded Web Citations:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {generatedResult.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/40 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[220px]">{src.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Pilot Evidence Gate & Executive Owner */}
              {(generatedResult.evidenceGate || generatedResult.executiveOwner) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {generatedResult.evidenceGate && (
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Pilot Sprint Evidence Gate
                      </span>
                      <span className="text-slate-200">
                        {generatedResult.evidenceGate}
                      </span>
                    </div>
                  )}
                  {generatedResult.executiveOwner && (
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Executive Accountable Owner
                      </span>
                      <span className="text-slate-200 font-semibold">
                        {generatedResult.executiveOwner}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Apply Button */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGeneratedResult(null)}
                  className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Adjust Prompt
                </button>
                <button
                  id="apply-generated-use-case-btn"
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Apply to Calculator & Model ROI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
