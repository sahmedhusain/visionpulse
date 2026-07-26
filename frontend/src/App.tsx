import React, { useState, useEffect } from 'react';
import { DetectionPage } from './pages/DetectionPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { WinTaskbar } from './components/win98/WinTaskbar';

const SETTINGS_KEY = 'rpd_user_settings';

interface SavedSettings {
  confThreshold: number;
  maxThreshold: number;
  soundEnabled: boolean;
  soundPitch: number;
  saveHistory: boolean;
}

const DEFAULT_SETTINGS: SavedSettings = {
  confThreshold: 0.35,
  maxThreshold: 5,
  soundEnabled: true,
  soundPitch: 880,
  saveHistory: true
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detection' | 'history' | 'settings'>('detection');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);

  // Load initial settings from localStorage or defaults
  const [settings, setSettings] = useState<SavedSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  }, [settings]);

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

  const updateSetting = <K extends keyof SavedSettings>(key: K, value: SavedSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#008080', paddingBottom: '48px' }}>
      <main style={{ flex: 1, paddingTop: '8px' }}>
        {activeTab === 'detection' && (
          <DetectionPage
            confThreshold={settings.confThreshold}
            maxThreshold={settings.maxThreshold}
            soundEnabled={settings.soundEnabled}
            soundPitch={settings.soundPitch}
          />
        )}
        {activeTab === 'history' && <HistoryPage />}
        {activeTab === 'settings' && (
          <SettingsPage
            confThreshold={settings.confThreshold}
            onConfThresholdChange={(v) => updateSetting('confThreshold', v)}
            maxThreshold={settings.maxThreshold}
            onMaxThresholdChange={(v) => updateSetting('maxThreshold', v)}
            soundEnabled={settings.soundEnabled}
            onSoundEnabledChange={(v) => updateSetting('soundEnabled', v)}
            soundPitch={settings.soundPitch}
            onSoundPitchChange={(v) => updateSetting('soundPitch', v)}
            saveHistory={settings.saveHistory}
            onSaveHistoryChange={(v) => updateSetting('saveHistory', v)}
          />
        )}
      </main>

      {/* Enlarged 44px Win98 Desktop Taskbar Footer */}
      <WinTaskbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBackendHealthy={isBackendHealthy}
      />
    </div>
  );
};

export default App;
