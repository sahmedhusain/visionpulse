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
      title="RPD Monitor Display - Visual Stream"
      icon={<Monitor size={14} />}
      statusBarContent={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>Detections: {detections.length} Persons</span>
          <span>Resolution: 800x600</span>
          <span>Status: {isLoading ? 'Processing...' : 'Active Feed'}</span>
        </div>
      }
    >
      <div
        ref={containerRef}
        className="win-screen-inset"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '380px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#04070a',
          padding: '4px'
        }}
      >
        {/* Fullscreen Button in top-right corner of video monitor */}
        <button
          className="win-btn"
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 30,
            fontSize: '11px',
            padding: '2px 8px'
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Stream'}
        >
          {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          <span>{isFullscreen ? 'Restore' : '🗖 Fullscreen Stream'}</span>
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
              gap: '8px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #008080',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
            <p style={{ color: '#00ffff', fontFamily: 'monospace', fontSize: '12px' }}>
              [RPD AI] Processing Neural Inference...
            </p>
          </div>
        )}

        {displaySrc ? (
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
              src={displaySrc}
              alt="RPD Visual Stream"
              style={{
                maxWidth: '100%',
                maxHeight: isFullscreen ? '95vh' : '500px',
                objectFit: 'contain'
              }}
            />
            {processedImage && detections.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #00ffff',
                  padding: '4px 8px',
                  color: '#00ffff',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={12} /> RPD Annotated: {detections.length} Persons Detected
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#808080', padding: '3rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#00ff00' }}>[RPD MONITOR STANDBY]</p>
            <p style={{ fontSize: '11px', marginTop: '6px', color: '#a0a0a0' }}>Select a Camera Source, Upload File, or Demo Sample below</p>
          </div>
        )}
      </div>
    </WinWindow>
  );
};
