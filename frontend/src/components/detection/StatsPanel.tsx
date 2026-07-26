import React from 'react';
import { Users } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';

interface StatsPanelProps {
  count: number;
  avgConfidence: number;
  inferenceTimeMs: number;
  threshold?: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  count,
  avgConfidence,
  inferenceTimeMs,
  threshold = 5
}) => {
  const isThresholdExceeded = count >= threshold;

  return (
    <WinWindow title="RPD Live Metrics & System Telemetry" icon={<Users size={14} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {/* Count Metric */}
        <div className="win-inset" style={{ padding: '8px', textAlign: 'center', background: isThresholdExceeded ? '#ffc0c0' : '#ffffff' }}>
          <div style={{ fontSize: '11px', color: '#606060', fontWeight: 'bold' }}>PEOPLE COUNT</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: isThresholdExceeded ? '#800000' : '#000080', marginTop: '2px' }}>
            {count}
          </div>
        </div>

        {/* Confidence Metric */}
        <div className="win-inset" style={{ padding: '8px', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ fontSize: '11px', color: '#606060', fontWeight: 'bold' }}>AVG CONFIDENCE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#008000', marginTop: '2px' }}>
            {Math.round(avgConfidence * 100)}%
          </div>
        </div>

        {/* Inference Time Metric */}
        <div className="win-inset" style={{ padding: '8px', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ fontSize: '11px', color: '#606060', fontWeight: 'bold' }}>INFERENCE SPEED</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000', marginTop: '4px' }}>
            {inferenceTimeMs} <span style={{ fontSize: '11px', fontWeight: 'normal' }}>ms</span>
          </div>
        </div>

        {/* Alert Status Metric */}
        <div className="win-inset" style={{ padding: '8px', textAlign: 'center', background: isThresholdExceeded ? '#800000' : '#008000', color: '#ffffff' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}>ZONE STATUS</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '8px' }}>
            {isThresholdExceeded ? 'ALARM OVERFLOW' : 'NORMAL OK'}
          </div>
        </div>
      </div>
    </WinWindow>
  );
};
