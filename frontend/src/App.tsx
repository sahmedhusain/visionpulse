import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { DetectionPage } from './pages/DetectionPage';
import { HistoryPage } from './pages/HistoryPage';
import { WinTaskbar } from './components/win98/WinTaskbar';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detection' | 'history'>('detection');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [confThreshold, setConfThreshold] = useState<number>(0.35);
  const [maxThreshold, setMaxThreshold] = useState<number>(5);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/health`);
        if (res.ok) {
          setIsBackendHealthy(true);
        } else {
          const fallbackRes = await fetch('http://localhost:8001/health');
          setIsBackendHealthy(fallbackRes.ok);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#008080', paddingBottom: '36px' }}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isBackendHealthy={isBackendHealthy}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'detection' ? (
          <DetectionPage
            isSettingsOpen={isSettingsOpen}
            onCloseSettings={() => setIsSettingsOpen(false)}
            confThreshold={confThreshold}
            onConfThresholdChange={setConfThreshold}
            maxThreshold={maxThreshold}
            onMaxThresholdChange={setMaxThreshold}
          />
        ) : (
          <HistoryPage />
        )}
      </main>

      <WinTaskbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBackendHealthy={isBackendHealthy}
      />
    </div>
  );
};

export default App;
