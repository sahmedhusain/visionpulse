from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from backend.core.database import get_db
from backend.schemas.detection import DetectionResponse
from backend.services.preprocessor import decode_image_bytes, decode_base64_image, encode_image_to_base64, resize_for_inference
from backend.services.detector import detector_service
from backend.services.overlay import draw_detection_overlay
from backend.services.history_service import save_detection_record

router = APIRouter(prefix="/api/v1", tags=["Detection"])

@router.post("/detect", response_model=DetectionResponse)
async def detect_people(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    conf_threshold: Optional[float] = Form(None),
    image_name: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    if not file and not image_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either an image file or base64 image string must be provided."
        )

    try:
        if file:
            filename = file.filename or image_name or "uploaded_frame.jpg"
            ext = filename.split(".")[-1].lower()
            if ext not in ["jpg", "jpeg", "png", "webp", "bmp"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported image format '.{ext}'. Supported formats: JPG, PNG, WEBP, BMP."
                )
            contents = await file.read()
            img_bgr = decode_image_bytes(contents)
        else:
            filename = image_name or "base64_frame.jpg"
            img_bgr = decode_base64_image(image_base64)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process image: {str(e)}"
        )

    img_resized = resize_for_inference(img_bgr)
    detections, count, avg_conf, inference_time_ms = detector_service.detect(img_resized, conf_threshold)

    annotated_img = draw_detection_overlay(img_resized, detections)
    processed_base64 = encode_image_to_base64(annotated_img)

    record = save_detection_record(
        db=db,
        count=count,
        avg_confidence=avg_conf,
        inference_time_ms=inference_time_ms,
        image_name=filename
    )

    return DetectionResponse(
        count=count,
        avg_confidence=avg_conf,
        inference_time_ms=inference_time_ms,
        detections=detections,
        processed_image=processed_base64,
        record_id=record.id
    )

# Also expose top-level /detect route for compatibility
@router.post("/detect_legacy", response_model=DetectionResponse, include_in_schema=False)
async def detect_legacy(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    conf_threshold: Optional[float] = Form(None),
    db: Session = Depends(get_db)
):
    return await detect_people(file=file, image_base64=image_base64, conf_threshold=conf_threshold, db=db)
