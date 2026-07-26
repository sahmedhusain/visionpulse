export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PersonDetection {
  box: BoundingBox;
  confidence: number;
  label: string;
}

export interface DetectionResponse {
  count: number;
  avg_confidence: number;
  inference_time_ms: number;
  detections: PersonDetection[];
  processed_image?: string;
  record_id?: number;
}
