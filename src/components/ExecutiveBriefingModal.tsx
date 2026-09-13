import React, { useState } from "react";
import { CalculatorInputs, CalculationResults } from "../types";
import { X, Sparkles, Copy, Check, Printer, RefreshCw, AlertCircle } from "lucide-react";

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
  results: CalculationResults;
  industryName: string;
}

export const ExecutiveBriefingModal: React.FC<ExecutiveBriefingModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results,
  industryName,
}) => {
  const [briefingText, setBriefingText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateBriefing = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureName: inputs.featureName,
          technologyMove: inputs.technologyMove,
          industry: industryName,
          teamSize: inputs.teamSize,
          hourlyRate: inputs.hourlyRate,
          hoursSavedPerWeek: inputs.hoursSavedPerWeek,
          adoptionRate: inputs.adoptionRate,
          scenario: inputs.scenario,
          npv: results.financialFluency?.npv ?? 0,
          irr: results.financialFluency?.irr ?? 0,
          fiveYearTco: results.financialFluency?.fiveYearTco ?? 0,
          arrImpact: results.financialFluency?.arrImpact ?? 0,
          grossMarginDeltaBps: results.financialFluency?.plImpact?.grossMarginDeltaBps ?? 0,
          operatingMarginDeltaBps: results.financialFluency?.plImpact?.operatingMarginDeltaBps ?? 0,
          ebitdaImpact: results.financialFluency?.plImpact?.ebitdaImpact ?? 0,
          totalNetValueYr1: results.firstYearNetValue ?? 0,
          netRoiYr1: results.firstYearNetRoi ?? 0,
          paybackMonths: results.paybackPeriodMonths ?? 0,
          hoursSavedYr1: results.annualHoursSaved ?? 0,
          fteEquiv: results.fteEquivalent ?? 0,
          costToValueRatio: results.costToValueRatio ?? 0,
          costs: {
            oneTimeDev: results.costs?.oneTimeDev ?? 0,
            annualTokens: results.costs?.annualTokens ?? 0,
            annualInfra: results.costs?.annualInfra ?? 0,
            annualMaintenance: results.costs?.annualMaintenance ?? 0,
            totalFirstYear: results.costs?.totalFirstYearCost ?? 0,
          },
          benefits: {
            directProductivity: results.benefits?.directProductivity ?? 0,
            qualityImprovement: results.benefits?.qualityImprovement ?? 0,
            innovationVelocity: results.benefits?.innovationVelocity ?? 0,
            learningUpskilling: results.benefits?.learningUpskilling ?? 0,
            retentionWellbeing: results.benefits?.retentionWellbeing ?? 0,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate executive briefing.");
      }
      setBriefingText(data.briefing);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error generating briefing");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger on open if empty
  React.useEffect(() => {
    if (isOpen && !briefingText && !isLoading) {
      generateBriefing();
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (!briefingText) return;
    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        id="executive-briefing-modal"
        className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Executive Investment Briefing & CFO One-Pager
              </h3>
              <p className="text-xs text-slate-400">
                Synthesized business memo ready for VP of Product and CFO review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateBriefing}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors"
              title="Regenerate memo"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Regenerate
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-200 font-sans text-sm leading-relaxed">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-300">
                Drafting defensible executive memo with Gemini...
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Evaluating {industryName} cost-to-value benchmarks and risk mitigation parameters.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold">Unable to generate live AI briefing</p>
                <p className="mt-1">{error}</p>
                <button
                  onClick={generateBriefing}
                  className="mt-2 px-3 py-1 bg-rose-500/20 rounded border border-rose-500/30 text-white hover:bg-rose-500/30 font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-indigo-300 whitespace-pre-line font-sans text-xs sm:text-sm">
              {briefingText}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/70">
          <div className="text-xs text-slate-400 font-mono">
            Modeled: {inputs.scenario.toUpperCase()} | Net ROI: {results.firstYearNetRoi}%
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={isLoading || !briefingText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            <button
              onClick={handleCopy}
              disabled={isLoading || !briefingText}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Memo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
