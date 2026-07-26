import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, Video, Radio } from 'lucide-react';
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

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [useWebSocket, setUseWebSocket] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [fps, setFps] = useState<number>(0);

  const startWebcam = async () => {
    try {
      setErrorMsg('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);

        // Attempt WebSocket connection for low-latency streaming
        const wsUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')
          .replace(/^http/, 'ws') + '/api/v1/ws/stream';

        try {
          const ws = new WebSocket(wsUrl);
          ws.onopen = () => setUseWebSocket(true);
          ws.onmessage = (event) => {
            try {
              const res: DetectionResponse = jsonParse(event.data);
              if (onStreamResult) onStreamResult(res);
            } catch {}
          };
          ws.onerror = () => setUseWebSocket(false);
          wsRef.current = ws;
        } catch {
          setUseWebSocket(false);
        }
      }
    } catch (err: any) {
      setErrorMsg('Webcam access error: ' + (err.message || 'Camera not accessible'));
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
      setIsStreaming(false);
    }
  };

  function jsonParse(data: string) {
    return JSON.parse(data);
  }

  useEffect(() => {
    let intervalId: any;
    let frameCount = 0;
    const fpsTimer = setInterval(() => {
      setFps(frameCount);
      frameCount = 0;
    }, 1000);

    if (isStreaming) {
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
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && useWebSocket) {
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
  }, [isStreaming, isProcessing, useWebSocket, confThreshold, onFrameCapture, onStreamResult]);

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Video size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Live Video Stream</span>
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
        style={{ display: isStreaming ? 'block' : 'none', width: '100%', maxHeight: '240px', borderRadius: '8px', background: '#000', objectFit: 'cover' }}
        muted
        playsInline
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
