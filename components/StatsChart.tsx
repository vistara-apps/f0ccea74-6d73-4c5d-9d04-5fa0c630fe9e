'use client';

import { TrendingUp, BarChart3 } from 'lucide-react';

export function StatsChart() {
  // Mock data for the chart visualization
  const chartData = [
    { day: 'Mon', tips: 12 },
    { day: 'Tue', tips: 19 },
    { day: 'Wed', tips: 8 },
    { day: 'Thu', tips: 25 },
    { day: 'Fri', tips: 32 },
    { day: 'Sat', tips: 28 },
    { day: 'Sun', tips: 15 },
  ];

  const maxTips = Math.max(...chartData.map(d => d.tips));

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Tip Jar</h3>
        <span className="text-sm text-gray-400 ml-auto">7D</span>
      </div>

      {/* Chart Area */}
      <div className="h-32 flex items-end justify-between gap-2 mb-4">
        {chartData.map((data, index) => (
          <div key={data.day} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm transition-all duration-300 hover:from-blue-400 hover:to-purple-400"
              style={{ 
                height: `${(data.tips / maxTips) * 100}%`,
                minHeight: '4px'
              }}
            />
            <span className="text-xs text-gray-400 mt-2">{data.day}</span>
          </div>
        ))}
      </div>

      {/* Chart Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-gray-400" />
          <span className="text-gray-400">Weekly Total</span>
        </div>
        <span className="font-bold text-gradient">139 tips</span>
      </div>
    </div>
  );
}
