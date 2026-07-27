import React from 'react';
import { Monitor, History, Sliders } from 'lucide-react';

interface WinTopBarProps {
  activeTab: 'detection' | 'history' | 'settings';
  onTabChange: (tab: 'detection' | 'history' | 'settings') => void;
  isBackendHealthy?: boolean;
}

export const WinTopBar: React.FC<WinTopBarProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div style={{ padding: '6px 8px 0 8px' }}>
      <div className="win-window" style={{ marginBottom: '4px' }}>
        {/* Clean Title Bar with RPD Logo */}
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
        </div>

        {/* Top Window Tabs Navigation Bar */}
        <div style={{ display: 'flex', gap: '6px', padding: '6px 8px', background: '#c0c0c0', alignItems: 'center' }}>
          {/* Main Navigation Window Tabs */}
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
      </div>
    </div>
  );
};
