import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, Video, Radio, Globe } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';
import type { DetectionResponse } from '../../types/detection';

interface CameraSourceWindowProps {
  onFrameCapture: (base64Frame: string) => void;
  onStreamResult?: (result: DetectionResponse) => void;
  confThreshold: number;
  isProcessing: boolean;
}

export const CameraSourceWindow: React.FC<CameraSourceWindowProps> = ({
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
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } }
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
        setErrorMsg('Hardware webcam permission denied or camera unavailable: ' + (err.message || 'Error'));
      }
    } else {
      if (!ipUrl) {
        setErrorMsg('Enter a valid IP Camera, RTSP, or NDI stream URL');
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
          setErrorMsg('Unable to connect to IP Camera stream at ' + ipUrl);
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
      }, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (fpsTimer) clearInterval(fpsTimer);
    };
  }, [isStreaming, streamMode, isProcessing, confThreshold, onFrameCapture]);

  return (
    <WinWindow title="Camera & Stream Input Source" icon={<Video size={14} />}>
      {/* Stream Type Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        <button
          className={`win-btn ${streamMode === 'webcam' ? 'win-btn-active' : ''}`}
          onClick={() => { stopWebcam(); setStreamMode('webcam'); }}
          style={{ flex: 1, fontSize: '11px' }}
        >
          <Camera size={12} /> Hardware Webcam
        </button>
        <button
          className={`win-btn ${streamMode === 'ipcam' ? 'win-btn-active' : ''}`}
          onClick={() => { stopWebcam(); setStreamMode('ipcam'); }}
          style={{ flex: 1, fontSize: '11px' }}
        >
          <Globe size={12} /> IP / RTSP Camera
        </button>
      </div>

      {streamMode === 'ipcam' && (
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
            IP Camera / RTSP Feed URL:
          </label>
          <input
            type="text"
            className="win-inset"
            value={ipUrl}
            onChange={(e) => setIpUrl(e.target.value)}
            placeholder="http://192.168.1.100:8080/video or rtsp://..."
            disabled={isStreaming}
            style={{ width: '100%', padding: '4px 6px', fontSize: '11px' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {isStreaming ? (
            <span style={{ color: '#008000', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Radio size={12} /> STREAMING ACTIVE ({fps} FPS)
            </span>
          ) : (
            <span style={{ color: '#808080', fontSize: '11px' }}>Stream Offline</span>
          )}
        </div>

        {!isStreaming ? (
          <button className="win-btn" onClick={startWebcam}>
            <Camera size={12} /> Start Stream
          </button>
        ) : (
          <button className="win-btn win-btn-danger" onClick={stopWebcam}>
            <StopCircle size={12} /> Stop Stream
          </button>
        )}
      </div>

      {errorMsg && (
        <p style={{ color: '#800000', fontSize: '11px', marginTop: '6px', fontWeight: 'bold' }}>{errorMsg}</p>
      )}

      <video ref={videoRef} style={{ display: 'none' }} muted playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </WinWindow>
  );
};
