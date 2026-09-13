import {
  CalculatorInputs,
  CalculationResults,
  MonthDataPoint,
  YearProjection,
  FinancialFluencyResults,
} from "../types";

/**
 * Calculates Internal Rate of Return (IRR) using bisection root-finding
 */
function calculateIrr(cashFlows: number[], maxIterations = 100): number {
  // If initial cashflow is positive or all are negative, IRR is undefined or 0
  if (cashFlows[0] >= 0 || cashFlows.slice(1).every((cf) => cf <= 0)) {
    return 0;
  }

  let lowRate = -0.5; // -50%
  let highRate = 5.0; // 500%

  const npvAt = (rate: number): number => {
    return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
  };

  let lowNpv = npvAt(lowRate);
  let highNpv = npvAt(highRate);

  // Check if sign flips
  if (lowNpv * highNpv > 0) {
    // If highRate still yields positive NPV, rate is extremely high
    if (highNpv > 0) return 500;
    return 0;
  }

  for (let i = 0; i < maxIterations; i++) {
    const midRate = (lowRate + highRate) / 2;
    const midNpv = npvAt(midRate);

    if (Math.abs(midNpv) < 1.0 || (highRate - lowRate) < 0.0001) {
      return Math.round(midRate * 1000) / 10; // e.g. 36.4%
    }

    if (lowNpv * midNpv <= 0) {
      highRate = midRate;
      highNpv = midNpv;
    } else {
      lowRate = midRate;
      lowNpv = midNpv;
    }
  }

  return Math.round(((lowRate + highRate) / 2) * 1000) / 10;
}

export function calculateRoi(inputs: CalculatorInputs): CalculationResults {
  const {
    teamSize,
    hourlyRate,
    hoursSavedPerWeek,
    workWeeksPerYear = 48,
    adoptionRate,
    scenario,
    oneTimeDevCost,
    capexPercentage = 80,
    monthlyQueriesPerUser,
    avgTokensPerQuery,
    tokenCostPerMillion,
    annualInfraCost,
    annualMaintenanceCost,
    streamWeights,
    annualRevenueUplift = 0,
    technologyMove = "ai_workflows",
    companyRevenue = 10000000,
    baselineGrossMarginPct = 70,
    baselineOperatingMarginPct = 12,
    discountRatePct = 10,
  } = inputs;

  // Scenario Multipliers (Page 10 Assumptions Sensitivity)
  let adoptionMultiplier = 1.0;
  let valueEfficiencyMultiplier = 1.0;
  let costBufferMultiplier = 1.0;

  if (scenario === "conservative") {
    adoptionMultiplier = 0.85; // -15% adoption discount
    valueEfficiencyMultiplier = 0.9;
    costBufferMultiplier = 1.1; // +10% contingency buffer
  } else if (scenario === "optimistic") {
    adoptionMultiplier = 1.15; // +15% adoption
    valueEfficiencyMultiplier = 1.15;
    costBufferMultiplier = 0.95;
  }

  const effectiveAdoption = Math.min(
    100,
    Math.max(10, adoptionRate * adoptionMultiplier)
  );

  // 1. Costs Calculation (FinOps / Mavvrik True Cost & CapEx/OpEx Accounting)
  const adjustedOneTimeDev = Math.round(oneTimeDevCost * costBufferMultiplier);
  const adjustedInfra = Math.round(annualInfraCost * costBufferMultiplier);
  const adjustedMaintenance = Math.round(annualMaintenanceCost * costBufferMultiplier);

  // Annual token inference cost based on active usage
  const activeUsers = Math.max(1, teamSize * (effectiveAdoption / 100));
  const totalAnnualQueries = activeUsers * monthlyQueriesPerUser * 12;
  const totalAnnualTokens = totalAnnualQueries * avgTokensPerQuery;
  const annualTokens = Math.round(
    (totalAnnualTokens / 1_000_000) * tokenCostPerMillion * costBufferMultiplier
  );

  const totalFirstYearCost =
    adjustedOneTimeDev + annualTokens + adjustedInfra + adjustedMaintenance;
  const totalOngoingAnnualCost = annualTokens + adjustedInfra + adjustedMaintenance;

  // Accounting Classification: CapEx vs. OpEx (Page 5 from PDF)
  const capexAmount = Math.round(adjustedOneTimeDev * (capexPercentage / 100));
  const expensedDev = adjustedOneTimeDev - capexAmount;
  const annualAmortization = Math.round(capexAmount / 3); // 3-year straight-line software amortization
  const opexAnnualAmount = annualTokens + adjustedInfra + adjustedMaintenance;

  // 2. Benefits Calculation (AI4SP 5-Value Stream Framework)
  const baselineCapacityDollars =
    teamSize *
    hoursSavedPerWeek *
    workWeeksPerYear *
    hourlyRate *
    (effectiveAdoption / 100);

  // Normalize stream weights with safe fallbacks
  const safeDirect = streamWeights?.directProductivity ?? 40;
  const safeQuality = streamWeights?.qualityImprovement ?? 25;
  const safeInno = streamWeights?.innovationVelocity ?? 15;
  const safeLearn = streamWeights?.learningUpskilling ?? 10;
  const safeRet = streamWeights?.retentionWellbeing ?? 10;

  const totalWeight =
    (safeDirect || 0) +
    (safeQuality || 0) +
    (safeInno || 0) +
    (safeLearn || 0) +
    (safeRet || 0) || 100;

  const wDirect = safeDirect / totalWeight;
  const wQuality = safeQuality / totalWeight;
  const wInno = safeInno / totalWeight;
  const wLearn = safeLearn / totalWeight;
  const wRet = safeRet / totalWeight;

  // Stream 1: Direct Productivity (Routine labor automation)
  const directProductivity = Math.round(
    baselineCapacityDollars * wDirect * valueEfficiencyMultiplier
  );

  // Stream 2: Quality & Error Reduction (Rework prevention, defect escapes, QA automation)
  const qualityImprovement = Math.round(
    baselineCapacityDollars * wQuality * 1.15 * valueEfficiencyMultiplier
  );

  // Stream 3: Innovation & Velocity (Time-to-market acceleration + ARR/revenue uplift)
  const adjustedRevenueUplift = Math.round(
    annualRevenueUplift * (effectiveAdoption / 100) * valueEfficiencyMultiplier
  );
  const innovationVelocity = Math.round(
    baselineCapacityDollars * wInno * 1.25 * valueEfficiencyMultiplier + adjustedRevenueUplift
  );

  // Stream 4: Learning & Upskilling (Ramp-up acceleration, prompt & context retrieval)
  const learningUpskilling = Math.round(
    baselineCapacityDollars * wLearn * 0.9 * valueEfficiencyMultiplier
  );

  // Stream 5: Wellbeing & Retention (Burnout alleviation, lower employee turnover)
  const retentionWellbeing = Math.round(
    baselineCapacityDollars * wRet * 0.95 * valueEfficiencyMultiplier
  );

  const totalAnnualBenefit =
    directProductivity +
    qualityImprovement +
    innovationVelocity +
    learningUpskilling +
    retentionWellbeing;

  // 3. Highlights & Key Executive Ratios
  const firstYearNetValue = totalAnnualBenefit - totalFirstYearCost;
  const firstYearNetRoi =
    totalFirstYearCost > 0
      ? Math.round(((totalAnnualBenefit - totalFirstYearCost) / totalFirstYearCost) * 100)
      : 0;

  const costToValueRatio =
    totalFirstYearCost > 0
      ? Number((totalAnnualBenefit / totalFirstYearCost).toFixed(2))
      : 0;

  const annualHoursSaved = Math.round(
    teamSize * hoursSavedPerWeek * workWeeksPerYear * (effectiveAdoption / 100)
  );
  const fteEquivalent = Number((annualHoursSaved / 2000).toFixed(1));

  const annualCostPerSeat = teamSize > 0 ? Math.round(totalFirstYearCost / teamSize) : 0;
  const annualValuePerSeat = teamSize > 0 ? Math.round(totalAnnualBenefit / teamSize) : 0;

  // 4. Monthly Timeline & Break-Even Curve (S-curve ramp modeled)
  const timeline: MonthDataPoint[] = [];
  let cumCost = adjustedOneTimeDev;
  let cumBenefit = 0;
  let breakEvenMonth = 0;

  const monthlyOngoingCost = totalOngoingAnnualCost / 12;
  const monthlySteadyBenefit = totalAnnualBenefit / 12;

  for (let m = 1; m <= 36; m++) {
    let rampFactor = 1.0;
    if (m === 1) rampFactor = 0.25;
    else if (m === 2) rampFactor = 0.45;
    else if (m === 3) rampFactor = 0.65;
    else if (m === 4) rampFactor = 0.8;
    else if (m === 5) rampFactor = 0.92;
    else rampFactor = 1.0;

    cumCost += monthlyOngoingCost;
    cumBenefit += monthlySteadyBenefit * rampFactor;
    const netCashFlow = cumBenefit - cumCost;

    const isBreakEven = netCashFlow >= 0;
    if (isBreakEven && breakEvenMonth === 0) {
      breakEvenMonth = m;
    }

    timeline.push({
      month: m,
      cumulativeCost: Math.round(cumCost),
      cumulativeBenefit: Math.round(cumBenefit),
      netCashFlow: Math.round(netCashFlow),
      isBreakEven,
    });
  }

  const paybackPeriodMonths =
    breakEvenMonth > 0 ? breakEvenMonth : timeline.findIndex((p) => p.netCashFlow >= 0) + 1 || 36;

  // 5. 5-Year Projections & Discounted Cash Flows (Page 3 & 4: NPV, IRR, 5-Year TCO)
  const discountRate = discountRatePct / 100;
  const fiveYearProjections: YearProjection[] = [];

  // Year 0 Cash Outflow: Upfront Capital Expenditure
  const cashFlows: number[] = [-adjustedOneTimeDev];

  let cumulativeNet = 0;
  let cumulativeDiscounted = -adjustedOneTimeDev;

  for (let yr = 1; yr <= 5; yr++) {
    // Model adoption & scaling curves across 5 years
    let yrAdoption = effectiveAdoption;
    let costGrowth = 1.0;
    let benefitGrowth = 1.0;

    if (yr === 1) {
      yrAdoption = Math.round(effectiveAdoption);
      costGrowth = 1.0;
      benefitGrowth = 1.0;
    } else if (yr === 2) {
      yrAdoption = Math.min(100, Math.round(effectiveAdoption * 1.08));
      costGrowth = 1.05;
      benefitGrowth = (yrAdoption / effectiveAdoption) * 1.06;
    } else if (yr === 3) {
      yrAdoption = Math.min(100, Math.round(effectiveAdoption * 1.14));
      costGrowth = 1.08;
      benefitGrowth = (yrAdoption / effectiveAdoption) * 1.12;
    } else if (yr === 4) {
      yrAdoption = Math.min(100, Math.round(effectiveAdoption * 1.18));
      costGrowth = 1.11;
      benefitGrowth = (yrAdoption / effectiveAdoption) * 1.16;
    } else {
      yrAdoption = Math.min(100, Math.round(effectiveAdoption * 1.2));
      costGrowth = 1.14;
      benefitGrowth = (yrAdoption / effectiveAdoption) * 1.2;
    }

    const yrCosts = Math.round(
      (yr === 1 ? totalFirstYearCost : totalOngoingAnnualCost * costGrowth)
    );
    const yrOngoingCosts = Math.round(totalOngoingAnnualCost * costGrowth);
    const yrBenefits = Math.round(totalAnnualBenefit * benefitGrowth);
    const yrNetValue = yrBenefits - (yr === 1 ? totalFirstYearCost : yrOngoingCosts);

    cumulativeNet += yrNetValue;

    // Operating cash flow for year yr = benefits - ongoing expenses
    const netCashFlowForYr = yrBenefits - yrOngoingCosts;
    cashFlows.push(netCashFlowForYr);

    // Discounted cash flow
    const discountedCashFlow = Math.round(netCashFlowForYr / Math.pow(1 + discountRate, yr));
    cumulativeDiscounted += discountedCashFlow;

    const yrRoi =
      yrCosts > 0 ? Math.round(((yrBenefits - yrCosts) / yrCosts) * 100) : 0;

    fiveYearProjections.push({
      year: yr,
      costs: yrCosts,
      benefits: yrBenefits,
      netValue: yrNetValue,
      cumulativeNetValue: cumulativeNet,
      roi: yrRoi,
      effectiveAdoptionRate: yrAdoption,
      discountedCashFlow,
      cumulativeDiscountedValue: cumulativeDiscounted,
    });
  }

  // 6. Net Present Value (NPV) & Internal Rate of Return (IRR) (Page 3 from PDF)
  // NPV = discounted cash flows - initial dev cost
  const npv = Math.round(cumulativeDiscounted);
  const irr = calculateIrr(cashFlows);

  // 7. Full 5-Year Total Cost of Ownership (TCO) (Page 4 from PDF)
  const fiveYearOngoingCosts = fiveYearProjections.reduce((sum, p, idx) => {
    if (idx === 0) return sum + totalOngoingAnnualCost;
    return sum + p.costs;
  }, 0);
  const fiveYearTco = adjustedOneTimeDev + fiveYearOngoingCosts;

  // 8. P&L Statement Impact & Operating Leverage (Pages 6 & 7 from PDF)
  const postAiRevenue = companyRevenue + adjustedRevenueUplift;
  const baselineGrossProfit = companyRevenue * (baselineGrossMarginPct / 100);
  const baselineCogs = companyRevenue - baselineGrossProfit;

  // If customer-facing AI or new product, token costs hit COGS; otherwise OpEx
  const isCustomerDelivery =
    technologyMove === "new_product" || technologyMove === "product_improvement";

  const aiCogs = isCustomerDelivery ? annualTokens + adjustedInfra : 0;
  const postAiCogs = baselineCogs + aiCogs;
  const postAiGrossProfit = postAiRevenue - postAiCogs;
  const postAiGrossMarginPct = Number(
    ((postAiGrossProfit / postAiRevenue) * 100).toFixed(2)
  );
  const grossMarginDeltaBps = Math.round(
    (postAiGrossMarginPct - baselineGrossMarginPct) * 100
  );

  const baselineOperatingIncome = companyRevenue * (baselineOperatingMarginPct / 100);
  const baselineOpEx = baselineGrossProfit - baselineOperatingIncome;

  // Operating efficiency release (direct productivity + quality reduction)
  const operatingEfficiencyBenefit = directProductivity + qualityImprovement;
  const aiOpEx = isCustomerDelivery
    ? adjustedMaintenance + annualAmortization
    : annualTokens + adjustedInfra + adjustedMaintenance + annualAmortization;

  const netOpExReduction = operatingEfficiencyBenefit - aiOpEx;
  const postAiOpEx = Math.max(0, baselineOpEx - netOpExReduction);
  const postAiOperatingIncome = postAiGrossProfit - postAiOpEx;
  const postAiOperatingMarginPct = Number(
    ((postAiOperatingIncome / postAiRevenue) * 100).toFixed(2)
  );
  const operatingMarginDeltaBps = Math.round(
    (postAiOperatingMarginPct - baselineOperatingMarginPct) * 100
  );
  const ebitdaImpact = Math.round(postAiOperatingIncome - baselineOperatingIncome + annualAmortization);

  // 9. Unit Economics (Page 8 from PDF)
  const unitCostPerQuery =
    totalAnnualQueries > 0
      ? Number(((annualTokens + adjustedInfra) / totalAnnualQueries).toFixed(4))
      : 0;

  const monthlyNetValuePerSeat =
    teamSize > 0
      ? Math.round((totalAnnualBenefit - totalOngoingAnnualCost) / (teamSize * 12))
      : 0;

  const financialFluency: FinancialFluencyResults = {
    npv,
    irr,
    fiveYearTco,
    capexVsOpex: {
      capitalizedDev: capexAmount,
      annualAmortization,
      annualOpex: opexAnnualAmount,
      year1CashFlowImpact: totalFirstYearCost,
    },
    arrImpact: adjustedRevenueUplift,
    plImpact: {
      baselineRevenue: companyRevenue,
      postAiRevenue,
      baselineGrossProfit: Math.round(baselineGrossProfit),
      postAiGrossProfit: Math.round(postAiGrossProfit),
      baselineGrossMarginPct,
      postAiGrossMarginPct,
      grossMarginDeltaBps,
      baselineOperatingIncome: Math.round(baselineOperatingIncome),
      postAiOperatingIncome: Math.round(postAiOperatingIncome),
      baselineOperatingMarginPct,
      postAiOperatingMarginPct,
      operatingMarginDeltaBps,
      ebitdaImpact,
    },
    unitEconomics: {
      costPerQuery: unitCostPerQuery,
      annualCostPerSeat,
      annualValuePerSeat,
      monthlyNetValuePerSeat,
      queryVolumeAnnual: Math.round(totalAnnualQueries),
    },
  };

  return {
    benefits: {
      directProductivity,
      qualityImprovement,
      innovationVelocity,
      learningUpskilling,
      retentionWellbeing,
      totalAnnualBenefit,
    },
    costs: {
      oneTimeDev: adjustedOneTimeDev,
      annualTokens,
      annualInfra: adjustedInfra,
      annualMaintenance: adjustedMaintenance,
      totalFirstYearCost,
      totalOngoingAnnualCost,
      capexAmount,
      annualAmortization,
      opexAnnualAmount,
    },
    firstYearNetValue,
    firstYearNetRoi,
    paybackPeriodMonths,
    annualHoursSaved,
    fteEquivalent,
    costToValueRatio,
    annualCostPerSeat,
    annualValuePerSeat,
    financialFluency,
    timeline,
    fiveYearProjections,
  };
}
