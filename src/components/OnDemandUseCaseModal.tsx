import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Check,
  X,
  AlertCircle,
  Globe,
  Users,
  DollarSign,
  Clock,
  Zap,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Database,
  Lock,
} from "lucide-react";
import { CalculatorInputs, GuardrailsEvalSpecs } from "../types";

interface OnDemandUseCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyUseCase: (customInputs: Partial<CalculatorInputs>) => void;
  currentIndustryId?: string;
}

interface GeneratedUseCaseData {
  featureName: string;
  description: string;
  industryId: string;
  technologyMove: any;
  architectureType: any;
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
  guardrailsEvalSpecs?: GuardrailsEvalSpecs;
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
      // Execute both ROI modeling research AND Guardrails research in parallel!
      const [useCaseRes, guardrailsRes] = await Promise.all([
        fetch("/api/research-use-case", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: query.trim(),
            industryHint: industryHint || undefined,
            scaleHint,
            enableWebSearch,
          }),
        }),
        fetch("/api/research-guardrails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            featureName: query.trim(),
            industryId: industryHint || undefined,
          }),
        }),
      ]);

      const useCaseData = await useCaseRes.json();
      if (!useCaseRes.ok) {
        throw new Error(useCaseData.error || "Failed to research AI use case.");
      }

      let guardrailsSpecs: GuardrailsEvalSpecs | undefined;
      if (guardrailsRes.ok) {
        const gData = await guardrailsRes.json();
        guardrailsSpecs = gData.guardrailsEvalSpecs;
      }

      const combinedResult: GeneratedUseCaseData = {
        ...useCaseData.useCase,
        guardrailsEvalSpecs: guardrailsSpecs,
      };

      setGeneratedResult(combinedResult);
      setDataSource(useCaseData.source || "search-grounded");
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
      guardrailsEvalSpecs: generatedResult.guardrailsEvalSpecs,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-300 bg-white shadow-2xl overflow-hidden my-6 text-blue-950">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 text-white shadow-md shadow-blue-900/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-blue-950 tracking-tight">
                  On-Demand AI Use Case, ROI & Guardrails Research
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs text-blue-800">
                Input any AI initiative to perform live web research on financial ROI, labor economics, and institutional RAG guardrails.
              </p>
            </div>
          </div>
          <button
            id="close-on-demand-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-950 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Dynamic Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-950 mb-1.5 flex items-center justify-between">
                <span>1. Describe the AI Feature, Initiative, or Use Case</span>
                <span className="text-[11px] text-blue-700 normal-case font-semibold">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-blue-950 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none font-medium"
                />
              </div>
            </div>

            {/* Quick Inspiration Chips */}
            <div>
              <span className="text-[11px] font-bold text-blue-900 block mb-2">
                Or choose from rapid inspiration archetypes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INSPIRATION_USE_CASES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectInspiration(item)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-slate-100 hover:bg-blue-50 text-blue-900 hover:text-blue-950 hover:border-blue-500 transition-all text-left flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Sparkles className="w-3 h-3 text-blue-700" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Domain & Scale Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-blue-950 mb-1">
                  Industry / Domain Sector
                </label>
                <select
                  id="select-use-case-industry"
                  value={industryHint}
                  onChange={(e) => setIndustryHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer font-medium"
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
                <label className="block text-xs font-bold text-blue-950 mb-1">
                  Target Deployment Scale
                </label>
                <select
                  id="select-use-case-scale"
                  value={scaleHint}
                  onChange={(e) => setScaleHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer font-medium"
                >
                  <option value="Pilot / Team (15-30 seats)">Pilot / Focused Team (15-30 seats)</option>
                  <option value="Mid-Market (50-150 seats)">Mid-Market (50-150 seats)</option>
                  <option value="Enterprise (150-500 seats)">Enterprise (150-500 seats)</option>
                  <option value="Global Corporate (500-2,000 seats)">Global Corporate (500-2,000 seats)</option>
                </select>
              </div>
            </div>

            {/* Web Search Grounding Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-300 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800 border border-blue-300">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-950 block">
                    Dynamic Web Search Grounding
                  </span>
                  <span className="text-[11px] text-blue-800 block">
                    Retrieves current industry labor benchmarks, salary figures, token economics, and regulatory guardrail standards.
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableWebSearch}
                  onChange={(e) => setEnableWebSearch(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-800"></div>
              </label>
            </div>

            {/* Research Action Button */}
            <button
              id="btn-trigger-ai-research"
              type="button"
              onClick={handleResearch}
              disabled={isLoading || !query.trim()}
              className="w-full py-3 px-4 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>
                    {loadingStep === 1
                      ? "Analyzing Use Case & Querying Search Indices..."
                      : loadingStep === 2
                      ? "Benchmarking Labor, Token Economics & RAG Guardrails..."
                      : "Synthesizing Financial Model & Governance Specs..."}
                  </span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Research Use Case, ROI & Guardrails via Web</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl border border-red-300 bg-red-50 text-red-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedResult && (
            <div id="generated-use-case-result" className="mt-6 pt-5 border-t border-slate-300 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <Check className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-blue-950 tracking-tight">
                    Modeled Proposal & Governance Specifications
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-blue-800">
                  Engine: <strong className="text-blue-950">{dataSource}</strong>
                </span>
              </div>

              {/* Proposed Title & Tagline */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-base font-extrabold text-blue-950">
                    {generatedResult.featureName}
                  </h5>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-blue-900 border border-blue-200">
                      Move: {generatedResult.technologyMove}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-blue-900 border border-blue-200">
                      Arch: {generatedResult.architectureType}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                  {generatedResult.description}
                </p>
              </div>

              {/* Modeled Parameters Bento Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1 text-blue-700 text-[10px] font-bold mb-1">
                    <Users className="w-3 h-3 text-blue-800" />
                    <span>Workforce</span>
                  </div>
                  <div className="text-sm font-extrabold text-blue-950">
                    {generatedResult.teamSize} seats
                  </div>
                  <div className="text-[10px] text-blue-800 font-mono font-medium">
                    ${generatedResult.hourlyRate}/hr blended wage
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1 text-blue-700 text-[10px] font-bold mb-1">
                    <Clock className="w-3 h-3 text-blue-800" />
                    <span>Hours Saved</span>
                  </div>
                  <div className="text-sm font-extrabold text-blue-950">
                    {generatedResult.hoursSavedPerWeek} hrs/wk
                  </div>
                  <div className="text-[10px] text-blue-800 font-mono font-medium">
                    {generatedResult.adoptionRate}% target adoption
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1 text-blue-700 text-[10px] font-bold mb-1">
                    <DollarSign className="w-3 h-3 text-blue-800" />
                    <span>Upfront Dev</span>
                  </div>
                  <div className="text-sm font-extrabold text-blue-950">
                    ${(generatedResult.oneTimeDevCost || 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-blue-800 font-mono font-medium">
                    {generatedResult.capexPercentage ?? 70}% CapEx
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1 text-blue-700 text-[10px] font-bold mb-1">
                    <Zap className="w-3 h-3 text-blue-800" />
                    <span>FinOps Cost</span>
                  </div>
                  <div className="text-sm font-extrabold text-blue-950">
                    ${generatedResult.tokenCostPerMillion}/M tok
                  </div>
                  <div className="text-[10px] text-blue-800 font-mono font-medium">
                    ${(generatedResult.annualInfraCost || 0).toLocaleString()}/yr infra
                  </div>
                </div>
              </div>

              {/* Researched Guardrails Specs Box */}
              {generatedResult.guardrailsEvalSpecs && (
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-blue-950">
                      <Shield className="w-3.5 h-3.5 text-blue-800" />
                      <span>Researched Institutional Guardrails & RAG Targets:</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-800">
                      Autonomy: Level {generatedResult.guardrailsEvalSpecs.autonomyLevel}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-blue-900">
                    <div>
                      <strong className="block text-blue-950">Approved Tools:</strong>
                      <span className="text-blue-800">
                        {generatedResult.guardrailsEvalSpecs.toolAllowlistApproved.slice(0, 2).join(", ")}
                      </span>
                    </div>
                    <div>
                      <strong className="block text-blue-950">HITL Gate:</strong>
                      <span className="text-blue-800 line-clamp-1">
                        {generatedResult.guardrailsEvalSpecs.hitlApprovalThreshold}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-blue-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {generatedResult && (
            <button
              id="btn-apply-generated-use-case"
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply This Project to Model & Guardrails</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
