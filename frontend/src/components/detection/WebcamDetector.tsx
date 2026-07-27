import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, Video, Radio, Globe } from 'lucide-react';
import { Button } from '../common/Button';
import type { DetectionResponse } from '../../types/detection';

interface WebcamDetectorProps {
  onFrameCapture: (base64Frame: string) => void;
  onStreamResult?: (result: DetectionResponse) => void;
  confThreshold: number;
  isProcessing: boolean;
}

export const WebcamDetector: React.FC<WebcamDetectorProps> = ({
  onFrameCapture,
  onStreamResult,
  confThreshold,
  isProcessing
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [streamMode, setStreamMode] = useState<'webcam' | 'ipcam'>('webcam');
  const [ipUrl, setIpUrl] = useState<string>('http://192.168.1.100:8080/video');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [fps, setFps] = useState<number>(0);

  const startWebcam = async () => {
    setErrorMsg('');

    if (streamMode === 'webcam') {
      try {
        // Request browser camera hardware permission in 1080p widescreen full resolution
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsStreaming(true);

          const wsUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')
            .replace(/^http/, 'ws') + '/api/v1/ws/stream';

          try {
            const ws = new WebSocket(wsUrl);
            ws.onmessage = (event) => {
              try {
                const res: DetectionResponse = JSON.parse(event.data);
                if (onStreamResult) onStreamResult(res);
              } catch {}
            };
            wsRef.current = ws;
          } catch (e) {
            console.error('WebSocket connection error:', e);
          }
        }
      } catch (err: any) {
        setErrorMsg('Browser webcam permission denied or camera not found: ' + (err.message || 'Error'));
      }
    } else {
      // IP Camera / RTSP / NDI stream mode
      if (!ipUrl) {
        setErrorMsg('Please enter a valid IP Camera, RTSP, or NDI stream URL');
        return;
      }

      const wsUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')
        .replace(/^http/, 'ws') + `/api/v1/ws/ipstream?url=${encodeURIComponent(ipUrl)}&conf_threshold=${confThreshold}`;

      try {
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => setIsStreaming(true);
        ws.onmessage = (event) => {
          try {
            const res = JSON.parse(event.data);
            if (res.error) {
              setErrorMsg(res.error);
              stopWebcam();
            } else if (onStreamResult) {
              onStreamResult(res as DetectionResponse);
            }
          } catch {}
        };
        ws.onerror = () => {
          setErrorMsg('Failed to connect to IP Camera stream at ' + ipUrl);
          stopWebcam();
        };
        wsRef.current = ws;
      } catch (e: any) {
        setErrorMsg('Failed to open WebSocket for IP stream: ' + e.message);
      }
    }
  };

  const stopWebcam = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    let intervalId: any;
    let frameCount = 0;
    const fpsTimer = setInterval(() => {
      setFps(frameCount);
      frameCount = 0;
    }, 1000);

    if (isStreaming && streamMode === 'webcam') {
      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

              frameCount += 1;
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ image: dataUrl, conf_threshold: confThreshold }));
              } else if (!isProcessing) {
                onFrameCapture(dataUrl);
              }
            }
          }
        }
      }, 200); // 5 FPS streaming
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (fpsTimer) clearInterval(fpsTimer);
    };
  }, [isStreaming, streamMode, isProcessing, confThreshold, onFrameCapture]);

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
      {/* Stream Source Mode Selector */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px' }}>
        <button
          onClick={() => { stopWebcam(); setStreamMode('webcam'); }}
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: '6px',
            border: 'none',
            background: streamMode === 'webcam' ? 'var(--accent-cyan)' : 'transparent',
            color: streamMode === 'webcam' ? '#000' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Camera size={14} /> Hardware Webcam
        </button>
        <button
          onClick={() => { stopWebcam(); setStreamMode('ipcam'); }}
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: '6px',
            border: 'none',
            background: streamMode === 'ipcam' ? 'var(--accent-purple)' : 'transparent',
            color: streamMode === 'ipcam' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Globe size={14} /> IP / RTSP / NDI Camera
        </button>
      </div>

      {streamMode === 'ipcam' && (
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            IP Camera / RTSP / MJPEG Stream URL:
          </label>
          <input
            type="text"
            value={ipUrl}
            onChange={(e) => setIpUrl(e.target.value)}
            placeholder="rtsp://192.168.1.50:554/h264 or http://192.168.1.100:8080/video"
            disabled={isStreaming}
            style={{
              width: '100%',
              background: 'rgba(15,23,42,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              color: '#fff',
              padding: '6px 10px',
              fontSize: '0.8rem'
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Video size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {streamMode === 'webcam' ? 'Local Hardware Stream' : 'IP Network Stream'}
          </span>
          {isStreaming && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--accent-emerald)', background: 'rgba(52,211,153,0.15)', padding: '2px 8px', borderRadius: '12px' }}>
              <Radio size={12} className="animate-pulse" /> LIVE ({fps} FPS)
            </span>
          )}
        </div>
        {!isStreaming ? (
          <Button variant="secondary" icon={<Camera size={16} />} onClick={startWebcam}>
            Start Stream
          </Button>
        ) : (
          <Button variant="danger" icon={<StopCircle size={16} />} onClick={stopWebcam}>
            Stop Stream
          </Button>
        )}
      </div>

      {errorMsg && (
        <p style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '0.4rem' }}>{errorMsg}</p>
      )}

      <video
        ref={videoRef}
        style={{ display: isStreaming && streamMode === 'webcam' ? 'block' : 'none', width: '100%', maxHeight: '200px', borderRadius: '8px', background: '#000', objectFit: 'cover' }}
        muted
        playsInline
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
