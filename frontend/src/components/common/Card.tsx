import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, icon, children, style, className = '' }) => {
  return (
    <div className={`glass-card ${className}`} style={{ padding: '1.25rem', ...style }}>
      {(title || icon) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {icon && <span style={{ color: 'var(--accent-cyan)' }}>{icon}</span>}
            <div>
              {title && <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>{title}</h3>}
              {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
