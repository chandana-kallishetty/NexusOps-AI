from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from .. import models, database

router = APIRouter(
    prefix="/api/logistics",
    tags=["Logistics"]
)

@router.get("/")
def get_logistics(db: Session = Depends(database.get_db)):
    warehouses = db.query(models.Warehouse).all()
    result = []
    
    for w in warehouses:
        utilization_percent = round((w.current_utilization / w.capacity) * 100, 1) if w.capacity > 0 else 0
        
        # Calculate delay for this warehouse
        total_orders = db.query(models.Order).filter(models.Order.warehouse_id == w.id).count()
        delayed_orders = db.query(models.Order).filter(models.Order.warehouse_id == w.id, models.Order.delivery_status == "Delayed").count()
        delay_rate = round((delayed_orders / total_orders) * 100, 1) if total_orders > 0 else 0
        
        result.append({
            "id": w.id,
            "name": w.name,
            "capacity": w.capacity,
            "current_utilization": w.current_utilization,
            "utilization_percent": utilization_percent,
            "delay_rate": delay_rate
        })
        
    result.sort(key=lambda x: x['delay_rate'])
    return result

@router.get("/kpis")
def get_logistics_kpis(db: Session = Depends(database.get_db)):
    total_orders = db.query(models.Order).count()
    delayed_orders = db.query(models.Order).filter(models.Order.delivery_status == "Delayed").count()
    delivered_orders = db.query(models.Order).filter(models.Order.delivery_status == "Delivered").count()
    
    delivery_success_rate = round((delivered_orders / total_orders) * 100, 1) if total_orders > 0 else 0
    
    # Calculate avg delivery time (mock using supplier averages as we don't store actual transit time in order)
    avg_delivery_time = db.query(func.avg(models.Supplier.average_delivery_time)).scalar() or 0
    
    return {
        "average_delivery_time": round(avg_delivery_time, 1),
        "delayed_shipments": delayed_orders,
        "delivery_success_rate": delivery_success_rate
    }
