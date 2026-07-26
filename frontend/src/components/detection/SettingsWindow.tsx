import React from 'react';
import { Sliders, AlertTriangle } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';

interface SettingsWindowProps {
  confThreshold: number;
  onConfThresholdChange: (newVal: number) => void;
  maxThreshold: number;
  onMaxThresholdChange: (newVal: number) => void;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  confThreshold,
  onConfThresholdChange,
  maxThreshold,
  onMaxThresholdChange
}) => {
  return (
    <WinWindow title="RPD Detection Settings & Thresholds" icon={<Sliders size={14} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Confidence Threshold Setting */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold', fontSize: '11px' }}>
            <span>Model Confidence Threshold:</span>
            <span style={{ color: '#000080' }}>{Math.round(confThreshold * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={confThreshold}
            onChange={(e) => onConfThresholdChange(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#000080' }}
          />
          <p style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>
            Lower threshold increases sensitivity for occluded or distant figures.
          </p>
        </div>

        <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff' }} />

        {/* Restricted Zone Occupancy Alert Setting */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px' }}>
              <AlertTriangle size={14} color="#800000" />
              <span>Zone Capacity Limit:</span>
            </div>
            <input
              type="number"
              className="win-inset"
              min={1}
              max={50}
              value={maxThreshold}
              onChange={(e) => onMaxThresholdChange(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '50px', padding: '2px 4px', fontSize: '11px', textAlign: 'center', fontWeight: 'bold' }}
            />
          </div>
          <p style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>
            Triggers visual alarm whenever visible person count reaches or exceeds limit.
          </p>
        </div>
      </div>
    </WinWindow>
  );
};
