import React from 'react';
import { ShieldCheck, Eye, History, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'detection' | 'history';
  onTabChange: (tab: 'detection' | 'history') => void;
  isBackendHealthy: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, isBackendHealthy }) => {
  return (
    <header className="glass-card" style={{ margin: '1rem', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            DETECTO <span style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 500 }}>AI Vision</span>
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Real-Time Person Detection & Crowd Analytics</p>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px' }}>
        <button
          onClick={() => onTabChange('detection')}
          className={activeTab === 'detection' ? 'btn-primary' : 'btn-secondary'}
          style={{ border: 'none', borderRadius: '8px' }}
        >
          <Eye size={18} /> Detection View
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}
          style={{ border: 'none', borderRadius: '8px' }}
        >
          <History size={18} /> History & Analytics
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
        <Activity size={16} color={isBackendHealthy ? 'var(--accent-emerald)' : 'var(--accent-rose)'} />
        <span style={{ color: isBackendHealthy ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 500 }}>
          {isBackendHealthy ? 'YOLOv8 Active' : 'Connecting to API...'}
        </span>
      </div>
    </header>
  );
};
