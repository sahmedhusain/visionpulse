import React from 'react';
import type { HistoryRecord } from '../../types/history';
import { WinWindow } from '../win98/WinWindow';
import { PieChart, TrendingUp, Clock } from 'lucide-react';

interface HistoryAnalyticsSummaryProps {
  records: HistoryRecord[];
  total: number;
}

export const HistoryAnalyticsSummary: React.FC<HistoryAnalyticsSummaryProps> = ({ records, total }) => {
  if (records.length === 0) {
    return (
      <WinWindow title="RPD Executive Telemetry & Summary" icon={<PieChart size={14} />}>
        <div className="win-inset" style={{ padding: '12px', textAlign: 'center', color: '#808080', fontSize: '11px' }}>
          No analytics data available. Perform detection scans to generate history database.
        </div>
      </WinWindow>
    );
  }

  // Calculate metrics
  const peakCount = Math.max(...records.map(r => r.count), 0);
  const totalCountSum = records.reduce((acc, r) => acc + r.count, 0);
  const avgCount = (totalCountSum / records.length).toFixed(1);
  const avgConf = Math.round((records.reduce((acc, r) => acc + r.avg_confidence, 0) / records.length) * 100);
  const avgLatency = Math.round(records.reduce((acc, r) => acc + r.inference_time_ms, 0) / records.length);

  // Risk distribution
  const lowOccupancy = records.filter(r => r.count <= 3).length;
  const medOccupancy = records.filter(r => r.count > 3 && r.count <= 7).length;
  const highOccupancy = records.filter(r => r.count > 7).length;

  const lowPct = Math.round((lowOccupancy / records.length) * 100);
  const medPct = Math.round((medOccupancy / records.length) * 100);
  const highPct = Math.round((highOccupancy / records.length) * 100);

  // Peak Hour Calculation
  const hourCounts: { [hour: number]: { total: number; count: number } } = {};
  records.forEach(r => {
    const hour = new Date(r.timestamp).getHours();
    if (!hourCounts[hour]) hourCounts[hour] = { total: 0, count: 0 };
    hourCounts[hour].total += r.count;
    hourCounts[hour].count += 1;
  });

  let peakHour = -1;
  let maxAvgInHour = 0;
  Object.keys(hourCounts).forEach(hStr => {
    const h = parseInt(hStr);
    const avg = hourCounts[h].total / hourCounts[h].count;
    if (avg > maxAvgInHour) {
      maxAvgInHour = avg;
      peakHour = h;
    }
  });

  const peakHourLabel = peakHour !== -1 ? `${peakHour}:00 - ${peakHour + 1}:00` : 'N/A';

  return (
    <WinWindow title="RPD Executive Telemetry & Summary Analytics" icon={<PieChart size={14} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Top 5 Stat Metrics Windows */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: '#ffffff' }}>
            <div style={{ fontSize: '10px', color: '#606060', fontWeight: 'bold' }}>TOTAL SCANS</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000080', marginTop: '2px' }}>{total}</div>
          </div>

          <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: '#ffffff' }}>
            <div style={{ fontSize: '10px', color: '#606060', fontWeight: 'bold' }}>PEAK CROWD</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#800000', marginTop: '2px' }}>{peakCount}</div>
          </div>

          <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: '#ffffff' }}>
            <div style={{ fontSize: '10px', color: '#606060', fontWeight: 'bold' }}>AVG OCCUPANCY</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#008000', marginTop: '2px' }}>{avgCount}</div>
          </div>

          <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: '#ffffff' }}>
            <div style={{ fontSize: '10px', color: '#606060', fontWeight: 'bold' }}>AVG ACCURACY</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000080', marginTop: '2px' }}>{avgConf}%</div>
          </div>

          <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: '#ffffff' }}>
            <div style={{ fontSize: '10px', color: '#606060', fontWeight: 'bold' }}>AVG SPEED</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', marginTop: '2px' }}>{avgLatency} ms</div>
          </div>
        </div>

        {/* Occupancy Risk Level Breakdown Bar & Peak Traffic Hour */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '6px' }}>
          <div className="win-outdent" style={{ padding: '8px', background: '#c0c0c0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px', marginBottom: '6px', color: '#000080' }}>
              <TrendingUp size={13} /> Occupancy Density Distribution Breakdown
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <div className="win-inset" style={{ padding: '6px', background: '#ffffff', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#008000' }}>NORMAL (1-3)</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{lowOccupancy} ({lowPct}%)</div>
              </div>

              <div className="win-inset" style={{ padding: '6px', background: '#ffffff', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#ff8c00' }}>MODERATE (4-7)</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{medOccupancy} ({medPct}%)</div>
              </div>

              <div className="win-inset" style={{ padding: '6px', background: '#ffffff', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#800000' }}>HIGH (8+)</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{highOccupancy} ({highPct}%)</div>
              </div>
            </div>
          </div>

          <div className="win-outdent" style={{ padding: '8px', background: '#c0c0c0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px', color: '#000080', marginBottom: '4px' }}>
              <Clock size={13} /> Peak Traffic Window
            </div>
            <div className="win-inset" style={{ padding: '8px', background: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#800000' }}>{peakHourLabel}</div>
              <div style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>Highest Avg Density: {maxAvgInHour.toFixed(1)} people</div>
            </div>
          </div>
        </div>
      </div>
    </WinWindow>
  );
};
