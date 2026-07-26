import React, { useState, useEffect } from 'react';
import { ShieldCheck, Monitor, History, Volume2, Sliders } from 'lucide-react';

interface WinTaskbarProps {
  activeTab: 'detection' | 'history' | 'settings';
  onTabChange: (tab: 'detection' | 'history' | 'settings') => void;
  isBackendHealthy: boolean;
}

export const WinTaskbar: React.FC<WinTaskbarProps> = ({
  activeTab,
  onTabChange,
  isBackendHealthy
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isStartOpen, setIsStartOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Start Menu Popup */}
      {isStartOpen && (
        <div
          className="win-window"
          style={{
            position: 'fixed',
            bottom: '44px',
            left: '4px',
            width: '230px',
            zIndex: 99999,
            padding: '4px'
          }}
        >
          <div className="win-title-bar" style={{ marginBottom: '4px' }}>
            <span>RPD 98 Start Menu</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              className={`win-btn ${activeTab === 'detection' ? 'win-btn-active' : ''}`}
              onClick={() => { onTabChange('detection'); setIsStartOpen(false); }}
              style={{ justifyContent: 'flex-start', padding: '6px 10px' }}
            >
              <Monitor size={16} /> Detection Monitor
            </button>
            <button
              className={`win-btn ${activeTab === 'history' ? 'win-btn-active' : ''}`}
              onClick={() => { onTabChange('history'); setIsStartOpen(false); }}
              style={{ justifyContent: 'flex-start', padding: '6px 10px' }}
            >
              <History size={16} /> History & Analytics
            </button>
            <button
              className={`win-btn ${activeTab === 'settings' ? 'win-btn-active' : ''}`}
              onClick={() => { onTabChange('settings'); setIsStartOpen(false); }}
              style={{ justifyContent: 'flex-start', padding: '6px 10px', color: '#000080', fontWeight: 'bold' }}
            >
              <Sliders size={16} /> Control Panel Settings
            </button>
          </div>
        </div>
      )}

      {/* Main Win98 Bottom Taskbar (Enlarged 44px Height) */}
      <div
        className="win-outdent"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '3px 6px',
          zIndex: 9999,
          background: '#c0c0c0'
        }}
      >
        {/* Left: Start Button & Active Page Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className={`win-btn ${isStartOpen ? 'win-btn-active' : ''}`}
            onClick={() => setIsStartOpen(!isStartOpen)}
            style={{
              fontWeight: 'bold',
              padding: '4px 12px',
              height: '34px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#c0c0c0'
            }}
          >
            <ShieldCheck size={18} color="#000080" />
            <span>Start</span>
          </button>

          <div style={{ height: '28px', width: '2px', borderLeft: '1px solid #808080', borderRight: '1px solid #fff', margin: '0 4px' }} />

          <button
            className={`win-btn ${activeTab === 'detection' ? 'win-btn-active' : ''}`}
            onClick={() => onTabChange('detection')}
            style={{ height: '34px', padding: '4px 12px', fontSize: '12px' }}
          >
            <Monitor size={14} /> RPD Monitor Display
          </button>

          <button
            className={`win-btn ${activeTab === 'history' ? 'win-btn-active' : ''}`}
            onClick={() => onTabChange('history')}
            style={{ height: '34px', padding: '4px 12px', fontSize: '12px' }}
          >
            <History size={14} /> RPD History Log
          </button>

          <button
            className={`win-btn ${activeTab === 'settings' ? 'win-btn-active' : ''}`}
            onClick={() => onTabChange('settings')}
            style={{ height: '34px', padding: '4px 12px', fontSize: '12px', color: '#000080', fontWeight: 'bold' }}
          >
            <Sliders size={14} /> Control Panel Settings
          </button>
        </div>

        {/* Right: System Tray & Clock */}
        <div
          className="win-inset"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 12px',
            height: '32px',
            fontSize: '12px',
            background: '#c0c0c0'
          }}
        >
          <Volume2 size={14} />
          <span style={{ color: isBackendHealthy ? '#008000' : '#800000', fontWeight: 'bold' }}>
            {isBackendHealthy ? 'YOLO ONLINE' : 'OFFLINE'}
          </span>
          <span style={{ color: '#000000', marginLeft: '6px', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {timeStr}
          </span>
        </div>
      </div>
    </>
  );
};
