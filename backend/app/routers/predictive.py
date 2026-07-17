from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, database

router = APIRouter(
    prefix="/api/predictive",
    tags=["Predictive"]
)

@router.get("/")
def get_forecasts(db: Session = Depends(database.get_db)):
    forecasts = db.query(models.Forecast).all()
    return forecasts
