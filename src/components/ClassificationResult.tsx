import React from 'react';
import { CheckCircle, AlertTriangle, Clock, Zap } from 'lucide-react';

interface ClassificationResultProps {
  result: {
    class: string;
    confidence: number;
    ripeness_stage: string;
    description: string;
  };
}

const ClassificationResult: React.FC<ClassificationResultProps> = ({ result }) => {
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'green':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'ripe':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'overripe':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'decay':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'green':
        return <Clock size={20} />;
      case 'ripe':
        return <CheckCircle size={20} />;
      case 'overripe':
        return <AlertTriangle size={20} />;
      case 'decay':
        return <AlertTriangle size={20} />;
      default:
        return <Zap size={20} />;
    }
  };

  const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <div className="space-y-6">
      {/* Main Classification */}
      <div className={`border rounded-xl p-6 ${getStageColor(result.ripeness_stage)}`}>
        <div className="flex items-center mb-3">
          {getStageIcon(result.ripeness_stage)}
          <h3 className="text-xl font-bold ml-2">{result.ripeness_stage}</h3>
        </div>
        <p className="font-medium text-lg">{result.class}</p>
      </div>

      {/* Confidence Score */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-3">Confidence Score</h4>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
          <span className="absolute right-0 top-4 text-sm font-medium text-gray-600">
            {confidencePercentage}%
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-800 mb-2">Recommendation</h4>
        <p className="text-blue-700 leading-relaxed">{result.description}</p>
      </div>

      {/* Quick Tips */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-3">Quick Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Green:</strong> Store at room temperature to ripen
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Ripe:</strong> Perfect for eating fresh
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Overripe:</strong> Good for smoothies and baking but should be consumed soon
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Decay:</strong> Should be discarded
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationResult;