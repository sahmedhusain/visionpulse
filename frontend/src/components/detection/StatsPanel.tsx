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
    <WinWindow title="RPD Live Metrics & Zone Status" icon={<Users size={14} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        {/* Count Metric */}
        <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: isThresholdExceeded ? '#ffc0c0' : '#ffffff' }}>
          <div style={{ fontSize: '10px', color: '#808080', fontWeight: 'bold' }}>COUNT</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: isThresholdExceeded ? '#800000' : '#000080' }}>
            {count}
          </div>
        </div>

        {/* Confidence Metric */}
        <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ fontSize: '10px', color: '#808080', fontWeight: 'bold' }}>CONFIDENCE</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#008000' }}>
            {Math.round(avgConfidence * 100)}%
          </div>
        </div>

        {/* Inference Time Metric */}
        <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ fontSize: '10px', color: '#808080', fontWeight: 'bold' }}>SPEED</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', marginTop: '2px' }}>
            {inferenceTimeMs} <span style={{ fontSize: '10px' }}>ms</span>
          </div>
        </div>

        {/* Alert Status Metric */}
        <div className="win-inset" style={{ padding: '6px', textAlign: 'center', background: isThresholdExceeded ? '#800000' : '#008000', color: '#ffffff' }}>
          <div style={{ fontSize: '9px', fontWeight: 'bold' }}>ZONE STATUS</div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '6px' }}>
            {isThresholdExceeded ? 'ALARM OVERFLOW' : 'NORMAL OK'}
          </div>
        </div>
      </div>
    </WinWindow>
  );
};
