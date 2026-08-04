import cv2
import asyncio
from typing import AsyncGenerator
from backend.services.preprocessor import resize_for_inference, encode_image_to_base64
from backend.services.detector import detector_service
from backend.services.overlay import draw_detection_overlay

class IPCameraStreamer:
    def __init__(self, stream_url: str):
        self.stream_url = stream_url

    async def generate_frames(self, conf_threshold: float = 0.35) -> AsyncGenerator[dict, None]:
        # Support RTSP, HTTP-FLV, MJPEG, and NDI streams with FFMPEG backend
        cap = cv2.VideoCapture(self.stream_url, cv2.CAP_FFMPEG)
        if not cap.isOpened():
            cap = cv2.VideoCapture(self.stream_url)
            if not cap.isOpened():
                raise ValueError(f"Unable to connect to camera stream at: {self.stream_url}")

        try:
            consecutive_failures = 0
            while True:
                ret, frame_bgr = cap.read()
                if not ret or frame_bgr is None:
                    consecutive_failures += 1
                    if consecutive_failures > 50:
                        # Attempt to reconnect stream
                        cap.release()
                        await asyncio.sleep(0.5)
                        cap = cv2.VideoCapture(self.stream_url)
                        consecutive_failures = 0
                    await asyncio.sleep(0.05)
                    continue

                consecutive_failures = 0
                frame_resized = resize_for_inference(frame_bgr, max_dim=640)
                detections, count, avg_conf, inference_time_ms = detector_service.detect(frame_resized, conf_threshold)

                annotated = draw_detection_overlay(frame_resized, detections)
                processed_base64 = encode_image_to_base64(annotated)

                yield {
                    "count": count,
                    "avg_confidence": avg_conf,
                    "inference_time_ms": inference_time_ms,
                    "detections": [d.dict() for d in detections],
                    "processed_image": processed_base64
                }

                # Yield to event loop for smooth real-time streaming
                await asyncio.sleep(0.08)
        finally:
            if cap and cap.isOpened():
                cap.release()
