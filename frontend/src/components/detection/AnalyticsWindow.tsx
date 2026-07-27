import React, { useState, useEffect, useRef } from 'react';
import { Activity, Volume2, VolumeX, BarChart2, Zap } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';
import type { PersonDetection } from '../../types/detection';

interface AnalyticsWindowProps {
  count: number;
  avgConfidence: number;
  inferenceTimeMs: number;
  detections: PersonDetection[];
  maxThreshold: number;
}

export const AnalyticsWindow: React.FC<AnalyticsWindowProps> = ({
  count,
  avgConfidence,
  inferenceTimeMs,
  detections,
  maxThreshold
}) => {
  const [peakCount, setPeakCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Track Peak Count
  useEffect(() => {
    if (count > peakCount) {
      setPeakCount(count);
    }
  }, [count, peakCount]);

  // Audio Warning Beep when threshold exceeded
  useEffect(() => {
    if (count >= maxThreshold && soundEnabled) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx && ctx.state === 'running') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz Retro Beep
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15); // Short 150ms beep
        }
      } catch (e) {
        console.error('Audio beep error:', e);
      }
    }
  }, [count, maxThreshold, soundEnabled]);

  // Confidence distribution calculations
  const highConf = detections.filter(d => d.confidence >= 0.8).length;
  const medConf = detections.filter(d => d.confidence >= 0.5 && d.confidence < 0.8).length;
  const lowConf = detections.filter(d => d.confidence < 0.5).length;

  const occupancyPct = Math.min(100, Math.round((count / maxThreshold) * 100));

  return (
    <WinWindow
      title="RPD Advanced Visual Telemetry & Analytics"
      icon={<Activity size={14} />}
      statusBarContent={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: 'bold' }}>
          <span>Peak Count: {peakCount}</span>
          <span>Avg Conf: {Math.round(avgConfidence * 100)}%</span>
          <span>Speed: {inferenceTimeMs}ms</span>
          <span>Audio: {soundEnabled ? '880Hz BEEP' : 'MUTED'}</span>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px' }}>
        {/* Crowd Density Meter Bar (Increased Height to 24px) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontWeight: 'bold' }}>
            <span>Zone Occupancy Gauge:</span>
            <span style={{ color: occupancyPct >= 100 ? '#800000' : '#000080' }}>
              {occupancyPct}% ({count}/{maxThreshold} Limit)
            </span>
          </div>

          <div className="win-inset" style={{ height: '24px', padding: '3px', background: '#e0e0e0', display: 'flex' }}>
            <div
              style={{
                width: `${occupancyPct}%`,
                height: '100%',
                background: occupancyPct >= 100 ? '#800000' : occupancyPct > 70 ? '#ff8c00' : '#008000',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Confidence Breakdown Grid */}
        <div className="win-outdent" style={{ padding: '10px', background: '#c0c0c0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px', marginBottom: '8px', color: '#000080' }}>
            <BarChart2 size={14} />
            <span>Detection Confidence Distribution</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div className="win-inset" style={{ padding: '8px', textAlign: 'center', background: '#ffffff' }}>
              <div style={{ fontSize: '10px', color: '#008000', fontWeight: 'bold' }}>HIGH (&gt;80%)</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#008000', marginTop: '2px' }}>{highConf}</div>
            </div>

            <div className="win-inset" style={{ padding: '8px', textAlign: 'center', background: '#ffffff' }}>
              <div style={{ fontSize: '10px', color: '#ff8c00', fontWeight: 'bold' }}>MED (50-80%)</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff8c00', marginTop: '2px' }}>{medConf}</div>
            </div>

            <div className="win-inset" style={{ padding: '8px', textAlign: 'center', background: '#ffffff' }}>
              <div style={{ fontSize: '10px', color: '#800000', fontWeight: 'bold' }}>LOW (&lt;50%)</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#800000', marginTop: '2px' }}>{lowConf}</div>
            </div>
          </div>
        </div>

        {/* Action Controls & Sound Alarm Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold' }}>
            <Zap size={14} color="#000080" />
            <span>Telemetry Stream Status: Active</span>
          </div>

          <button
            className={`win-btn ${soundEnabled ? '' : 'win-btn-danger'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{ padding: '5px 12px', fontSize: '11px' }}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{soundEnabled ? 'Audio Beep ON' : 'Audio Beep OFF'}</span>
          </button>
        </div>
      </div>
    </WinWindow>
  );
};
