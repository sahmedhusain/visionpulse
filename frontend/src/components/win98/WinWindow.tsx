import React from 'react';

interface WinWindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  statusBarContent?: React.ReactNode;
}

export const WinWindow: React.FC<WinWindowProps> = ({
  title,
  icon,
  children,
  style,
  className = '',
  onMinimize,
  onMaximize,
  onClose,
  statusBarContent
}) => {
  return (
    <div className={`win-window ${className}`} style={{ ...style }}>
      {/* Title Bar */}
      <div className="win-title-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
          <span>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="win-btn-control" onClick={onMinimize} title="Minimize">_</button>
          <button className="win-btn-control" onClick={onMaximize} title="Maximize">🗖</button>
          <button className="win-btn-control" onClick={onClose} title="Close" style={{ fontWeight: 'bold' }}>X</button>
        </div>
      </div>

      {/* Window Body */}
      <div style={{ padding: '8px', flex: 1, overflow: 'auto' }}>
        {children}
      </div>

      {/* Optional Window Status Bar */}
      {statusBarContent && (
        <div className="win-status-bar">
          {statusBarContent}
        </div>
      )}
    </div>
  );
};
