import { TechnologyMoveConfig, TechnologyMoveType } from "../types";

export const TECHNOLOGY_MOVES: Record<TechnologyMoveType, TechnologyMoveConfig> = {
  ai_workflows: {
    id: "ai_workflows",
    label: "AI-First Workflows (Internal Automation)",
    businessMechanism: "Automate / redesign internal work & employee tasks",
    economicEffect: "Capacity release, faster cycle time, lower operating cost",
    metricsToWatch: ["Operating Margin", "EBITDA", "Hours Saved / FTE", "Cost-to-Value Ratio"],
  },
  new_product: {
    id: "new_product",
    label: "New AI / Data Product (Revenue Generating)",
    businessMechanism: "Premium AI capability or net-new customer revenue stream",
    economicEffect: "Incremental recurring revenue with high scalable delivery margin",
    metricsToWatch: ["ARR / Contracted Value", "Gross Margin", "ROI", "LTV:CAC"],
  },
  product_improvement: {
    id: "product_improvement",
    label: "Product Improvement (Customer Experience)",
    businessMechanism: "Self-serve onboarding, intelligent search, churn prevention",
    economicEffect: "Higher customer adoption, expanded contract retention, lower support burden",
    metricsToWatch: ["ARR Expansion", "Net Retention Rate (NRR)", "LTV:CAC", "Support Deflection"],
  },
  platform_scale: {
    id: "platform_scale",
    label: "Platform Scale & Shared AI Services",
    businessMechanism: "Shared model gateway, centralized vector index, multi-team reuse",
    economicEffect: "Lower marginal inference cost per query + faster distribution velocity",
    metricsToWatch: ["Gross Margin", "Unit Cost per Query", "TCO", "Time-to-Market"],
  },
  modernization: {
    id: "modernization",
    label: "Foundation Modernization & Cloud Consolidation",
    businessMechanism: "Consolidate fragmented legacy tools, on-prem to cloud AI pipelines",
    economicEffect: "Lower hosting, vendor license, support, and duplicate tooling cost",
    metricsToWatch: ["5-Year TCO", "Gross Margin", "OpEx Reduction", "Payback Period"],
  },
};

export interface SixQuestionsChecklist {
  outcome: string;
  economics: string;
  plCash: string;
  assumptions: string;
  evidenceGate: string;
  owner: string;
}

export const C_SUITE_SIX_QUESTIONS = [
  {
    number: "01",
    key: "outcome",
    title: "Outcome",
    question: "What business outcome are we trying to change?",
    guidance: "Avoid saying 'AI created value'. State the exact operational or customer mechanism (e.g., ticket resolution time, engineering test cycle, customer churn).",
  },
  {
    number: "02",
    key: "economics",
    title: "Economics",
    question: "What is the full lifecycle cost (TCO) and expected value?",
    guidance: "Evaluate the 5-year full lifecycle: dev, tokens, vector hosting, security/compliance, and maintenance—not just Year 1 build costs.",
  },
  {
    number: "03",
    key: "plCash",
    title: "P&L / Cash",
    question: "Where does the impact show up—in revenue, margin, expense, cash, or risk?",
    guidance: "Differentiate between CapEx (capitalized dev asset on balance sheet) and OpEx (API tokens/cloud consumption expensed in period).",
  },
  {
    number: "04",
    key: "assumptions",
    title: "Assumptions",
    question: "Which assumptions drive the case, and how sensitive are they?",
    guidance: "Model conservative adoption (-15%), token pricing shifts, and compare against the company's hurdle rate (NPV @ 10%).",
  },
  {
    number: "05",
    key: "evidenceGate",
    title: "Evidence Gate",
    question: "What must be true before we scale the investment?",
    guidance: "Define milestone-based rollout criteria (e.g. proof-of-concept latency <800ms, test defect deflection >25%, accuracy benchmark >92%).",
  },
  {
    number: "06",
    key: "owner",
    title: "Owner",
    question: "Who owns the business outcome and ongoing economics?",
    guidance: "Single accountable executive (Product Manager, Engineering Lead, or Business Head) responsible for realizing ongoing returns.",
  },
];
