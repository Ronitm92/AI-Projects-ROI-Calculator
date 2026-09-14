import React from "react";
import { CostBreakdown } from "../types";
import { Server, Cpu, Database, Wrench, DollarSign } from "lucide-react";
import { MODEL_COST_TIERS } from "../data/modelPricing";

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
      badge: "bg-blue-100 text-blue-900 border-blue-300",
      description: "Architecture, prompt pipelines, evaluation harnesses, security guardrails, and system integration.",
    },
    {
      id: "cost-tokens",
      label: "LLM Token Inference",
      amount: costs?.annualTokens ?? 0,
      type: "Annual Recurring",
      icon: Server,
      badge: "bg-blue-100 text-blue-900 border-blue-300",
      description: `${(safeMonthlyQueries * safeTeamSize * 12).toLocaleString()} queries/yr @ avg ${safeTokensPerQuery} tokens.`,
    },
    {
      id: "cost-infra",
      label: "Vector DB & Cloud Infra",
      amount: costs?.annualInfra ?? 0,
      type: "Annual Recurring",
      icon: Database,
      badge: "bg-blue-100 text-blue-900 border-blue-300",
      description: "Vector indexing, embeddings, caching layer, and dedicated API gateway infrastructure.",
    },
    {
      id: "cost-ops",
      label: "Observability & Maintenance",
      amount: costs?.annualMaintenance ?? 0,
      type: "Annual Recurring",
      icon: Wrench,
      badge: "bg-blue-100 text-blue-900 border-blue-300",
      description: "Tracing, latency monitoring, prompt iteration, and human-in-the-loop audit oversight.",
    },
  ];

  const costPerSeatMonth =
    safeTeamSize > 0
      ? Math.round((costs?.totalOngoingAnnualCost ?? 0) / (safeTeamSize * 12))
      : 0;

  return (
    <div id="finops-costs-card" className="rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm text-blue-950">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-blue-950">AI FinOps & Total Cost of Ownership (TCO)</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              ${costPerSeatMonth}/seat/mo
            </span>
          </div>
          <p className="text-xs text-blue-800 mt-1">
            Engineering build, inference token consumption, vector storage, and continuous operations.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-blue-900 font-semibold">Year 1 Total AI Spend:</div>
          <div className="text-xl font-bold font-mono text-blue-950">
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
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-300 text-blue-800 shadow-xs">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-blue-950">
                      {item.label}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md border ${item.badge}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-blue-800 mt-2 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-xs text-blue-900 font-medium">Modeled Cost:</span>
                <span className="text-base font-bold font-mono text-blue-950">
                  ${(item.amount ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FinOps Granular Adjustments */}
      <div className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-3 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-blue-700" />
          FinOps Cost Parameters
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Upfront Dev */}
          <div>
            <div className="flex justify-between text-blue-950 font-semibold mb-1.5">
              <span>Upfront Build/Evals:</span>
              <span className="font-mono font-bold text-blue-900">${safeOneTimeDev.toLocaleString()}</span>
            </div>
            <input
              type="range"
              id="dev-cost-slider"
              min="5000"
              max="100000"
              step="5000"
              value={safeOneTimeDev}
              onChange={(e) => onUpdateCostParam("oneTimeDevCost", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Monthly Queries / User */}
          <div>
            <div className="flex justify-between text-blue-950 font-semibold mb-1.5">
              <span>Queries/User/Mo:</span>
              <span className="font-mono font-bold text-blue-900">{safeMonthlyQueries}</span>
            </div>
            <input
              type="range"
              id="queries-slider"
              min="50"
              max="3000"
              step="50"
              value={safeMonthlyQueries}
              onChange={(e) => onUpdateCostParam("monthlyQueriesPerUser", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Avg Tokens / Query */}
          <div>
            <div className="flex justify-between text-blue-950 font-semibold mb-1.5">
              <span>Avg Tokens/Query:</span>
              <span className="font-mono font-bold text-blue-900">{safeTokensPerQuery}</span>
            </div>
            <input
              type="range"
              id="tokens-slider"
              min="200"
              max="5000"
              step="100"
              value={safeTokensPerQuery}
              onChange={(e) => onUpdateCostParam("avgTokensPerQuery", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Token Price / 1M */}
          <div>
            <div className="flex justify-between text-blue-950 font-semibold mb-1.5">
              <span>Model Price / 1M Tokens:</span>
              <span className="font-mono font-bold text-blue-900">${(tokenCostPerMillion ?? 0.6).toFixed(2)}</span>
            </div>
            <input
              type="range"
              id="price-per-m-slider"
              min="0.10"
              max="5.00"
              step="0.05"
              value={tokenCostPerMillion ?? 0.6}
              onChange={(e) => onUpdateCostParam("tokenCostPerMillion", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer"
            />
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {MODEL_COST_TIERS.map((tier) => {
                const isSelected = Math.abs((tokenCostPerMillion ?? 0.6) - tier.costPerMillion) < 0.05;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => onUpdateCostParam("tokenCostPerMillion", tier.costPerMillion)}
                    className={`py-1 px-1.5 rounded-lg border text-left text-[10px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-800 text-white border-blue-900"
                        : "bg-white text-blue-900 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{tier.name.split(" ")[0]}</span>
                      <span className="font-mono font-extrabold">${tier.costPerMillion.toFixed(2)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Annual Vector DB & Infra */}
          <div>
            <div className="flex justify-between text-blue-950 font-semibold mb-1.5">
              <span>Vector DB & Infra/Yr:</span>
              <span className="font-mono font-bold text-blue-900">${safeInfraCost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              id="infra-cost-slider"
              min="1000"
              max="30000"
              step="500"
              value={safeInfraCost}
              onChange={(e) => onUpdateCostParam("annualInfraCost", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Annual Maintenance */}
          <div>
            <div className="flex justify-between text-blue-950 font-semibold mb-1.5">
              <span>Ops & Maintenance/Yr:</span>
              <span className="font-mono font-bold text-blue-900">${safeMaintCost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              id="maint-cost-slider"
              min="2000"
              max="40000"
              step="1000"
              value={safeMaintCost}
              onChange={(e) => onUpdateCostParam("annualMaintenanceCost", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
