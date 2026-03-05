import React from 'react';

export default function StatCard({ title, value, sub, icon: Icon, iconBg, valueColor = 'text-white', trend }) {
  return (
    <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#8b8fa8] uppercase font-medium tracking-wide">{title}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg || 'bg-[#1e2130]'}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold font-mono ${valueColor}`}>{value}</div>
      {sub && <div className="text-xs text-[#8b8fa8] mt-1">{sub}</div>}
      {trend !== undefined && (
        <div className={`text-xs font-mono mt-1 ${trend >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(2)}%
        </div>
      )}
    </div>
  );
}