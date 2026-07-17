from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from .. import models, database

router = APIRouter(
    prefix="/api/suppliers",
    tags=["Suppliers"]
)

@router.get("/")
def get_suppliers(db: Session = Depends(database.get_db)):
    # Calculate Supplier Delay % based on orders
    # Delay % = (Delayed Orders / Total Orders) * 100
    
    # We will get all suppliers and attach metrics
    suppliers = db.query(models.Supplier).all()
    
    result = []
    for s in suppliers:
        total_orders = db.query(models.Order).filter(models.Order.supplier_id == s.id).count()
        delayed_orders = db.query(models.Order).filter(models.Order.supplier_id == s.id, models.Order.delivery_status == "Delayed").count()
        
        delay_percent = round((delayed_orders / total_orders) * 100, 1) if total_orders > 0 else 0
        
        result.append({
            "id": s.id,
            "name": s.name,
            "region": s.region,
            "rating": s.rating,
            "average_delivery_time": s.average_delivery_time,
            "total_orders": total_orders,
            "delay_percent": delay_percent
        })
        
    # Sort by rating descending
    result.sort(key=lambda x: x['rating'], reverse=True)
    return result

@router.get("/kpis")
def get_supplier_kpis(db: Session = Depends(database.get_db)):
    suppliers = db.query(models.Supplier).all()
    if not suppliers:
        return {}
        
    avg_rating = sum(s.rating for s in suppliers) / len(suppliers)
    top_supplier = max(suppliers, key=lambda s: s.rating)
    
    # Calculate overall delay percent
    total_orders = db.query(models.Order).count()
    delayed_orders = db.query(models.Order).filter(models.Order.delivery_status == "Delayed").count()
    overall_delay_percent = round((delayed_orders / total_orders) * 100, 1) if total_orders > 0 else 0
    
    return {
        "top_supplier_name": top_supplier.name,
        "average_supplier_rating": round(avg_rating, 2),
        "overall_supplier_delay_percent": overall_delay_percent
    }
