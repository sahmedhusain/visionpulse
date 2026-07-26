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
          <span>Target Resolution: 800x600</span>
          <span>Mode: {isLoading ? 'Processing...' : 'Active Stream'}</span>
        </div>
      }
    >
      <div
        ref={containerRef}
        className="win-screen-inset"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#04070a',
          padding: '6px'
        }}
      >
        {/* Fullscreen Button in top-right corner */}
        <button
          className="win-btn"
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 30,
            fontSize: '11px',
            padding: '3px 10px',
            height: '26px'
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Video Stream'}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
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
                width: '36px',
                height: '36px',
                border: '3px solid #008080',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
            <p style={{ color: '#00ffff', fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold' }}>
              [RPD AI] Running Neural Detection Inference...
            </p>
          </div>
        )}

        {displaySrc ? (
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
              src={displaySrc}
              alt="RPD Visual Stream"
              className="rpd-stream-img"
              style={{
                maxWidth: '100%',
                maxHeight: isFullscreen ? '95vh' : '520px',
                objectFit: 'contain'
              }}
            />
            {processedImage && detections.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid #00ffff',
                  padding: '5px 10px',
                  color: '#00ffff',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={13} /> RPD Annotated: {detections.length} Persons Tracked
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#808080', padding: '4rem 2rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '15px', color: '#00ff00', fontWeight: 'bold' }}>[RPD MONITOR STANDBY]</p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#b0b0b0' }}>Select an Input Source (Webcam, IP Camera, File Upload, or Demo Samples) on the right</p>
          </div>
        )}
      </div>
    </WinWindow>
  );
};
