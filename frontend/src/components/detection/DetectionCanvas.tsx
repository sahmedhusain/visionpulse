import React, { useRef, useState } from 'react';
import type { PersonDetection } from '../../types/detection';
import { Maximize2, Minimize2, Sparkles, Monitor } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const displaySrc = processedImage || rawImageSrc;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error('Exit fullscreen failed:', err);
      });
    }
  };

  return (
    <WinWindow
      title="RPD Monitor Display - Live Visual Feed"
      icon={<Monitor size={14} />}
      statusBarContent={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: 'bold' }}>
          <span>Detections: {detections.length} Persons</span>
          <span>Feed Status: {displaySrc ? 'Stream Active' : 'Standby'}</span>
          <span>Mode: {isLoading ? 'Processing...' : 'Active Stream'}</span>
        </div>
      }
    >
      <div
        ref={containerRef}
        className="win-screen-inset rpd-monitor-container"
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#04070a',
          padding: isFullscreen ? '0' : '6px',
          overflow: 'hidden'
        }}
      >
        {/* Fullscreen Button in top-right corner */}
        <button
          className="win-btn"
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 30,
            fontSize: '11px',
            padding: '4px 10px',
            height: '28px',
            background: 'rgba(192, 192, 192, 0.95)',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.5)'
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Video Stream'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          <span>{isFullscreen ? 'Restore Window' : '🗖 Fullscreen Stream'}</span>
        </button>

        {isLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              gap: '10px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #008080',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
            <p style={{ color: '#00ffff', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold' }}>
              [RPD AI] Running Neural Detection Inference...
            </p>
          </div>
        )}

        {displaySrc ? (
          <div className="rpd-stream-wrapper" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={displaySrc}
              alt="RPD Visual Stream"
              className="rpd-stream-img"
            />
            {processedImage && detections.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid #00ffff',
                  padding: '6px 12px',
                  color: '#00ffff',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 25,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
                }}
              >
                <Sparkles size={14} /> RPD Annotated: {detections.length} Persons Tracked
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#808080', padding: '6rem 2rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '16px', color: '#00ff00', fontWeight: 'bold' }}>[RPD MONITOR STANDBY]</p>
            <p style={{ fontSize: '13px', marginTop: '10px', color: '#b0b0b0' }}>Select an Input Source (Webcam, IP Camera, File Upload, or Demo Samples) on the right</p>
          </div>
        )}
      </div>
    </WinWindow>
  );
};
