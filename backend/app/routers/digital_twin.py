from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, database

router = APIRouter(
    prefix="/api/digital-twin",
    tags=["DigitalTwin"]
)

@router.get("/network")
def get_network(db: Session = Depends(database.get_db)):
    warehouses = db.query(models.Warehouse).all()
    suppliers = db.query(models.Supplier).all()
    return {
        "warehouses": warehouses,
        "suppliers": suppliers
    }
