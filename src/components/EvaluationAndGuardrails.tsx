import React, { useState, useMemo } from "react";
import { CalculatorInputs, CalculationResults, GuardrailsEvalSpecs } from "../types";
import { PRESET_ARCHETYPES } from "../data/benchmarks";
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Cpu,
  Database,
  Wrench,
  Search,
  FileText,
  Check,
  X,
  Filter,
  BarChart3,
  Radio,
  Activity,
  Sparkles,
  Terminal,
  Layers,
  HelpCircle,
  Download,
  ExternalLink,
  Sliders,
  ChevronRight,
  UserCheck,
  Zap,
  Clock,
  DollarSign,
  Users,
  Award,
  Globe,
  Bot,
  FlaskConical,
  Scale,
} from "lucide-react";

interface EvaluationAndGuardrailsProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
  onUpdateInput?: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  selectedProjectId?: string | null;
  onLoadPreset?: (presetId: string) => void;
  isProjectSelected?: boolean;
}

export const EvaluationAndGuardrails: React.FC<EvaluationAndGuardrailsProps> = ({
  inputs,
  results,
  onUpdateInput,
  selectedProjectId,
  onLoadPreset,
  isProjectSelected = true,
}) => {
  // Top level views within this prominent tab
  const [activeSubView, setActiveSubView] = useState<
    "overview" | "top8_guardrails" | "rag_framework"
  >("overview");

  // Dynamic Web Search state for Evaluation & Guardrails
  const [searchProjectQuery, setSearchProjectQuery] = useState(inputs.featureName || "");
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [liveResearchData, setLiveResearchData] = useState<GuardrailsEvalSpecs | null>(
    inputs.guardrailsEvalSpecs || null
  );

  // Selected guardrail card for deep dive
  const [selectedGuardrailId, setSelectedGuardrailId] = useState<number>(1);
  // Selected eval stage for deep dive
  const [selectedEvalStageId, setSelectedEvalStageId] = useState<number>(1);
  // Toggle filter for non-negotiable guardrails only
  const [filterNonNegotiable, setFilterNonNegotiable] = useState<boolean>(false);

  // Project context derived values
  const projectName = inputs.featureName || "Enterprise AI Initiative";
  const archLabel =
    inputs.architectureType === "rag_agent"
      ? "RAG Agentic System"
      : inputs.architectureType === "autonomous_workflow"
      ? "Autonomous Workflow Agent"
      : inputs.architectureType === "llm_copilot"
      ? "Human-in-the-Loop Copilot"
      : "Fine-Tuned Domain Model";

  // Dynamic Project Governance Profile & Non-Negotiables
  const projectGovernanceProfile = useMemo(() => {
    const nameLower = projectName.toLowerCase();
    const ind = inputs.industryId;

    let nonNegotiableGuardrailIds = [2, 3, 7]; // Default
    let nonNegotiableMetricNames = ["Recall@K", "Faithfulness", "Hallucination Rate"];
    let customRationale = `Production deployment for ${projectName} requires strict adherence to data integrity, boundary defense, and verifiable factual accuracy.`;
    let projectCategory = "Enterprise AI Workflow";

    if (nameLower.includes("klarna") || nameLower.includes("customer") || ind === "customer_support_bpo") {
      projectCategory = "Customer Support & Financial Dispute Resolution";
      nonNegotiableGuardrailIds = [2, 3, 7]; // PII Redaction, Tool Allowlist (Refunds), Hallucination Shield
      nonNegotiableMetricNames = ["Faithfulness", "Hallucination Rate", "P50 / P95 / P99 Latency"];
      customRationale = `Financial customer support and dispute resolution requires absolute PII/PCI masking, strict monetary tool restrictions ($250 refund ceiling), and zero hallucinated policy commitments before production deployment.`;
    } else if (nameLower.includes("copilot") || nameLower.includes("developer") || nameLower.includes("code") || ind === "software_saas") {
      projectCategory = "Developer Code Generation & PR Review";
      nonNegotiableGuardrailIds = [3, 4, 5]; // Tool Execution Sandbox, Prompt Injection, Action Authorization
      nonNegotiableMetricNames = ["Context Precision", "Faithfulness", "Error Rate (5xx / Timeouts)"];
      customRationale = `Developer copilot and automated code review workflows require strict injection scanning on code diffs, sandboxed tool execution, and mandatory engineer sign-off on PR commits.`;
    } else if (nameLower.includes("legal") || nameLower.includes("contract") || nameLower.includes("harvey") || ind === "legal_tech") {
      projectCategory = "Legal Due Diligence & Contract Redlining";
      nonNegotiableGuardrailIds = [1, 2, 7]; // Context Boundary, Confidentiality/Privilege, Hallucination & Citation
      nonNegotiableMetricNames = ["Recall@K", "Context Precision", "Faithfulness", "Citation Correctness"];
      customRationale = `Legal contract redlining and M&A due diligence demands zero missed indemnification/liability clauses (Recall >= 99.5%) and 100% footnote citation fidelity to ground truth agreements.`;
    } else if (nameLower.includes("clinical") || nameLower.includes("health") || nameLower.includes("mayo") || ind === "healthcare_pharma") {
      projectCategory = "Ambient Clinical Documentation (EHR)";
      nonNegotiableGuardrailIds = [2, 5, 7]; // PHI Redaction, HITL Attending Physician Approval, Clinical Hallucination Shield
      nonNegotiableMetricNames = ["Faithfulness", "Hallucination Rate", "Context Precision"];
      customRationale = `Clinical documentation directly impacts patient health outcomes. Zero PHI leakage (HIPAA), mandatory attending physician note sign-off, and zero dosage/ICD-10 hallucinations are strictly non-negotiable.`;
    } else if (nameLower.includes("morgan") || nameLower.includes("fraud") || nameLower.includes("wealth") || ind === "fintech_banking") {
      projectCategory = "Institutional Wealth Advisory & AML Investigation";
      nonNegotiableGuardrailIds = [3, 5, 8]; // Tool Allowlist, Action Authorization (4-Eyes), WORM Audit Trail
      nonNegotiableMetricNames = ["Context Precision", "Faithfulness", "Hallucination Rate"];
      customRationale = `Banking & wealth advisory operations enforce FINRA Rule 2210 and SEC compliance. Dual-authorization gates for portfolio recommendations and tamper-evident WORM logging are mandatory.`;
    }

    return {
      projectCategory,
      nonNegotiableGuardrailIds,
      nonNegotiableMetricNames,
      customRationale,
    };
  }, [projectName, inputs.industryId]);

  // Trigger Live Web Search for Guardrails & RAG Specs
  const handlePerformWebSearch = async () => {
    const q = (searchProjectQuery || inputs.featureName || "Enterprise AI Feature").trim();
    setIsSearchingWeb(true);
    setSearchError(null);

    try {
      const response = await fetch("/api/research-guardrails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureName: q,
          industryId: inputs.industryId,
          architectureType: inputs.architectureType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to research guardrails.");
      }

      if (data.guardrailsEvalSpecs) {
        const specs: GuardrailsEvalSpecs = {
          ...data.guardrailsEvalSpecs,
          lastResearchedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setLiveResearchData(specs);
        if (onUpdateInput) {
          onUpdateInput("guardrailsEvalSpecs", specs);
        }
      }
    } catch (err: unknown) {
      console.error("Web search for guardrails error:", err);
      const msg = err instanceof Error ? err.message : "Error researching guardrails.";
      setSearchError(msg);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  // Effective specs merging live research or project defaults
  const effectiveSpecs = useMemo(() => {
    if (liveResearchData) return liveResearchData;
    if (inputs.guardrailsEvalSpecs) return inputs.guardrailsEvalSpecs;

    // Default intelligent presets based on industry
    const isHealth = inputs.industryId === "healthcare_pharma";
    const isFin = inputs.industryId === "fintech_banking";
    const isLegal = inputs.industryId === "legal_tech";

    return {
      industryStandards: isHealth
        ? ["HIPAA Security & Privacy", "FDA SaMD Guidance", "HITECH Act", "NIST AI RMF 1.0"]
        : isFin
        ? ["FINRA Rule 2210", "SEC Rule 206(4)-7", "PCI-DSS Level 1", "EU AI Act High-Risk", "GLBA"]
        : isLegal
        ? ["ABA Model Rules 1.1 / 1.6", "GDPR Article 22", "SOC 2 Type II Confidentiality"]
        : ["SOC 2 Type II", "NIST AI RMF 1.0", "ISO/IEC 42001", "EU AI Act"],
      sensitiveDataEntities: isHealth
        ? ["Protected Health Info (PHI)", "Patient Medical Record # (MRN)", "ICD-10 Diagnostic Codes", "SSN"]
        : isFin
        ? ["Primary Account Numbers (PAN)", "Bank Routing Numbers", "Taxpayer ID / SSN", "Credit Scores"]
        : isLegal
        ? ["Attorney-Client Privilege Communications", "Material Non-Public Info (MNPI)", "Trade Secrets"]
        : ["Customer PII", "Internal API Keys", "Unreleased Financials", "Employee Private Records"],
      toolAllowlistApproved: isHealth
        ? ["EHR Read-Only FHIR API", "RxNorm Drug Interaction Verifier", "Medical ICD-10 Cross-Referencer"]
        : isFin
        ? ["Core Ledger Read-Only API", "Fraud Risk Scoring Engine", "OFAC Sanctions & AML Screening"]
        : isLegal
        ? ["Contract Ingestion API", "Statutory Code Cross-Referencer", "Clause Deviation Diff Engine"]
        : ["Read-Only Knowledge Retrieval API", "Vector Semantic Index", "Structured JSON Schema Validator"],
      toolAllowlistBlocked: isHealth
        ? ["Direct Prescription Dispensation Write", "Unattended Clinical Diagnosis Mutation", "Unencrypted S3 Export"]
        : isFin
        ? ["Unsupervised Wire Transfer Initiation", "Direct Credit Limit Modification", "Bypass 2FA APIs"]
        : isLegal
        ? ["Direct Contract Signature Execution", "Public Webhook Broadcast", "External LLM Training Logging"]
        : ["Direct Shell / Bash Execution", "Raw SQL Schema Mutation / Drop", "Unauthenticated SMTP / Webhooks"],
      hitlApprovalThreshold: isHealth
        ? "All clinical note exports, dosage changes, and triage recommendations require credentialed Physician sign-off."
        : isFin
        ? "Disbursements or settlement offers over $2,500 and automated loan denial decisions require Human Underwriter signoff."
        : isLegal
        ? "All material indemnification deviations, liability cap overrides, and court filing submissions require Partner approval."
        : "Actions exceeding $5,000 financial impact, sensitive data export, or legal commitment require direct Human Approval.",
      autonomyLevel: isHealth ? "Assist" : isFin ? "Conditional" : isLegal ? "Bounded" : "Bounded",
      goldenBenchmarkDataset: isHealth
        ? "PubMedQA & MedQA Verified Golden Clinical Ground Truth Corpus"
        : isFin
        ? "FinQA & SEC-10K Financial Dialectic Reasoning Golden Corpus"
        : isLegal
        ? "LegalBench & ContractNLI Multi-Jurisdiction Benchmark (8,200 labeled clauses)"
        : "Enterprise Golden Curated Ground Truth Benchmark (1,500 domain QA pairs)",
      ragStageTargets: {
        retrievalRecall: isHealth ? "98.2%" : isFin ? "96.8%" : "94.5%",
        retrievalMRR: isHealth ? "0.95" : isFin ? "0.92" : "0.88",
        contextPrecision: isHealth ? "96.5%" : isFin ? "94.5%" : "92.0%",
        faithfulness: isHealth ? "99.4%" : isFin ? "98.8%" : "97.5%",
        hallucinationRateMax: isHealth ? "<0.4%" : isFin ? "<0.8%" : "<1.5%",
        latencyP95: isHealth ? "1.1s" : isFin ? "1.2s" : "1.4s",
      },
      liveWebFindings: `Production deployment for ${projectName} requires rigorous least-privilege RBAC token partitioning, pre-inference PII masking, and strict allowlisted tool execution with automated rollback safeguards.`,
    } as GuardrailsEvalSpecs;
  }, [liveResearchData, inputs.guardrailsEvalSpecs, inputs.industryId, projectName]);

  // THE 8 GUARDRAILS DATA - WITH DYNAMIC PROJECT-BASED NON-NEGOTIABLES
  const GUARDRAILS_DATA = useMemo(
    () => [
      {
        id: 1,
        step: "01",
        title: "IDENTITY & ACCESS",
        tagline: "Give every agent a unique identity with least-privilege access only.",
        flowType: "IdentityVerification",
        isNonNegotiable: projectGovernanceProfile.nonNegotiableGuardrailIds.includes(1),
        mandatorySLA: "100% IAM role verification / 0 unauthenticated sessions permitted",
        nonNegotiableRationale: "Mandatory credential isolation prevents cross-tenant data leaks and persistent privilege escalations.",
        flowNodes: [
          { label: "Agent", type: "agent", sub: "Session initiated" },
          { label: "Assign Identity", type: "process", sub: "Service token & role" },
          { label: "RBAC Check", type: "decision", sub: "Least-privilege policy" },
          { label: "Access Granted", type: "yes", sub: "Scoped lease token" },
          { label: "Denied", type: "no", sub: "403 Unauthorized" },
        ],
        projectImplementation: `Enforce isolated IAM credentials for '${projectName}'. Restrict data plane to read-only customer partitions with zero persistent admin elevation.`,
        status: "Enforced",
        riskLevel: "Critical",
        enterpriseStandard: "OAuth2 / SPIFFE / mTLS / IAM Role Partitioning",
        colorBadge: "bg-blue-800 text-white",
      },
      {
        id: 2,
        step: "02",
        title: "DATA SENSITIVITY & REDACTION",
        tagline: "Classify sensitive data in real time, then mask it automatically.",
        flowType: "RedactionPipeline",
        isNonNegotiable: projectGovernanceProfile.nonNegotiableGuardrailIds.includes(2),
        mandatorySLA: "100% masking of classified entities / Zero PII/PHI egress to LLM logs",
        nonNegotiableRationale: "Strict pre-inference redaction is mandatory to prevent statutory privacy breaches and customer data leaks.",
        flowNodes: [
          { label: "Input Data", type: "input", sub: "User prompt / chunk" },
          { label: "Sensitive?", type: "decision", sub: "PII / PHI / PCI / Secrets" },
          { label: "Mask / Redact", type: "yes", sub: "Tokenized placeholder" },
          { label: "Pass Through", type: "no", sub: "Clean payload" },
          { label: "Safe Output", type: "output", sub: "Zero LLM leakage" },
        ],
        projectImplementation: `Real-time Presidio / DLP classification for ${inputs.industryId.replace("_", " ")}. Masks: ${effectiveSpecs.sensitiveDataEntities.slice(0, 3).join(", ")}.`,
        status: "Active Filter",
        riskLevel: "High",
        enterpriseStandard: effectiveSpecs.industryStandards.slice(0, 2).join(" / ") || "SOC2 / HIPAA / GDPR",
        colorBadge: "bg-emerald-800 text-white",
      },
      {
        id: 3,
        step: "03",
        title: "TOOL-USE & API",
        tagline: "Restrict every agent to an explicit allowlist of approved tools.",
        flowType: "AllowlistPipeline",
        isNonNegotiable: projectGovernanceProfile.nonNegotiableGuardrailIds.includes(3),
        mandatorySLA: "Zero unlisted API execution / Sandboxed schema verification on 100% of payloads",
        nonNegotiableRationale: "Blast-radius boundary prevents catastrophic automated mutations, state corruption, or financial disbursements.",
        flowNodes: [
          { label: "Agent Requests Tool", type: "agent", sub: "JSON function call" },
          { label: "On Allowlist?", type: "decision", sub: "Registry verification" },
          { label: "Execute", type: "yes", sub: "Sandboxed container" },
          { label: "Blocked", type: "no", sub: "Execution aborted" },
        ],
        projectImplementation: `Strict OpenAPI schema registry. Approved: [${effectiveSpecs.toolAllowlistApproved.slice(0, 2).join(", ")}]. Blocked: [${effectiveSpecs.toolAllowlistBlocked.slice(0, 2).join(", ")}].`,
        status: "Allowlist Strict",
        riskLevel: "High",
        enterpriseStandard: "OpenAPI 3.1 Strict Typing / Sandboxed WASM / Container Isolation",
        colorBadge: "bg-amber-700 text-white",
      },
      {
        id: 4,
        step: "04",
        title: "INPUT & PROMPT-INJECTION",
        tagline: "Screen every prompt and retrieved document for injection before execution.",
        flowType: "InjectionScanner",
        isNonNegotiable: projectGovernanceProfile.nonNegotiableGuardrailIds.includes(4),
        mandatorySLA: "100% prompt scan coverage / Automatic session termination on jailbreak detection",
        nonNegotiableRationale: "Blocks indirect prompt injection attacks hidden within vector retrieval contexts or untrusted user inputs.",
        flowNodes: [
          { label: "Incoming Prompt", type: "input", sub: "User text + RAG chunks" },
          { label: "Injection Scan", type: "decision", sub: "Jailbreak & override filter" },
          { label: "Proceed to Agent", type: "yes", sub: "Sanitized input" },
          { label: "Reject", type: "no", sub: "Session reset & alert" },
        ],
        projectImplementation: `Dual-stage defense: screens conversational prompt and retrieved vector embeddings against indirect prompt injection (OWASP LLM01).`,
        status: "Scanning 100%",
        riskLevel: "Critical",
        enterpriseStandard: "OWASP Top 10 for LLMs / Llama-Guard / Lakera Guardrail APIs",
        colorBadge: "bg-rose-800 text-white",
      },
      {
        id: 5,
        step: "05",
        title: "ACTION AUTHORIZATION",
        tagline: "Require human approval before any irreversible or high-impact action runs.",
        flowType: "HumanApprovalGate",
        isNonNegotiable: projectGovernanceProfile.nonNegotiableGuardrailIds.includes(5),
        mandatorySLA: "Dual-key supervisor approval for all state mutations >$2,500 or external commits",
        nonNegotiableRationale: "Four-eyes principle ensures no autonomous agent can finalize high-liability or non-reversible actions unilaterally.",
        flowNodes: [
          { label: "Proposed Action", type: "input", sub: "State change requested" },
          { label: "High-Impact?", type: "decision", sub: "Financial / irreversible?" },
          { label: "Human Approval", type: "yes", sub: "Executive sign-off" },
          { label: "Auto-Execute", type: "no", sub: "Low-impact read/draft" },
          { label: "Execute", type: "output", sub: "Signed commit" },
        ],
        projectImplementation: effectiveSpecs.hitlApprovalThreshold,
        status: "HITL Circuit Active",
        riskLevel: "High",
        enterpriseStandard: "Dual-Key Sign-off / 4-Eyes Governance / Non-Repudiation Ledger",
        colorBadge: "bg-indigo-800 text-white",
      },
      {
        id: 6,
        step: "06",
        title: "AUTONOMY-LEVEL",
        tagline: "Match autonomy level to task risk, from assistive to full.",
        flowType: "AutonomyGovernor",
        isNonNegotiable: projectGovernanceProfile.nonNegotiableGuardrailIds.includes(6),
        mandatorySLA: `Enforce Level ${effectiveSpecs.autonomyLevel} boundary / Automatic step-down on confidence drop <0.85`,
        nonNegotiableRationale: "Prevents runaway recursion and unbounded loops by locking maximum decision authority per session.",
        flowNodes: [
          { label: "Task", type: "input", sub: "Operational job" },
          { label: "Risk Score", type: "decision", sub: "Impact assessment" },
          { label: "Assist", type: "tier", sub: "L1: Human drives" },
          { label: "Bounded", type: "tier", sub: "L2: Constrained box" },
          { label: "Conditional", type: "tier", sub: "L3: Supervised auto" },
          { label: "Full", type: "tier", sub: "L4: Autonomous" },
        ],
        projectImplementation: `Calibrated to Level ${effectiveSpecs.autonomyLevel === "Assist" ? "1 (Assist)" : effectiveSpecs.autonomyLevel === "Bounded" ? "2 (Bounded)" : effectiveSpecs.autonomyLevel === "Conditional" ? "3 (Conditional)" : "4 (Full)"} for ${projectName}. Risk scoring triggers dynamic step-down.`,
        status: `Level: ${effectiveSpecs.autonomyLevel}`,
        riskLevel: "Moderate",
        enterpriseStandard: "NIST AI Risk Management Framework (RMF 1.0)",
        colorBadge: "bg-cyan-800 text-white",
      },
      {
        id: 7,
        step: "07",
        title: "OUTPUT & HALLUCINATION",
        tagline: "Ground every output in facts, then filter it before delivery.",
        flowType: "HallucinationVerifier",
        isNonNegotiable: projectGovernanceProfile.nonNegotiableGuardrailIds.includes(7),
        mandatorySLA: `Hallucination rate < ${effectiveSpecs.ragStageTargets.hallucinationRateMax} / 100% footnote attribution to verified context`,
        nonNegotiableRationale: "Zero-tolerance factuality gate rejects fabricated commitments, hallucinations, or unverified claims.",
        flowNodes: [
          { label: "Agent Output", type: "agent", sub: "Generated response" },
          { label: "Grounded?", type: "decision", sub: "NLI entailment test" },
          { label: "Deliver to User", type: "yes", sub: "Verified & cited" },
          { label: "Regenerate", type: "no", sub: "Retry with stricter prompt" },
          { label: "Pass Through / Escalate", type: "output", sub: "Human fallback" },
        ],
        projectImplementation: `Enforces strict claim entailment against verified vector chunks. Target hallucination rate: ${effectiveSpecs.ragStageTargets.hallucinationRateMax} with mandatory footnote citations.`,
        status: "NLI Verifier On",
        riskLevel: "Critical",
        enterpriseStandard: "Natural Language Inference (NLI) / RAGAS Faithfulness / G-Eval",
        colorBadge: "bg-blue-900 text-white",
      },
      {
        id: 8,
        step: "08",
        title: "OBSERVABILITY & AUDIT",
        tagline: "Log every action and flag anomalies for continuous compliance auditing.",
        flowType: "ObservabilityTrail",
        isNonNegotiable: projectGovernanceProfile.nonNegotiableGuardrailIds.includes(8),
        mandatorySLA: "100% trace capture / Immutable WORM tamper-evident ledger retained for 7 years",
        nonNegotiableRationale: "Statutory compliance and post-incident forensics require non-repudiable audit trails of every agent decision.",
        flowNodes: [
          { label: "Agent/Tool/Action Calls", type: "input", sub: "All telemetry events" },
          { label: "Log Entry", type: "process", sub: "Structured trace & span" },
          { label: "Anomaly?", type: "decision", sub: "Cost / loop / deviation?" },
          { label: "Alert", type: "yes", sub: "Security & FinOps alert" },
          { label: "Audit Trail", type: "no", sub: "WORM immutable ledger" },
        ],
        projectImplementation: `Full OpenTelemetry distributed trace spans with payload hashing. Tamper-evident audit logs preserved for regulatory audits (${effectiveSpecs.industryStandards[0] || "SOC2"}).`,
        status: "100% Traced",
        riskLevel: "High",
        enterpriseStandard: "OpenTelemetry / WORM S3 Object Lock / SIEM Integration",
        colorBadge: "bg-purple-800 text-white",
      },
    ],
    [projectName, inputs.industryId, effectiveSpecs, projectGovernanceProfile]
  );

  // THE 4 RAG EVALUATION STAGES - EXACTLY AS IN IMAGE 2
  const RAG_STAGES_DATA = useMemo(
    () => [
      {
        id: 1,
        stageNumber: "1",
        name: "Retrieval",
        question: "Did we find the right evidence?",
        subtitle: "Find the right information",
        icon: Search,
        accentColor: "blue",
        metrics: [
          {
            name: "Recall@K",
            benchmark: effectiveSpecs.ragStageTargets.retrievalRecall || "95.2%",
            slaTarget: ">90.0%",
            status: "Passing",
            isNonNegotiable: projectGovernanceProfile.nonNegotiableMetricNames.includes("Recall@K"),
            desc: "Percentage of relevant ground-truth chunks retrieved in top K results.",
          },
          {
            name: "Precision@K",
            benchmark: "89.4%",
            slaTarget: ">85.0%",
            status: "Passing",
            desc: "Proportion of retrieved chunks in top K that are genuinely relevant to the query.",
          },
          {
            name: "Hit Rate",
            benchmark: "98.7%",
            slaTarget: ">95.0%",
            status: "Passing",
            desc: "Probability that at least one highly relevant document chunk is retrieved.",
          },
          {
            name: "MRR (Mean Reciprocal Rank)",
            benchmark: effectiveSpecs.ragStageTargets.retrievalMRR || "0.89",
            slaTarget: ">0.80",
            status: "Passing",
            desc: "Average reciprocal position of the first relevant document chunk.",
          },
          {
            name: "NDCG (Normalized DCG)",
            benchmark: "0.92",
            slaTarget: ">0.85",
            status: "Passing",
            desc: "Graded relevance accounting for the ranking position and quality of top items.",
          },
        ],
        architectureImpact:
          "High retrieval precision prevents polluting the LLM context window, directly reducing token spend while cutting distraction hallucinations.",
      },
      {
        id: 2,
        stageNumber: "2",
        name: "RAG Augmentation",
        question: "Did we use the evidence correctly?",
        subtitle: "Augment with relevant context",
        icon: Layers,
        accentColor: "indigo",
        metrics: [
          {
            name: "Context Precision",
            benchmark: effectiveSpecs.ragStageTargets.contextPrecision || "92.8%",
            slaTarget: ">88.0%",
            status: "Passing",
            isNonNegotiable: projectGovernanceProfile.nonNegotiableMetricNames.includes("Context Precision"),
            desc: "Signal-to-noise ratio: fraction of context chunks that directly substantiate the final answer.",
          },
          {
            name: "Context Recall",
            benchmark: "90.5%",
            slaTarget: ">85.0%",
            status: "Passing",
            desc: "Measures whether all facts needed to answer the prompt were present in context.",
          },
          {
            name: "Faithfulness",
            benchmark: effectiveSpecs.ragStageTargets.faithfulness || "97.4%",
            slaTarget: ">95.0%",
            status: "Passing",
            isNonNegotiable: projectGovernanceProfile.nonNegotiableMetricNames.includes("Faithfulness"),
            desc: "Mathematical claim entailment: answers must be directly derived from context.",
          },
          {
            name: "Groundedness",
            benchmark: "96.2%",
            slaTarget: ">92.0%",
            status: "Passing",
            desc: "Absence of fabricated assumptions or unsupported background assertions.",
          },
          {
            name: "Relevance",
            benchmark: "93.1%",
            slaTarget: ">88.0%",
            status: "Passing",
            desc: "Filtering out semantic drift and unhelpful neighbor chunks.",
          },
          {
            name: "Citation Correctness",
            benchmark: "98.6%",
            slaTarget: ">95.0%",
            status: "Passing",
            isNonNegotiable: projectGovernanceProfile.nonNegotiableMetricNames.includes("Citation Correctness"),
            desc: "Exact point-to-point alignment between inline footnotes and source documents.",
          },
        ],
        architectureImpact:
          "Context precision directly prevents 'needle-in-a-haystack' retrieval failures and eliminates context window pollution.",
      },
      {
        id: 3,
        stageNumber: "3",
        name: "Generation",
        question: "Did we produce the right answer?",
        subtitle: "Produce a faithful answer",
        icon: Cpu,
        accentColor: "teal",
        metrics: [
          {
            name: "Hallucination Rate",
            benchmark: effectiveSpecs.ragStageTargets.hallucinationRateMax || "0.9%",
            slaTarget: "<1.5%",
            status: "Passing",
            isNonNegotiable: projectGovernanceProfile.nonNegotiableMetricNames.includes("Hallucination Rate"),
            desc: "Percentage of generated responses containing unverified or false assertions.",
          },
          {
            name: "Completeness",
            benchmark: "94.2%",
            slaTarget: ">90.0%",
            status: "Passing",
            desc: "Degree to which all multi-part sub-questions in the query are addressed.",
          },
          {
            name: "Correctness",
            benchmark: "95.8%",
            slaTarget: ">92.0%",
            status: "Passing",
            desc: "Factual agreement and alignment with verified golden ground-truth answers.",
          },
          {
            name: "Semantic Similarity",
            benchmark: "0.94",
            slaTarget: ">0.88",
            status: "Passing",
            desc: "Cosine distance in embedding space between model output and expert human answers.",
          },
          {
            name: "Instruction Adherence",
            benchmark: "99.1%",
            slaTarget: ">98.0%",
            status: "Passing",
            desc: "Strict adherence to formatting rules, system constraints, and JSON schemas.",
          },
        ],
        architectureImpact:
          "High generation fidelity directly protects brand reputation and prevents expensive operational errors.",
      },
      {
        id: 4,
        stageNumber: "4",
        name: "Production",
        question: "Did we do it reliably, quickly, and cost-effectively?",
        subtitle: "Operate at scale reliably",
        icon: BarChart3,
        accentColor: "blue",
        metrics: [
          {
            name: "P50 / P95 / P99 Latency",
            benchmark: `0.6s / ${effectiveSpecs.ragStageTargets.latencyP95 || "1.2s"} / 2.1s`,
            slaTarget: "P95 <1.5s",
            status: "Passing",
            isNonNegotiable: projectGovernanceProfile.nonNegotiableMetricNames.some(m => m.includes("Latency")),
            desc: "Round-trip user perceived latency from prompt dispatch to final rendered token.",
          },
          {
            name: "Throughput (QPS)",
            benchmark: "145 QPS",
            slaTarget: ">80 QPS",
            status: "Passing",
            desc: "Sustained concurrent query handling capacity under peak enterprise load.",
          },
          {
            name: "Tokens / Query",
            benchmark: `${inputs.avgTokensPerQuery.toLocaleString()} tok`,
            slaTarget: "<4,500 tok",
            status: "Optimal",
            desc: "Blended input prompt and generated output token consumption per transaction.",
          },
          {
            name: "Cost / Query",
            benchmark: `$${(results?.costPerQuery ?? results?.financialFluency?.unitEconomics?.costPerQuery ?? 0).toFixed(4)}`,
            slaTarget: "<$0.025",
            status: "Optimal",
            desc: "FinOps unit economics: direct LLM API inference cost per query.",
          },
          {
            name: "Error Rate (5xx / Timeouts)",
            benchmark: "0.12%",
            slaTarget: "<0.50%",
            status: "Passing",
            isNonNegotiable: projectGovernanceProfile.nonNegotiableMetricNames.some(m => m.includes("Error Rate")),
            desc: "Rate of unhandled server exceptions, provider timeouts, or context overflows.",
          },
        ],
        architectureImpact:
          "Enforces rigorous FinOps boundaries and predictable sub-second user latency across global corporate traffic.",
      },
    ],
    [effectiveSpecs, inputs?.avgTokensPerQuery, results?.costPerQuery, results?.financialFluency?.unitEconomics?.costPerQuery, projectGovernanceProfile]
  );

  // EVALUATION APPROACHES - FROM IMAGE 2
  const EVAL_APPROACHES = [
    {
      title: "Golden Dataset",
      subtitle: "Curated Q&A with ground truth",
      desc: `High-quality reference dataset vetted by senior domain experts. Benchmark: ${effectiveSpecs.goldenBenchmarkDataset}`,
      icon: Database,
      tag: "Ground Truth",
    },
    {
      title: "Human Evaluation",
      subtitle: "Expert review for nuance and quality",
      desc: "Blind dual-SME review scoring clinical/financial liability, nuance, empathy, and subtle factual errors.",
      icon: Users,
      tag: "High Precision",
    },
    {
      title: "LLM-as-a-Judge",
      subtitle: "Scalable, consistent evaluation",
      desc: "Synthetic evaluators using Gemini 2.5 Pro with structured Rubric Prompting to score hundreds of runs in parallel.",
      icon: Bot,
      tag: "Automated Scale",
    },
    {
      title: "RAGAS / DeepEval",
      subtitle: "Purpose-built metrics and toolkits",
      desc: "Algorithmic evaluation pipelines calculating mathematical faithfulness, context recall, and groundedness.",
      icon: BarChart3,
      tag: "Metric Suite",
    },
    {
      title: "A/B Testing",
      subtitle: "Compare versions with real users",
      desc: "Split-run traffic routing comparing prompt templates, embedding models, and chunking strategies with live users.",
      icon: FlaskConical,
      tag: "Production Signal",
    },
  ];

  // CONTINUOUS EVALUATION IN PRODUCTION - FROM IMAGE 2
  const CONTINUOUS_EVAL_STEPS = [
    {
      step: "01",
      title: "Change",
      code: "</>",
      desc: "New data, model, prompt, or config",
      icon: Terminal,
      color: "bg-blue-800 text-white",
    },
    {
      step: "02",
      title: "Offline Eval",
      code: "TEST",
      desc: "Run comprehensive evaluation suite on Golden Dataset",
      icon: FileText,
      color: "bg-blue-800 text-white",
    },
    {
      step: "03",
      title: "Regression Gates",
      code: "GATE",
      desc: "Block deployment on performance or faithfulness regressions",
      icon: ShieldCheck,
      color: "bg-blue-800 text-white",
    },
    {
      step: "04",
      title: "Shadow / Canary",
      code: "5%",
      desc: "Test with limited traffic (5-10%) in real production environment",
      icon: Radio,
      color: "bg-blue-800 text-white",
    },
    {
      step: "05",
      title: "Production Monitoring",
      code: "LIVE",
      desc: "Track quality, latency, token cost, and anomalies in real time",
      icon: Activity,
      color: "bg-blue-900 text-white",
    },
  ];

  return (
    <div className="w-full space-y-6 text-blue-950">
      {/* =========================================================================
          1. PROMINENT EXECUTIVE HEADER & DYNAMIC WEB-SEARCH BANNER
          ========================================================================= */}
      <div className="rounded-2xl bg-white border border-slate-300 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-200 pb-5">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Enterprise AI Agent Governance
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-blue-900">
              <span>Project:</span>
              {inputs.featureName && inputs.featureName.trim() ? (
                <span className="text-blue-950 font-extrabold">{inputs.featureName}</span>
              ) : (
                <span className="text-amber-800 font-semibold italic">No Project Selected</span>
              )}
              {onLoadPreset && (
                <select
                  id="eval-select-project-dropdown"
                  value={selectedProjectId || ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      onLoadPreset(e.target.value);
                    }
                  }}
                  className="ml-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-xs font-bold text-blue-950 hover:border-blue-500 cursor-pointer focus:ring-2 focus:ring-blue-600"
                >
                  <option value="" disabled>
                    -- Select a Project to Apply Governance --
                  </option>
                  {PRESET_ARCHETYPES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Prominent Subview Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border-2 border-slate-300 shadow-inner w-full lg:w-auto">
            <button
              id="subview-tab-overview"
              onClick={() => setActiveSubView("overview")}
              className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSubView === "overview"
                  ? "bg-blue-800 text-white shadow-md ring-2 ring-blue-900/30"
                  : "bg-white text-blue-900 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Unified Overview</span>
            </button>
            <button
              id="subview-tab-guardrails"
              onClick={() => setActiveSubView("top8_guardrails")}
              className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSubView === "top8_guardrails"
                  ? "bg-blue-800 text-white shadow-md ring-2 ring-blue-900/30"
                  : "bg-white text-blue-900 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Top 8 Guardrails</span>
            </button>
            <button
              id="subview-tab-rag"
              onClick={() => setActiveSubView("rag_framework")}
              className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSubView === "rag_framework"
                  ? "bg-blue-800 text-white shadow-md ring-2 ring-blue-900/30"
                  : "bg-white text-blue-900 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>RAG Evaluation</span>
            </button>
          </div>
        </div>

        {/* Dynamic Project Production Readiness Gate */}
        <div className="mt-5 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-blue-200/80">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-900">
                Production Gate: {projectGovernanceProfile.projectCategory}
              </span>
              <p className="text-xs text-blue-950 font-medium mt-0.5">
                {projectGovernanceProfile.customRationale}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 border border-rose-300">
                {projectGovernanceProfile.nonNegotiableGuardrailIds.length} Non-Negotiable Guardrails
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 border border-blue-300">
                {projectGovernanceProfile.nonNegotiableMetricNames.length} Non-Negotiable Metrics
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-blue-950 block">Applicable Regulatory Standards:</span>
              <div className="flex flex-wrap gap-1">
                {effectiveSpecs.industryStandards.map((std, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white text-blue-900 border border-slate-300 font-semibold text-[11px]">
                    {std}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-blue-950 block">Mandatory Sensitive Redactions:</span>
              <p className="text-blue-900 text-[11px] font-medium leading-tight">
                {effectiveSpecs.sensitiveDataEntities.join(", ")}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-blue-950 block">Human-in-the-Loop Threshold:</span>
              <p className="text-blue-900 text-[11px] font-medium leading-tight">
                {effectiveSpecs.hitlApprovalThreshold}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Web-Search Bar */}
        <div className="mt-4 p-4 rounded-xl bg-slate-100/90 border border-slate-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
              <Globe className="w-4 h-4 text-blue-700" />
              <span>Live Web-Search Specification Calibrator</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 font-medium">
                Google Search Grounded
              </span>
            </div>
            {effectiveSpecs.lastResearchedAt && (
              <span className="text-[11px] text-blue-800 font-mono">
                Updated: {effectiveSpecs.lastResearchedAt}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
              <input
                type="text"
                value={searchProjectQuery}
                onChange={(e) => setSearchProjectQuery(e.target.value)}
                placeholder="Search live web standards for this project or custom AI feature..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-blue-950 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
            <button
              onClick={handlePerformWebSearch}
              disabled={isSearchingWeb}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearchingWeb ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Researching Web...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Web Specs</span>
                </>
              )}
            </button>
          </div>

          {searchError && (
            <p className="mt-2 text-xs text-red-700 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {searchError}
            </p>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. TOP 8 AI AGENT GUARDRAILS (EXACTLY AS IN IMAGE 1)
          ========================================================================= */}
      {(activeSubView === "overview" || activeSubView === "top8_guardrails") && (
        <div className="rounded-2xl bg-white border border-slate-300 shadow-sm p-5 sm:p-6 space-y-6">
          {/* Top 8 Guardrails Header & Non-Negotiable Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-blue-950 tracking-tight">
                Top 8 AI Agent Guardrails
              </h3>
              <span className="text-xs font-bold text-blue-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                Project: <strong className="text-blue-950 font-bold">{projectName}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterNonNegotiable(!filterNonNegotiable)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  filterNonNegotiable
                    ? "bg-rose-700 text-white border-rose-800 shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-blue-950 border-slate-300"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{filterNonNegotiable ? "Showing Non-Negotiables Only" : "Filter Non-Negotiables"}</span>
              </button>
            </div>
          </div>

          {/* The 8 Guardrails Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {(filterNonNegotiable
              ? GUARDRAILS_DATA.filter((g) => g.isNonNegotiable)
              : GUARDRAILS_DATA
            ).map((guardrail) => {
              const isSelected = selectedGuardrailId === guardrail.id;

              return (
                <div
                  key={guardrail.id}
                  onClick={() => setSelectedGuardrailId(guardrail.id)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-50 border-blue-700 shadow-md ring-2 ring-blue-600/20"
                      : guardrail.isNonNegotiable
                      ? "bg-rose-50/30 hover:bg-rose-50/50 border-rose-300 shadow-sm"
                      : "bg-slate-50/60 hover:bg-slate-50 border-slate-300 hover:border-slate-400 shadow-sm"
                  }`}
                >
                  {/* Top Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wider ${guardrail.colorBadge}`}>
                        {guardrail.step}
                      </span>
                      {guardrail.isNonNegotiable ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Non-Negotiable
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-blue-900 uppercase">
                          {guardrail.title}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-blue-950 leading-snug">
                      "{guardrail.tagline}"
                    </p>
                  </div>

                  {/* Flowchart Diagram Representation matching Image 1 */}
                  <div className="my-3 py-2 px-2.5 rounded-lg bg-white border border-slate-200 text-[11px] space-y-1.5 font-mono">
                    <div className="text-[10px] uppercase font-bold text-blue-800 tracking-wider text-center border-b border-slate-100 pb-1">
                      Decision-Tree Logic Flow
                    </div>

                    {guardrail.flowNodes.map((node, nIdx) => (
                      <div key={nIdx} className="flex items-center justify-between text-xs py-0.5">
                        <span className="flex items-center gap-1.5 font-bold text-blue-950">
                          {node.type === "agent" && <Bot className="w-3 h-3 text-blue-600" />}
                          {node.type === "input" && <FileText className="w-3 h-3 text-blue-600" />}
                          {node.type === "process" && <Sliders className="w-3 h-3 text-blue-600" />}
                          {node.type === "decision" && <HelpCircle className="w-3 h-3 text-blue-800" />}
                          {node.type === "yes" && <Check className="w-3 h-3 text-emerald-600" />}
                          {node.type === "no" && <X className="w-3 h-3 text-rose-600" />}
                          {node.type === "output" && <ShieldCheck className="w-3 h-3 text-blue-700" />}
                          {node.type === "tier" && <Activity className="w-3 h-3 text-cyan-600" />}
                          <span>{node.label}</span>
                        </span>
                        <span className="text-[10px] text-blue-800 truncate max-w-[110px] text-right font-sans">
                          {node.sub}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mandatory SLA if Non-Negotiable */}
                  {guardrail.isNonNegotiable && (
                    <div className="mb-2 p-2 rounded-lg bg-rose-100/70 border border-rose-300 text-[11px] text-rose-950">
                      <span className="font-extrabold text-rose-800 block text-[10px] uppercase tracking-wide">
                        Mandatory SLA (Production Gate):
                      </span>
                      <p className="font-bold text-rose-950 leading-tight mt-0.5">
                        {guardrail.mandatorySLA}
                      </p>
                    </div>
                  )}

                  {/* Implementation for this project */}
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-blue-900 space-y-1">
                    <span className="font-bold block text-blue-950">Applied to {projectName}:</span>
                    <p className="line-clamp-2 leading-relaxed text-blue-800">
                      {guardrail.projectImplementation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          3. ENTERPRISE RAG EVALUATION FRAMEWORK (EXACTLY AS IN IMAGE 2)
          ========================================================================= */}
      {(activeSubView === "overview" || activeSubView === "rag_framework") && (
        <div className="rounded-2xl bg-white border border-slate-300 shadow-sm p-5 sm:p-6 space-y-6">
          {/* Enterprise RAG Framework Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-blue-950 tracking-tight">
                Enterprise RAG Evaluation Framework
              </h3>
              <span className="text-xs font-bold text-blue-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                Project: <strong className="text-blue-950 font-bold">{projectName}</strong>
              </span>
            </div>
          </div>

          {/* 4 Pipeline Stages Process Flow matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {RAG_STAGES_DATA.map((stage) => {
              const isSelected = selectedEvalStageId === stage.id;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedEvalStageId(stage.id)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-50 border-blue-700 shadow-md ring-2 ring-blue-600/20"
                      : "bg-slate-50/60 hover:bg-slate-50 border-slate-300 hover:border-slate-400 shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-blue-800 text-white font-black text-xs flex items-center justify-center shadow-sm">
                        {stage.stageNumber}
                      </span>
                      <div>
                        <h4 className="text-base font-extrabold text-blue-950">
                          {stage.name}
                        </h4>
                      </div>
                    </div>

                    {/* Guiding Question Box */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
                        Core Question:
                      </span>
                      <p className="text-xs font-bold text-blue-950 italic mt-0.5">
                        "{stage.question}"
                      </p>
                    </div>

                    {/* Metrics List from Image 2 */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">
                        Evaluated Metrics & SLAs:
                      </span>
                      {stage.metrics.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className={`flex items-center justify-between text-xs py-1 px-1.5 rounded transition-all border-b border-slate-200 last:border-0 ${
                            m.isNonNegotiable
                              ? "bg-rose-50/80 border-rose-200 text-rose-950 font-bold"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate max-w-[150px]" title={m.desc}>
                            <span className={m.isNonNegotiable ? "text-rose-800 font-extrabold" : "font-semibold text-blue-950"}>
                              • {m.name}
                            </span>
                            {m.isNonNegotiable && (
                              <span className="text-[9px] font-black uppercase px-1 py-0.2 rounded bg-rose-600 text-white shrink-0">
                                Required
                              </span>
                            )}
                          </div>
                          <span className={`font-mono font-bold px-1.5 py-0.5 rounded border text-[11px] ${
                            m.isNonNegotiable
                              ? "bg-white text-rose-800 border-rose-300"
                              : "bg-white text-blue-900 border-slate-200"
                          }`}>
                            {m.benchmark}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-[11px] text-blue-800 font-medium">
                    {stage.architectureImpact}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evaluation Approaches Section matching Image 2 */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-sm font-extrabold text-blue-950 uppercase tracking-wider">
              Evaluation Approaches
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {EVAL_APPROACHES.map((appr, idx) => {
                const Icon = appr.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-300 text-blue-900">
                          {appr.tag}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-blue-950">
                        {appr.title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-blue-900/90 leading-snug">
                      {appr.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continuous Evaluation in Production matching Image 2 */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-sm font-extrabold text-blue-950 uppercase tracking-wider">
              Continuous Evaluation in Production
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {CONTINUOUS_EVAL_STEPS.map((step, sIdx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={sIdx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1.5 relative flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-md bg-blue-800 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                        {step.code}
                      </span>
                      <Icon className="w-3.5 h-3.5 text-blue-700" />
                    </div>
                    <div className="font-bold text-xs text-blue-950">
                      {step.title}
                    </div>
                    <p className="text-[11px] text-blue-800 leading-snug">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
