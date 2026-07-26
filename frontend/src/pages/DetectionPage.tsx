import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { ImageUploader } from '../components/detection/ImageUploader';
import { SampleSelector } from '../components/detection/SampleSelector';
import { DetectionCanvas } from '../components/detection/DetectionCanvas';
import { StatsPanel } from '../components/detection/StatsPanel';
import { WebcamDetector } from '../components/detection/WebcamDetector';
import { RegionAlert } from '../components/detection/RegionAlert';
import { useDetection } from '../hooks/useDetection';
import { AlertCircle, Sliders } from 'lucide-react';

export const DetectionPage: React.FC = () => {
  const { result, isLoading, error, processFile, processBase64 } = useDetection();
  const [selectedSample, setSelectedSample] = useState<string>('');
  const [rawImageSrc, setRawImageSrc] = useState<string>('');
  const [confThreshold, setConfThreshold] = useState<number>(0.35);
  const [maxThreshold, setMaxThreshold] = useState<number>(5);

  const handleFileSelect = async (file: File) => {
    setSelectedSample('');
    const reader = new FileReader();
    reader.onload = (e) => setRawImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
    await processFile(file, confThreshold);
  };

  const handleSampleSelect = async (sampleName: string, sampleUrl: string) => {
    setSelectedSample(sampleName);
    setRawImageSrc(sampleUrl);
    
    // Fetch image as blob and send to backend for detection
    const res = await fetch(sampleUrl);
    const blob = await res.blob();
    const file = new File([blob], sampleName, { type: 'image/jpeg' });
    await processFile(file, confThreshold);
  };

  const handleWebcamFrame = async (base64Frame: string) => {
    setRawImageSrc(base64Frame);
    await processBase64(base64Frame, 'webcam_stream.jpg', confThreshold);
  };

  return (
    <div style={{ padding: '0 1.5rem 2rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
      {/* Left Column: Canvas Preview & Metrics */}
      <div>
        <Card title="Visual Person Detection & Tracking">
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', color: '#fca5a5', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <DetectionCanvas
            processedImage={result?.processed_image}
            rawImageSrc={rawImageSrc}
            detections={result?.detections || []}
            isLoading={isLoading}
          />

          <StatsPanel
            count={result?.count || 0}
            avgConfidence={result?.avg_confidence || 0}
            inferenceTimeMs={result?.inference_time_ms || 0}
            threshold={maxThreshold}
          />

          <RegionAlert
            currentCount={result?.count || 0}
            maxThreshold={maxThreshold}
            onThresholdChange={setMaxThreshold}
          />
        </Card>
      </div>

      {/* Right Column: Upload, Sample Gallery & Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Card title="Input Source Controls">
          <ImageUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
          <SampleSelector onSelectSample={handleSampleSelect} selectedSample={selectedSample} />
          <WebcamDetector onFrameCapture={handleWebcamFrame} isProcessing={isLoading} />
        </Card>

        <Card title="Model Sensitivity">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Sliders size={16} color="var(--accent-cyan)" />
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Confidence Threshold: {Math.round(confThreshold * 100)}%</label>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={confThreshold}
            onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Higher values reduce false positives; lower values improve recall for occluded figures.
          </p>
        </Card>
      </div>
    </div>
  );
};
