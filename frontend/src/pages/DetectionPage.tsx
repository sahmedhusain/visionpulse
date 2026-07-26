import React, { useState } from 'react';
import { DetectionCanvas } from '../components/detection/DetectionCanvas';
import { StatsPanel } from '../components/detection/StatsPanel';
import { CameraSourceWindow } from '../components/detection/CameraSourceWindow';
import { FileUploadWindow } from '../components/detection/FileUploadWindow';
import { SampleGalleryWindow } from '../components/detection/SampleGalleryWindow';
import { SettingsWindow } from '../components/detection/SettingsWindow';
import { useDetection } from '../hooks/useDetection';
import type { DetectionResponse } from '../types/detection';
import { AlertCircle } from 'lucide-react';

export const DetectionPage: React.FC = () => {
  const { result: httpResult, isLoading, error, processFile, processBase64 } = useDetection();
  const [streamResult, setStreamResult] = useState<DetectionResponse | null>(null);
  const [selectedSample, setSelectedSample] = useState<string>('');
  const [rawImageSrc, setRawImageSrc] = useState<string>('');
  const [confThreshold, setConfThreshold] = useState<number>(0.35);
  const [maxThreshold, setMaxThreshold] = useState<number>(5);

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
    <div style={{ padding: '0 8px 40px 8px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '8px' }}>
      {/* Left Column: Visual Monitor Display & Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {error && (
          <div className="win-inset" style={{ background: '#ffc0c0', padding: '6px 10px', color: '#800000', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            <AlertCircle size={14} /> System Error: {error}
          </div>
        )}

        {/* Visual Monitor Canvas (With Fullscreen Button) */}
        <DetectionCanvas
          processedImage={activeResult?.processed_image}
          rawImageSrc={rawImageSrc}
          detections={activeResult?.detections || []}
          isLoading={isLoading && !streamResult}
        />

        {/* Separated Win98 Status & Metrics Window */}
        <StatsPanel
          count={activeResult?.count || 0}
          avgConfidence={activeResult?.avg_confidence || 0}
          inferenceTimeMs={activeResult?.inference_time_ms || 0}
          threshold={maxThreshold}
        />
      </div>

      {/* Right Column: Separated Controls & Input Sources */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Separated Window 1: Camera & Stream Input */}
        <CameraSourceWindow
          onFrameCapture={handleWebcamFrame}
          onStreamResult={handleStreamResult}
          confThreshold={confThreshold}
          isProcessing={isLoading}
        />

        {/* Separated Window 2: File Upload */}
        <FileUploadWindow onFileSelect={handleFileSelect} isLoading={isLoading} />

        {/* Separated Window 3: Demo Sample Library */}
        <SampleGalleryWindow onSelectSample={handleSampleSelect} selectedSample={selectedSample} />

        {/* Separated Window 4: Settings & Thresholds */}
        <SettingsWindow
          confThreshold={confThreshold}
          onConfThresholdChange={setConfThreshold}
          maxThreshold={maxThreshold}
          onMaxThresholdChange={setMaxThreshold}
        />
      </div>
    </div>
  );
};
