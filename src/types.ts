export type ScenarioType = "conservative" | "balanced" | "optimistic";

export type TechnologyMoveType =
  | "ai_workflows"
  | "modernization"
  | "product_improvement"
  | "platform_scale"
  | "new_product";

export interface TechnologyMoveConfig {
  id: TechnologyMoveType;
  label: string;
  businessMechanism: string;
  economicEffect: string;
  metricsToWatch: string[];
}

export interface IndustryBenchmark {
  id: string;
  name: string;
  category: string;
  defaultHourlyRate: number;
  typicalHoursSavedPerWeek: number;
  defaultAdoptionRate: number;
  description: string;
  defaultStreamWeights: {
    directProductivity: number;
    qualityImprovement: number;
    innovationVelocity: number;
    learningUpskilling: number;
    retentionWellbeing: number;
  };
}

export interface PresetArchetype {
  id: string;
  name: string;
  badge: string;
  description: string;
  featureDescription?: string;
  industryId: string;
  technologyMove?: TechnologyMoveType;
  architectureType?: "rag_agent" | "llm_copilot" | "fine_tuned" | "autonomous_workflow";
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
}

// Multi-stakeholder input model
export interface GuardrailItemSpec {
  id: number;
  step: string;
  title: string;
  tagline: string;
  projectRule: string;
  enforcementStandard: string;
  riskLevel: "Critical" | "High" | "Moderate" | "Standard";
  status: string;
  decisionLogic: string;
}

export interface RagStageSpec {
  stageNumber: string;
  name: string;
  subtitle: string;
  question: string;
  targetBenchmark: string;
  keyMetrics: Array<{
    name: string;
    target: string;
    description: string;
  }>;
}

export interface GuardrailsEvalSpecs {
  industryStandards: string[];
  sensitiveDataEntities: string[];
  toolAllowlistApproved: string[];
  toolAllowlistBlocked: string[];
  hitlApprovalThreshold: string;
  autonomyLevel: "Assist" | "Bounded" | "Conditional" | "Full";
  goldenBenchmarkDataset: string;
  ragStageTargets: {
    retrievalRecall: string;
    retrievalMRR: string;
    contextPrecision: string;
    faithfulness: string;
    hallucinationRateMax: string;
    latencyP95: string;
  };
  liveWebFindings?: string;
  webSources?: Array<{ title: string; uri: string }>;
  lastResearchedAt?: string;
}

export interface CalculatorInputs {
  featureName: string;
  featureDescription?: string;
  industryId: string;
  scenario: ScenarioType;
  technologyMove: TechnologyMoveType;

  // --- 1. Product Manager (PM) Inputs ---
  teamSize: number; // Seats / target users
  hourlyRate: number; // Blended employee cost $/hr
  hoursSavedPerWeek: number; // Hours freed per person per week
  workWeeksPerYear: number;
  adoptionRate: number; // Target adoption %
  annualRevenueUplift: number; // New ARR / Contracted recurring revenue ($)
  retentionUpliftPct: number; // Churn reduction / retention lift %
  monthlyQueriesPerUser: number; // Usage intensity

  // --- 2. Engineering Lead Inputs ---
  architectureType: "rag_agent" | "llm_copilot" | "fine_tuned" | "autonomous_workflow";
  oneTimeDevCost: number; // Upfront build, evals, harness ($)
  capexPercentage: number; // % eligible for software capitalization (ASC 350-40)
  avgTokensPerQuery: number; // Tokens per call
  tokenCostPerMillion: number; // Model price per 1M tokens ($)
  annualInfraCost: number; // Vector DB, Cloud hosting, API proxy ($)
  annualMaintenanceCost: number; // Maintenance, observability, ongoing tuning ($)

  // --- 3. Business Head / CFO Inputs ---
  companyRevenue: number; // Baseline enterprise revenue ($)
  baselineGrossMarginPct: number; // e.g. 70%
  baselineOperatingMarginPct: number; // e.g. 12%
  discountRatePct: number; // Hurdle rate for NPV (e.g. 10%)
  businessOutcome: string; // What business outcome are we changing?
  evidenceGate: string; // What must be true before scaling?
  executiveOwner: string; // Accountable leader

  // 5 Value Streams Weighting % (AI4SP Framework)
  streamWeights: {
    directProductivity: number;
    qualityImprovement: number;
    innovationVelocity: number;
    learningUpskilling: number;
    retentionWellbeing: number;
  };

  // Dynamic Evaluation & Guardrails Governance (Researched / Configured)
  guardrailsEvalSpecs?: GuardrailsEvalSpecs;
}

export interface StreamBreakdown {
  directProductivity: number;
  qualityImprovement: number;
  innovationVelocity: number;
  learningUpskilling: number;
  retentionWellbeing: number;
  totalAnnualBenefit: number;
}

export interface CostBreakdown {
  oneTimeDev: number;
  annualTokens: number;
  annualInfra: number;
  annualMaintenance: number;
  totalFirstYearCost: number;
  totalOngoingAnnualCost: number;
  // Accounting lenses (Page 5)
  capexAmount: number;
  annualAmortization: number;
  opexAnnualAmount: number;
}

export interface MonthDataPoint {
  month: number;
  cumulativeCost: number;
  cumulativeBenefit: number;
  netCashFlow: number;
  isBreakEven: boolean;
}

export interface YearProjection {
  year: number;
  costs: number;
  benefits: number;
  netValue: number;
  cumulativeNetValue: number;
  roi: number;
  effectiveAdoptionRate: number;
  discountedCashFlow: number;
  cumulativeDiscountedValue: number;
}

// Financial Fluency Returns (Corporate Finance & Strategic Returns)
export interface FinancialFluencyResults {
  // Cost & Capital Discipline (Page 2, 3, 4, 5)
  npv: number; // Net Present Value ($ in today's dollars at hurdle rate)
  irr: number; // Internal Rate of Return (%)
  fiveYearTco: number; // Full 5-year lifecycle cost
  capexVsOpex: {
    capitalizedDev: number;
    annualAmortization: number;
    annualOpex: number;
    year1CashFlowImpact: number;
  };

  // Value Creation & Scale (Page 2, 6, 7, 8)
  arrImpact: number; // Annual Recurring Revenue uplift
  plImpact: {
    baselineRevenue: number;
    postAiRevenue: number;
    baselineGrossProfit: number;
    postAiGrossProfit: number;
    baselineGrossMarginPct: number;
    postAiGrossMarginPct: number;
    grossMarginDeltaBps: number; // Basis points change
    baselineOperatingIncome: number;
    postAiOperatingIncome: number;
    baselineOperatingMarginPct: number;
    postAiOperatingMarginPct: number;
    operatingMarginDeltaBps: number;
    ebitdaImpact: number;
  };

  // Unit Economics (Page 8)
  unitEconomics: {
    costPerQuery: number; // $ per API call
    annualCostPerSeat: number;
    annualValuePerSeat: number;
    monthlyNetValuePerSeat: number;
    queryVolumeAnnual: number;
  };
}

export interface CalculationResults {
  benefits: StreamBreakdown;
  costs: CostBreakdown;

  // Year 1 Core Summary
  firstYearNetValue: number;
  firstYearNetRoi: number;
  paybackPeriodMonths: number;
  annualHoursSaved: number;
  fteEquivalent: number;
  costToValueRatio: number;

  // Per-User Economics
  annualCostPerSeat: number;
  annualValuePerSeat: number;
  costPerQuery: number;

  // Advanced Financial Fluency (from attached PDF)
  financialFluency: FinancialFluencyResults;

  // Projections
  timeline: MonthDataPoint[];
  fiveYearProjections: YearProjection[];
}
