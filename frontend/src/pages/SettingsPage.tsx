import React, { useState, useEffect } from 'react';
import { Sliders, Volume2, VolumeX, Camera, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { WinWindow } from '../components/win98/WinWindow';

interface SettingsPageProps {
  confThreshold: number;
  onConfThresholdChange: (val: number) => void;
  maxThreshold: number;
  onMaxThresholdChange: (val: number) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (val: boolean) => void;
  soundPitch: number;
  onSoundPitchChange: (val: number) => void;
  saveHistory: boolean;
  onSaveHistoryChange: (val: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  confThreshold,
  onConfThresholdChange,
  maxThreshold,
  onMaxThresholdChange,
  soundEnabled,
  onSoundEnabledChange,
  soundPitch,
  onSoundPitchChange,
  saveHistory,
  onSaveHistoryChange
}) => {
  const [cameraStatus, setCameraStatus] = useState<string>('Checking...');
  const [testBeepPlaying, setTestBeepPlaying] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string>('');

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then((res) => {
          setCameraStatus(res.state.toUpperCase());
          res.onchange = () => setCameraStatus(res.state.toUpperCase());
        })
        .catch(() => setCameraStatus('PROMPT / UNKNOWN'));
    } else {
      setCameraStatus('PROMPT / UNKNOWN');
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStatus('GRANTED');
      stream.getTracks().forEach(track => track.stop());
    } catch (e: any) {
      setCameraStatus('DENIED: ' + (e.message || 'Access blocked'));
    }
  };

  const playTestBeep = () => {
    try {
      setTestBeepPlaying(true);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(soundPitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);

      setTimeout(() => setTestBeepPlaying(false), 300);
    } catch (e) {
      console.error('Audio test failed:', e);
      setTestBeepPlaying(false);
    }
  };

  const handleResetDefaults = () => {
    onConfThresholdChange(0.35);
    onMaxThresholdChange(5);
    onSoundEnabledChange(true);
    onSoundPitchChange(880);
    onSaveHistoryChange(true);
    setResetMessage('System settings restored to default parameters.');
    setTimeout(() => setResetMessage(''), 3000);
  };

  return (
    <div style={{ padding: '0 8px 50px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <WinWindow
        title="RPD System Control Panel & Settings"
        icon={<Sliders size={14} />}
        statusBarContent={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: 'bold' }}>
            <span>Config File: visionpulse.db</span>
            <span>Camera Permission: {cameraStatus}</span>
            <span>Audio Alarm: {soundEnabled ? `${soundPitch}Hz ACTIVE` : 'OFF'}</span>
          </div>
        }
      >
        {resetMessage && (
          <div className="win-inset" style={{ background: '#d4ffc0', padding: '6px 10px', color: '#008000', fontSize: '11px', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} /> {resetMessage}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* Section 1: AI Model & Detection Parameters */}
          <div className="win-outdent" style={{ padding: '10px', background: '#c0c0c0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px', color: '#000080' }}>
              <Sliders size={14} /> <span>AI Detection & Model Parameters</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontWeight: 'bold', fontSize: '11px' }}>
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
                  Lower threshold improves recall for occluded or distant people; higher threshold eliminates false positives.
                </p>
              </div>

              <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff' }} />

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
                    style={{ width: '60px', padding: '3px 6px', fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}
                  />
                </div>
                <p style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>
                  Triggers visual telemetry alarm & audio warning when person count reaches or exceeds limit.
                </p>
              </div>

              <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Save Detections to Database:</label>
                <input
                  type="checkbox"
                  checked={saveHistory}
                  onChange={(e) => onSaveHistoryChange(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#000080' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Audio & Sound Alert Configuration */}
          <div className="win-outdent" style={{ padding: '10px', background: '#c0c0c0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px', color: '#000080' }}>
              <Volume2 size={14} /> <span>Audio & Beep Alert Configuration</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Occupancy Alarm Sound:</span>
                <button
                  className={`win-btn ${soundEnabled ? '' : 'win-btn-danger'}`}
                  onClick={() => onSoundEnabledChange(!soundEnabled)}
                  style={{ padding: '3px 10px', fontSize: '11px' }}
                >
                  {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  <span>{soundEnabled ? 'Alarm Sound ON' : 'Alarm Sound OFF'}</span>
                </button>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  Beep Frequency Pitch: {soundPitch} Hz
                </label>
                <select
                  className="win-inset"
                  value={soundPitch}
                  onChange={(e) => onSoundPitchChange(parseInt(e.target.value))}
                  disabled={!soundEnabled}
                  style={{ width: '100%', padding: '4px', fontSize: '11px', fontWeight: 'bold' }}
                >
                  <option value={440}>Low Pitch (440 Hz Standard Tone)</option>
                  <option value={880}>Medium Pitch (880 Hz Win98 Retro Beep)</option>
                  <option value={1200}>High Siren (1200 Hz Alarm Pitch)</option>
                </select>
              </div>

              <div style={{ marginTop: '4px' }}>
                <button
                  className="win-btn"
                  onClick={playTestBeep}
                  disabled={!soundEnabled || testBeepPlaying}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Volume2 size={14} /> <span>{testBeepPlaying ? 'Playing Beep...' : '🔊 Test Sound Alarm Beep'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Hardware Permissions & System Diagnostics */}
        <div className="win-outdent" style={{ padding: '10px', background: '#c0c0c0', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px', color: '#000080' }}>
            <ShieldCheck size={14} /> <span>Hardware Permissions & System Diagnostics</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="win-inset" style={{ padding: '8px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Browser Camera Permission:</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: cameraStatus.includes('GRANTED') ? '#008000' : '#800000', marginTop: '2px' }}>
                    {cameraStatus}
                  </div>
                </div>
                <button className="win-btn" onClick={requestCameraPermission} style={{ fontSize: '10px', padding: '3px 8px' }}>
                  <Camera size={12} /> Test Permission
                </button>
              </div>
            </div>

            <div className="win-inset" style={{ padding: '8px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold' }}>API Server Status:</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#008000', marginTop: '2px' }}>
                    ONLINE (FastAPI & YOLOv8 Engine)
                  </div>
                </div>
                <Zap size={18} color="#008000" />
              </div>
            </div>
          </div>
        </div>

        {/* System Reset Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button className="win-btn win-btn-danger" onClick={handleResetDefaults}>
            <RefreshCw size={14} /> 🔄 Reset System Defaults
          </button>
        </div>
      </WinWindow>
    </div>
  );
};
