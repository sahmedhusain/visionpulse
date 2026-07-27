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
  const width = 500;
  const height = 110;
  const padding = 20;

  const maxCount = Math.max(...chronoRecords.map(r => r.count), 5);
  const points = chronoRecords.map((r, index) => {
    const x = padding + (index / Math.max(1, chronoRecords.length - 1)) * (width - 2 * padding);
    const y = height - padding - (r.count / maxCount) * (height - 2 * padding);
    return { x, y, count: r.count };
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

  const circumference = 2 * Math.PI * 30; // radius = 30
  const lowStroke = lowPct * circumference;
  const medStroke = medPct * circumference;
  const highStroke = (1 - lowPct - medPct) * circumference;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
      {/* SVG Chart 1: Compact Crowd Size Timeline Curve */}
      <WinWindow title="RPD Occupancy Trend (SVG)" icon={<TrendingUp size={13} />}>
        <div className="win-inset" style={{ padding: '4px', background: '#000000', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '95px', display: 'block' }}>
            <defs>
              <linearGradient id="rpdLineGradCompact" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00ffff" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#222" strokeDasharray="2 2" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#222" strokeDasharray="2 2" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#555" />

            {/* Area Fill */}
            {areaD && <path d={areaD} fill="url(#rpdLineGradCompact)" />}

            {/* Main Trend Line */}
            {pathD && <path d={pathD} fill="none" stroke="#00ffff" strokeWidth="2" />}

            {/* Data Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="2.5" fill="#000" stroke="#00ffff" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
        </div>
      </WinWindow>

      {/* SVG Chart 2: Compact 24-Hour Traffic Bar Chart */}
      <WinWindow title="RPD 24h Density Histogram (SVG)" icon={<BarChart2 size={13} />}>
        <div className="win-inset" style={{ padding: '4px', background: '#000000', overflow: 'hidden' }}>
          <svg viewBox="0 0 360 110" style={{ width: '100%', height: '95px', display: 'block' }}>
            <line x1="15" y1="15" x2="345" y2="15" stroke="#222" strokeDasharray="2 2" />
            <line x1="15" y1="55" x2="345" y2="55" stroke="#222" strokeDasharray="2 2" />
            <line x1="15" y1="90" x2="345" y2="90" stroke="#555" />

            {hourAverages.map((avg, h) => {
              const barHeight = (avg / maxHourAvg) * 70;
              const x = 20 + h * 13.5;
              const y = 90 - barHeight;
              const color = avg > 7 ? '#ff0000' : avg > 3 ? '#ff8c00' : '#00ff00';

              return (
                <g key={h}>
                  <rect x={x} y={y} width="9" height={Math.max(2, barHeight)} fill={color} stroke="#000" strokeWidth="0.5" />
                  {h % 4 === 0 && (
                    <text x={x + 4} y="104" fill="#888" fontSize="7" fontFamily="monospace" textAnchor="middle">
                      {h}h
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </WinWindow>

      {/* SVG Chart 3: Compact Risk Level Donut Chart */}
      <WinWindow title="RPD Risk Distribution Donut (SVG)" icon={<PieChart size={13} />}>
        <div className="win-inset" style={{ padding: '6px 10px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '95px' }}>
          <svg viewBox="0 0 80 80" style={{ width: '75px', height: '75px' }}>
            <circle cx="40" cy="40" r="30" fill="transparent" stroke="#e0e0e0" strokeWidth="12" />
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="transparent"
              stroke="#008000"
              strokeWidth="12"
              strokeDasharray={`${lowStroke} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 40 40)"
            />
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="transparent"
              stroke="#ff8c00"
              strokeWidth="12"
              strokeDasharray={`${medStroke} ${circumference}`}
              strokeDashoffset={`-${lowStroke}`}
              transform="rotate(-90 40 40)"
            />
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="transparent"
              stroke="#800000"
              strokeWidth="12"
              strokeDasharray={`${highStroke} ${circumference}`}
              strokeDashoffset={`-${lowStroke + medStroke}`}
              transform="rotate(-90 40 40)"
            />
            <text x="40" y="44" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#000080" fontFamily="monospace">
              {records.length}
            </text>
          </svg>

          {/* Compact Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '10px', fontWeight: 'bold' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#008000', border: '1px solid #000' }} />
              <span>Normal (1-3): {lowCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#ff8c00', border: '1px solid #000' }} />
              <span>Moderate (4-7): {medCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#800000', border: '1px solid #000' }} />
              <span>Alarm (8+): {highCount}</span>
            </div>
          </div>
        </div>
      </WinWindow>

      {/* SVG Chart 4: Compact Neural Inference Speed Latency Chart */}
      <WinWindow title="RPD Latency Telemetry (SVG)" icon={<Zap size={13} />}>
        <div className="win-inset" style={{ padding: '4px', background: '#04070a', overflow: 'hidden' }}>
          <svg viewBox="0 0 360 110" style={{ width: '100%', height: '95px', display: 'block' }}>
            <line x1="15" y1="15" x2="345" y2="15" stroke="#222" />
            <line x1="15" y1="55" x2="345" y2="55" stroke="#222" />
            <line x1="15" y1="90" x2="345" y2="90" stroke="#444" />

            {chronoRecords.map((r, idx) => {
              const x = 20 + (idx / Math.max(1, chronoRecords.length - 1)) * 325;
              const maxMs = Math.max(...chronoRecords.map(rec => rec.inference_time_ms), 50);
              const y = 90 - (r.inference_time_ms / maxMs) * 70;
              return (
                <g key={r.id}>
                  <circle cx={x} cy={y} r="2.5" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
                </g>
              );
            })}
            <text x="25" y="28" fill="#ffff00" fontSize="9" fontFamily="monospace" fontWeight="bold">
              Latency (ms) Speed Plot
            </text>
          </svg>
        </div>
      </WinWindow>
    </div>
  );
};
