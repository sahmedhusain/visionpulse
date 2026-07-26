import React from 'react';
import { ShieldCheck, Monitor, History, Video } from 'lucide-react';

interface HeaderProps {
  activeTab: 'detection' | 'history';
  onTabChange: (tab: 'detection' | 'history') => void;
  isBackendHealthy: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, isBackendHealthy }) => {
  return (
    <div style={{ margin: '8px 8px 0 8px' }}>
      {/* Top Application Win98 Window */}
      <div className="win-window" style={{ marginBottom: '8px' }}>
        <div className="win-title-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} />
            <span>RPD - Real-Time Person Detection & Visual Analytics System v1.0</span>
          </div>
          <div style={{ display: 'flex' }}>
            <button className="win-btn-control">_</button>
            <button className="win-btn-control">🗖</button>
            <button className="win-btn-control">X</button>
          </div>
        </div>

        {/* Win98 Classic Menu Bar */}
        <div style={{ display: 'flex', gap: '12px', padding: '2px 8px', borderBottom: '1px solid #808080', fontSize: '11px', background: '#c0c0c0' }}>
          <span style={{ cursor: 'pointer' }}><u>F</u>ile</span>
          <span style={{ cursor: 'pointer' }}><u>E</u>dit</span>
          <span style={{ cursor: 'pointer' }}><u>V</u>iew</span>
          <span style={{ cursor: 'pointer' }}><u>S</u>ource</span>
          <span style={{ cursor: 'pointer' }}><u>T</u>ools</span>
          <span style={{ cursor: 'pointer' }}><u>H</u>elp</span>
        </div>

        {/* Win98 Tab Navigation Toolbar */}
        <div style={{ display: 'flex', gap: '4px', padding: '4px 6px', background: '#c0c0c0', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className={`win-btn ${activeTab === 'detection' ? 'win-btn-active' : ''}`}
              onClick={() => onTabChange('detection')}
            >
              <Monitor size={14} /> Detection Monitor
            </button>
            <button
              className={`win-btn ${activeTab === 'history' ? 'win-btn-active' : ''}`}
              onClick={() => onTabChange('history')}
            >
              <History size={14} /> History Log & Analytics
            </button>
          </div>

          {/* System Status Indicator */}
          <div className="win-inset" style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Video size={12} color={isBackendHealthy ? '#008000' : '#800000'} />
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: isBackendHealthy ? '#008000' : '#800000' }}>
              {isBackendHealthy ? 'YOLOv8 Engine Ready' : 'Backend Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
