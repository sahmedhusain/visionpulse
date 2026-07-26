from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.core.database import engine, Base
from backend.routes import health, detect, history

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Real-Time Person Detection and Counting API using YOLOv8"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(detect.router)
app.include_router(history.router)

# Mount root aliases for direct endpoint access (/detect, /history, /reset, /ws/stream)
app.add_api_route("/detect", detect.detect_people, methods=["POST"], tags=["Detection (Legacy Root Alias)"])
app.add_api_route("/history", history.fetch_history, methods=["GET"], tags=["History (Legacy Root Alias)"])
app.add_api_route("/reset", history.clear_history, methods=["POST"], tags=["History (Legacy Root Alias)"])
app.add_api_websocket_route("/ws/stream", detect.websocket_stream_detection)
app.add_api_websocket_route("/ws/ipstream", detect.websocket_ip_camera_stream)

