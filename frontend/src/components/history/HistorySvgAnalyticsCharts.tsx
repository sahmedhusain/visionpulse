import React from 'react';
import type { HistoryRecord } from '../../types/history';
import { WinWindow } from '../win98/WinWindow';
import { TrendingUp, BarChart2, PieChart } from 'lucide-react';

interface HistorySvgAnalyticsChartsProps {
  records: HistoryRecord[];
}

export const HistorySvgAnalyticsCharts: React.FC<HistorySvgAnalyticsChartsProps> = ({ records }) => {
  if (!records || records.length === 0) return null;

  // Chronological order (left to right)
  const chronoRecords = [...records].reverse();

  // --- Graph 1: Timeline Occupancy Trend (Stretched Edge-to-Edge) ---
  const width = 1000;
  const height = 180;
  const paddingLeft = 35;
  const paddingBottom = 28;
  const paddingTop = 16;
  const paddingRight = 15;

  const maxCount = Math.max(...chronoRecords.map(r => r.count), 5);
  const yTicks = [0, Math.round(maxCount / 2), maxCount];

  const points = chronoRecords.map((r, index) => {
    const x = paddingLeft + (index / Math.max(1, chronoRecords.length - 1)) * (width - paddingLeft - paddingRight);
    const y = height - paddingBottom - (r.count / maxCount) * (height - paddingTop - paddingBottom);
    const timeStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { x, y, count: r.count, timeStr };
  });

  const pathD = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  // --- Graph 2: 24-Hour Traffic Bar Chart (Stretched Edge-to-Edge) ---
  const hourCounts: number[] = new Array(24).fill(0);
  const hourTotalScans: number[] = new Array(24).fill(0);

  records.forEach(r => {
    const hour = new Date(r.timestamp).getHours();
    hourCounts[hour] += r.count;
    hourTotalScans[hour] += 1;
  });

  const hourAverages = hourCounts.map((tot, h) => hourTotalScans[h] > 0 ? tot / hourTotalScans[h] : 0);
  const maxHourAvg = Math.max(...hourAverages, 1);

  const histLeft = 25;
  const histRight = 975;
  const barWidth = 30;
  const stepX = (histRight - histLeft) / 24;

  // --- Graph 3: Risk Level Donut Chart ---
  const lowCount = records.filter(r => r.count <= 3).length;
  const medCount = records.filter(r => r.count > 3 && r.count <= 7).length;
  const highCount = records.filter(r => r.count > 7).length;

  const totalRecs = records.length;
  const lowPct = totalRecs > 0 ? Math.round((lowCount / totalRecs) * 100) : 0;
  const medPct = totalRecs > 0 ? Math.round((medCount / totalRecs) * 100) : 0;
  const highPct = totalRecs > 0 ? Math.round((highCount / totalRecs) * 100) : 0;

  const circumference = 2 * Math.PI * 45; // radius = 45
  const lowStroke = (lowCount / Math.max(1, totalRecs)) * circumference;
  const medStroke = (medCount / Math.max(1, totalRecs)) * circumference;
  const highStroke = (highCount / Math.max(1, totalRecs)) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
      {/* 1. Large Classic Win98 PerfMon Style Occupancy Trend Chart (Stretches Full Width) */}
      <WinWindow title="RPD Occupancy Telemetry Monitor (PerfMon Style)" icon={<TrendingUp size={14} />}>
        <div className="win-inset" style={{ padding: '6px 4px', background: '#ffffff' }}>
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: '180px', display: 'block' }}>
            {/* Grid lines */}
            <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="#e0e0e0" strokeDasharray="4 4" />
            <line x1={paddingLeft} y1={height / 2} x2={width - paddingRight} y2={height / 2} stroke="#e0e0e0" strokeDasharray="4 4" />
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#808080" strokeWidth="1.5" />
            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#808080" strokeWidth="1.5" />

            {/* Y-Axis Labels */}
            {yTicks.map((val, i) => {
              const yPos = height - paddingBottom - (val / maxCount) * (height - paddingTop - paddingBottom);
              return (
                <text key={i} x={paddingLeft - 6} y={yPos + 4} fill="#000000" fontSize="11" fontFamily="Tahoma, sans-serif" textAnchor="end" fontWeight="bold">
                  {val}
                </text>
              );
            })}

            {/* Main Trend Line in Classic Win98 Navy Blue */}
            {pathD && <path d={pathD} fill="none" stroke="#000080" strokeWidth="3" />}

            {/* Data Points & Numbers */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4.5" fill="#000080" stroke="#ffffff" strokeWidth="1.5" />
                {(i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 10) === 0) && (
                  <>
                    <text x={p.x} y={p.y - 8} fill="#800000" fontSize="11" fontFamily="Tahoma, sans-serif" textAnchor="middle" fontWeight="bold">
                      {p.count}
                    </text>
                    <text x={p.x} y={height - 8} fill="#606060" fontSize="10" fontFamily="Tahoma, sans-serif" textAnchor="middle">
                      {p.timeStr}
                    </text>
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>
      </WinWindow>

      {/* 2. Side-by-Side 24-Hour Histogram & Donut Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '8px' }}>
        {/* 24-Hour Traffic Bar Histogram (Stretches Full Width) */}
        <WinWindow title="RPD 24-Hour Crowd Traffic Histogram" icon={<BarChart2 size={14} />}>
          <div className="win-inset" style={{ padding: '6px 4px', background: '#ffffff' }}>
            <svg viewBox="0 0 1000 160" preserveAspectRatio="none" style={{ width: '100%', height: '160px', display: 'block' }}>
              <line x1={histLeft} y1="20" x2={histRight} y2="20" stroke="#e0e0e0" strokeDasharray="4 4" />
              <line x1={histLeft} y1="70" x2={histRight} y2="70" stroke="#e0e0e0" strokeDasharray="4 4" />
              <line x1={histLeft} y1="120" x2={histRight} y2="120" stroke="#808080" strokeWidth="1.5" />

              {hourAverages.map((avg, h) => {
                const barHeight = (avg / maxHourAvg) * 95;
                const x = histLeft + h * stepX;
                const y = 120 - barHeight;
                const color = avg > 7 ? '#800000' : avg > 3 ? '#ff8c00' : '#008000';

                return (
                  <g key={h}>
                    <rect x={x} y={y} width={barWidth} height={Math.max(2, barHeight)} fill={color} stroke="#000000" strokeWidth="1" />
                    {avg > 0 && (
                      <text x={x + barWidth / 2} y={y - 4} fill="#000000" fontSize="10" fontFamily="Tahoma, sans-serif" textAnchor="middle" fontWeight="bold">
                        {avg.toFixed(1)}
                      </text>
                    )}
                    {h % 2 === 0 && (
                      <text x={x + barWidth / 2} y="138" fill="#000000" fontSize="10" fontFamily="Tahoma, sans-serif" textAnchor="middle" fontWeight="bold">
                        {h}h
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </WinWindow>

        {/* Risk Distribution Donut & Legend */}
        <WinWindow title="RPD Occupancy Risk Distribution" icon={<PieChart size={14} />}>
          <div className="win-inset" style={{ padding: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '160px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                <circle cx="60" cy="60" r="45" fill="transparent" stroke="#e0e0e0" strokeWidth="18" />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#008000"
                  strokeWidth="18"
                  strokeDasharray={`${lowStroke} ${circumference}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#ff8c00"
                  strokeWidth="18"
                  strokeDasharray={`${medStroke} ${circumference}`}
                  strokeDashoffset={`-${lowStroke}`}
                  transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#800000"
                  strokeWidth="18"
                  strokeDasharray={`${highStroke} ${circumference}`}
                  strokeDashoffset={`-${lowStroke + medStroke}`}
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="65" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#000080" fontFamily="Tahoma, sans-serif">
                  {totalRecs} Logs
                </text>
              </svg>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', background: '#008000', border: '1px solid #000' }} />
                  <span>Normal (1-3): {lowCount} ({lowPct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', background: '#ff8c00', border: '1px solid #000' }} />
                  <span>Moderate (4-7): {medCount} ({medPct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', background: '#800000', border: '1px solid #000' }} />
                  <span>Alarm (8+): {highCount} ({highPct}%)</span>
                </div>
              </div>
            </div>
          </div>
        </WinWindow>
      </div>
    </div>
  );
};
