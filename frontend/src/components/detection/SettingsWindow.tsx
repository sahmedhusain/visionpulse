import React from 'react';
import { Sliders, AlertTriangle } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';

interface SettingsWindowProps {
  isOpen: boolean;
  onClose: () => void;
  confThreshold: number;
  onConfThresholdChange: (newVal: number) => void;
  maxThreshold: number;
  onMaxThresholdChange: (newVal: number) => void;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  isOpen,
  onClose,
  confThreshold,
  onConfThresholdChange,
  maxThreshold,
  onMaxThresholdChange
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '380px', maxWidth: '100%' }}>
        <WinWindow title="RPD System Configuration & Settings" icon={<Sliders size={14} />} onClose={onClose}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px' }}>
            {/* Confidence Threshold Setting */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 'bold', fontSize: '11px' }}>
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
                Lower threshold increases detection sensitivity for occluded figures.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff' }} />

            {/* Restricted Zone Occupancy Alert Setting */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px' }}>
                  <AlertTriangle size={14} color="#800000" />
                  <span>Zone Occupancy Limit:</span>
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
                Triggers visual alarm status when person count reaches or exceeds limit.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="win-btn" onClick={onClose} style={{ padding: '4px 16px', fontWeight: 'bold' }}>
                OK / Save
              </button>
            </div>
          </div>
        </WinWindow>
      </div>
    </div>
  );
};
