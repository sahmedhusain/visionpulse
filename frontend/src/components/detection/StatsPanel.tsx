import React from 'react';
import { Users, Gauge, Clock, ShieldAlert } from 'lucide-react';
import { Card } from '../common/Card';

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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
      <Card style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>People Detected</span>
          <Users size={18} color="var(--accent-cyan)" />
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.2rem', color: isThresholdExceeded ? 'var(--accent-rose)' : '#fff' }}>
          {count}
        </div>
      </Card>

      <Card style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Avg Confidence</span>
          <Gauge size={18} color="var(--accent-emerald)" />
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--accent-emerald)' }}>
          {Math.round(avgConfidence * 100)}%
        </div>
      </Card>

      <Card style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Inference Time</span>
          <Clock size={18} color="var(--accent-purple)" />
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--accent-purple)' }}>
          {inferenceTimeMs} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>ms</span>
        </div>
      </Card>

      <Card style={{ padding: '1rem', background: isThresholdExceeded ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Zone Alert Status</span>
          <ShieldAlert size={18} color={isThresholdExceeded ? 'var(--accent-rose)' : 'var(--accent-emerald)'} />
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.4rem', color: isThresholdExceeded ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
          {isThresholdExceeded ? 'RESTRICTED CAPACITY' : 'NORMAL DENSITY'}
        </div>
      </Card>
    </div>
  );
};
