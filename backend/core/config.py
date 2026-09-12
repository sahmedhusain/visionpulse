import os

class Settings:
    PROJECT_NAME: str = "RPD API"
    VERSION: str = "1.0.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./visionpulse.db")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "yolov8n.pt")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.35"))
    MAX_IMAGE_SIZE_MB: int = 10

settings = Settings()
