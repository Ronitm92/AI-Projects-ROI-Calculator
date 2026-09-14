import { useState, useMemo, useEffect } from "react";
import { CalculatorInputs, ScenarioType } from "./types";
import { INDUSTRY_BENCHMARKS, PRESET_ARCHETYPES } from "./data/benchmarks";
import { calculateRoi } from "./utils/calculator";
import { generateExecutiveExcelWorkbook } from "./utils/excelGenerator";
import { MetricCard } from "./components/MetricCard";
import { BreakEvenChart } from "./components/BreakEvenChart";
import { ValueStreamBreakdown } from "./components/ValueStreamBreakdown";
import { FinOpsCostBreakdown } from "./components/FinOpsCostBreakdown";
import { ScenarioSensitivity } from "./components/ScenarioSensitivity";
import { MultiYearProjections } from "./components/MultiYearProjections";
import { ExecutiveFinancialLenses } from "./components/ExecutiveFinancialLenses";
import { EvaluationAndGuardrails } from "./components/EvaluationAndGuardrails";
import { MultiStakeholderInputHub } from "./components/MultiStakeholderInputHub";
import { ExecutiveBriefingModal } from "./components/ExecutiveBriefingModal";
import { ExportShareModal } from "./components/ExportShareModal";
import {
  TrendingUp,
  Sparkles,
  Share2,
  Clock,
  Layers,
  Coins,
  ShieldCheck,
  FileSpreadsheet,
  Building,
  Scale,
  DollarSign,
  Search,
  Globe,
} from "lucide-react";

export default function App() {
  const defaultIndustry = INDUSTRY_BENCHMARKS[0]; // Software & SaaS

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(false);

  const [inputs, setInputs] = useState<CalculatorInputs>({
    featureName: "",
    featureDescription: "",
    industryId: defaultIndustry.id,
    scenario: "balanced",
    technologyMove: "ai_workflows",

    // PM Inputs
    teamSize: 35,
    hourlyRate: 85,
    hoursSavedPerWeek: 4.5,
    workWeeksPerYear: 48,
    adoptionRate: 75,
    annualRevenueUplift: 150000,
    retentionUpliftPct: 2.5,
    monthlyQueriesPerUser: 450,

    // Engineering Lead Inputs
    architectureType: "rag_agent",
    oneTimeDevCost: 45000,
    capexPercentage: 80,
    avgTokensPerQuery: 2200,
    tokenCostPerMillion: 0.6,
    annualInfraCost: 7500,
    annualMaintenanceCost: 14000,

    // Business Head & CFO Inputs
    companyRevenue: 12000000,
    baselineGrossMarginPct: 72,
    baselineOperatingMarginPct: 14,
    discountRatePct: 10,
    businessOutcome: "Accelerate feature velocity by 25% while deflecting QA defects before staging.",
    evidenceGate: "Phase 1 staging test deflection >20% and model latency <1.2s across 60-day pilot.",
    executiveOwner: "VP of Product & Engineering",

    // 5 Value Streams Weighting % (AI4SP Framework)
    streamWeights: {
      directProductivity: 40,
      qualityImprovement: 25,
      innovationVelocity: 15,
      learningUpskilling: 10,
      retentionWellbeing: 10,
    },
  });

  // Top-Level 2 Prominent Tabs requested by user
  const [mainTab, setMainTab] = useState<"roi_calculator" | "eval_guardrails">("roi_calculator");

  // Sub-tabs for the ROI Calculator analysis workbench
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<
    | "executive_lenses"
    | "timeline"
    | "multi_year"
    | "streams"
    | "finops"
    | "scenarios"
  >("executive_lenses");

  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Load from URL query parameters if present on first load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("fn") && params.get("fn")?.trim()) {
        setIsProjectSelected(true);
        setSelectedProjectId("url_preset");
        setInputs((prev) => ({
          ...prev,
          featureName: params.get("fn") || prev.featureName,
          technologyMove:
            (params.get("tm") as CalculatorInputs["technologyMove"]) || prev.technologyMove,
          industryId: params.get("ind") || prev.industryId,
          teamSize: params.has("ts") ? Number(params.get("ts")) : prev.teamSize,
          hourlyRate: params.has("hr") ? Number(params.get("hr")) : prev.hourlyRate,
          hoursSavedPerWeek: params.has("hs") ? Number(params.get("hs")) : prev.hoursSavedPerWeek,
          adoptionRate: params.has("ar") ? Number(params.get("ar")) : prev.adoptionRate,
          scenario: (params.get("sc") as ScenarioType) || prev.scenario,
          oneTimeDevCost: params.has("dev") ? Number(params.get("dev")) : prev.oneTimeDevCost,
          capexPercentage: params.has("capex") ? Number(params.get("capex")) : prev.capexPercentage,
          monthlyQueriesPerUser: params.has("q") ? Number(params.get("q")) : prev.monthlyQueriesPerUser,
          avgTokensPerQuery: params.has("tok") ? Number(params.get("tok")) : prev.avgTokensPerQuery,
          tokenCostPerMillion: params.has("prc") ? Number(params.get("prc")) : prev.tokenCostPerMillion,
          annualInfraCost: params.has("inf") ? Number(params.get("inf")) : prev.annualInfraCost,
          annualMaintenanceCost: params.has("mnt") ? Number(params.get("mnt")) : prev.annualMaintenanceCost,
          annualRevenueUplift: params.has("rev") ? Number(params.get("rev")) : prev.annualRevenueUplift,
          discountRatePct: params.has("disc") ? Number(params.get("disc")) : prev.discountRatePct,
        }));
      }
    } catch (e) {
      console.error("Failed to parse URL params", e);
    }
  }, []);

  // Current industry benchmark object
  const currentIndustry = useMemo(() => {
    return (
      INDUSTRY_BENCHMARKS.find((i) => i.id === inputs.industryId) ||
      INDUSTRY_BENCHMARKS[0]
    );
  }, [inputs.industryId]);

  // Real-time calculation results
  const results = useMemo(() => {
    return calculateRoi(inputs);
  }, [inputs]);

  // Input updater helper
  const handleUpdateInput = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    if (key === "featureName") {
      const hasName = Boolean(typeof value === "string" && value.trim().length > 0);
      setIsProjectSelected(hasName);
      if (!hasName) {
        setSelectedProjectId(null);
      }
    }
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Stream weights updater
  const handleUpdateWeights = (weights: CalculatorInputs["streamWeights"]) => {
    setInputs((prev) => ({
      ...prev,
      streamWeights: weights,
    }));
  };

  // Load Preset Archetype as a starter baseline
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_ARCHETYPES.find((p) => p.id === presetId);
    if (preset) {
      setSelectedProjectId(preset.id);
      setIsProjectSelected(true);
      setInputs((prev) => ({
        ...prev,
        featureName: preset.name,
        featureDescription: preset.featureDescription || preset.description,
        industryId: preset.industryId,
        technologyMove: preset.technologyMove || prev.technologyMove,
        architectureType: preset.architectureType || prev.architectureType,
        teamSize: preset.teamSize,
        hourlyRate: preset.hourlyRate,
        hoursSavedPerWeek: preset.hoursSavedPerWeek,
        adoptionRate: preset.adoptionRate,
        annualRevenueUplift: preset.annualRevenueUplift !== undefined ? preset.annualRevenueUplift : prev.annualRevenueUplift,
        retentionUpliftPct: preset.retentionUpliftPct !== undefined ? preset.retentionUpliftPct : prev.retentionUpliftPct,
        oneTimeDevCost: preset.oneTimeDevCost,
        capexPercentage: preset.capexPercentage !== undefined ? preset.capexPercentage : prev.capexPercentage,
        monthlyQueriesPerUser: preset.monthlyQueriesPerUser,
        avgTokensPerQuery: preset.avgTokensPerQuery,
        tokenCostPerMillion: preset.tokenCostPerMillion,
        annualInfraCost: preset.annualInfraCost,
        annualMaintenanceCost: preset.annualMaintenanceCost,
        companyRevenue: preset.companyRevenue !== undefined ? preset.companyRevenue : prev.companyRevenue,
        baselineGrossMarginPct: preset.baselineGrossMarginPct !== undefined ? preset.baselineGrossMarginPct : prev.baselineGrossMarginPct,
        baselineOperatingMarginPct: preset.baselineOperatingMarginPct !== undefined ? preset.baselineOperatingMarginPct : prev.baselineOperatingMarginPct,
        discountRatePct: preset.discountRatePct !== undefined ? preset.discountRatePct : prev.discountRatePct,
        businessOutcome: preset.businessOutcome || prev.businessOutcome,
        evidenceGate: preset.evidenceGate || prev.evidenceGate,
        executiveOwner: preset.executiveOwner || prev.executiveOwner,
        streamWeights: { ...preset.streamWeights },
      }));
    }
  };

  // Direct Custom / Generated Inputs Apply
  const handleApplyCustomInputs = (custom: Partial<CalculatorInputs>) => {
    if (custom.featureName && custom.featureName.trim().length > 0) {
      setSelectedProjectId("custom");
      setIsProjectSelected(true);
    }
    setInputs((prev) => ({
      ...prev,
      ...custom,
      streamWeights: custom.streamWeights
        ? { ...custom.streamWeights }
        : prev.streamWeights,
    }));
  };

  // Direct Excel Download Trigger
  const handleDownloadExcel = () => {
    if (!isProjectSelected) return;
    generateExecutiveExcelWorkbook(inputs, results, currentIndustry.name);
  };

  return (
    <div className="min-h-screen bg-slate-200 text-blue-950 flex flex-col font-sans selection:bg-blue-800 selection:text-white">
      {/* Top Executive Header */}
      <header className="sticky top-0 z-30 border-b border-slate-300 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 text-white shadow-md shadow-blue-900/20 font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-blue-950">
                AI Feature ROI Calculator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* AI Executive Memo */}
            <button
              id="generate-briefing-btn"
              onClick={() => setIsBriefingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">AI C-Suite Memo</span>
            </button>

            {/* Quick Export Excel */}
            <button
              id="header-export-excel-btn"
              onClick={handleDownloadExcel}
              disabled={!isProjectSelected}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isProjectSelected
                  ? "bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm cursor-pointer"
                  : "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed"
              }`}
              title={isProjectSelected ? "Download Executive Financial Model (.xlsx)" : "Select a Project first to enable Export Excel"}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            {/* Export & Share Modal */}
            <button
              id="export-share-btn"
              onClick={() => setIsExportModalOpen(true)}
              disabled={!isProjectSelected}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                isProjectSelected
                  ? "border-slate-300 bg-slate-100 hover:bg-slate-200 text-blue-900 cursor-pointer"
                  : "border-slate-300 bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
              title={isProjectSelected ? "Share interactive URL or export data" : "Select a Project first to enable Export & Share"}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* =========================================================================
            2 PROMINENT MAIN EXECUTIVE TABS (REQUESTED BY USER)
            ========================================================================= */}
        <div className="bg-white rounded-2xl p-2 border border-slate-300 shadow-sm flex flex-col sm:flex-row gap-2">
          <button
            id="tab-roi-calculator"
            onClick={() => setMainTab("roi_calculator")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
              mainTab === "roi_calculator"
                ? "bg-blue-800 text-white shadow-md shadow-blue-900/25 ring-2 ring-blue-900/20"
                : "text-blue-900 hover:bg-slate-100 hover:text-blue-950"
            }`}
          >
            <Scale className="w-5 h-5 text-blue-200 shrink-0" />
            <span className="tracking-tight">AI Feature ROI Calculator</span>
          </button>

          <button
            id="tab-eval-guardrails"
            onClick={() => setMainTab("eval_guardrails")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
              mainTab === "eval_guardrails"
                ? "bg-blue-800 text-white shadow-md shadow-blue-900/25 ring-2 ring-blue-900/20"
                : "text-blue-900 hover:bg-slate-100 hover:text-blue-950"
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-blue-200 shrink-0" />
            <span className="tracking-tight">Evaluation and Guardrails</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: AI FEATURE ROI CALCULATOR
            ========================================================================= */}
        {mainTab === "roi_calculator" && (
          <div className="space-y-6">
            {/* 1. PRIMARY DYNAMIC FEATURE INPUT HUB - POSITIONED AT THE TOP */}
            <MultiStakeholderInputHub
              inputs={inputs}
              results={results}
              onUpdateInput={handleUpdateInput}
              onUpdateWeights={handleUpdateWeights}
              onLoadPreset={handleLoadPreset}
              onApplyCustomInputs={handleApplyCustomInputs}
              selectedProjectId={selectedProjectId}
              isProjectSelected={isProjectSelected}
            />

            {/* 2. EXECUTIVE C-SUITE KPI SCORECARD */}
            <section
              id="executive-kpi-grid"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5"
            >
              {/* 1. Net Present Value (NPV) */}
              <MetricCard
                id="kpi-npv"
                label="Net Present Value (NPV)"
                value={`$${(results.financialFluency?.npv ?? 0).toLocaleString()}`}
                subValue={`@ ${inputs.discountRatePct}% Hurdle Rate`}
                icon={Coins}
                colorTheme="emerald"
                tooltip="Net discounted enterprise cash flows over 5 years minus initial development investment."
              />

              {/* 2. Internal Rate of Return (IRR) */}
              <MetricCard
                id="kpi-irr"
                label="Internal Rate of Return"
                value={`${results.financialFluency?.irr ?? 0}%`}
                subValue={`Hurdle: ${inputs.discountRatePct}%`}
                icon={TrendingUp}
                colorTheme="indigo"
                tooltip="Annualized rate of return of the AI investment; compares directly with company hurdle rate."
              />

              {/* 3. Year 1 Net ROI */}
              <MetricCard
                id="kpi-net-roi"
                label="Year 1 Net ROI"
                value={`${results.firstYearNetRoi ?? 0}%`}
                subValue={`Net: $${(results.firstYearNetValue ?? 0).toLocaleString()}`}
                icon={Building}
                colorTheme="violet"
                tooltip="Year 1 net benefits (5 streams) divided by total first-year upfront dev and FinOps spend."
              />

              {/* 4. Break-Even Payback */}
              <MetricCard
                id="kpi-payback-period"
                label="Break-Even Payback"
                value={
                  results.paybackPeriodMonths === 36
                    ? ">36 Mo"
                    : `${results.paybackPeriodMonths} Mo`
                }
                subValue={
                  (results?.paybackPeriodMonths ?? 36) <= 12
                    ? "In-Year Payback"
                    : `${(((results?.paybackPeriodMonths ?? 0) / 12)).toFixed(1)} Years`
                }
                icon={Clock}
                colorTheme="amber"
                tooltip="Number of operating months required for cumulative enterprise benefits to recover total upfront dev investment."
              />

              {/* 5. 5-Year Net Cash Flow */}
              <MetricCard
                id="kpi-five-year-value"
                label="5-Yr Net Cash Flow"
                value={`$${(results.totalFiveYearNetValue ?? 0).toLocaleString()}`}
                subValue={`TCO: $${(results.fiveYearProjections?.[4]?.cumulativeCosts ?? 0).toLocaleString()}`}
                icon={Layers}
                colorTheme="cyan"
                tooltip="Cumulative five-year net financial returns factoring ongoing FinOps and annual maintenance."
              />

              {/* 6. Operating Margin Expansion */}
              <MetricCard
                id="kpi-op-margin-expansion"
                label="Op. Margin Expansion"
                value={`+${results.financialFluency?.plImpact?.operatingMarginDeltaBps ?? 0} bps`}
                subValue={`+$${(results.financialFluency?.plImpact?.ebitdaImpact ?? 0).toLocaleString()} EBITDA`}
                icon={DollarSign}
                colorTheme="emerald"
                tooltip="Basis points expansion in operating margin (EBIT) driven by labor efficiency and capacity unlock."
              />
            </section>

            {/* 3. ANALYTICAL WORKBENCH & FINANCIAL LENSES */}
            <section id="analysis-workbench" className="space-y-4">
              {/* Workbench Navigation Sub-Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-300">
                {[
                  { id: "executive_lenses", label: "Executive Lenses & P&L Statement" },
                  { id: "timeline", label: "Break-Even S-Curve & Timeline" },
                  { id: "multi_year", label: "5-Year Horizon & Compounding" },
                  { id: "streams", label: "5 Value Streams Breakdown" },
                  { id: "finops", label: "FinOps Cost & Cloud Architecture" },
                  { id: "scenarios", label: "Scenario Sensitivity Matrix" },
                ].map((tab) => {
                  const isSelected = activeAnalysisTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`btn-tab-${tab.id}`}
                      onClick={() =>
                        setActiveAnalysisTab(
                          tab.id as typeof activeAnalysisTab
                        )
                      }
                      className={`py-2 px-3 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? "border-blue-800 text-blue-950 bg-white shadow-xs"
                          : "border-transparent text-blue-800/80 hover:text-blue-950 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Sub-Tab 1: Executive Lenses & P&L Statement */}
              {activeAnalysisTab === "executive_lenses" && (
                <ExecutiveFinancialLenses
                  inputs={inputs}
                  results={results}
                  onUpdateInput={handleUpdateInput}
                />
              )}

              {/* Sub-Tab 2: Break-Even S-Curve & Timeline */}
              {activeAnalysisTab === "timeline" && (
                <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm text-blue-950">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-blue-950">
                        Cumulative Cash Flow & Break-Even S-Curve
                      </h3>
                      <p className="text-xs text-blue-800 mt-0.5">
                        Modeled over 36 months reflecting upfront build spend, adoption ramps, and ongoing FinOps.
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold">
                      Payback at Month {results.paybackPeriodMonths}
                    </span>
                  </div>
                  <BreakEvenChart
                    timeline={results.timeline}
                    paybackPeriodMonths={results.paybackPeriodMonths}
                  />
                </div>
              )}

              {/* Sub-Tab 3: 5-Year Horizon & Compounding */}
              {activeAnalysisTab === "multi_year" && (
                <MultiYearProjections
                  projections={results.fiveYearProjections}
                  discountRatePct={inputs.discountRatePct}
                />
              )}

              {/* Sub-Tab 4: 5 Value Streams Breakdown */}
              {activeAnalysisTab === "streams" && (
                <ValueStreamBreakdown
                  benefits={results.benefits}
                  streamWeights={inputs.streamWeights}
                  weights={inputs.streamWeights}
                  onWeightChange={(key, val) =>
                    handleUpdateWeights({
                      ...inputs.streamWeights,
                      [key]: val,
                    })
                  }
                  onUpdateWeights={handleUpdateWeights}
                  onResetWeights={() =>
                    handleUpdateWeights(
                      currentIndustry.defaultStreamWeights || {
                        directProductivity: 40,
                        qualityImprovement: 25,
                        innovationVelocity: 15,
                        learningUpskilling: 10,
                        retentionWellbeing: 10,
                      }
                    )
                  }
                />
              )}

              {/* Sub-Tab 5: FinOps Cost Breakdown */}
              {activeAnalysisTab === "finops" && (
                <FinOpsCostBreakdown
                  costs={results.costs}
                  annualInfraCost={inputs.annualInfraCost}
                  annualMaintenanceCost={inputs.annualMaintenanceCost}
                  oneTimeDevCost={inputs.oneTimeDevCost}
                  monthlyQueriesPerUser={inputs.monthlyQueriesPerUser}
                  avgTokensPerQuery={inputs.avgTokensPerQuery}
                  teamSize={inputs.teamSize}
                  tokenCostPerMillion={inputs.tokenCostPerMillion}
                  onUpdateCostParam={(field, val) => handleUpdateInput(field as any, val)}
                />
              )}

              {/* Sub-Tab 6: Scenario Sensitivity */}
              {activeAnalysisTab === "scenarios" && (
                <ScenarioSensitivity
                  currentScenario={inputs.scenario}
                  onSelectScenario={(s) => handleUpdateInput("scenario", s)}
                  inputs={inputs}
                />
              )}
            </section>
          </div>
        )}

        {/* =========================================================================
            TAB 2: EVALUATION AND GUARDRAILS
            ========================================================================= */}
        {mainTab === "eval_guardrails" && (
          <EvaluationAndGuardrails
            inputs={inputs}
            results={results}
            onUpdateInput={handleUpdateInput}
            selectedProjectId={selectedProjectId}
            onLoadPreset={handleLoadPreset}
            isProjectSelected={isProjectSelected}
          />
        )}
      </main>

      {/* Modals */}
      <ExecutiveBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        inputs={inputs}
        results={results}
        industryName={currentIndustry.name}
      />

      <ExportShareModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        inputs={inputs}
        results={results}
        industryName={currentIndustry.name}
        isProjectSelected={isProjectSelected}
      />
    </div>
  );
}
