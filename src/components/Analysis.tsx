import React from 'react';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisProps {
  result: AnalysisResult | null;
  loading: boolean;
}

export const Analysis: React.FC<AnalysisProps> = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!result) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Security Analysis</h2>
      </div>

      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRiskColor(result.riskLevel)}`}>
        {result.riskLevel === 'high' && <AlertTriangle className="w-4 h-4 mr-1" />}
        {result.riskLevel === 'low' && <CheckCircle className="w-4 h-4 mr-1" />}
        Risk Level: {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
      </div>

      <div className="prose max-w-none">
        <h3 className="text-lg font-medium mb-2">Analysis</h3>
        <p className="text-gray-700 mb-4">{result.analysis}</p>

        <h3 className="text-lg font-medium mb-2">Recommendations</h3>
        <ul className="list-disc list-inside space-y-2">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="text-gray-700">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};