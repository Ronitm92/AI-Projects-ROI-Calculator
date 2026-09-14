export interface ModelCostTier {
  id: "frontier" | "fine_tuned" | "distilled" | "open_weights";
  name: string;
  costPerMillion: number;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  description: string;
  representativeModels: string;
  bestFor: string;
  sourceBenchmark: string;
}

export const MODEL_COST_TIERS: ModelCostTier[] = [
  {
    id: "frontier",
    name: "Frontier Models",
    costPerMillion: 3.0,
    inputCostPerMillion: 2.5,
    outputCostPerMillion: 10.0,
    description: "State-of-the-art reasoning, deep contextual synthesis, complex multi-step tool calls, and high-stakes coding.",
    representativeModels: "GPT-4o, Claude Sonnet 5, Gemini 1.5 Pro",
    bestFor: "High-complexity reasoning, executive analysis, autonomous agents, and nuanced legal/financial advisory.",
    sourceBenchmark: "Web Search Benchmarks: $2.50/M input, $10.00/M output (Blended ~$3.00 - $4.50/M)",
  },
  {
    id: "fine_tuned",
    name: "Custom-Built / Fine-Tuned Models",
    costPerMillion: 1.2,
    inputCostPerMillion: 0.3,
    outputCostPerMillion: 1.2,
    description: "Domain-adapted models trained on proprietary enterprise datasets for specialized nomenclature and task consistency.",
    representativeModels: "Fine-Tuned GPT-4o-mini, Domain LoRA / Mistral-7B, Med-LLM",
    bestFor: "High-compliance internal jargon, strict JSON schema conformance, clinical transcription, and brand voice adherence.",
    sourceBenchmark: "Web Search Benchmarks: $0.30/M input, $1.20/M output + $0.30/M training token amortization",
  },
  {
    id: "distilled",
    name: "Small - Distilled Models",
    costPerMillion: 0.4,
    inputCostPerMillion: 0.15,
    outputCostPerMillion: 0.6,
    description: "Ultra-fast, cost-efficient distilled models optimized for routine classification, summarization, and high-frequency triage.",
    representativeModels: "GPT-4o-mini, Gemini 1.5 Flash-8B, Claude Haiku, Qwen Flash",
    bestFor: "Customer support deflection, query classification, basic extraction, and high-throughput real-time chat.",
    sourceBenchmark: "Web Search Benchmarks: $0.15/M input, $0.60/M output (Cheapest hosted APIs down to $0.03 - $0.15/M)",
  },
  {
    id: "open_weights",
    name: "Open Weights Models (Self-Hosted)",
    costPerMillion: 0.15,
    inputCostPerMillion: 0.08,
    outputCostPerMillion: 0.2,
    description: "Self-hosted or dedicated cloud GPU cluster execution (vLLM / TensorRT-LLM on NVIDIA H100 / H200) with zero external API egress.",
    representativeModels: "Llama 3.3 70B, DeepSeek V3, Mistral NeMo, Qwen 2.5",
    bestFor: "Strict sovereign VPC / on-prem privacy, zero data-retention mandates, and predictable bulk token volume >5M tokens/day.",
    sourceBenchmark: "Web Search Benchmarks: $0.10 - $0.18/M tokens at 85% GPU batch utilization on reserved H100 infrastructure",
  },
];
