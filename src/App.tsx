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
} from "lucide-react";

export default function App() {
  const defaultIndustry = INDUSTRY_BENCHMARKS[0]; // Software & SaaS

  const [inputs, setInputs] = useState<CalculatorInputs>({
    featureName: "Enterprise Agentic Code Review & Test Generation",
    featureDescription: "Autonomous pull request reviews, defect escape prevention, and test generation.",
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

  const [activeAnalysisTab, setActiveAnalysisTab] = useState<
    "executive_lenses" | "timeline" | "multi_year" | "streams" | "finops" | "scenarios"
  >("executive_lenses");

  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Load from URL query parameters if present on first load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("fn")) {
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
    generateExecutiveExcelWorkbook(inputs, results, currentIndustry.name);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Executive Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-md shadow-indigo-600/30 text-white font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  AI Feature ROI Calculator & Executive Financial Model
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Dynamic cross-functional ROI modeling for Product Managers, Engineering Leads & CFOs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* AI Executive Memo */}
            <button
              id="generate-briefing-btn"
              onClick={() => setIsBriefingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span className="hidden sm:inline">AI C-Suite Memo</span>
            </button>

            {/* Export & Share Modal */}
            <button
              id="export-share-btn"
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Share interactive URL or export data"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. PRIMARY DYNAMIC FEATURE INPUT HUB - POSITIONED AT THE TOP */}
        <MultiStakeholderInputHub
          inputs={inputs}
          results={results}
          onUpdateInput={handleUpdateInput}
          onUpdateWeights={handleUpdateWeights}
          onLoadPreset={handleLoadPreset}
          onApplyCustomInputs={handleApplyCustomInputs}
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
            value={`${results.paybackPeriodMonths ?? 0} Months`}
            subValue="S-curve ramp modeled"
            icon={Clock}
            colorTheme="amber"
            tooltip="The exact month cumulative benefits surpass cumulative development, token, and cloud spend."
          />

          {/* 5. 5-Year Lifecycle TCO */}
          <MetricCard
            id="kpi-five-year-tco"
            label="5-Year Lifecycle TCO"
            value={`$${(results.financialFluency?.fiveYearTco ?? 0).toLocaleString()}`}
            subValue={`$${Math.round(results.costs?.totalOngoingAnnualCost ?? 0).toLocaleString()}/yr ongoing`}
            icon={ShieldCheck}
            colorTheme="cyan"
            tooltip="Full 5-year cost of ownership: upfront dev, tokens, vector DB, ops and maintenance."
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

        {/* ANALYTICAL WORKBENCH & LENSES */}
        <section id="analysis-workbench" className="space-y-4">
          {/* Workbench Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
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
                  className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "border-indigo-500 text-white bg-slate-900/60"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Executive Lenses & P&L Statement */}
          {activeAnalysisTab === "executive_lenses" && (
            <ExecutiveFinancialLenses
              inputs={inputs}
              results={results}
              onUpdateInput={handleUpdateInput}
            />
          )}

          {/* Tab 2: Break-Even S-Curve & Timeline */}
          {activeAnalysisTab === "timeline" && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-sm shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Cumulative Cash Flow & Break-Even S-Curve
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modeled over 36 months reflecting upfront build spend, adoption ramps, and ongoing FinOps.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                  Payback at Month {results.paybackPeriodMonths}
                </span>
              </div>
              <BreakEvenChart
                timeline={results.timeline}
                paybackPeriodMonths={results.paybackPeriodMonths}
              />
            </div>
          )}

          {/* Tab 3: 5-Year Horizon & Compounding */}
          {activeAnalysisTab === "multi_year" && (
            <MultiYearProjections
              projections={results.fiveYearProjections}
              discountRatePct={inputs.discountRatePct}
            />
          )}

          {/* Tab 4: 5 Value Streams Breakdown */}
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

          {/* Tab 5: FinOps Cost & Cloud Architecture */}
          {activeAnalysisTab === "finops" && (
            <FinOpsCostBreakdown
              costs={results.costs}
              teamSize={inputs.teamSize}
              monthlyQueriesPerUser={inputs.monthlyQueriesPerUser}
              avgTokensPerQuery={inputs.avgTokensPerQuery}
              tokenCostPerMillion={inputs.tokenCostPerMillion}
              oneTimeDevCost={inputs.oneTimeDevCost}
              annualInfraCost={inputs.annualInfraCost}
              annualMaintenanceCost={inputs.annualMaintenanceCost}
              onUpdateCostParam={handleUpdateInput}
            />
          )}

          {/* Tab 6: Scenario Sensitivity Matrix */}
          {activeAnalysisTab === "scenarios" && (
            <ScenarioSensitivity
              inputs={inputs}
              currentResults={results}
              onSelectScenario={(sc) => handleUpdateInput("scenario", sc)}
            />
          )}
        </section>

        {/* ========================================================= */}
        {/* DEDICATED EXECUTIVE EXCEL EXPORT - THE 1 DOWNLOADABLE EXCEL SHEET AT THE END */}
        {/* ========================================================= */}
        <section
          id="executive-excel-export-section"
          className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/40 p-6 sm:p-7 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Executive Excel Spreadsheet</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Download Complete Executive Financial Model (.xlsx)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Export the dynamic 5-tab workbook containing live financial metrics,
                multi-stakeholder inputs (PM, Eng, CFO), 5-year discounted cash flows, enterprise P&L statements, and unit economics.
              </p>

              {/* 5 Tabs Summary Pill Grid */}
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
                <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Tab 1: C-Suite Executive Summary
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Tab 2: PM, Eng & CFO Inputs
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Tab 3: 5-Yr Cash Flow & TCO
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Tab 4: Enterprise P&L Impact
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Tab 5: FinOps Unit Economics
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                id="btn-download-final-excel"
                onClick={handleDownloadExcel}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <FileSpreadsheet className="w-5 h-5 text-slate-950" />
                <span>Download Executive Financial Model (.xlsx)</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              AI Feature ROI Calculator & Executive Financial Engine
            </span>
            <span>•</span>
            <span>Executive Financial Fluency & AI4SP Methodologies</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Institutional-Grade C-Suite Financial Fluency Modeling
          </div>
        </div>
      </footer>

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
      />
    </div>
  );
}
