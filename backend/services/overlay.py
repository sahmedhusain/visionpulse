import cv2
import numpy as np
from typing import List
from backend.schemas.detection import PersonDetection

def draw_detection_overlay(img_bgr: np.ndarray, detections: List[PersonDetection]) -> np.ndarray:
    annotated = img_bgr.copy()
    box_color = (0, 215, 255) # Cyber Cyan / Yellow accent
    text_bg_color = (0, 180, 220)
    text_color = (15, 15, 15)

    for det in detections:
        box = det.box
        x1, y1, x2, y2 = int(box.x1), int(box.y1), int(box.x2), int(box.y2)

        # Draw bounding box
        cv2.rectangle(annotated, (x1, y1), (x2, y2), box_color, 2)

        # Draw label & confidence box
        label_text = f"Person {int(det.confidence * 100)}%"
        (w, h), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)

        cv2.rectangle(annotated, (x1, y1 - h - 8), (x1 + w + 8, y1), text_bg_color, -1)
        cv2.putText(
            annotated, label_text, (x1 + 4, y1 - 4),
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, text_color, 1, cv2.LINE_AA
        )

    return annotated
