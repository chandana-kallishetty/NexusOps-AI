from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, database

router = APIRouter(
    prefix="/api/esg",
    tags=["ESG"]
)

@router.get("/")
def get_esg_metrics(db: Session = Depends(database.get_db)):
    suppliers = db.query(models.Supplier).all()
    warehouses = db.query(models.Warehouse).all()
    
    total_carbon = sum([s.carbon_footprint for s in suppliers if s.carbon_footprint])
    avg_sustainability = sum([s.sustainability_score for s in suppliers if s.sustainability_score]) / len(suppliers) if suppliers else 0
    total_energy = sum([w.energy_usage for w in warehouses if w.energy_usage])
    
    return {
        "suppliers": suppliers,
        "warehouses": warehouses,
        "kpis": {
            "total_carbon": total_carbon,
            "avg_sustainability": avg_sustainability,
            "total_energy": total_energy
        }
    }
