from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, database

router = APIRouter(
    prefix="/api/anomalies",
    tags=["Anomalies"]
)

@router.get("/")
def get_anomalies(db: Session = Depends(database.get_db)):
    anomalies = db.query(models.Anomaly).order_by(models.Anomaly.detected_at.desc()).all()
    return anomalies
