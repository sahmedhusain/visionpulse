import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Activity, Clock } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';
import type { PersonDetection } from '../../types/detection';

interface MiniWidgetsProps {
  count: number;
  avgConfidence: number;
  inferenceTimeMs: number;
  detections: PersonDetection[];
  maxThreshold: number;
}

export const MiniWidgets: React.FC<MiniWidgetsProps> = ({
  count,
  avgConfidence,
  inferenceTimeMs,
  maxThreshold
}) => {
  const isOverflow = count >= maxThreshold;
  const confPct = Math.round(avgConfidence * 100);

  return (
    <WinWindow title="RPD Live Analytics Mini Widgets" icon={<Activity size={14} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {/* Widget 1: Safety & Zone Status */}
        <div className="win-inset" style={{ padding: '6px 8px', background: isOverflow ? '#ffc0c0' : '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#606060' }}>ZONE SAFETY</span>
            {isOverflow ? <ShieldAlert size={14} color="#800000" /> : <ShieldCheck size={14} color="#008000" />}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: isOverflow ? '#800000' : '#008000' }}>
            {isOverflow ? 'ALARM OVERFLOW' : count > 3 ? 'MODERATE' : 'SECURE OK'}
          </div>
          <div style={{ fontSize: '9px', color: '#606060', marginTop: '2px' }}>
            Limit: {count}/{maxThreshold} People
          </div>
        </div>

        {/* Widget 2: Model Accuracy Gauge */}
        <div className="win-inset" style={{ padding: '6px 8px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#606060' }}>MODEL CONF</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#000080' }}>{confPct}%</span>
          </div>
          <div className="win-inset" style={{ height: '10px', padding: '1px', background: '#e0e0e0' }}>
            <div
              style={{
                width: `${confPct}%`,
                height: '100%',
                background: confPct >= 70 ? '#008000' : confPct >= 40 ? '#ff8c00' : '#800000'
              }}
            />
          </div>
          <div style={{ fontSize: '9px', color: '#606060', marginTop: '2px' }}>YOLOv8 Nano Engine</div>
        </div>

        {/* Widget 3: Neural Latency & Hardware Throughput */}
        <div className="win-inset" style={{ padding: '6px 8px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#606060' }}>LATENCY</span>
            <Cpu size={13} color="#000080" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000' }}>
            {inferenceTimeMs} <span style={{ fontSize: '10px', fontWeight: 'normal' }}>ms</span>
          </div>
          <div style={{ fontSize: '9px', color: '#008000', fontWeight: 'bold', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={10} /> Real-Time Inference
          </div>
        </div>
      </div>
    </WinWindow>
  );
};
