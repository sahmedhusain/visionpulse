import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, Video } from 'lucide-react';
import { Button } from '../common/Button';

interface WebcamDetectorProps {
  onFrameCapture: (base64Frame: string) => void;
  isProcessing: boolean;
}

export const WebcamDetector: React.FC<WebcamDetectorProps> = ({ onFrameCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const startWebcam = async () => {
    try {
      setErrorMsg('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err: any) {
      setErrorMsg('Webcam access denied or unavailable: ' + (err.message || 'Unknown error'));
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    let intervalId: any;
    if (isStreaming) {
      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current && !isProcessing) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              onFrameCapture(dataUrl);
            }
          }
        }
      }, 1000); // 1 frame per second
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming, isProcessing, onFrameCapture]);

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Video size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Live Stream / Webcam Mode</span>
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
        style={{ display: isStreaming ? 'block' : 'none', width: '100%', maxHeight: '300px', borderRadius: '8px', background: '#000' }}
        muted
        playsInline
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
