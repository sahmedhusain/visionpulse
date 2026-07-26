import React from 'react';
import { AlertTriangle, Sliders } from 'lucide-react';

interface RegionAlertProps {
  currentCount: number;
  maxThreshold: number;
  onThresholdChange: (newThreshold: number) => void;
}

export const RegionAlert: React.FC<RegionAlertProps> = ({
  currentCount,
  maxThreshold,
  onThresholdChange
}) => {
  const isExceeded = currentCount >= maxThreshold;

  return (
    <div style={{
      background: isExceeded ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${isExceeded ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
      padding: '0.85rem 1rem',
      borderRadius: '10px',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <AlertTriangle size={20} color={isExceeded ? '#ef4444' : 'var(--accent-cyan)'} />
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isExceeded ? '#fca5a5' : '#fff' }}>
            {isExceeded ? `ALERT: Zone Occupancy Exceeded (${currentCount}/${maxThreshold})` : `Zone Occupancy Threshold: ${maxThreshold} Max`}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Automated alarm triggers when person count reaches or exceeds configured threshold.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sliders size={16} color="var(--text-muted)" />
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Max Limit:</label>
        <input
          type="number"
          min={1}
          max={50}
          value={maxThreshold}
          onChange={(e) => onThresholdChange(Math.max(1, parseInt(e.target.value) || 1))}
          style={{
            width: '60px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: '6px',
            padding: '4px 8px',
            textAlign: 'center',
            fontSize: '0.85rem'
          }}
        />
      </div>
    </div>
  );
};
