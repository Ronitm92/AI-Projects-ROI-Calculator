import React from "react";
import { CostBreakdown } from "../types";
import { Server, Cpu, Database, Wrench, DollarSign } from "lucide-react";

interface FinOpsCostBreakdownProps {
  costs: CostBreakdown;
  teamSize?: number;
  monthlyQueriesPerUser?: number;
  avgTokensPerQuery?: number;
  tokenCostPerMillion?: number;
  oneTimeDevCost?: number;
  annualInfraCost?: number;
  annualMaintenanceCost?: number;
  onUpdateCostParam: (field: string, value: number) => void;
}

export const FinOpsCostBreakdown: React.FC<FinOpsCostBreakdownProps> = ({
  costs,
  teamSize = 35,
  monthlyQueriesPerUser = 450,
  avgTokensPerQuery = 2200,
  tokenCostPerMillion = 0.6,
  oneTimeDevCost = 45000,
  annualInfraCost = 7500,
  annualMaintenanceCost = 14000,
  onUpdateCostParam,
}) => {
  const safeTeamSize = teamSize || 1;
  const safeMonthlyQueries = monthlyQueriesPerUser || 0;
  const safeTokensPerQuery = avgTokensPerQuery || 0;
  const safeOneTimeDev = oneTimeDevCost || 0;
  const safeInfraCost = annualInfraCost || 0;
  const safeMaintCost = annualMaintenanceCost || 0;

  const costItems = [
    {
      id: "cost-dev",
      label: "Upfront Build & Evals",
      amount: costs?.oneTimeDev ?? 0,
      type: "One-Time (Year 1)",
      icon: Cpu,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      description: "Architecture, prompt engineering, agent harness, safety guardrails, integration.",
    },
    {
      id: "cost-tokens",
      label: "LLM Token Inference",
      amount: costs?.annualTokens ?? 0,
      type: "Annual Recurring",
      icon: Server,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      description: `${(safeMonthlyQueries * safeTeamSize * 12).toLocaleString()} queries/yr @ avg ${safeTokensPerQuery} tokens.`,
    },
    {
      id: "cost-infra",
      label: "Vector DB & Cloud Infra",
      amount: costs?.annualInfra ?? 0,
      type: "Annual Recurring",
      icon: Database,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      description: "Embeddings, vector indexing (Pinecone/Qdrant/pgvector), caching & API proxy.",
    },
    {
      id: "cost-ops",
      label: "Observability & Human Ops",
      amount: costs?.annualMaintenance ?? 0,
      type: "Annual Recurring",
      icon: Wrench,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      description: "Tracing, latency monitoring, continuous prompt refinement, human-in-the-loop review.",
    },
  ];

  const costPerSeatMonth =
    safeTeamSize > 0
      ? Math.round((costs?.totalOngoingAnnualCost ?? 0) / (safeTeamSize * 12))
      : 0;

  return (
    <div id="finops-costs-card" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">AI FinOps & Total Cost of Ownership (TCO)</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              ${costPerSeatMonth}/seat/mo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mavvrik true-cost model capturing hidden infrastructure, vector pipelines, and recurring maintenance.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">Year 1 Total AI Spend:</div>
          <div className="text-lg font-bold font-mono text-rose-400">
            ${(costs?.totalFirstYearCost ?? 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Cost Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {costItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={item.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-md border ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-900 flex justify-between items-baseline">
                <span className="text-[11px] text-slate-400">Modeled Cost:</span>
                <span className="text-sm font-bold font-mono text-white">
                  ${(item.amount ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FinOps Granular Adjustments */}
      <div className="mt-5 rounded-lg border border-slate-800/80 bg-slate-950/40 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
          FinOps Variable Controls
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Upfront Dev */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Upfront Dev/Evals:</span>
              <span className="font-mono text-indigo-300">${safeOneTimeDev.toLocaleString()}</span>
            </div>
            <input
              type="range"
              id="dev-cost-slider"
              min="5000"
              max="100000"
              step="5000"
              value={safeOneTimeDev}
              onChange={(e) => onUpdateCostParam("oneTimeDevCost", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Monthly Queries / User */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Queries/User/Mo:</span>
              <span className="font-mono text-cyan-300">{safeMonthlyQueries}</span>
            </div>
            <input
              type="range"
              id="queries-slider"
              min="50"
              max="3000"
              step="50"
              value={safeMonthlyQueries}
              onChange={(e) => onUpdateCostParam("monthlyQueriesPerUser", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Avg Tokens / Query */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Avg Tokens/Query:</span>
              <span className="font-mono text-cyan-300">{safeTokensPerQuery} tokens</span>
            </div>
            <input
              type="range"
              id="tokens-slider"
              min="200"
              max="5000"
              step="100"
              value={safeTokensPerQuery}
              onChange={(e) => onUpdateCostParam("avgTokensPerQuery", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Token Price / 1M */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Model Price/1M:</span>
              <span className="font-mono text-cyan-300">${(tokenCostPerMillion ?? 0.6).toFixed(2)}</span>
            </div>
            <input
              type="range"
              id="price-per-m-slider"
              min="0.10"
              max="5.00"
              step="0.05"
              value={tokenCostPerMillion ?? 0.6}
              onChange={(e) => onUpdateCostParam("tokenCostPerMillion", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Annual Vector DB & Infra */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Vector DB & Infra/Yr:</span>
              <span className="font-mono text-purple-300">${safeInfraCost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              id="infra-cost-slider"
              min="1000"
              max="30000"
              step="500"
              value={safeInfraCost}
              onChange={(e) => onUpdateCostParam("annualInfraCost", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Annual Maintenance */}
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Ops & Maintenance/Yr:</span>
              <span className="font-mono text-amber-300">${safeMaintCost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              id="maint-cost-slider"
              min="2000"
              max="40000"
              step="1000"
              value={safeMaintCost}
              onChange={(e) => onUpdateCostParam("annualMaintenanceCost", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
