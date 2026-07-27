import React from 'react';
import type { HistoryRecord } from '../../types/history';
import { WinWindow } from '../win98/WinWindow';
import { TrendingUp, BarChart2, PieChart, Zap } from 'lucide-react';

interface HistorySvgAnalyticsChartsProps {
  records: HistoryRecord[];
}

export const HistorySvgAnalyticsCharts: React.FC<HistorySvgAnalyticsChartsProps> = ({ records }) => {
  if (!records || records.length === 0) return null;

  // Chronological order (left to right)
  const chronoRecords = [...records].reverse();

  // --- Graph 1: Timeline Occupancy Line Chart SVG Math ---
  const width = 600;
  const height = 180;
  const padding = 30;

  const maxCount = Math.max(...chronoRecords.map(r => r.count), 5);
  const points = chronoRecords.map((r, index) => {
    const x = padding + (index / Math.max(1, chronoRecords.length - 1)) * (width - 2 * padding);
    const y = height - padding - (r.count / maxCount) * (height - 2 * padding);
    return { x, y, count: r.count, label: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
  });

  const pathD = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  // --- Graph 2: 24-Hour Traffic Bar Chart SVG Math ---
  const hourCounts: number[] = new Array(24).fill(0);
  const hourTotalScans: number[] = new Array(24).fill(0);

  records.forEach(r => {
    const hour = new Date(r.timestamp).getHours();
    hourCounts[hour] += r.count;
    hourTotalScans[hour] += 1;
  });

  const hourAverages = hourCounts.map((tot, h) => hourTotalScans[h] > 0 ? tot / hourTotalScans[h] : 0);
  const maxHourAvg = Math.max(...hourAverages, 1);

  // --- Graph 3: Risk Level Donut Chart SVG Math ---
  const lowCount = records.filter(r => r.count <= 3).length;
  const medCount = records.filter(r => r.count > 3 && r.count <= 7).length;
  const highCount = records.filter(r => r.count > 7).length;

  const totalRecs = records.length;
  const lowPct = totalRecs > 0 ? (lowCount / totalRecs) : 0;
  const medPct = totalRecs > 0 ? (medCount / totalRecs) : 0;

  const circumference = 2 * Math.PI * 40; // radius = 40
  const lowStroke = lowPct * circumference;
  const medStroke = medPct * circumference;
  const highStroke = (1 - lowPct - medPct) * circumference;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
      {/* SVG Chart 1: Crowd Size Timeline Curve */}
      <WinWindow title="RPD Occupancy Timeline Trend (SVG)" icon={<TrendingUp size={14} />}>
        <div className="win-inset" style={{ padding: '6px', background: '#000000', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="rpdLineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00ffff" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#333" strokeDasharray="3 3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#333" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#666" />

            {/* Area Fill */}
            {areaD && <path d={areaD} fill="url(#rpdLineGrad)" />}

            {/* Main Trend Line */}
            {pathD && <path d={pathD} fill="none" stroke="#00ffff" strokeWidth="2.5" />}

            {/* Data Points & Values */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="#000" stroke="#00ffff" strokeWidth="2" />
                <text x={p.x} y={p.y - 7} fill="#00ff00" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  {p.count}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </WinWindow>

      {/* SVG Chart 2: 24-Hour Traffic Bar Chart */}
      <WinWindow title="RPD 24-Hour Traffic Density Histogram (SVG)" icon={<BarChart2 size={14} />}>
        <div className="win-inset" style={{ padding: '6px', background: '#000000', overflow: 'hidden' }}>
          <svg viewBox="0 0 400 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Grid lines */}
            <line x1="20" y1="20" x2="380" y2="20" stroke="#333" strokeDasharray="2 2" />
            <line x1="20" y1="80" x2="380" y2="80" stroke="#333" strokeDasharray="2 2" />
            <line x1="20" y1="140" x2="380" y2="140" stroke="#666" />

            {/* Bars for 24 hours */}
            {hourAverages.map((avg, h) => {
              const barHeight = (avg / maxHourAvg) * 110;
              const x = 25 + h * 14.5;
              const y = 140 - barHeight;
              const color = avg > 7 ? '#ff0000' : avg > 3 ? '#ff8c00' : '#00ff00';

              return (
                <g key={h}>
                  <rect x={x} y={y} width="11" height={Math.max(2, barHeight)} fill={color} stroke="#000" strokeWidth="0.5" />
                  {h % 3 === 0 && (
                    <text x={x + 5} y="156" fill="#888" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      {h}h
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </WinWindow>

      {/* SVG Chart 3: Risk Level Donut Segment Chart */}
      <WinWindow title="RPD Occupancy Risk Distribution Donut (SVG)" icon={<PieChart size={14} />}>
        <div className="win-inset" style={{ padding: '8px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-around', minHeight: '140px' }}>
          <svg viewBox="0 0 100 100" style={{ width: '110px', height: '110px' }}>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e0e0e0" strokeWidth="16" />
            {/* Normal Segment (Green) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#008000"
              strokeWidth="16"
              strokeDasharray={`${lowStroke} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            {/* Moderate Segment (Orange) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#ff8c00"
              strokeWidth="16"
              strokeDasharray={`${medStroke} ${circumference}`}
              strokeDashoffset={`-${lowStroke}`}
              transform="rotate(-90 50 50)"
            />
            {/* High Segment (Red) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#800000"
              strokeWidth="16"
              strokeDasharray={`${highStroke} ${circumference}`}
              strokeDashoffset={`-${lowStroke + medStroke}`}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#000080" fontFamily="monospace">
              {records.length} Logs
            </text>
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', fontWeight: 'bold' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#008000', border: '1px solid #000' }} />
              <span>Normal (1-3): {lowCount} ({Math.round(lowPct * 100)}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#ff8c00', border: '1px solid #000' }} />
              <span>Moderate (4-7): {medCount} ({Math.round(medPct * 100)}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#800000', border: '1px solid #000' }} />
              <span>Overcrowded (8+): {highCount} ({Math.round((1 - lowPct - medPct) * 100)}%)</span>
            </div>
          </div>
        </div>
      </WinWindow>

      {/* SVG Chart 4: Neural Inference Speed Latency Scatter */}
      <WinWindow title="RPD Inference Latency Telemetry (SVG)" icon={<Zap size={14} />}>
        <div className="win-inset" style={{ padding: '6px', background: '#04070a', overflow: 'hidden' }}>
          <svg viewBox="0 0 400 140" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <line x1="20" y1="20" x2="380" y2="20" stroke="#222" />
            <line x1="20" y1="70" x2="380" y2="70" stroke="#222" />
            <line x1="20" y1="120" x2="380" y2="120" stroke="#444" />

            {chronoRecords.map((r, idx) => {
              const x = 25 + (idx / Math.max(1, chronoRecords.length - 1)) * 350;
              const maxMs = Math.max(...chronoRecords.map(rec => rec.inference_time_ms), 50);
              const y = 120 - (r.inference_time_ms / maxMs) * 90;
              return (
                <g key={r.id}>
                  <circle cx={x} cy={y} r="3" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
                </g>
              );
            })}
            <text x="30" y="35" fill="#ffff00" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Latency (ms) per Frame Scan
            </text>
          </svg>
        </div>
      </WinWindow>
    </div>
  );
};
