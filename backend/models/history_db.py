from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from backend.core.database import Base

class DetectionRecord(Base):
    __tablename__ = "detection_records"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    count = Column(Integer, nullable=False)
    avg_confidence = Column(Float, nullable=False)
    inference_time_ms = Column(Float, nullable=False)
    image_name = Column(String, nullable=True)
