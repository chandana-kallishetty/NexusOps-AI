from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import random
from typing import List

from .. import models, database

router = APIRouter(
    prefix="/api/insights",
    tags=["Insights"]
)

@router.get("/process-improvement")
def get_process_improvement(db: Session = Depends(database.get_db)):
    recommendations = []
    
    # 1. Suppliers causing highest delays
    worst_supplier = db.query(
        models.Supplier, 
        func.count(models.Order.id).label('delays')
    ).join(models.Order).filter(models.Order.delivery_status == "Delayed").group_by(models.Supplier.id).order_by(func.count(models.Order.id).desc()).first()
    
    if worst_supplier:
        recommendations.append({
            "category": "Supplier Delay",
            "title": f"Review contract with {worst_supplier.Supplier.name}",
            "description": f"This supplier is responsible for the highest number of delayed shipments ({worst_supplier.delays} delays). Consider alternative sourcing.",
            "impact": "High"
        })
        
    # 2. Warehouses nearing capacity
    full_warehouse = db.query(models.Warehouse).filter((models.Warehouse.current_utilization / models.Warehouse.capacity) > 0.9).first()
    if full_warehouse:
        recommendations.append({
            "category": "Warehouse Capacity",
            "title": f"Expand capacity at {full_warehouse.name}",
            "description": f"Warehouse utilization is critically high (>90%). Route new incoming shipments to alternative locations to avoid bottlenecks.",
            "impact": "High"
        })
        
    # 3. Products likely to go out of stock
    low_stock = db.query(models.Inventory).filter(models.Inventory.current_stock < models.Inventory.reorder_level * 0.5).first()
    if low_stock:
        recommendations.append({
            "category": "Inventory Risk",
            "title": f"Expedite orders for {low_stock.product_name}",
            "description": f"Current stock ({low_stock.current_stock}) is critically below the reorder level ({low_stock.reorder_level}).",
            "impact": "Medium"
        })
        
    # 4. Cost saving opportunities
    over_stock = db.query(models.Inventory).filter(models.Inventory.current_stock > models.Inventory.reorder_level * 5).first()
    if over_stock:
        recommendations.append({
            "category": "Cost Optimization",
            "title": f"Liquidate excess stock of {over_stock.product_name}",
            "description": f"Holding costs are accumulating for this product with current stock at {over_stock.current_stock}, which is 5x over reorder level.",
            "impact": "Medium"
        })
        
    return recommendations

@router.get("/ai-business")
def get_ai_business_insights(db: Session = Depends(database.get_db)):
    # Simulating algorithmic AI generation
    insights = []
    
    # Analyze best/worst supplier based on rating + delay
    best_supplier = db.query(models.Supplier).order_by(models.Supplier.rating.desc()).first()
    if best_supplier:
        insights.append({
            "id": 1,
            "type": "Performance",
            "priority": "Low",
            "title": "Best Performing Supplier",
            "message": f"{best_supplier.name} has maintained a stellar rating of {best_supplier.rating} with {best_supplier.average_delivery_time} days average delivery time."
        })
        
    # Warehouse optimization
    avg_utilization = db.query(func.avg(models.Warehouse.current_utilization / models.Warehouse.capacity)).scalar() or 0
    insights.append({
        "id": 2,
        "type": "Optimization",
        "priority": "Medium",
        "title": "Global Warehouse Utilization",
        "message": f"Global average warehouse utilization is at {round(avg_utilization * 100, 1)}%. Re-balancing inventory across regions could improve delivery speeds by 12%."
    })
    
    # Procurement
    insights.append({
        "id": 3,
        "type": "Procurement",
        "priority": "High",
        "title": "Bulk Discount Opportunity",
        "message": "AI analysis of Q1 order volumes suggests we can negotiate a 4% volume discount with raw material suppliers by consolidating orders."
    })
    
    return insights

@router.get("/feed")
def get_insights_feed(db: Session = Depends(database.get_db)):
    # Generates dynamic insights for the Executive Feed
    feed = [
        {
            "id": 1,
            "type": "Risk",
            "title": "Elevated Stockout Risk",
            "message": "Top 20% selling SKUs in European sector face a 35% probability of stockouts this week.",
            "timestamp": "10 mins ago",
            "priority": "High"
        },
        {
            "id": 2,
            "type": "Opportunity",
            "title": "Cost Saving Opportunity",
            "message": "Consolidating secondary logistics routes can yield ₹45,00,000 in monthly savings.",
            "timestamp": "45 mins ago",
            "priority": "Medium"
        },
        {
            "id": 3,
            "type": "Forecast",
            "title": "Q3 Revenue Projection",
            "message": "Demand forecast suggests Q3 revenue will exceed target by 12% if supply chains hold.",
            "timestamp": "2 hours ago",
            "priority": "Low"
        },
        {
            "id": 4,
            "type": "Recommendation",
            "title": "Supplier Renegotiation",
            "message": "Supplier 'Apex Logistics' delay times have increased. Trigger SLA penalty clause.",
            "timestamp": "5 hours ago",
            "priority": "High"
        }
    ]
    return feed
