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
        cap = cv2.VideoCapture(self.stream_url)
        if not cap.isOpened():
            raise ValueError(f"Unable to open stream at URL: {self.stream_url}")

        try:
            while True:
                ret, frame_bgr = cap.read()
                if not ret:
                    # Wait briefly and attempt to reconnect or read again
                    await asyncio.sleep(0.1)
                    continue

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

                # Yield to event loop for smooth 10 FPS streaming
                await asyncio.sleep(0.1)
        finally:
            cap.release()
