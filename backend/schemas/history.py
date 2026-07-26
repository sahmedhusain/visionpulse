from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class HistoryRecordSchema(BaseModel):
    id: int
    timestamp: str
    count: int
    avg_confidence: float
    inference_time_ms: float
    image_name: Optional[str] = None

    class Config:
        from_attributes = True

class HistoryResponse(BaseModel):
    total: int
    records: List[HistoryRecordSchema]

class HistoryFilterParams(BaseModel):
    min_confidence: Optional[float] = None
    min_count: Optional[int] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    limit: int = 100
    offset: int = 0
