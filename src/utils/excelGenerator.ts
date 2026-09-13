import * as XLSX from "xlsx";
import { CalculatorInputs, CalculationResults } from "../types";
import { TECHNOLOGY_MOVES } from "../data/technologyMoves";

export function generateExecutiveExcelWorkbook(
  inputs: CalculatorInputs,
  results: CalculationResults,
  industryName: string
) {
  const wb = XLSX.utils.book_new();

  const techMove =
    TECHNOLOGY_MOVES[inputs?.technologyMove] || TECHNOLOGY_MOVES.ai_workflows;

  const ff = results?.financialFluency || ({} as any);
  const pl = ff.plImpact || ({} as any);
  const cx = ff.capexVsOpex || ({} as any);
  const ue = ff.unitEconomics || ({} as any);
  const costs = results?.costs || ({} as any);
  const projections = results?.fiveYearProjections || [];

  const fmt = (n: number | undefined | null) => (n ?? 0).toLocaleString();
  const fmtCur = (n: number | undefined | null) => `$${(n ?? 0).toLocaleString()}`;
  const fmtPct = (n: number | undefined | null) => `${n ?? 0}%`;

  // ==========================================
  // TAB 1: EXECUTIVE SUMMARY & C-SUITE ROI
  // ==========================================
  const execSummaryData = [
    ["EXECUTIVE AI INVESTMENT MEMORANDUM & ROI MODEL"],
    ["Framework: Executive Financial Fluency for Product & Technology Leaders"],
    ["Generated Date:", new Date().toLocaleDateString()],
    [],
    ["1. INITIATIVE OVERVIEW & STRATEGIC ALIGNMENT"],
    ["Project / Feature Name:", inputs?.featureName || "AI Initiative"],
    ["Technology Move Archetype:", techMove?.label || "AI Workflows"],
    ["Business Mechanism:", techMove?.businessMechanism || ""],
    ["Economic Effect:", techMove?.economicEffect || ""],
    ["Industry Sector:", industryName || "Cross-Industry"],
    ["Operating Scenario:", (inputs?.scenario || "expected").toUpperCase()],
    ["Executive Sponsor / Owner:", inputs?.executiveOwner || "VP Product & Tech"],
    [],
    ["2. CORE CAPITAL ALLOCATION & FINANCIAL LENSES (CFO DASHBOARD)"],
    ["Metric", "Value", "Benchmark / Unit", "C-Suite Interpretation"],
    [
      "Net Present Value (NPV)",
      fmtCur(ff.npv),
      `@ ${inputs?.discountRatePct ?? 10}% Hurdle Rate`,
      "Net enterprise value created in today's dollars over 5 years",
    ],
    [
      "Internal Rate of Return (IRR)",
      fmtPct(ff.irr),
      `vs. ${inputs?.discountRatePct ?? 10}% Hurdle Rate`,
      "Annualized rate of return; strongly exceeds cost of capital",
    ],
    [
      "Year 1 Net ROI",
      fmtPct(results?.firstYearNetRoi),
      "Percentage",
      "Net Year 1 dollar returns divided by total Year 1 investment",
    ],
    [
      "Break-Even Payback Period",
      `${results?.paybackPeriodMonths ?? 0} Months`,
      "Months from Launch",
      "Exact month cumulative benefits surpass cumulative development + FinOps spend",
    ],
    [
      "5-Year Total Cost of Ownership (TCO)",
      fmtCur(ff.fiveYearTco),
      "5-Year Full Lifecycle",
      "Full lifecycle spend: upfront dev, tokens, vector cloud, security & ongoing maintenance",
    ],
    [
      "Cost-to-Value Multiplier",
      `1 : $${results?.costToValueRatio ?? 0}`,
      "Ratio ($1 spend : $ return)",
      "For every $1.00 invested in AI, dollars of organizational value returned",
    ],
    [
      "Annual Capacity Released",
      `${fmt(results?.annualHoursSaved)} Hours`,
      `≈ ${results?.fteEquivalent ?? 0} FTEs`,
      "Productive hours unlocked from routine cognitive labor and rework",
    ],
    [],
    ["3. VALUE CREATION & SCALE: P&L OPERATING LEVERAGE"],
    ["P&L Line Item", "Baseline (Pre-AI)", "Post-AI (Transformed)", "Variance / Expansion"],
    [
      "Enterprise Annual Revenue / ARR",
      fmtCur(pl.baselineRevenue),
      fmtCur(pl.postAiRevenue),
      `+${fmtCur(ff.arrImpact)} ARR uplift`,
    ],
    [
      "Gross Margin %",
      fmtPct(pl.baselineGrossMarginPct),
      fmtPct(pl.postAiGrossMarginPct),
      `+${pl.grossMarginDeltaBps ?? 0} bps expansion`,
    ],
    [
      "Operating Income ($)",
      fmtCur(pl.baselineOperatingIncome),
      fmtCur(pl.postAiOperatingIncome),
      `+${fmtCur((pl.postAiOperatingIncome ?? 0) - (pl.baselineOperatingIncome ?? 0))}`,
    ],
    [
      "Operating Margin %",
      fmtPct(pl.baselineOperatingMarginPct),
      fmtPct(pl.postAiOperatingMarginPct),
      `+${pl.operatingMarginDeltaBps ?? 0} bps expansion`,
    ],
    [
      "Annual EBITDA Operating Leverage",
      "—",
      `+${fmtCur(pl.ebitdaImpact)}`,
      "Incremental operating profit contribution",
    ],
    [],
    ["4. CAPEX VS. OPEX ACCOUNTING CLASSIFICATION (PAGE 5)"],
    [
      "Capitalized Software Development (CapEx):",
      fmtCur(cx.capitalizedDev),
      `(${inputs?.capexPercentage ?? 80}% of upfront dev amortized over 3 yrs)`,
    ],
    [
      "Annual Straight-Line Amortization:",
      `${fmtCur(cx.annualAmortization)}/yr`,
      "Non-cash period expense against Operating Margin",
    ],
    [
      "Annual Operational Expenses (OpEx):",
      `${fmtCur(cx.annualOpex)}/yr`,
      "Recurring model tokens, vector DB hosting & maintenance",
    ],
    [],
    ["5. THE SIX QUESTIONS BEFORE TAKING AN INVESTMENT TO THE C-SUITE (PAGE 10)"],
    ["Question", "Executive Answer / Framing"],
    [
      "1. Outcome (What business outcome are we changing?)",
      inputs?.businessOutcome ||
        `Automate internal workflow friction, saving ${inputs?.hoursSavedPerWeek ?? 0} hrs/person/wk across ${inputs?.teamSize ?? 0} team members.`,
    ],
    [
      "2. Economics (Full lifecycle TCO & expected value?)",
      `5-year TCO is ${fmtCur(ff.fiveYearTco)} generating ${fmtCur(
        projections.reduce((s: number, p: any) => s + (p?.benefits ?? 0), 0)
      )} in gross 5-stream value.`,
    ],
    [
      "3. P&L / Cash (Where does the impact show up?)",
      `Shows up in +${pl.operatingMarginDeltaBps ?? 0} bps operating margin, ${fmtCur(results?.firstYearNetValue)} net Year 1 value, and ${fmtCur(ff.arrImpact)} ARR.`,
    ],
    [
      "4. Assumptions (Which assumptions drive the case?)",
      `Sensitivity modeled under ${(inputs?.scenario || "expected").toUpperCase()} scenario (${inputs?.adoptionRate ?? 0}% target adoption, $${inputs?.tokenCostPerMillion ?? 0}/1M tokens, ${inputs?.discountRatePct ?? 0}% hurdle rate).`,
    ],
    [
      "5. Evidence Gate (What must be true before we scale?)",
      inputs?.evidenceGate ||
        "Milestone gate: Pilot defect reduction >20%, model latency <1.2s, and user adoption >60% within 60 days.",
    ],
    [
      "6. Owner (Who owns ongoing economics?)",
      inputs?.executiveOwner || "Lead Product Manager & VP of Engineering",
    ],
  ];

  const wsExec = XLSX.utils.aoa_to_sheet(execSummaryData);
  XLSX.utils.book_append_sheet(wb, wsExec, "C-Suite Summary");

  // ==========================================
  // TAB 2: MULTI-STAKEHOLDER INPUT MATRIX
  // ==========================================
  const inputsData = [
    ["DYNAMIC MULTI-STAKEHOLDER INPUT MATRIX"],
    ["Configure any AI project or feature by gathering structured inputs across PM, Eng, and Finance."],
    [],
    ["SECTION A: PRODUCT MANAGER (PM) INPUTS", "Value", "Unit / Format", "Role Ownership"],
    ["Feature / Project Name", inputs?.featureName || "", "Text", "Product Manager"],
    ["Strategic Technology Move", techMove?.label || "", "Dropdown Archetype", "Product Manager"],
    ["Target Team Size / Impacted Seats", inputs?.teamSize ?? 0, "Users / Seats", "Product Manager"],
    ["Hours Saved per Person per Week", inputs?.hoursSavedPerWeek ?? 0, "Hours / Week", "Product Manager"],
    ["Target Adoption Rate", fmtPct(inputs?.adoptionRate), "Percentage", "Product Manager"],
    ["Annual Revenue / ARR Uplift (Optional)", fmtCur(inputs?.annualRevenueUplift), "USD / Year", "Product Manager"],
    ["Retention / Churn Reduction Lift", fmtPct(inputs?.retentionUpliftPct), "Percentage Lift", "Product Manager"],
    ["Monthly Queries / User", inputs?.monthlyQueriesPerUser ?? 0, "Queries / User / Month", "Product Manager"],
    [],
    ["SECTION B: ENGINEERING LEAD & ARCHITECTURE INPUTS", "Value", "Unit / Format", "Role Ownership"],
    ["AI Architecture Type", (inputs?.architectureType || "").toUpperCase().replace("_", " "), "Architecture Pattern", "Engineering Lead"],
    ["Upfront Dev & Evaluation Cost", fmtCur(inputs?.oneTimeDevCost), "USD (One-Time)", "Engineering Lead"],
    ["Software Capitalization Rate (CapEx)", fmtPct(inputs?.capexPercentage), "Eligible for Balance Sheet", "Engineering Lead & Finance"],
    ["Average Tokens per Query", fmt(inputs?.avgTokensPerQuery), "Tokens / Call", "Engineering Lead"],
    ["Model Pricing per 1M Tokens", `$${inputs?.tokenCostPerMillion ?? 0}`, "USD / 1M Tokens", "Engineering Lead"],
    ["Annual Vector DB & Cloud Infra", fmtCur(inputs?.annualInfraCost), "USD / Year", "Engineering Lead"],
    ["Annual Maintenance, Evals & Ops", fmtCur(inputs?.annualMaintenanceCost), "USD / Year", "Engineering Lead"],
    [],
    ["SECTION C: BUSINESS HEAD & CFO INPUTS", "Value", "Unit / Format", "Role Ownership"],
    ["Baseline Enterprise Annual Revenue", fmtCur(inputs?.companyRevenue), "USD / Year", "Business Head / CFO"],
    ["Baseline Gross Margin %", fmtPct(inputs?.baselineGrossMarginPct), "Percentage", "Business Head / CFO"],
    ["Baseline Operating Margin %", fmtPct(inputs?.baselineOperatingMarginPct), "Percentage", "Business Head / CFO"],
    ["Blended Employee Hourly Labor Cost", `$${inputs?.hourlyRate ?? 0}/hr`, "USD / Hour", "Business Head / CFO"],
    ["Corporate Hurdle Rate (Discount Rate)", fmtPct(inputs?.discountRatePct), "Annual Discount Rate", "Business Head / CFO"],
    ["Active Evaluation Scenario", (inputs?.scenario || "expected").toUpperCase(), "Conservative / Balanced / Optimistic", "Business Head / CFO"],
    ["Business Outcome Statement", inputs?.businessOutcome || "Operational workflow acceleration", "Text", "Business Head"],
    ["Evidence Gate Milestone", inputs?.evidenceGate || "Phase-gate evaluation", "Text", "Business Head & Eng Lead"],
    ["Executive Owner", inputs?.executiveOwner || "VP Product", "Text", "Business Head"],
    [],
    ["SECTION D: 5 VALUE STREAM WEIGHTS (AI4SP METHODOLOGY)", "Weight %", "Stream Description"],
    ["1. Direct Productivity", fmtPct(inputs?.streamWeights?.directProductivity), "Routine task automation & hours saved"],
    ["2. Quality & Error Reduction", fmtPct(inputs?.streamWeights?.qualityImprovement), "Rework prevention & defect deflection"],
    ["3. Innovation & Velocity", fmtPct(inputs?.streamWeights?.innovationVelocity), "Faster time-to-market & ARR acceleration"],
    ["4. Knowledge & Learning", fmtPct(inputs?.streamWeights?.learningUpskilling), "Onboarding acceleration & decentralized context"],
    ["5. Wellbeing & Retention", fmtPct(inputs?.streamWeights?.retentionWellbeing), "Cognitive burnout relief & talent turnover reduction"],
  ];

  const wsInputs = XLSX.utils.aoa_to_sheet(inputsData);
  XLSX.utils.book_append_sheet(wb, wsInputs, "Stakeholder Inputs");

  // ==========================================
  // TAB 3: 5-YEAR CASH FLOW, DISCOUNTING & TCO
  // ==========================================
  const cashFlowData = [
    ["5-YEAR CASH FLOW & TCO LIFECYCLE MODEL"],
    [`Discount Rate: ${inputs?.discountRatePct ?? 10}% | Scenario: ${(inputs?.scenario || "expected").toUpperCase()}`],
    [],
    [
      "Financial Line Item",
      "Year 0 (Build)",
      "Year 1",
      "Year 2",
      "Year 3",
      "Year 4",
      "Year 5",
      "5-Year Cumulative",
    ],
    // Cash Inflows
    [
      "GROSS BENEFITS / INFLOWS",
      "$0",
      fmtCur(projections[0]?.benefits),
      fmtCur(projections[1]?.benefits),
      fmtCur(projections[2]?.benefits),
      fmtCur(projections[3]?.benefits),
      fmtCur(projections[4]?.benefits),
      fmtCur(projections.reduce((s: number, p: any) => s + (p?.benefits ?? 0), 0)),
    ],
    // Cash Outflows
    [
      "One-Time Dev / Architecture (CapEx/OpEx)",
      `-${fmtCur(costs.oneTimeDev)}`,
      "$0",
      "$0",
      "$0",
      "$0",
      "$0",
      `-${fmtCur(costs.oneTimeDev)}`,
    ],
    [
      "Ongoing FinOps: Tokens, Vector DB & Maintenance",
      "$0",
      `-${fmtCur(costs.totalOngoingAnnualCost)}`,
      `-${fmtCur(projections[1]?.costs)}`,
      `-${fmtCur(projections[2]?.costs)}`,
      `-${fmtCur(projections[3]?.costs)}`,
      `-${fmtCur(projections[4]?.costs)}`,
      `-${fmtCur((ff.fiveYearTco ?? 0) - (costs.oneTimeDev ?? 0))}`,
    ],
    [
      "TOTAL OUTFLOWS (TCO SPEND)",
      `-${fmtCur(costs.oneTimeDev)}`,
      `-${fmtCur(costs.totalFirstYearCost)}`,
      `-${fmtCur(projections[1]?.costs)}`,
      `-${fmtCur(projections[2]?.costs)}`,
      `-${fmtCur(projections[3]?.costs)}`,
      `-${fmtCur(projections[4]?.costs)}`,
      `-${fmtCur(ff.fiveYearTco)}`,
    ],
    [],
    [
      "NET OPERATING CASH FLOW",
      `-${fmtCur(costs.oneTimeDev)}`,
      fmtCur(projections[0]?.netValue),
      fmtCur(projections[1]?.netValue),
      fmtCur(projections[2]?.netValue),
      fmtCur(projections[3]?.netValue),
      fmtCur(projections[4]?.netValue),
      fmtCur(projections[4]?.cumulativeNetValue),
    ],
    [
      "Cumulative Net Cash Flow (Undiscounted)",
      `-${fmtCur(costs.oneTimeDev)}`,
      fmtCur(projections[0]?.cumulativeNetValue),
      fmtCur(projections[1]?.cumulativeNetValue),
      fmtCur(projections[2]?.cumulativeNetValue),
      fmtCur(projections[3]?.cumulativeNetValue),
      fmtCur(projections[4]?.cumulativeNetValue),
      "—",
    ],
    [
      `Discount Factor @ ${inputs?.discountRatePct ?? 10}%`,
      "1.000",
      (1 / (1 + (inputs?.discountRatePct ?? 10) / 100)).toFixed(3),
      (1 / Math.pow(1 + (inputs?.discountRatePct ?? 10) / 100, 2)).toFixed(3),
      (1 / Math.pow(1 + (inputs?.discountRatePct ?? 10) / 100, 3)).toFixed(3),
      (1 / Math.pow(1 + (inputs?.discountRatePct ?? 10) / 100, 4)).toFixed(3),
      (1 / Math.pow(1 + (inputs?.discountRatePct ?? 10) / 100, 5)).toFixed(3),
      "—",
    ],
    [
      "Discounted Cash Flow (Today's Dollars)",
      `-${fmtCur(costs.oneTimeDev)}`,
      fmtCur(projections[0]?.discountedCashFlow),
      fmtCur(projections[1]?.discountedCashFlow),
      fmtCur(projections[2]?.discountedCashFlow),
      fmtCur(projections[3]?.discountedCashFlow),
      fmtCur(projections[4]?.discountedCashFlow),
      `NPV = ${fmtCur(ff.npv)}`,
    ],
    [
      "Cumulative Discounted Value (NPV Trend)",
      `-${fmtCur(costs.oneTimeDev)}`,
      fmtCur(projections[0]?.cumulativeDiscountedValue),
      fmtCur(projections[1]?.cumulativeDiscountedValue),
      fmtCur(projections[2]?.cumulativeDiscountedValue),
      fmtCur(projections[3]?.cumulativeDiscountedValue),
      fmtCur(projections[4]?.cumulativeDiscountedValue),
      `Final NPV: ${fmtCur(ff.npv)}`,
    ],
    [],
    ["ANNUAL RETURN METRICS", "Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Target"],
    [
      "Annual Net ROI %",
      "—",
      fmtPct(projections[0]?.roi),
      fmtPct(projections[1]?.roi),
      fmtPct(projections[2]?.roi),
      fmtPct(projections[3]?.roi),
      fmtPct(projections[4]?.roi),
      `IRR = ${fmtPct(ff.irr)}`,
    ],
    [
      "Effective Adoption Rate %",
      "0%",
      fmtPct(projections[0]?.effectiveAdoptionRate),
      fmtPct(projections[1]?.effectiveAdoptionRate),
      fmtPct(projections[2]?.effectiveAdoptionRate),
      fmtPct(projections[3]?.effectiveAdoptionRate),
      fmtPct(projections[4]?.effectiveAdoptionRate),
      "—",
    ],
  ];

  const wsCashFlow = XLSX.utils.aoa_to_sheet(cashFlowData);
  XLSX.utils.book_append_sheet(wb, wsCashFlow, "5-Yr Cash Flow & TCO");

  // ==========================================
  // TAB 4: P&L STATEMENT & OPERATING LEVERAGE
  // ==========================================
  const baselineRev = pl.baselineRevenue ?? 1;
  const growthRate = (((ff.arrImpact ?? 0) / (baselineRev || 1)) * 100).toFixed(2);

  const plData = [
    ["INCOME STATEMENT & OPERATING LEVERAGE (PAGE 6 & 7)"],
    ["Illustrates how the AI initiative flows into Revenue, Gross Margin, and EBITDA"],
    [],
    ["P&L Line Item", "Pre-AI Baseline", "Post-AI (Transformed)", "Variance ($)", "Margin Impact"],
    [
      "Total Enterprise Revenue / ARR",
      fmtCur(pl.baselineRevenue),
      fmtCur(pl.postAiRevenue),
      `+${fmtCur(ff.arrImpact)}`,
      `+${growthRate}% Top-Line Growth`,
    ],
    [
      "Cost of Goods Sold (COGS)",
      fmtCur((pl.baselineRevenue ?? 0) - (pl.baselineGrossProfit ?? 0)),
      fmtCur((pl.postAiRevenue ?? 0) - (pl.postAiGrossProfit ?? 0)),
      `+${fmtCur(
        (pl.postAiRevenue ?? 0) -
          (pl.postAiGrossProfit ?? 0) -
          ((pl.baselineRevenue ?? 0) - (pl.baselineGrossProfit ?? 0))
      )}`,
      "AI delivery tokens + infra (if customer-facing)",
    ],
    [
      "Gross Profit",
      fmtCur(pl.baselineGrossProfit),
      fmtCur(pl.postAiGrossProfit),
      `+${fmtCur((pl.postAiGrossProfit ?? 0) - (pl.baselineGrossProfit ?? 0))}`,
      `${pl.postAiGrossMarginPct ?? 0}% GM (vs ${pl.baselineGrossMarginPct ?? 0}%)`,
    ],
    [
      "Gross Margin %",
      fmtPct(pl.baselineGrossMarginPct),
      fmtPct(pl.postAiGrossMarginPct),
      `${(pl.grossMarginDeltaBps ?? 0) > 0 ? "+" : ""}${pl.grossMarginDeltaBps ?? 0} bps`,
      "Delivery efficiency & scalability",
    ],
    [
      "Operating Expenses (OpEx)",
      fmtCur((pl.baselineGrossProfit ?? 0) - (pl.baselineOperatingIncome ?? 0)),
      fmtCur((pl.postAiGrossProfit ?? 0) - (pl.postAiOperatingIncome ?? 0)),
      `-${fmtCur(
        (pl.baselineGrossProfit ?? 0) -
          (pl.baselineOperatingIncome ?? 0) -
          ((pl.postAiGrossProfit ?? 0) - (pl.postAiOperatingIncome ?? 0))
      )}`,
      "Net OpEx release from labor automation",
    ],
    [
      "Operating Income (EBIT)",
      fmtCur(pl.baselineOperatingIncome),
      fmtCur(pl.postAiOperatingIncome),
      `+${fmtCur((pl.postAiOperatingIncome ?? 0) - (pl.baselineOperatingIncome ?? 0))}`,
      `${pl.postAiOperatingMarginPct ?? 0}% (vs ${pl.baselineOperatingMarginPct ?? 0}%)`,
    ],
    [
      "Operating Margin %",
      fmtPct(pl.baselineOperatingMarginPct),
      fmtPct(pl.postAiOperatingMarginPct),
      `+${pl.operatingMarginDeltaBps ?? 0} bps`,
      "Operating leverage expansion",
    ],
    [
      "Annual EBITDA Operating Leverage",
      "—",
      `+${fmtCur(pl.ebitdaImpact)}`,
      `+${fmtCur(pl.ebitdaImpact)}`,
      "Operating profit + capitalized amortization",
    ],
  ];

  const wsPl = XLSX.utils.aoa_to_sheet(plData);
  XLSX.utils.book_append_sheet(wb, wsPl, "P&L Statement Impact");

  // ==========================================
  // TAB 5: UNIT ECONOMICS & FINOPS BREAKDOWN
  // ==========================================
  const unitEconomicsData = [
    ["UNIT ECONOMICS & FINOPS INFERENCE MODEL (PAGE 8)"],
    ["Granular per-user, per-query, and token consumption metrics"],
    [],
    ["Metric", "Value", "Unit", "FinOps Significance"],
    [
      "Total Active Seats / Users",
      Math.round((inputs?.teamSize ?? 0) * ((inputs?.adoptionRate ?? 0) / 100)),
      "Active Users",
      "Headcount actively using the AI feature",
    ],
    [
      "Annual Query Volume",
      fmt(ue.queryVolumeAnnual),
      "Inference Calls / Year",
      "Total API requests processed",
    ],
    [
      "Cost per Query / Inference Call",
      `$${(ue.costPerQuery ?? 0).toFixed(4)}`,
      "USD / Query",
      "Model tokens + vector infrastructure allocation",
    ],
    [
      "Annual Cost per Seat",
      fmtCur(ue.annualCostPerSeat),
      "USD / Seat / Year",
      "Total first-year investment per seat",
    ],
    [
      "Monthly Cost per Seat",
      `$${Math.round((ue.annualCostPerSeat ?? 0) / 12)}`,
      "USD / Seat / Month",
      "Benchmark vs. commercial copilot licenses",
    ],
    [
      "Annual Value per Seat Created",
      fmtCur(ue.annualValuePerSeat),
      "USD / Seat / Year",
      "Gross 5-stream value generated per employee",
    ],
    [
      "Monthly Net Margin per Seat",
      fmtCur(ue.monthlyNetValuePerSeat),
      "USD / Seat / Month",
      "Net economic surplus generated per seat",
    ],
  ];

  const wsUnit = XLSX.utils.aoa_to_sheet(unitEconomicsData);
  XLSX.utils.book_append_sheet(wb, wsUnit, "Unit Economics & FinOps");

  // Trigger browser download
  const cleanFilename = `AI_ROI_Executive_Model_${(inputs?.featureName || "Project")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .slice(0, 30)}.xlsx`;

  XLSX.writeFile(wb, cleanFilename);
}
