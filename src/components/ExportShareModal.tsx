import React, { useState } from "react";
import { CalculatorInputs, CalculationResults } from "../types";
import { generateExecutiveExcelWorkbook } from "../utils/excelGenerator";
import {
  X,
  Download,
  FileSpreadsheet,
  Code,
  Link2,
  Check,
  Table,
} from "lucide-react";

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
  results: CalculationResults;
  industryName: string;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results,
  industryName,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Generate shareable URL
  const generateShareUrl = () => {
    const params = new URLSearchParams();
    params.set("fn", inputs.featureName);
    params.set("tm", inputs.technologyMove);
    params.set("ind", inputs.industryId);
    params.set("ts", String(inputs.teamSize));
    params.set("hr", String(inputs.hourlyRate));
    params.set("hs", String(inputs.hoursSavedPerWeek));
    params.set("ar", String(inputs.adoptionRate));
    params.set("sc", inputs.scenario);
    params.set("dev", String(inputs.oneTimeDevCost));
    params.set("capex", String(inputs.capexPercentage));
    params.set("q", String(inputs.monthlyQueriesPerUser));
    params.set("tok", String(inputs.avgTokensPerQuery));
    params.set("prc", String(inputs.tokenCostPerMillion));
    params.set("inf", String(inputs.annualInfraCost));
    params.set("mnt", String(inputs.annualMaintenanceCost));
    params.set("rev", String(inputs.annualRevenueUplift));
    params.set("disc", String(inputs.discountRatePct));
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const handleCopyShareLink = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Export Dynamic Excel (.xlsx)
  const handleExportExcel = () => {
    generateExecutiveExcelWorkbook(inputs, results, industryName);
  };

  // Export CSV
  const handleExportCsv = () => {
    const rows = [
      ["AI Feature ROI Calculator - Comprehensive C-Suite Financial Export"],
      ["Framework", "Executive Financial Fluency Framework for Product & Technology Leaders"],
      ["Generated At", new Date().toISOString()],
      ["Feature Name", inputs.featureName],
      ["Strategic Technology Move", inputs.technologyMove],
      ["Industry", industryName],
      ["Scenario", inputs.scenario.toUpperCase()],
      [],
      ["--- MULTI-STAKEHOLDER INPUT PARAMETERS ---"],
      ["Team Members / Seats", inputs.teamSize],
      ["Blended Hourly Rate ($/hr)", inputs.hourlyRate],
      ["Hours Saved / Person / Week", inputs.hoursSavedPerWeek],
      ["Target Adoption Rate (%)", inputs.adoptionRate],
      ["Upfront Development Cost ($)", inputs.oneTimeDevCost],
      ["Software Capitalization CapEx (%)", `${inputs.capexPercentage}%`],
      ["Monthly Queries / User", inputs.monthlyQueriesPerUser],
      ["Avg Tokens / Query", inputs.avgTokensPerQuery],
      ["Model Token Cost ($/1M)", inputs.tokenCostPerMillion],
      ["Annual Vector DB & Infra ($)", inputs.annualInfraCost],
      ["Annual Maintenance & Ops ($)", inputs.annualMaintenanceCost],
      ["Strategic Revenue / ARR Uplift ($)", inputs.annualRevenueUplift],
      ["Hurdle Rate / Discount Rate (%)", `${inputs.discountRatePct}%`],
      [],
      ["--- EXECUTIVE FINANCIAL LENSES ---"],
      ["Net Present Value (NPV)", `$${(results.financialFluency?.npv ?? 0).toLocaleString()}`],
      ["Internal Rate of Return (IRR)", `${results.financialFluency?.irr ?? 0}%`],
      ["First Year Net ROI (%)", `${results.firstYearNetRoi ?? 0}%`],
      ["Break-Even Payback (Months)", results.paybackPeriodMonths ?? 0],
      ["5-Year Lifecycle TCO ($)", `$${(results.financialFluency?.fiveYearTco ?? 0).toLocaleString()}`],
      ["Capitalized Development CapEx ($)", `$${(results.financialFluency?.capexVsOpex?.capitalizedDev ?? 0).toLocaleString()}`],
      ["Annual OpEx ($)", `$${(results.financialFluency?.capexVsOpex?.annualOpex ?? 0).toLocaleString()}`],
      ["ARR Impact ($)", `$${(results.financialFluency?.arrImpact ?? 0).toLocaleString()}`],
      ["Gross Margin Delta (bps)", `+${results.financialFluency?.plImpact?.grossMarginDeltaBps ?? 0} bps`],
      ["Operating Margin Delta (bps)", `+${results.financialFluency?.plImpact?.operatingMarginDeltaBps ?? 0} bps`],
      ["Annual EBITDA Leverage ($)", `+$${(results.financialFluency?.plImpact?.ebitdaImpact ?? 0).toLocaleString()}`],
      [],
      ["--- 5 VALUE STREAMS BREAKDOWN ---"],
      ["Direct Productivity ($)", results.benefits?.directProductivity ?? 0],
      ["Quality & Error Reduction ($)", results.benefits?.qualityImprovement ?? 0],
      ["Innovation & Velocity ($)", results.benefits?.innovationVelocity ?? 0],
      ["Knowledge & Learning ($)", results.benefits?.learningUpskilling ?? 0],
      ["Wellbeing & Retention ($)", results.benefits?.retentionWellbeing ?? 0],
      [],
      ["--- 5-YEAR PROJECTIONS ---"],
      ["Year", "Benefits ($)", "TCO Costs ($)", "Net Value ($)", "Discounted Value ($)", "ROI (%)"],
      ...(results.fiveYearProjections || []).map((p) => [
        `Year ${p.year}`,
        p.benefits ?? 0,
        p.costs ?? 0,
        p.netValue ?? 0,
        p.discountedCashFlow ?? 0,
        `${p.roi ?? 0}%`,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ai-roi-model-${inputs.featureName.toLowerCase().replace(/\s+/g, "-")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataObj = {
      metadata: {
        tool: "AI Feature ROI Calculator - Executive Financial Model",
        framework: "Executive Financial Fluency Framework",
        exportedAt: new Date().toISOString(),
      },
      inputs,
      results,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataObj, null, 2)
    )}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute(
      "download",
      `ai-roi-model-${inputs.featureName.toLowerCase().replace(/\s+/g, "-")}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Export & Share Financial Model
              </h3>
              <p className="text-xs text-slate-400">
                Download multi-tab Excel workbooks or share the interactive model URL.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3.5">
          {/* PRIMARY: DYNAMIC MULTI-TAB EXCEL WORKBOOK (.XLSX) */}
          <div
            id="btn-modal-export-excel"
            onClick={handleExportExcel}
            className="cursor-pointer rounded-xl border-2 border-emerald-500/40 bg-emerald-950/20 p-4 hover:border-emerald-400 hover:bg-emerald-950/30 transition-all flex items-center justify-between group shadow-lg shadow-emerald-950/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    Dynamic Multi-Tab Excel Spreadsheet (.xlsx)
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  5 dynamic sheets: C-Suite Summary, Stakeholder Inputs (PM, Eng, CFO), 5-Yr Cash Flow & TCO, P&L Impact, and Unit Economics.
                </p>
              </div>
            </div>
            <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>

          {/* Share Link */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                Shareable Interactive URL
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">Preserves all parameters</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Send this link to Product Managers, Engineering Leads, or the CFO.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generateShareUrl()}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono truncate"
              />
              <button
                onClick={handleCopyShareLink}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    Copied
                  </>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
          </div>

          {/* Export CSV & JSON (Side by side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={handleExportCsv}
              className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 hover:border-slate-700 hover:bg-slate-950 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Table className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Flat CSV File</h4>
                  <p className="text-[11px] text-slate-400">Single-sheet table</p>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </div>

            <div
              onClick={handleExportJson}
              className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 hover:border-slate-700 hover:bg-slate-950 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Raw JSON Payload</h4>
                  <p className="text-[11px] text-slate-400">Full model state</p>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
