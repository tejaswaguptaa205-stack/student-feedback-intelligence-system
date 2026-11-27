import React, { useState } from 'react';
import { ModelEvaluationStats, FeedbackCategory } from '../types';
import { EVALUATION_DATA } from '../data/evaluationData';
import { CategoryBadge } from '../components/common/Badges';
import {
  CheckCheck,
  Download,
  AlertCircle,
  HelpCircle,
  FileCheck,
  BarChart,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ModelEvaluationPageProps {
  onExportEvaluation: () => void;
}

export const ModelEvaluationPage: React.FC<ModelEvaluationPageProps> = ({
  onExportEvaluation
}) => {
  const stats = EVALUATION_DATA;
  const [selectedCell, setSelectedCell] = useState<{
    trueCategory: FeedbackCategory;
    predCategory: FeedbackCategory;
    count: number;
  } | null>(null);

  const categories = stats.confusionMatrix.labels;

  return (
    <div className="space-y-6">
      {/* Top Evaluation Credibility Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#EBF1F6] text-[#244A73] rounded">
                <CheckCheck className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-[#20242B]">
                Academic NLP Model Evaluation & Benchmarks
              </h2>
            </div>
            <p className="text-xs text-[#697386]">
              Standardized held-out test dataset validation for model <span className="font-mono text-[#244A73] font-semibold">{stats.modelVersion}</span>.
            </p>
          </div>

          <button
            onClick={onExportEvaluation}
            className="px-3 py-1.5 bg-[#244A73] hover:bg-[#1B3756] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Benchmark JSON
          </button>
        </div>

        {/* 5 Core Evaluation Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
            <div className="text-[11px] font-semibold text-[#697386] uppercase">Overall Accuracy</div>
            <div className="text-2xl font-bold text-[#20242B] mt-1">{stats.overallAccuracy}%</div>
            <div className="text-[10px] text-emerald-700 font-medium">8-Category multi-class</div>
          </div>

          <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
            <div className="text-[11px] font-semibold text-[#697386] uppercase">Macro Precision</div>
            <div className="text-2xl font-bold text-[#20242B] mt-1">{stats.overallPrecision}%</div>
            <div className="text-[10px] text-[#697386]">Avg precision across classes</div>
          </div>

          <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
            <div className="text-[11px] font-semibold text-[#697386] uppercase">Macro Recall</div>
            <div className="text-2xl font-bold text-[#20242B] mt-1">{stats.overallRecall}%</div>
            <div className="text-[10px] text-[#697386]">Sensitivity across classes</div>
          </div>

          <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
            <div className="text-[11px] font-semibold text-[#697386] uppercase">F1-Score</div>
            <div className="text-2xl font-bold text-[#244A73] mt-1">{stats.overallF1}%</div>
            <div className="text-[10px] text-[#697386]">Harmonic mean (P & R)</div>
          </div>

          <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
            <div className="text-[11px] font-semibold text-[#697386] uppercase">Sentiment Accuracy</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.sentimentAccuracy}%</div>
            <div className="text-[10px] text-[#697386]">Pos / Neu / Neg 3-class</div>
          </div>
        </div>
      </div>

      {/* 8x8 Interactive Confusion Matrix */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#20242B] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#244A73]" />
              Confusion Matrix (True Label vs Predicted Label)
            </h3>
            <p className="text-xs text-[#697386]">
              Diagonal cells reflect correct predictions. Off-diagonal cells indicate boundary confusion.
            </p>
          </div>
          {selectedCell && (
            <div className="text-xs bg-[#EBF1F6] text-[#244A73] px-3 py-1 rounded border border-[#244A73]/20 font-medium">
              True: <strong>{selectedCell.trueCategory}</strong> → Pred: <strong>{selectedCell.predCategory}</strong> ({selectedCell.count} samples)
            </div>
          )}
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 border border-transparent"></th>
                <th colSpan={categories.length} className="p-1.5 text-center text-[11px] font-semibold text-[#244A73] uppercase bg-gray-50 border border-gray-200">
                  Predicted Class →
                </th>
              </tr>
              <tr className="bg-gray-100 text-[#697386] text-[10px] font-semibold uppercase">
                <th className="p-2 border border-gray-200 text-left w-28">True Class ↓</th>
                {categories.map(c => (
                  <th key={c} className="p-2 border border-gray-200 max-w-[80px] truncate" title={c}>
                    {c.slice(0, 5)}..
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.confusionMatrix.matrix.map((row, rIdx) => {
                const trueLabel = categories[rIdx];
                return (
                  <tr key={trueLabel}>
                    <td className="p-2 border border-gray-200 text-left font-semibold text-[#20242B] bg-gray-50 text-[11px]">
                      {trueLabel}
                    </td>
                    {row.map((val, cIdx) => {
                      const predLabel = categories[cIdx];
                      const isDiagonal = rIdx === cIdx;
                      let bgClass = 'bg-white hover:bg-gray-50';
                      if (isDiagonal) {
                        bgClass = val > 140 ? 'bg-emerald-100/70 font-bold text-emerald-900' : 'bg-emerald-50 text-emerald-800 font-semibold';
                      } else if (val > 0) {
                        bgClass = val >= 4 ? 'bg-red-50 text-red-700 font-medium' : 'bg-amber-50/50 text-gray-700';
                      }

                      return (
                        <td
                          key={predLabel}
                          onClick={() => setSelectedCell({ trueCategory: trueLabel, predCategory: predLabel, count: val })}
                          className={`p-2 border border-gray-200 font-mono cursor-pointer transition-colors ${bgClass}`}
                          title={`True: ${trueLabel}, Predicted: ${predLabel} = ${val} items`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Category Evaluation Metrics Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden">
        <div className="p-3 border-b border-[#E5E7EB] bg-[#F7F8FA]">
          <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
            Per-Category Precision, Recall, and F1-Scores
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-gray-50 text-[#697386] font-semibold text-[11px] uppercase">
                <th className="py-2.5 px-3">Category Class</th>
                <th className="py-2.5 px-3 text-right">Support (Samples)</th>
                <th className="py-2.5 px-3 text-right">Precision</th>
                <th className="py-2.5 px-3 text-right">Recall</th>
                <th className="py-2.5 px-3 text-right">F1-Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.perCategoryMetrics.map(row => (
                <tr key={row.category} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-semibold text-[#20242B]">
                    <CategoryBadge category={row.category} />
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">{row.samples}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-gray-700">{row.precision}%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-gray-700">{row.recall}%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#244A73]">
                    {row.f1Score}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Misclassification Inspector */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs space-y-4">
        <div className="border-b border-[#E5E7EB] pb-2">
          <h3 className="text-sm font-bold text-[#20242B] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Misclassification Inspector & Error Analysis
          </h3>
          <p className="text-xs text-[#697386]">
            Analyze test instances where model prediction diverged from ground-truth labels to guide model fine-tuning.
          </p>
        </div>

        <div className="space-y-3">
          {stats.misclassifiedExamples.map(item => (
            <div key={item.id} className="p-4 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg text-xs space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#244A73]">{item.id}</span>
                  <span className="text-[#697386]">Ground Truth:</span>
                  <CategoryBadge category={item.trueCategory} />
                  <span className="text-[#697386]">→ Predicted:</span>
                  <CategoryBadge category={item.predictedCategory} />
                </div>
                <span className="font-mono text-[11px] text-[#697386]">
                  Model Confidence: {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <p className="text-gray-800 bg-white p-2.5 rounded border border-gray-200 leading-relaxed">
                "{item.text}"
              </p>

              <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded text-amber-900">
                <span className="font-semibold">Root Cause Attribution:</span> {item.errorReason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
