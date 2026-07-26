from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from typing import Optional
from backend.core.database import get_db
from backend.schemas.history import HistoryResponse, HistoryFilterParams
from backend.services.history_service import get_history_records, reset_history, export_history_csv

router = APIRouter(prefix="/api/v1", tags=["History"])

@router.get("/history", response_model=HistoryResponse)
def fetch_history(
    min_confidence: Optional[float] = Query(None, ge=0.0, le=1.0),
    min_count: Optional[int] = Query(None, ge=0),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    filters = HistoryFilterParams(
        min_confidence=min_confidence,
        min_count=min_count,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        offset=offset
    )
    total, records = get_history_records(db, filters)
    return HistoryResponse(total=total, records=records)

@router.post("/reset")
@router.delete("/history")
def clear_history(db: Session = Depends(get_db)):
    deleted_count = reset_history(db)
    return {"message": "Detection history cleared successfully", "deleted_count": deleted_count}

@router.get("/export")
def export_csv(db: Session = Depends(get_db)):
    csv_data = export_history_csv(db)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=detecto_history.csv"}
    )
