from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from .. import models, database

router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"]
)

@router.get("/")
def get_inventory(db: Session = Depends(database.get_db)):
    inventories = db.query(models.Inventory).all()
    result = []
    
    for inv in inventories:
        category = inv.product.category if inv.product else "Unknown"
        status = "Healthy"
        if inv.current_stock < inv.reorder_level:
            status = "Low Stock"
        elif inv.current_stock > inv.reorder_level * 3:
            status = "Overstock"
            
        result.append({
            "id": inv.id,
            "product_name": inv.product_name,
            "category": category,
            "current_stock": inv.current_stock,
            "reorder_level": inv.reorder_level,
            "inventory_value": inv.inventory_value,
            "warehouse": inv.warehouse.name if inv.warehouse else "Unknown",
            "status": status
        })
    return result

@router.get("/kpis")
def get_inventory_kpis(db: Session = Depends(database.get_db)):
    total_items = db.query(models.Inventory).count()
    low_stock = db.query(models.Inventory).filter(models.Inventory.current_stock < models.Inventory.reorder_level).count()
    overstock = db.query(models.Inventory).filter(models.Inventory.current_stock > models.Inventory.reorder_level * 3).count()
    
    # Inventory Turnover mock calculation
    # COGS / Average Inventory (We use mock data for now)
    total_sales_qty = db.query(func.sum(models.Order.quantity_delivered)).scalar() or 0
    total_inventory_qty = db.query(func.sum(models.Inventory.current_stock)).scalar() or 1
    turnover_rate = round(total_sales_qty / total_inventory_qty, 2)
    
    return {
        "low_stock_products": low_stock,
        "overstock_products": overstock,
        "inventory_turnover": turnover_rate
    }
