from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, database

router = APIRouter(
    prefix="/api/risk",
    tags=["Risk"]
)

@router.get("/")
def get_risks(db: Session = Depends(database.get_db)):
    suppliers = db.query(models.Supplier).all()
    inventory = db.query(models.Inventory).all()
    
    return {
        "suppliers": suppliers,
        "inventory": inventory
    }
