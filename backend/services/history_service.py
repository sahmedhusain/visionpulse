import csv
import io
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.models.history_db import DetectionRecord
from backend.schemas.history import HistoryRecordSchema, HistoryFilterParams

def save_detection_record(
    db: Session,
    count: int,
    avg_confidence: float,
    inference_time_ms: float,
    image_name: Optional[str] = None
) -> DetectionRecord:
    record = DetectionRecord(
        timestamp=datetime.utcnow(),
        count=count,
        avg_confidence=avg_confidence,
        inference_time_ms=inference_time_ms,
        image_name=image_name
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_history_records(db: Session, filters: HistoryFilterParams) -> tuple:
    query = db.query(DetectionRecord)

    if filters.min_confidence is not None:
        query = query.filter(DetectionRecord.avg_confidence >= filters.min_confidence)
    if filters.min_count is not None:
        query = query.filter(DetectionRecord.count >= filters.min_count)
    if filters.start_date:
        try:
            start_dt = datetime.fromisoformat(filters.start_date)
            query = query.filter(DetectionRecord.timestamp >= start_dt)
        except ValueError:
            pass
    if filters.end_date:
        try:
            end_dt = datetime.fromisoformat(filters.end_date)
            query = query.filter(DetectionRecord.timestamp <= end_dt)
        except ValueError:
            pass

    total = query.count()
    records = query.order_by(DetectionRecord.timestamp.desc()).offset(filters.offset).limit(filters.limit).all()

    formatted_records = [
        HistoryRecordSchema(
            id=r.id,
            timestamp=r.timestamp.isoformat() + "Z",
            count=r.count,
            avg_confidence=r.avg_confidence,
            inference_time_ms=r.inference_time_ms,
            image_name=r.image_name
        )
        for r in records
    ]

    return total, formatted_records

def reset_history(db: Session) -> int:
    deleted_count = db.query(DetectionRecord).delete()
    db.commit()
    return deleted_count

def export_history_csv(db: Session) -> str:
    records = db.query(DetectionRecord).order_by(DetectionRecord.timestamp.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Timestamp (UTC)", "People Count", "Avg Confidence", "Inference Time (ms)", "Image Name"])

    for r in records:
        writer.writerow([r.id, r.timestamp.isoformat(), r.count, r.avg_confidence, r.inference_time_ms, r.image_name or ""])

    return output.getvalue()
