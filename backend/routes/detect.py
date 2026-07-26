import json
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from typing import Optional
from backend.core.database import SessionLocal, get_db
from backend.schemas.detection import DetectionResponse
from backend.services.preprocessor import decode_image_bytes, decode_base64_image, encode_image_to_base64, resize_for_inference
from backend.services.detector import detector_service
from backend.services.overlay import draw_detection_overlay
from backend.services.history_service import save_detection_record
from backend.services.stream_service import IPCameraStreamer

router = APIRouter(prefix="/api/v1", tags=["Detection"])

@router.post("/detect", response_model=DetectionResponse)
async def detect_people(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    conf_threshold: Optional[float] = Form(None),
    image_name: Optional[str] = Form(None),
    save_to_db: bool = Form(True),
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
            filename = image_name or "stream_frame.jpg"
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

    record_id = None
    if save_to_db:
        record = save_detection_record(
            db=db,
            count=count,
            avg_confidence=avg_conf,
            inference_time_ms=inference_time_ms,
            image_name=filename
        )
        record_id = record.id

    return DetectionResponse(
        count=count,
        avg_confidence=avg_conf,
        inference_time_ms=inference_time_ms,
        detections=detections,
        processed_image=processed_base64,
        record_id=record_id
    )

# WebSocket Stream for Local Browser Webcam Frames
@router.websocket("/ws/stream")
async def websocket_stream_detection(websocket: WebSocket):
    await websocket.accept()
    db = SessionLocal()
    frame_counter = 0

    try:
        while True:
            data_str = await websocket.receive_text()
            try:
                payload = json.loads(data_str)
                base64_img = payload.get("image")
                conf_threshold = payload.get("conf_threshold", None)
            except Exception:
                base64_img = data_str
                conf_threshold = None

            if not base64_img:
                continue

            img_bgr = decode_base64_image(base64_img)
            img_resized = resize_for_inference(img_bgr, max_dim=640)
            detections, count, avg_conf, inference_time_ms = detector_service.detect(img_resized, conf_threshold)

            annotated_img = draw_detection_overlay(img_resized, detections)
            processed_base64 = encode_image_to_base64(annotated_img)

            frame_counter += 1
            record_id = None
            if frame_counter % 10 == 0:
                record = save_detection_record(
                    db=db,
                    count=count,
                    avg_confidence=avg_conf,
                    inference_time_ms=inference_time_ms,
                    image_name="webcam_stream_frame.jpg"
                )
                record_id = record.id

            response_data = {
                "count": count,
                "avg_confidence": avg_conf,
                "inference_time_ms": inference_time_ms,
                "detections": [d.dict() for d in detections],
                "processed_image": processed_base64,
                "record_id": record_id
            }

            await websocket.send_text(json.dumps(response_data))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket stream error: {e}")
    finally:
        db.close()

# WebSocket Stream for IP Camera / RTSP / NDI Feed
@router.websocket("/ws/ipstream")
async def websocket_ip_camera_stream(
    websocket: WebSocket,
    url: str = Query(...),
    conf_threshold: float = Query(0.35)
):
    await websocket.accept()
    streamer = IPCameraStreamer(url)

    try:
        async for frame_data in streamer.generate_frames(conf_threshold=conf_threshold):
            await websocket.send_text(json.dumps(frame_data))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_text(json.dumps({"error": f"Stream failed: {str(e)}"}))
        await websocket.close()

# Legacy Root Aliases
@router.post("/detect_legacy", response_model=DetectionResponse, include_in_schema=False)
async def detect_legacy(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    conf_threshold: Optional[float] = Form(None),
    db: Session = Depends(get_db)
):
    return await detect_people(file=file, image_base64=image_base64, conf_threshold=conf_threshold, db=db)
