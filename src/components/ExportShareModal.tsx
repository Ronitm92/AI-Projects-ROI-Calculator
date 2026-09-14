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
  isProjectSelected?: boolean;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results,
  industryName,
  isProjectSelected = true,
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
      ["AI Feature ROI Calculator - Comprehensive Executive Financial Export"],
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
        tool: "AI Feature ROI Calculator & Financial Model",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative flex flex-col w-full max-w-xl rounded-2xl border border-slate-300 bg-white text-blue-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-800 border border-blue-300">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950">
                Export & Share Financial Model
              </h3>
              <p className="text-xs text-blue-800">
                Download multi-tab Excel workbooks or share the interactive model URL.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-950 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3.5">
          {!isProjectSelected && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
              <span>Please select a Project first in the calculator to enable data export and downloads.</span>
            </div>
          )}

          {/* PRIMARY: DYNAMIC MULTI-TAB EXCEL WORKBOOK (.XLSX) */}
          <div
            id="btn-modal-export-excel"
            onClick={isProjectSelected ? handleExportExcel : undefined}
            className={`rounded-xl border-2 p-4 transition-all flex items-center justify-between group shadow-xs ${
              isProjectSelected
                ? "cursor-pointer border-emerald-600/40 bg-emerald-50/70 hover:border-emerald-600 hover:bg-emerald-100/50"
                : "cursor-not-allowed border-slate-300 bg-slate-100 opacity-60"
            }`}
            title={isProjectSelected ? "Download Multi-Tab Excel Workbook" : "Select a Project first to enable Download"}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                isProjectSelected
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 group-hover:scale-105"
                  : "bg-slate-200 text-slate-500 border-slate-300"
              } transition-transform`}>
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-blue-950">
                    Dynamic Multi-Tab Excel Spreadsheet (.xlsx)
                  </h4>
                  {isProjectSelected && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold">
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-900/80 mt-1">
                  5 dynamic sheets: Executive Summary, Stakeholder Inputs (PM, Eng, CFO), 5-Yr Cash Flow & TCO, P&L Impact, and Unit Economics.
                </p>
              </div>
            </div>
            <Download className={`w-5 h-5 ${isProjectSelected ? "text-emerald-700 group-hover:scale-110" : "text-slate-400"} transition-transform`} />
          </div>

          {/* Share Link */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-700" />
                Shareable Interactive URL
              </span>
              <span className="text-[10px] text-blue-900 font-bold font-mono">Preserves all inputs</span>
            </div>
            <p className="text-xs text-blue-800 mt-1">
              Send this link to Product Managers, Engineering Leads, or Finance.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generateShareUrl()}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-blue-950 font-mono truncate"
              />
              <button
                onClick={handleCopyShareLink}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
              onClick={isProjectSelected ? handleExportCsv : undefined}
              className={`rounded-xl border p-3.5 transition-all flex items-center justify-between group ${
                isProjectSelected
                  ? "cursor-pointer border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                  : "cursor-not-allowed border-slate-300 bg-slate-100 opacity-60"
              }`}
              title={isProjectSelected ? "Download Flat CSV File" : "Select a Project first to enable Download"}
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  isProjectSelected
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-slate-200 text-slate-500 border-slate-300"
                }`}>
                  <Table className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950">Flat CSV File</h4>
                  <p className="text-[11px] text-blue-800">Single-sheet table</p>
                </div>
              </div>
              <Download className={`w-3.5 h-3.5 ${isProjectSelected ? "text-blue-800 group-hover:text-blue-950" : "text-slate-400"}`} />
            </div>

            <div
              onClick={isProjectSelected ? handleExportJson : undefined}
              className={`rounded-xl border p-3.5 transition-all flex items-center justify-between group ${
                isProjectSelected
                  ? "cursor-pointer border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                  : "cursor-not-allowed border-slate-300 bg-slate-100 opacity-60"
              }`}
              title={isProjectSelected ? "Download Raw JSON Payload" : "Select a Project first to enable Download"}
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  isProjectSelected
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-slate-200 text-slate-500 border-slate-300"
                }`}>
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950">Raw JSON Payload</h4>
                  <p className="text-[11px] text-blue-800">Full model state</p>
                </div>
              </div>
              <Download className={`w-3.5 h-3.5 ${isProjectSelected ? "text-blue-800 group-hover:text-blue-950" : "text-slate-400"}`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-blue-900 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
