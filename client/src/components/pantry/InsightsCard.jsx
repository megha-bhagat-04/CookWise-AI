import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '../common/Card';

const InsightsCard = ({ insights = [], isLoading }) => {
  return (
    <Card className="bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-blue-500/10 border-purple-500/20 p-6 rounded-3xl h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-slate-900">Pantry Insights</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : insights.length > 0 ? (
        <ul className="space-y-3 text-sm text-slate-700">
          {insights.map((insight, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-purple-500 mt-0.5">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 italic">No insights available right now.</p>
      )}
    </Card>
  );
};

export default InsightsCard;
