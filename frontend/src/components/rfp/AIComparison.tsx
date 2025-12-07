import { Sparkles } from 'lucide-react';

interface Comparison {
  recommendation: string;
  reasoning: string;
  comparisons: {
    vendorName: string;
    score: number;
    summary: string;
  }[];
}

interface AIComparisonProps {
  comparison: Comparison | null;
}

const AIComparison = ({ comparison }: AIComparisonProps) => {
  if (!comparison) return null;

  return (
    <div className="glass-card rounded-2xl p-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">AI Recommendation</h3>
          <p className="text-sm text-gray-600">Powered by Gemini AI</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <p className="font-semibold text-lg text-gray-900 mb-2">
          Recommended: {comparison.recommendation}
        </p>
        <p className="text-gray-700">{comparison.reasoning}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comparison.comparisons?.map((comp, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-900">{comp.vendorName}</span>
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {comp.score}/100
              </span>
            </div>
            <p className="text-sm text-gray-600">{comp.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIComparison;
