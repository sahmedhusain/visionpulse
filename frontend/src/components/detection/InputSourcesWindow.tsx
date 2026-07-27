import React, { useRef, useState, useEffect } from 'react';
import { Camera, Video, Radio, Globe, Folder, Layers, UploadCloud } from 'lucide-react';
import { WinWindow } from '../win98/WinWindow';
import type { DetectionResponse } from '../../types/detection';

interface InputSourcesWindowProps {
  onFileSelect: (file: File) => void;
  onSelectSample: (sampleName: string, sampleUrl: string) => void;
  selectedSample?: string;
  onFrameCapture: (base64Frame: string) => void;
  onStreamResult?: (result: DetectionResponse) => void;
  confThreshold: number;
  isLoading: boolean;
}

const SAMPLE_IMAGES = [
  { name: 'frame1.jpg', label: '1 Person' },
  { name: 'frame2.jpg', label: '9 People' },
  { name: 'frame3.jpg', label: '5 Group' },
  { name: 'frame4.jpg', label: 'Lobby (1)' },
  { name: 'frame5.jpg', label: 'Queue (3)' },
  { name: 'frame6.jpg', label: 'Warehouse (6)' },
  { name: 'frame7.jpg', label: 'Class (5)' },
  { name: 'frame8.jpg', label: 'Hall (10)' },
  { name: 'frame9.jpg', label: 'Zone (3)' },
  { name: 'frame10.jpg', label: 'Crowd (8)' }
];

export const InputSourcesWindow: React.FC<InputSourcesWindowProps> = ({
  onFileSelect,
  onSelectSample,
  selectedSample,
  onFrameCapture,
  onStreamResult,
  confThreshold,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'webcam' | 'ipcam' | 'upload' | 'samples'>('webcam');
  const [ipUrl, setIpUrl] = useState<string>('http://192.168.1.100:8080/video');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [fps, setFps] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

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

  const startStream = async () => {
    setErrorMsg('');

    if (activeTab === 'webcam') {
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
        setErrorMsg('Webcam permission denied or camera unavailable: ' + (err.message || 'Error'));
      }
    } else if (activeTab === 'ipcam') {
      if (!ipUrl) {
        setErrorMsg('Please enter an IP Camera / RTSP stream URL');
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
        setErrorMsg('Failed to open WebSocket stream: ' + e.message);
      }
    }
  };

  useEffect(() => {
    let intervalId: any;
    let frameCount = 0;
    const fpsTimer = setInterval(() => {
      setFps(frameCount);
      frameCount = 0;
    }, 1000);

    if (isStreaming && activeTab === 'webcam') {
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
              } else if (!isLoading) {
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
  }, [isStreaming, activeTab, isLoading, confThreshold, onFrameCapture]);

  const handleTabChange = (tab: 'webcam' | 'ipcam' | 'upload' | 'samples') => {
    stopWebcam();
    setErrorMsg('');
    setActiveTab(tab);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <WinWindow title="RPD Input Source Manager" icon={<Video size={14} />}>
      {/* Input Source Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '12px' }}>
        <button
          className={`win-btn ${activeTab === 'webcam' ? 'win-btn-active' : ''}`}
          onClick={() => handleTabChange('webcam')}
          style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
        >
          <Camera size={13} /> Webcam
        </button>
        <button
          className={`win-btn ${activeTab === 'ipcam' ? 'win-btn-active' : ''}`}
          onClick={() => handleTabChange('ipcam')}
          style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
        >
          <Globe size={13} /> IP Cam
        </button>
        <button
          className={`win-btn ${activeTab === 'upload' ? 'win-btn-active' : ''}`}
          onClick={() => handleTabChange('upload')}
          style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
        >
          <Folder size={13} /> Upload
        </button>
        <button
          className={`win-btn ${activeTab === 'samples' ? 'win-btn-active' : ''}`}
          onClick={() => handleTabChange('samples')}
          style={{ fontSize: '11px', padding: '6px 8px', justifyContent: 'center' }}
        >
          <Layers size={13} /> Samples
        </button>
      </div>

      {/* Tab 1 & 2: Live Video Stream Controls */}
      {(activeTab === 'webcam' || activeTab === 'ipcam') && (
        <div style={{ padding: '8px 0', minHeight: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {activeTab === 'ipcam' && (
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                IP Camera / RTSP Feed URL:
              </label>
              <input
                type="text"
                className="win-inset"
                value={ipUrl}
                onChange={(e) => setIpUrl(e.target.value)}
                placeholder="http://192.168.1.100:8080/video or rtsp://..."
                disabled={isStreaming}
                style={{ width: '100%', padding: '6px 8px', fontSize: '12px' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {isStreaming ? (
                <span style={{ color: '#008000', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Radio size={13} /> STREAM ACTIVE ({fps} FPS)
                </span>
              ) : (
                <span style={{ color: '#808080', fontSize: '11px' }}>Stream Offline</span>
              )}
            </div>

            {!isStreaming ? (
              <button className="win-btn" onClick={startStream} style={{ padding: '6px 14px' }}>
                <Camera size={14} /> Start Stream
              </button>
            ) : (
              <button className="win-btn win-btn-danger" onClick={stopWebcam} style={{ padding: '6px 14px' }}>
                Stop Stream
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: File Upload Dropzone (Increased Height) */}
      {activeTab === 'upload' && (
        <div
          className="win-inset"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '32px 16px',
            minHeight: '140px',
            textAlign: 'center',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#ffffff'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            disabled={isLoading}
          />
          <UploadCloud size={32} color="#000080" />
          <p style={{ fontWeight: 'bold', fontSize: '12px', margin: 0 }}>
            Drag & Drop image file or <span style={{ color: '#000080', textDecoration: 'underline' }}>Browse...</span>
          </p>
          <p style={{ fontSize: '10px', color: '#808080', margin: 0 }}>Supports JPEG, PNG, WEBP</p>
        </div>
      )}

      {/* Tab 4: Demo Sample Benchmark Gallery (Increased Thumbnail Heights to 76px) */}
      {activeTab === 'samples' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {SAMPLE_IMAGES.map((sample) => {
            const url = `/samples/${sample.name}`;
            const isSelected = selectedSample === sample.name;
            return (
              <div
                key={sample.name}
                onClick={() => onSelectSample(sample.name, url)}
                className={isSelected ? 'win-inset' : 'win-outdent'}
                style={{
                  cursor: 'pointer',
                  padding: '3px',
                  textAlign: 'center',
                  background: isSelected ? '#ffffff' : '#c0c0c0'
                }}
              >
                <img
                  src={url}
                  alt={sample.label}
                  style={{ width: '100%', height: '76px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ fontSize: '9px', fontWeight: 'bold', padding: '4px 0' }}>
                  {sample.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {errorMsg && (
        <p style={{ color: '#800000', fontSize: '11px', marginTop: '8px', fontWeight: 'bold' }}>{errorMsg}</p>
      )}

      <video ref={videoRef} style={{ display: 'none' }} muted playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </WinWindow>
  );
};
