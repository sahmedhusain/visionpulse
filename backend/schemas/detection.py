from pydantic import BaseModel, Field
from typing import List, Optional

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class PersonDetection(BaseModel):
    box: BoundingBox
    confidence: float
    label: str = "person"

class DetectionResponse(BaseModel):
    count: int
    avg_confidence: float
    inference_time_ms: float
    detections: List[PersonDetection]
    processed_image: Optional[str] = None
    record_id: Optional[int] = None
