import React, { useState, useEffect } from 'react';
import { ShieldCheck, Monitor, History, Volume2 } from 'lucide-react';

interface WinTaskbarProps {
  activeTab: 'detection' | 'history';
  onTabChange: (tab: 'detection' | 'history') => void;
  isBackendHealthy: boolean;
}

export const WinTaskbar: React.FC<WinTaskbarProps> = ({
  activeTab,
  onTabChange,
  isBackendHealthy
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="win-outdent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 4px',
        zIndex: 9999,
        background: '#c0c0c0'
      }}
    >
      {/* Left: Start Button & Active Windows */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          className="win-btn"
          style={{ fontWeight: 'bold', padding: '2px 8px', height: '24px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ShieldCheck size={14} color="#000080" />
          <span>Start</span>
        </button>

        <div style={{ height: '20px', width: '2px', borderLeft: '1px solid #808080', borderRight: '1px solid #fff', margin: '0 2px' }} />

        <button
          className={`win-btn ${activeTab === 'detection' ? 'win-btn-active' : ''}`}
          onClick={() => onTabChange('detection')}
          style={{ height: '24px', padding: '2px 8px', fontSize: '11px' }}
        >
          <Monitor size={12} /> RPD Vision Monitor
        </button>

        <button
          className={`win-btn ${activeTab === 'history' ? 'win-btn-active' : ''}`}
          onClick={() => onTabChange('history')}
          style={{ height: '24px', padding: '2px 8px', fontSize: '11px' }}
        >
          <History size={12} /> RPD History Log
        </button>
      </div>

      {/* Right: System Tray */}
      <div
        className="win-inset"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 8px',
          height: '22px',
          fontSize: '11px',
          background: '#c0c0c0'
        }}
      >
        <Volume2 size={12} />
        <span style={{ color: isBackendHealthy ? '#008000' : '#800000', fontWeight: 'bold' }}>
          {isBackendHealthy ? 'YOLO Online' : 'Offline'}
        </span>
        <span style={{ color: '#000', marginLeft: '4px' }}>{timeStr}</span>
      </div>
    </div>
  );
};
