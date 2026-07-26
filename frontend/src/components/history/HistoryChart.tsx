import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { HistoryRecord } from '../../types/history';

interface HistoryChartProps {
  records: HistoryRecord[];
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return null;
  }

  // Reverse records so timeline goes left-to-right (chronological)
  const chartData = [...records].reverse().map((r) => {
    const dateObj = new Date(r.timestamp);
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return {
      time: timeStr,
      count: r.count,
      confidence: Math.round(r.avg_confidence * 100),
      duration: r.inference_time_ms
    };
  });

  return (
    <div style={{ width: '100%', height: '240px', marginTop: '1rem', marginBottom: '1.5rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', borderColor: 'rgba(56,189,248,0.3)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
          />
          <Line type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
