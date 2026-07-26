import React from 'react';

interface BadgeProps {
  variant?: 'cyan' | 'emerald' | 'purple' | 'rose' | 'amber';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'cyan', children }) => {
  const getStyles = (): { bg: string; text: string; border: string } => {
    switch (variant) {
      case 'emerald': return { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', border: 'rgba(52, 211, 153, 0.3)' };
      case 'purple': return { bg: 'rgba(129, 140, 248, 0.15)', text: '#818cf8', border: 'rgba(129, 140, 248, 0.3)' };
      case 'rose': return { bg: 'rgba(251, 113, 133, 0.15)', text: '#fb7185', border: 'rgba(251, 113, 133, 0.3)' };
      case 'amber': return { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' };
      default: return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
    }
  };

  const s = getStyles();

  return (
    <span style={{
      background: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      padding: '0.25rem 0.6rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem'
    }}>
      {children}
    </span>
  );
};
