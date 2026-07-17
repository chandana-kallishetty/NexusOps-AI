from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Dict, Any

from .. import models, database

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

@router.get("/executive")
def get_executive_dashboard(db: Session = Depends(database.get_db)):
    # KPIs
    total_orders = db.query(models.Order).count()
    total_revenue = db.query(func.sum(models.Order.order_cost)).scalar() or 0
    total_inventory_value = db.query(func.sum(models.Inventory.inventory_value)).scalar() or 0
    supplier_count = db.query(models.Supplier).count()
    
    delivered_orders = db.query(models.Order).filter(models.Order.delivery_status == "Delivered").count()
    delayed_orders = db.query(models.Order).filter(models.Order.delivery_status == "Delayed").count()
    on_time_delivery_rate = round((delivered_orders / (delivered_orders + delayed_orders)) * 100, 2) if (delivered_orders + delayed_orders) > 0 else 0
    
    # Monthly Orders Trend
    # For SQLite we might need to group by strftime, but doing simple group by date here
    # In SQLite, order_date is stored as string usually, but SQLAlchemy Date handles it
    orders_trend_raw = db.query(
        func.strftime('%Y-%m', models.Order.order_date).label('month'),
        func.count(models.Order.id).label('orders'),
        func.sum(models.Order.order_cost).label('revenue')
    ).group_by('month').order_by('month').all()
    
    monthly_trend = [
        {"month": row.month, "orders": row.orders, "revenue": round(row.revenue, 2)}
        for row in orders_trend_raw
    ]
    
    # Inventory Health Score (mock metric: percentage of inventory items above reorder level)
    total_inventory_items = db.query(models.Inventory).count()
    healthy_inventory_items = db.query(models.Inventory).filter(models.Inventory.current_stock > models.Inventory.reorder_level).count()
    inventory_health_score = round((healthy_inventory_items / total_inventory_items) * 100, 1) if total_inventory_items > 0 else 0

    return {
        "kpis": {
            "total_orders": total_orders,
            "total_revenue": round(total_revenue, 2),
            "total_inventory_value": round(total_inventory_value, 2),
            "supplier_count": supplier_count,
            "on_time_delivery_rate": on_time_delivery_rate,
            "inventory_health_score": inventory_health_score
        },
        "trends": monthly_trend
    }
