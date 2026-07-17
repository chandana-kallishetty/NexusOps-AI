from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/scenarios",
    tags=["Scenarios"]
)

class ScenarioInput(BaseModel):
    supplierDelayPercent: float
    demandIncreasePercent: float
    warehouseCapacity: float
    inventoryLevels: float

@router.post("/simulate")
def simulate_scenario(inputs: ScenarioInput):
    # Base baseline metrics for a large enterprise
    baseline_revenue = 120000000.0  # 120M
    baseline_cost = 85000000.0      # 85M
    
    delay_factor = inputs.supplierDelayPercent / 100.0
    demand_factor = inputs.demandIncreasePercent / 100.0
    capacity_factor = inputs.warehouseCapacity / 100.0
    inventory_factor = inputs.inventoryLevels / 100.0
    
    # Calculate impacts based on a basic simulation model
    # If demand increases but delay is high and inventory is low, stockout risk explodes
    stockout_risk = max(0.0, min(100.0, (demand_factor * 50) + (delay_factor * 70) - ((inventory_factor - 1) * 40)))
    
    # Revenue is positively impacted by demand but bottlenecked by stockouts
    revenue_impact_percent = demand_factor - (stockout_risk / 200.0)
    new_revenue = baseline_revenue * (1 + revenue_impact_percent)
    
    # Costs increase with delays (expedited shipping) and warehouse constraints
    cost_impact_percent = (delay_factor * 0.4) + (demand_factor * 0.2)
    if capacity_factor < 1.0:
        cost_impact_percent += (1.0 - capacity_factor) * 0.5 # Penalty for lacking capacity
        
    new_cost = baseline_cost * (1 + cost_impact_percent)
    
    # Delivery performance drops with delays
    delivery_performance = max(0.0, 98.0 - (delay_factor * 150))
    
    actions = []
    if stockout_risk > 30:
        actions.append("Expedite raw material shipments for top 20% selling SKUs.")
    if new_cost > baseline_cost * 1.1:
        actions.append("Renegotiate spot rates with secondary logistics providers.")
    if delivery_performance < 85:
        actions.append("Reroute pending orders to warehouses with higher capacity.")
    if len(actions) == 0:
        actions.append("Current operating parameters are stable. Monitor margins.")
        
    return {
        "projected_revenue": new_revenue,
        "revenue_delta": new_revenue - baseline_revenue,
        "projected_cost": new_cost,
        "cost_delta": new_cost - baseline_cost,
        "stockout_risk": stockout_risk,
        "delivery_performance": delivery_performance,
        "recommended_actions": actions
    }
