import React from 'react';
import type { PersonDetection } from '../../types/detection';
import { Sparkles } from 'lucide-react';

interface DetectionCanvasProps {
  processedImage?: string;
  rawImageSrc?: string;
  detections: PersonDetection[];
  isLoading: boolean;
}

export const DetectionCanvas: React.FC<DetectionCanvasProps> = ({
  processedImage,
  rawImageSrc,
  detections,
  isLoading
}) => {
  const displaySrc = processedImage || rawImageSrc;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '380px', borderRadius: '12px', overflow: 'hidden', background: '#070a12', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7, 10, 18, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(56, 189, 248, 0.2)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>Running YOLOv8 Neural Inference...</p>
        </div>
      )}

      {displaySrc ? (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img
            src={displaySrc}
            alt="Detection Result"
            style={{ maxWidth: '100%', maxHeight: '520px', borderRadius: '8px', objectFit: 'contain' }}
          />
          {processedImage && detections.length > 0 && (
            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              <Sparkles size={14} /> AI Annotated ({detections.length} Persons)
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>No frame loaded for inference</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Upload an image or pick a demo sample above</p>
        </div>
      )}
    </div>
  );
};
