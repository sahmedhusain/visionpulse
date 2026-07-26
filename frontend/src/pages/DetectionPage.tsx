import React, { useState } from 'react';
import { DetectionCanvas } from '../components/detection/DetectionCanvas';
import { StatsPanel } from '../components/detection/StatsPanel';
import { InputSourcesWindow } from '../components/detection/InputSourcesWindow';
import { AnalyticsWindow } from '../components/detection/AnalyticsWindow';
import { SettingsWindow } from '../components/detection/SettingsWindow';
import { useDetection } from '../hooks/useDetection';
import type { DetectionResponse } from '../types/detection';
import { AlertCircle } from 'lucide-react';

interface DetectionPageProps {
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  confThreshold: number;
  onConfThresholdChange: (newVal: number) => void;
  maxThreshold: number;
  onMaxThresholdChange: (newVal: number) => void;
}

export const DetectionPage: React.FC<DetectionPageProps> = ({
  isSettingsOpen,
  onCloseSettings,
  confThreshold,
  onConfThresholdChange,
  maxThreshold,
  onMaxThresholdChange
}) => {
  const { result: httpResult, isLoading, error, processFile, processBase64 } = useDetection();
  const [streamResult, setStreamResult] = useState<DetectionResponse | null>(null);
  const [selectedSample, setSelectedSample] = useState<string>('');
  const [rawImageSrc, setRawImageSrc] = useState<string>('');

  const activeResult = streamResult || httpResult;

  const handleFileSelect = async (file: File) => {
    setStreamResult(null);
    setSelectedSample('');
    const reader = new FileReader();
    reader.onload = (e) => setRawImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
    await processFile(file, confThreshold);
  };

  const handleSampleSelect = async (sampleName: string, sampleUrl: string) => {
    setStreamResult(null);
    setSelectedSample(sampleName);
    setRawImageSrc(sampleUrl);

    const res = await fetch(sampleUrl);
    const blob = await res.blob();
    const file = new File([blob], sampleName, { type: 'image/jpeg' });
    await processFile(file, confThreshold);
  };

  const handleWebcamFrame = async (base64Frame: string) => {
    setRawImageSrc(base64Frame);
    const res = await processBase64(base64Frame, 'webcam_stream.jpg', confThreshold);
    setStreamResult(res);
  };

  const handleStreamResult = (res: DetectionResponse) => {
    setStreamResult(res);
  };

  return (
    <div style={{ padding: '8px 8px 50px 8px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '8px' }}>
      {/* Left Column: Visual Monitor Display & Telemetry Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {error && (
          <div className="win-inset" style={{ background: '#ffc0c0', padding: '6px 10px', color: '#800000', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            <AlertCircle size={14} /> System Error: {error}
          </div>
        )}

        {/* Visual Stream Canvas Monitor (With Fullscreen Button) */}
        <DetectionCanvas
          processedImage={activeResult?.processed_image}
          rawImageSrc={rawImageSrc}
          detections={activeResult?.detections || []}
          isLoading={isLoading && !streamResult}
        />

        {/* Real-Time Metrics Status Panel */}
        <StatsPanel
          count={activeResult?.count || 0}
          avgConfidence={activeResult?.avg_confidence || 0}
          inferenceTimeMs={activeResult?.inference_time_ms || 0}
          threshold={maxThreshold}
        />
      </div>

      {/* Right Column: Unified Input Sources & Advanced Telemetry Analytics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <InputSourcesWindow
          onFileSelect={handleFileSelect}
          onSelectSample={handleSampleSelect}
          selectedSample={selectedSample}
          onFrameCapture={handleWebcamFrame}
          onStreamResult={handleStreamResult}
          confThreshold={confThreshold}
          isLoading={isLoading}
        />

        {/* Advanced Retro Telemetry & Crowd Density Gauge Window */}
        <AnalyticsWindow
          count={activeResult?.count || 0}
          avgConfidence={activeResult?.avg_confidence || 0}
          inferenceTimeMs={activeResult?.inference_time_ms || 0}
          detections={activeResult?.detections || []}
          maxThreshold={maxThreshold}
        />
      </div>

      {/* Separated Settings Window (Opened via Control Panel button or Taskbar) */}
      <SettingsWindow
        isOpen={isSettingsOpen}
        onClose={onCloseSettings}
        confThreshold={confThreshold}
        onConfThresholdChange={onConfThresholdChange}
        maxThreshold={maxThreshold}
        onMaxThresholdChange={onMaxThresholdChange}
      />
    </div>
  );
};
