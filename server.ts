import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Executive briefing endpoint using Gemini
  app.post("/api/generate-briefing", async (req, res) => {
    try {
      const {
        featureName,
        industry,
        teamSize,
        hourlyRate,
        hoursSavedPerWeek,
        adoptionRate,
        scenario,
        technologyMove,
        npv,
        irr,
        fiveYearTco,
        arrImpact,
        grossMarginDeltaBps,
        operatingMarginDeltaBps,
        ebitdaImpact,
        totalNetValueYr1,
        netRoiYr1,
        paybackMonths,
        hoursSavedYr1,
        fteEquiv,
        costToValueRatio,
        costs,
        benefits,
      } = req.body;

      const ai = getAiClient();

      if (!ai) {
        // Fallback structured briefing if no GEMINI_API_KEY is currently provided in env
        const fallbackNarrative = `### Executive Investment Memorandum: ${featureName || "AI Strategic Initiative"}
**Framework:** Executive Financial Fluency for Product & Technology Leaders
**Recommendation:** **PROCEED WITH PHASE 1 INVESTMENT** under **${scenario?.toUpperCase()}** scenario parameters.

#### 1. Strategic Alignment & Economic Mechanism
This initiative models the **${technologyMove || "AI-First Workflow"}** pattern within the **${industry}** sector. Rather than treating AI as an experimental sandbox, this project delivers tangible operating leverage across **${teamSize} seats**. The operational mechanism releases **${(hoursSavedYr1 || 0).toLocaleString()} hours** of productive capacity annually (equivalent to **${fteEquiv} Full-Time Personnel**), while improving quality and defect deflection.

#### 2. Capital Allocation & Two Financial Lenses
##### Lens A: Cost & Capital Discipline
- **Net Present Value (NPV):** **$${(npv || 0).toLocaleString()}** (Discounted at corporate hurdle rate over 5 years).
- **Internal Rate of Return (IRR):** **${irr || 0}%** (Substantially exceeds corporate cost of capital).
- **First-Year Net ROI:** **${netRoiYr1}%** with a **${paybackMonths}-month break-even payback**.
- **5-Year Full Lifecycle TCO:** **$${(fiveYearTco || 0).toLocaleString()}** covering upfront build, inference tokens, vector infrastructure, and governance.
- **Cost-to-Value Ratio:** **1 : $${costToValueRatio}** multiplier.

##### Lens B: Value Creation, Scale & Operating Leverage
- **ARR / Contracted Revenue Impact:** **+$${(arrImpact || 0).toLocaleString()}** in top-line expansion.
- **Gross Margin Delta:** **+${grossMarginDeltaBps || 0} bps** delivery scalability.
- **Operating Margin (EBIT) Expansion:** **+${operatingMarginDeltaBps || 0} bps** operating leverage.
- **Annual EBITDA Contribution:** **+$${(ebitdaImpact || 0).toLocaleString()}**.

#### 3. 5-Stream Value Realization Breakdown
1. **Direct Productivity ($${(benefits?.directProductivity || 0).toLocaleString()}):** Routine workflow velocity & cycle time compression.
2. **Quality & Error Reduction ($${(benefits?.qualityImprovement || 0).toLocaleString()}):** Defect escape prevention and QA automation.
3. **Innovation Velocity ($${(benefits?.innovationVelocity || 0).toLocaleString()}):** Reinvestment of unlocked hours into core roadmap delivery and ARR expansion.
4. **Knowledge & Learning ($${(benefits?.learningUpskilling || 0).toLocaleString()}):** Accelerated onboarding and decentralized contextual knowledge.
5. **Wellbeing & Retention ($${(benefits?.retentionWellbeing || 0).toLocaleString()}):** Cognitive burnout relief and reduced turnover risk.

#### 4. Accounting & FinOps Governance (ASC 350-40)
- **CapEx vs. OpEx:** Upfront build costs are capitalizable as internal-use software assets and amortized straight-line over 3 years, dampening period P&L volatility.
- **FinOps Guardrails:** Per-seat query quota ceilings, vector caching, and continuous evaluation harness to contain monthly model inference.`;

        return res.json({ briefing: fallbackNarrative });
      }

      const prompt = `You are a Chief Financial Officer and Principal AI Product Strategist applying the "Executive Financial Fluency for Product & Technology Leaders" framework. Generate an executive investment memorandum for the CEO, CFO, and Board.

Initiative Context:
- Initiative / Feature: ${featureName || "AI Feature Deployment"}
- Strategic Technology Move: ${technologyMove || "AI-First Workflows"}
- Industry Sector: ${industry}
- Impacted Workforce / Seats: ${teamSize} members
- Blended Hourly Labor Rate: $${hourlyRate}/hr
- Weekly Hours Saved / Seat: ${hoursSavedPerWeek} hrs/wk
- Target Adoption Rate: ${adoptionRate}%
- Evaluated Scenario: ${scenario}

Financial Fluency Metrics:
- Net Present Value (NPV): $${(npv || 0).toLocaleString()}
- Internal Rate of Return (IRR): ${irr || 0}%
- 5-Year Lifecycle TCO: $${(fiveYearTco || 0).toLocaleString()}
- First-Year Net ROI: ${netRoiYr1}%
- Break-Even Payback Period: ${paybackMonths} months
- Year 1 Net Value: $${(totalNetValueYr1 || 0).toLocaleString()}
- Unlocked Productive Hours: ${(hoursSavedYr1 || 0).toLocaleString()} hours (≈ ${fteEquiv} FTEs)
- Cost-to-Value Multiplier: 1 : $${costToValueRatio}
- Top-Line ARR Impact: +$${(arrImpact || 0).toLocaleString()}
- Gross Margin Delta: +${grossMarginDeltaBps || 0} bps
- Operating Margin Delta: +${operatingMarginDeltaBps || 0} bps
- EBITDA Operating Leverage: +$${(ebitdaImpact || 0).toLocaleString()}
- 5-Stream Benefits:
  * Direct Productivity: $${(benefits?.directProductivity || 0).toLocaleString()}
  * Quality & Defect Red.: $${(benefits?.qualityImprovement || 0).toLocaleString()}
  * Innovation Velocity: $${(benefits?.innovationVelocity || 0).toLocaleString()}
  * Learning & Knowledge: $${(benefits?.learningUpskilling || 0).toLocaleString()}
  * Talent Retention & Wellbeing: $${(benefits?.retentionWellbeing || 0).toLocaleString()}

Write a professional, quantitative, executive-ready memorandum in clean Markdown addressing:
1. Executive Recommendation (Decisive GO/NO-GO recommendation grounded in the numbers)
2. The Two Financial Lenses (Cost & Capital Discipline: NPV, IRR, 5-Yr TCO; and Value Creation & Scale: ARR, Gross/Operating Margin expansion, EBITDA leverage)
3. Operational Mechanism & Capacity Unlocked (How labor savings translate to financial returns without generic claims)
4. Accounting Treatment & FinOps Governance (CapEx capitalization vs. recurring OpEx, model rate limiting, vector hosting)
5. Evidence Gate Milestones (Phase-gate criteria before full scale).

Maintain strict professional rigor. Avoid empty AI hype or buzzwords.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.35,
        },
      });

      return res.json({ briefing: response.text });
    } catch (err: unknown) {
      console.error("Gemini briefing generation error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to generate briefing";
      return res.status(500).json({ error: message });
    }
  });

  // On-demand Use Case Research & ROI Generator endpoint using Gemini + Google Search Grounding
  app.post("/api/research-use-case", async (req, res) => {
    try {
      const { query, industryHint, scaleHint, enableWebSearch = true } = req.body;

      if (!query || typeof query !== "string" || query.trim().length === 0) {
        return res.status(400).json({ error: "Query is required" });
      }

      const trimmedQuery = query.trim();
      const ai = getAiClient();

      if (ai) {
        const prompt = `You are a Principal AI Solutions Architect and Enterprise FinOps CFO applying the "Executive Financial Fluency" ROI framework.
Conduct quantitative research to generate a comprehensive, highly realistic financial ROI model for a newly proposed AI feature on demand.

Use Case / Feature Requested: "${trimmedQuery}"
Industry / Domain Hint: "${industryHint || "Auto-detect from use case"}"
Target Scale: "${scaleHint || "Mid-to-Large Enterprise (100-500 impacted seats)"}"

Analyze industry benchmarks for:
1. Impacted roles, blended fully loaded hourly rate ($/hr).
2. Weekly routine hours saved per seat via cognitive workflow automation.
3. Realistic adoption ramp, team seat size.
4. Upfront capitalizable software development cost (ASC 350-40 CapEx).
5. Monthly inference query volume, average tokens (prompt + output), and blended token pricing.
6. Annual infrastructure (vector DB, embeddings, caching, monitoring) and maintenance.
7. Top-line revenue expansion or customer retention uplift.
8. 5 value stream percentage weights (directProductivity, qualityImprovement, innovationVelocity, learningUpskilling, retentionWellbeing - must sum to 100).
9. Quantified business outcome, pilot sprint evidence gate, and executive sponsor title.

You MUST respond strictly with a valid JSON object wrapped inside a \`\`\`json code block. Do NOT include commentary outside the JSON block.

JSON Schema:
{
  "featureName": "Clear professional name for this AI feature",
  "industryId": "one of: customer_support_bpo | software_saas | fintech_banking | healthcare_pharma | manufacturing_supply | legal_tech | ecommerce_retail | professional_services | it_managed_services",
  "technologyMove": "one of: ai_workflows | modernization | product_improvement | platform_scale | new_product",
  "architectureType": "one of: rag_agent | llm_copilot | fine_tuned | autonomous_workflow",
  "description": "1-2 sentence executive overview of what this AI capability performs",
  "teamSize": number (e.g. 20 - 450),
  "hourlyRate": number (e.g. 40 - 150),
  "hoursSavedPerWeek": number (e.g. 3.0 - 12.0),
  "adoptionRate": number (e.g. 60 - 90),
  "annualRevenueUplift": number (e.g. 50000 - 1500000),
  "retentionUpliftPct": number (e.g. 1.0 - 6.0),
  "oneTimeDevCost": number (e.g. 50000 - 400000),
  "capexPercentage": number (e.g. 65 - 80),
  "monthlyQueriesPerUser": number (e.g. 150 - 1200),
  "avgTokensPerQuery": number (e.g. 1500 - 6500),
  "tokenCostPerMillion": number (e.g. 0.40 - 3.50),
  "annualInfraCost": number (e.g. 10000 - 60000),
  "annualMaintenanceCost": number (e.g. 12000 - 80000),
  "companyRevenue": number (e.g. 10000000 - 150000000),
  "baselineGrossMarginPct": number (e.g. 60 - 80),
  "baselineOperatingMarginPct": number (e.g. 15 - 28),
  "discountRatePct": number (e.g. 10 - 12),
  "businessOutcome": "Specific measurable business outcome (e.g. reduce case turnaround by 35%...)",
  "evidenceGate": "Specific pilot sprint verification gate (e.g. pilot with 20 analysts achieving 92% accuracy...)",
  "executiveOwner": "Title of executive owner (e.g. Chief Operating Officer, VP Engineering)",
  "streamWeights": {
    "directProductivity": number (e.g. 40),
    "qualityImprovement": number (e.g. 25),
    "innovationVelocity": number (e.g. 15),
    "learningUpskilling": number (e.g. 10),
    "retentionWellbeing": number (e.g. 10)
  },
  "researchSynthesis": "2-3 sentences explaining the web-grounded economic rationale and labor economics",
  "sources": [
    { "title": "string", "uri": "string" }
  ]
}`;

        try {
          const config: Record<string, unknown> = {
            temperature: 0.2,
          };

          if (enableWebSearch) {
            config.tools = [{ googleSearch: {} }];
          }

          const geminiResponse = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config,
          });

          const rawText = geminiResponse.text || "";
          const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawText.match(/(\{[\s\S]*\})/);
          const jsonStr = jsonMatch ? jsonMatch[1] : rawText;
          const parsed = JSON.parse(jsonStr);

          // Extract grounding metadata if search was used
          const groundingChunks = geminiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
          const webSources: Array<{ title: string; uri: string }> = [];
          if (Array.isArray(groundingChunks)) {
            for (const chunk of groundingChunks) {
              const web = (chunk as { web?: { title?: string; uri?: string } }).web;
              if (web?.uri) {
                webSources.push({
                  title: web.title || "Industry Research Reference",
                  uri: web.uri,
                });
              }
            }
          }

          if (webSources.length > 0) {
            const existing = Array.isArray(parsed.sources) ? parsed.sources : [];
            parsed.sources = [...existing, ...webSources].slice(0, 6);
          }

          return res.json({ success: true, useCase: parsed, source: "gemini-search-grounded" });
        } catch (apiErr) {
          console.warn("Gemini API call failed, falling back to heuristic engine:", apiErr);
          // Fall through to fallback
        }
      }

      // Heuristic on-demand generator fallback if GEMINI_API_KEY is not set or network call failed
      const fallbackUseCase = buildHeuristicUseCase(trimmedQuery, industryHint, scaleHint);
      return res.json({ success: true, useCase: fallbackUseCase, source: "domain-heuristic-engine" });
    } catch (err: unknown) {
      console.error("Research use-case error:", err);
      const message = err instanceof Error ? err.message : "Failed to research use case";
      return res.status(500).json({ error: message });
    }
  });

  // Dedicated Dynamic Web-Search Endpoint for Evaluation & Guardrails Governance
  app.post("/api/research-guardrails", async (req, res) => {
    try {
      const { featureName, industryId, architectureType } = req.body;
      const targetFeature = (featureName || "AI Feature").trim();
      const targetIndustry = (industryId || "software_saas").trim();
      const targetArch = (architectureType || "rag_agent").trim();

      const ai = getAiClient();

      if (ai) {
        const prompt = `You are a Principal AI Safety Architect and Lead RAG Evaluation Engineer.
Perform live web search research to formulate the comprehensive Evaluation and Guardrail Governance specifications for this specific enterprise AI project.

Project Name: "${targetFeature}"
Industry/Sector: "${targetIndustry}"
Architecture: "${targetArch}"

Based on the Top 8 AI Agent Guardrails and Enterprise RAG Evaluation Frameworks, formulate the project-specific governance specs:
1. Industry regulatory/compliance standards applicable to this project (e.g. HIPAA, PCI-DSS, GDPR, EU AI Act High-Risk, SOC2 Type II, FINRA, FDA SaMD).
2. Exact sensitive data entities to classify and redact in real time (PII/PHI/PCI/Confidential).
3. Tool allowlist: approved safe tools vs strictly blocked/disallowed tools for this use-case.
4. Human-in-the-Loop (HITL) approval threshold (exact dollar threshold, clinical action, or critical irreversible operation requiring human signoff).
5. Recommended autonomy level: Assist (L1), Bounded (L2), Conditional (L3), or Full (L4).
6. Recommended canonical golden evaluation benchmark dataset for this domain (e.g. PubMedQA, FinQA, LegalBench, SWE-bench, etc.).
7. Target RAG stage performance SLAs:
   - Retrieval Recall@K (e.g. "95.0%")
   - Retrieval MRR (e.g. "0.89")
   - Context Precision (e.g. "93.0%")
   - Faithfulness (e.g. "98.0%")
   - Maximum Hallucination Rate (e.g. "<1.5%")
   - P95 Latency (e.g. "1.2s")
8. Synthesized 2-sentence summary of live web-grounded regulatory & safety findings for this specific application.

Respond strictly with valid JSON inside a \`\`\`json block.
Schema:
{
  "industryStandards": ["string"],
  "sensitiveDataEntities": ["string"],
  "toolAllowlistApproved": ["string"],
  "toolAllowlistBlocked": ["string"],
  "hitlApprovalThreshold": "string",
  "autonomyLevel": "Assist" | "Bounded" | "Conditional" | "Full",
  "goldenBenchmarkDataset": "string",
  "ragStageTargets": {
    "retrievalRecall": "string",
    "retrievalMRR": "string",
    "contextPrecision": "string",
    "faithfulness": "string",
    "hallucinationRateMax": "string",
    "latencyP95": "string"
  },
  "liveWebFindings": "string",
  "webSources": [
    { "title": "string", "uri": "string" }
  ]
}`;

        try {
          const geminiResponse = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              temperature: 0.2,
              tools: [{ googleSearch: {} }],
            },
          });

          const rawText = geminiResponse.text || "";
          const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawText.match(/(\{[\s\S]*\})/);
          const jsonStr = jsonMatch ? jsonMatch[1] : rawText;
          const parsed = JSON.parse(jsonStr);

          // Extract grounding metadata if available
          const groundingChunks = geminiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
          const webSources: Array<{ title: string; uri: string }> = [];
          if (Array.isArray(groundingChunks)) {
            for (const chunk of groundingChunks) {
              const web = (chunk as { web?: { title?: string; uri?: string } }).web;
              if (web?.uri) {
                webSources.push({
                  title: web.title || "Industry Safety Benchmark",
                  uri: web.uri,
                });
              }
            }
          }

          if (webSources.length > 0) {
            const existing = Array.isArray(parsed.webSources) ? parsed.webSources : [];
            parsed.webSources = [...existing, ...webSources].slice(0, 6);
          }

          return res.json({
            success: true,
            guardrailsEvalSpecs: parsed,
            source: "gemini-search-grounded",
          });
        } catch (apiErr) {
          console.warn("Gemini guardrails research failed, using heuristic engine:", apiErr);
        }
      }

      // Fallback domain-tuned guardrails
      const fallbackSpecs = buildHeuristicGuardrails(targetFeature, targetIndustry, targetArch);
      return res.json({
        success: true,
        guardrailsEvalSpecs: fallbackSpecs,
        source: "domain-heuristic-engine",
      });
    } catch (err: unknown) {
      console.error("Research guardrails error:", err);
      const message = err instanceof Error ? err.message : "Failed to research guardrails";
      return res.status(500).json({ error: message });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

// Heuristic domain synthesizer fallback
function buildHeuristicUseCase(query: string, industryHint?: string, scaleHint?: string) {
  const q = (query + " " + (industryHint || "")).toLowerCase();

  let industryId = "software_saas";
  let techMove: "ai_workflows" | "modernization" | "product_improvement" | "platform_scale" | "new_product" = "ai_workflows";
  let archType: "rag_agent" | "llm_copilot" | "fine_tuned" | "autonomous_workflow" = "rag_agent";
  let hourlyRate = 65;
  let teamSize = 75;
  let hoursSavedPerWeek = 5.5;
  let oneTimeDevCost = 140000;
  let queriesPerUser = 450;
  let tokensPerQuery = 3200;
  let tokenCostPerM = 1.25;
  let infraCost = 28000;
  let maintCost = 35000;
  let annualRevUplift = 280000;
  let streamWeights = {
    directProductivity: 40,
    qualityImprovement: 25,
    innovationVelocity: 15,
    learningUpskilling: 10,
    retentionWellbeing: 10,
  };
  let outcome = "Compress cycle time by 40% and automate repetitive manual toil.";
  let gate = "Pilot sprint achieves >85% task completion rate and <1.2s response latency.";
  let owner = "VP of Product & Engineering";

  if (q.includes("health") || q.includes("clinic") || q.includes("medic") || q.includes("patient") || q.includes("pharma") || q.includes("doctor")) {
    industryId = "healthcare_pharma";
    techMove = "ai_workflows";
    archType = "rag_agent";
    hourlyRate = 95;
    teamSize = 120;
    hoursSavedPerWeek = 6.0;
    oneTimeDevCost = 220000;
    infraCost = 45000;
    maintCost = 50000;
    annualRevUplift = 450000;
    streamWeights = { directProductivity: 35, qualityImprovement: 35, innovationVelocity: 10, learningUpskilling: 10, retentionWellbeing: 10 };
    outcome = "Automate clinical documentation and triage audit prep, eliminating 6 hours/clinician/week.";
    gate = "Clinical documentation audit achieves 99.1% factual grounding with zero HIPAA compliance breaches.";
    owner = "Chief Medical Information Officer (CMIO)";
  } else if (q.includes("law") || q.includes("legal") || q.includes("contract") || q.includes("compliance") || q.includes("attorney")) {
    industryId = "legal_tech";
    techMove = "ai_workflows";
    archType = "rag_agent";
    hourlyRate = 125;
    teamSize = 45;
    hoursSavedPerWeek = 7.5;
    oneTimeDevCost = 160000;
    infraCost = 32000;
    maintCost = 38000;
    annualRevUplift = 350000;
    streamWeights = { directProductivity: 35, qualityImprovement: 35, innovationVelocity: 15, learningUpskilling: 10, retentionWellbeing: 5 };
    outcome = "Cut contract review turnaround time from 72 hours to 6 hours while maintaining strict clause governance.";
    gate = "Redline benchmark test across 100 historical MSAs achieves 96% risk identification recall.";
    owner = "General Counsel & Head of Legal Operations";
  } else if (q.includes("bank") || q.includes("finan") || q.includes("credit") || q.includes("loan") || q.includes("underwrit") || q.includes("trading") || q.includes("wealth") || q.includes("fraud")) {
    industryId = "fintech_banking";
    techMove = "ai_workflows";
    archType = "rag_agent";
    hourlyRate = 90;
    teamSize = 85;
    hoursSavedPerWeek = 5.0;
    oneTimeDevCost = 240000;
    infraCost = 52000;
    maintCost = 60000;
    annualRevUplift = 650000;
    streamWeights = { directProductivity: 30, qualityImprovement: 30, innovationVelocity: 20, learningUpskilling: 10, retentionWellbeing: 10 };
    outcome = "Automate regulatory checks and memo synthesis, lifting credit evaluation capacity by 2.5x.";
    gate = "Model risk governance approval under OCC/Fed guidance with <0.02% false positive escalation.";
    owner = "Chief Risk Officer & Head of Lending";
  } else if (q.includes("support") || q.includes("service") || q.includes("call") || q.includes("ticket") || q.includes("agent") || q.includes("bpo") || q.includes("helpdesk")) {
    industryId = "customer_support_bpo";
    techMove = "ai_workflows";
    archType = "autonomous_workflow";
    hourlyRate = 38;
    teamSize = 250;
    hoursSavedPerWeek = 8.5;
    oneTimeDevCost = 110000;
    queriesPerUser = 900;
    tokensPerQuery = 2400;
    infraCost = 24000;
    maintCost = 30000;
    annualRevUplift = 320000;
    streamWeights = { directProductivity: 45, qualityImprovement: 25, innovationVelocity: 10, learningUpskilling: 10, retentionWellbeing: 10 };
    outcome = "Deflect 45% of tier-1 customer inquiries autonomously, lowering average handling time from 14m to 3m.";
    gate = "Shadow mode testing across 5,000 inbound tickets achieves >90% CSAT score parity with human agents.";
    owner = "VP of Customer Experience & Operations";
  } else if (q.includes("retail") || q.includes("ecommerce") || q.includes("shop") || q.includes("catalog") || q.includes("order")) {
    industryId = "ecommerce_retail";
    techMove = "product_improvement";
    archType = "llm_copilot";
    hourlyRate = 50;
    teamSize = 90;
    hoursSavedPerWeek = 6.0;
    oneTimeDevCost = 130000;
    annualRevUplift = 520000;
    streamWeights = { directProductivity: 30, qualityImprovement: 20, innovationVelocity: 30, learningUpskilling: 10, retentionWellbeing: 10 };
    outcome = "Deliver personalized AI recommendations and automated merchandising, lifting conversion by 14%.";
    gate = "A/B test across 50,000 active shoppers confirms statistically significant +8% gross basket size.";
    owner = "Chief Commercial Officer & VP Digital";
  } else if (q.includes("manufactur") || q.includes("factory") || q.includes("supply") || q.includes("logistics") || q.includes("inventory")) {
    industryId = "manufacturing_supply";
    techMove = "platform_scale";
    archType = "rag_agent";
    hourlyRate = 60;
    teamSize = 110;
    hoursSavedPerWeek = 5.0;
    oneTimeDevCost = 180000;
    infraCost = 38000;
    maintCost = 42000;
    annualRevUplift = 420000;
    streamWeights = { directProductivity: 40, qualityImprovement: 30, innovationVelocity: 15, learningUpskilling: 10, retentionWellbeing: 5 };
    outcome = "Predict supply chain bottlenecks and automate supplier PO reconciliations, cutting expedite fees by 60%.";
    gate = "Validation on 12 months historical telemetry achieves 94% anomaly detection accuracy 48 hours prior to outage.";
    owner = "VP of Supply Chain & Global Operations";
  }

  // Adjust for scale hint if provided
  if (scaleHint && scaleHint.toLowerCase().includes("large")) {
    teamSize = Math.round(teamSize * 2.2);
    oneTimeDevCost = Math.round(oneTimeDevCost * 1.5);
    infraCost = Math.round(infraCost * 1.6);
    annualRevUplift = Math.round(annualRevUplift * 2.0);
  } else if (scaleHint && scaleHint.toLowerCase().includes("small")) {
    teamSize = Math.max(15, Math.round(teamSize * 0.4));
    oneTimeDevCost = Math.round(oneTimeDevCost * 0.6);
    infraCost = Math.round(infraCost * 0.5);
    annualRevUplift = Math.round(annualRevUplift * 0.4);
  }

  return {
    featureName: query.length > 50 ? query.substring(0, 47) + "..." : query,
    industryId,
    technologyMove: techMove,
    architectureType: archType,
    description: `AI-enabled system purpose-built for ${query}, transforming operational bottlenecks into automated cognitive workflows.`,
    teamSize,
    hourlyRate,
    hoursSavedPerWeek,
    adoptionRate: 75,
    annualRevenueUplift: annualRevUplift,
    retentionUpliftPct: 2.8,
    oneTimeDevCost,
    capexPercentage: 70,
    monthlyQueriesPerUser: queriesPerUser,
    avgTokensPerQuery: tokensPerQuery,
    tokenCostPerMillion: tokenCostPerM,
    annualInfraCost: infraCost,
    annualMaintenanceCost: maintCost,
    companyRevenue: 25000000,
    baselineGrossMarginPct: 70,
    baselineOperatingMarginPct: 20,
    discountRatePct: 10,
    businessOutcome: outcome,
    evidenceGate: gate,
    executiveOwner: owner,
    streamWeights,
    researchSynthesis: `Benchmarked against comparable enterprise deployments. Models ${teamSize} impacted users saving ${hoursSavedPerWeek} hrs/wk at $${hourlyRate}/hr blended wage, balancing CapEx build vs. recurring cloud FinOps.`,
    sources: [
      { title: "Enterprise AI Adoption & Labor Productivity Benchmarks", uri: "https://www.gartner.com" },
      { title: "Generative AI FinOps & Token Economics Guide", uri: "https://cloud.google.com" },
    ],
  };
}

// Heuristic fallback for Evaluation & Guardrails Governance
function buildHeuristicGuardrails(featureName: string, industryId?: string, archType?: string) {
  const ind = (industryId || "").toLowerCase();
  const name = (featureName || "").toLowerCase();

  let standards = ["SOC 2 Type II", "NIST AI RMF 1.0", "ISO/IEC 42001 (AI Governance)"];
  let sensitive = ["Employee IDs", "Customer PII (Email, Phone)", "Internal API Keys", "Unreleased Financials"];
  let approvedTools = ["Read-Only Knowledge Retrieval API", "Vector Semantic Index", "Structured JSON Schema Validator"];
  let blockedTools = ["Direct Shell / Bash Execution", "Raw SQL Schema Mutation / Drop", "Unauthenticated SMTP / Webhooks"];
  let hitl = "Actions exceeding $5,000 financial impact, sensitive data export, or legal commitment require direct Human Approval.";
  let autonomy: "Assist" | "Bounded" | "Conditional" | "Full" = "Bounded";
  let benchmark = "Enterprise General Benchmark & Golden Curated Dataset (1,500 QA pairs)";
  let targets = {
    retrievalRecall: "94.5%",
    retrievalMRR: "0.88",
    contextPrecision: "92.0%",
    faithfulness: "97.5%",
    hallucinationRateMax: "<1.5%",
    latencyP95: "1.4s",
  };
  let summary = `Production deployment for ${featureName} requires rigorous least-privilege RBAC token partitioning, pre-inference PII masking, and strict allowlisted tool execution with automated rollback safeguards.`;

  if (ind.includes("health") || name.includes("clinic") || name.includes("medic") || name.includes("patient")) {
    standards = ["HIPAA Security & Privacy Rule", "FDA SaMD Guidance", "HITECH Act", "NIST AI RMF"];
    sensitive = ["Protected Health Information (PHI)", "Patient Medical Record # (MRN)", "ICD-10/CPT Diagnostics", "Physician NPI", "SSN"];
    approvedTools = ["EHR Read-Only Fast Healthcare Interoperability Resources (FHIR) API", "RxNorm Drug Interaction Verifier", "Medical Terminology Ontology"];
    blockedTools = ["Direct Prescription Dispensation Write", "Unattended Clinical Diagnosis Mutation", "Unencrypted S3 Export"];
    hitl = "All clinical note exports, dosage changes, and triage recommendations require credentialed Physician / Clinician sign-off.";
    autonomy = "Assist";
    benchmark = "PubMedQA & MedQA Verified Golden Clinical Ground Truth Corpus";
    targets = {
      retrievalRecall: "98.2%",
      retrievalMRR: "0.95",
      contextPrecision: "96.5%",
      faithfulness: "99.4%",
      hallucinationRateMax: "<0.4%",
      latencyP95: "1.1s",
    };
    summary = `Healthcare and clinical deployments enforce zero-hallucination tolerance (<0.4%) with real-time Presidio PHI de-identification and mandatory dual-clinician sign-off.`;
  } else if (ind.includes("fintech") || ind.includes("bank") || name.includes("claim") || name.includes("fraud") || name.includes("loan")) {
    standards = ["FINRA Rule 2210", "SEC Rule 206(4)-7", "PCI-DSS Level 1", "GLBA Privacy Framework", "EU AI Act High-Risk"];
    sensitive = ["Primary Account Numbers (PAN / Credit Cards)", "Bank Routing & Account Numbers", "Taxpayer ID / SSN", "Credit Scores / FICO"];
    approvedTools = ["Core Ledger Read-Only API", "Fraud Risk Scoring Engine", "OFAC Sanctions & AML Screening API"];
    blockedTools = ["Unsupervised Wire Transfer Initiation", "Direct Credit Limit Modification", "Bypass 2FA / Authentication APIs"];
    hitl = "Disbursements or settlement offers over $2,500 and automated loan denial decisions require Human Underwriter signoff.";
    autonomy = "Conditional";
    benchmark = "FinQA & SEC-10K Financial Dialectic Reasoning Golden Corpus";
    targets = {
      retrievalRecall: "96.8%",
      retrievalMRR: "0.92",
      contextPrecision: "94.5%",
      faithfulness: "98.8%",
      hallucinationRateMax: "<0.8%",
      latencyP95: "1.2s",
    };
    summary = `Financial services governance enforces deterministic calculation checks, PCI-DSS token isolation, and automated supervisory oversight with human-in-the-loop gates.`;
  } else if (ind.includes("legal") || name.includes("contract") || name.includes("law") || name.includes("compliance")) {
    standards = ["ABA Model Rules of Professional Conduct (Rule 1.1/1.6)", "GDPR Art 22", "SOC 2 Type II Confidentiality"];
    sensitive = ["Privileged Attorney-Client Communications", "Material Non-Public Information (MNPI)", "Trade Secrets", "Signatory Identities"];
    approvedTools = ["DocuSign / Ironclad Contract Ingestion API", "Statutory Code Citation Cross-Referencer", "Clause Deviation Diff Engine"];
    blockedTools = ["Direct Signature Execution without Counsel", "Public Webhook Broadcast", "External LLM Training Logging"];
    hitl = "All material indemnification deviations, liability cap overrides, and court filing submissions require Partner / General Counsel approval.";
    autonomy = "Bounded";
    benchmark = "LegalBench & ContractNLI Multi-Jurisdiction Benchmark (8,200 labeled clauses)";
    targets = {
      retrievalRecall: "97.5%",
      retrievalMRR: "0.93",
      contextPrecision: "95.0%",
      faithfulness: "99.0%",
      hallucinationRateMax: "<0.6%",
      latencyP95: "1.5s",
    };
    summary = `Legal AI governance requires clause-level citation verification, strict air-gapped tenant tenancy, and attorney-client privilege isolation.`;
  }

  return {
    industryStandards: standards,
    sensitiveDataEntities: sensitive,
    toolAllowlistApproved: approvedTools,
    toolAllowlistBlocked: blockedTools,
    hitlApprovalThreshold: hitl,
    autonomyLevel: autonomy,
    goldenBenchmarkDataset: benchmark,
    ragStageTargets: targets,
    liveWebFindings: summary,
    webSources: [
      { title: "NIST AI Risk Management Framework (AI RMF 1.0)", uri: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { title: "OWASP Top 10 for Large Language Model Applications", uri: "https://owasp.org/www-project-top-10-for-large-language-model-applications" },
      { title: "RAG Evaluation Metrics & Benchmarks Guide", uri: "https://arxiv.org/abs/2309.01431" },
    ],
  };
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
