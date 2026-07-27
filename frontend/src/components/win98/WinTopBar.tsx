import React from 'react';
import { Monitor, History, Sliders, Zap } from 'lucide-react';

interface WinTopBarProps {
  activeTab: 'detection' | 'history' | 'settings';
  onTabChange: (tab: 'detection' | 'history' | 'settings') => void;
  isBackendHealthy: boolean;
}

export const WinTopBar: React.FC<WinTopBarProps> = ({
  activeTab,
  onTabChange,
  isBackendHealthy
}) => {
  return (
    <div style={{ padding: '6px 8px 0 8px' }}>
      <div className="win-window" style={{ marginBottom: '4px' }}>
        {/* Title Bar with RPD Logo */}
        <div className="win-title-bar" style={{ height: '28px', padding: '2px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/favicon.svg"
              alt="RPD Logo"
              style={{ width: '18px', height: '18px', display: 'block' }}
            />
            <span style={{ fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.5px' }}>
              RPD - Real-Time Person Detection & Visual Analytics System v1.0
            </span>
          </div>
          <div style={{ display: 'flex' }}>
            <button className="win-btn-control">_</button>
            <button className="win-btn-control">🗖</button>
            <button className="win-btn-control">X</button>
          </div>
        </div>

        {/* Win98 Classic Menu Bar */}
        <div style={{ display: 'flex', gap: '14px', padding: '3px 10px', borderBottom: '1px solid #808080', fontSize: '11px', background: '#c0c0c0' }}>
          <span style={{ cursor: 'pointer' }}><u>F</u>ile</span>
          <span style={{ cursor: 'pointer' }}><u>E</u>dit</span>
          <span style={{ cursor: 'pointer' }}><u>V</u>iew</span>
          <span style={{ cursor: 'pointer' }}><u>S</u>ource</span>
          <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => onTabChange('settings')}><u>O</u>ptions / Settings</span>
          <span style={{ cursor: 'pointer' }}><u>H</u>elp</span>
        </div>

        {/* Top Window Tabs Navigation Bar */}
        <div style={{ display: 'flex', gap: '6px', padding: '5px 8px', background: '#c0c0c0', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Main Navigation Window Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className={`win-btn ${activeTab === 'detection' ? 'win-btn-active' : ''}`}
              onClick={() => onTabChange('detection')}
              style={{ height: '32px', padding: '4px 14px', fontSize: '12px' }}
            >
              <Monitor size={15} /> RPD Monitor Display
            </button>

            <button
              className={`win-btn ${activeTab === 'history' ? 'win-btn-active' : ''}`}
              onClick={() => onTabChange('history')}
              style={{ height: '32px', padding: '4px 14px', fontSize: '12px' }}
            >
              <History size={15} /> RPD History Log
            </button>

            <button
              className={`win-btn ${activeTab === 'settings' ? 'win-btn-active' : ''}`}
              onClick={() => onTabChange('settings')}
              style={{ height: '32px', padding: '4px 14px', fontSize: '12px', color: '#000080', fontWeight: 'bold' }}
            >
              <Sliders size={15} /> Control Panel Settings
            </button>
          </div>

          {/* Engine Status Health Indicator */}
          <div className="win-inset" style={{ padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff' }}>
            <Zap size={13} color={isBackendHealthy ? '#008000' : '#800000'} />
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: isBackendHealthy ? '#008000' : '#800000' }}>
              {isBackendHealthy ? 'YOLO ENGINE ONLINE' : 'ENGINE OFFLINE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
