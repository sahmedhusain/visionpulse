import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { DetectionPage } from './pages/DetectionPage';
import { HistoryPage } from './pages/HistoryPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detection' | 'history'>('detection');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/health`);
        if (res.ok) {
          setIsBackendHealthy(true);
        } else {
          setIsBackendHealthy(false);
        }
      } catch {
        setIsBackendHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBackendHealthy={isBackendHealthy}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'detection' ? <DetectionPage /> : <HistoryPage />}
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        Detecto AI Vision System &bull; Powered by YOLOv8 & FastAPI &bull; React Vite TS
      </footer>
    </div>
  );
};

export default App;
