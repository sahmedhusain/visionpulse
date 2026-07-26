import time
import numpy as np
from ultralytics import YOLO
from backend.core.config import settings
from backend.schemas.detection import BoundingBox, PersonDetection

class PersonDetector:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.MODEL_NAME
        self._model = None

    def _load_model(self):
        if self._model is None:
            self._model = YOLO(self.model_name)

    def detect(self, img_bgr: np.ndarray, conf_threshold: float = None) -> tuple:
        self._load_model()
        threshold = conf_threshold if conf_threshold is not None else settings.CONFIDENCE_THRESHOLD

        start_time = time.time()
        results = self._model(img_bgr, verbose=False)[0]
        inference_time_ms = round((time.time() - start_time) * 1000, 2)

        detections = []
        confidences = []

        for box in results.boxes:
            cls_id = int(box.cls[0].item())
            conf = float(box.conf[0].item())

            # Filter for COCO class 0 ('person') and confidence threshold
            if cls_id == 0 and conf >= threshold:
                xyxy = box.xyxy[0].tolist()
                detections.append(
                    PersonDetection(
                        box=BoundingBox(
                            x1=round(xyxy[0], 1),
                            y1=round(xyxy[1], 1),
                            x2=round(xyxy[2], 1),
                            y2=round(xyxy[3], 1)
                        ),
                        confidence=round(conf, 4),
                        label="person"
                    )
                )
                confidences.append(conf)

        avg_conf = round(float(np.mean(confidences)), 4) if confidences else 0.0
        return detections, len(detections), avg_conf, inference_time_ms

detector_service = PersonDetector()
