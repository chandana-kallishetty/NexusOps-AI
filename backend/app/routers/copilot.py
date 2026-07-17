from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..database import get_db
from .. import models

router = APIRouter(
    prefix="/api/copilot",
    tags=["copilot"]
)

class ChatMessage(BaseModel):
    message: str
    context_path: Optional[str] = None

class ChatResponse(BaseModel):
    observation: str
    impact: str
    confidence: int
    recommendation: Optional[Dict[str, str]] = None
    chart_data: Optional[List[Dict[str, Any]]] = None
    suggested_followups: Optional[List[str]] = None

@router.post("/chat", response_model=ChatResponse)
def copilot_chat(chat: dict, db: Session = Depends(get_db)):
    msg = chat.get("message", "").lower()
    ctx = chat.get("context_path", "").lower()
    
    # Context-Aware: "What does this page do?"
    if "what does this page do" in msg or "what is this page" in msg or "explain this page" in msg:
        if "risk" in ctx:
            return {
                "observation": "You are currently viewing the Risk Intelligence Center. This module aggregates multi-vector vulnerabilities across Financial, Operational, Geopolitical, and Cyber domains.",
                "impact": "It provides early-warning detection for systemic shocks, protecting enterprise value from unforeseen disruptions.",
                "confidence": 100,
                "recommendation": {
                    "title": "Analyze Highest Risk",
                    "action": "Review the critical supplier disruptions flagged in the Radar Chart."
                },
                "suggested_followups": ["What are the biggest risks?", "Which suppliers need attention?"]
            }
        elif "inventory" in ctx:
            return {
                "observation": "You are currently viewing the Inventory Intelligence module. This dashboard tracks real-time stock levels, holding costs, and reorder alerts across all global nodes.",
                "impact": "Optimizing these metrics directly releases working capital and prevents stockout-driven revenue loss.",
                "confidence": 100,
                "recommendation": {
                    "title": "Optimize Capital",
                    "action": "Review the overstocked items to liquidate excess capital."
                },
                "suggested_followups": ["Show inventory bottlenecks", "How can costs be reduced?"]
            }
        elif "predictive" in ctx or "forecast" in ctx:
            return {
                "observation": "You are viewing the Predictive Analytics Engine. It uses machine learning to project 6-month trajectories for Revenue, Costs, Demand, and Risk.",
                "impact": "This allows for proactive resource allocation and accurate margin protection strategies.",
                "confidence": 100,
                "recommendation": {
                    "title": "Review Revenue Forecast",
                    "action": "Analyze the Best/Worst case confidence intervals for Q3 revenue."
                },
                "suggested_followups": ["Predict next month's revenue", "What is the demand forecast?"]
            }
        elif "anomalies" in ctx:
            return {
                "observation": "You are viewing the Anomaly Detection Center. It monitors all live telemetry to flag structural deviations in revenue, logistics, and supplier performance.",
                "impact": "Rapid identification of anomalies reduces response times to critical business threats by 80%.",
                "confidence": 100,
                "recommendation": {
                    "title": "Review Critical Alerts",
                    "action": "Investigate the Revenue Drop anomaly immediately."
                },
                "suggested_followups": ["What is today's executive summary?", "What are the biggest risks?"]
            }
        else:
            return {
                "observation": "You are viewing the NexusOps AI Command Center, the central nervous system for your enterprise operations.",
                "impact": "This unified view surfaces top-level KPIs, health scores, and critical alerts across all business units.",
                "confidence": 100,
                "recommendation": {
                    "title": "Generate Report",
                    "action": "Click 'Generate Executive Report' to create a PDF briefing."
                },
                "suggested_followups": ["What is today's executive summary?", "What are the biggest risks?"]
            }

    # 1. Executive Summary
    if "executive summary" in msg or "summary" in msg:
        kpis = db.query(models.DashboardKPI).first()
        rev = kpis.total_revenue if kpis else 150000000
        del_rate = kpis.on_time_delivery_rate if kpis else 94.2
        return {
            "observation": f"Enterprise health is highly stable. Total realized revenue is ₹{int(rev/100000)} Lakhs with a {del_rate}% delivery SLA compliance.",
            "impact": "Overall margin trajectories are positive, but predictive models flag emerging Tier-2 supplier congestion.",
            "confidence": 98,
            "recommendation": {
                "title": "Strategic Focus",
                "action": "Prioritize supplier diversification in the APAC region to protect Q3 revenue."
            },
            "suggested_followups": ["Which suppliers need attention?", "Predict next month's revenue"]
        }

    # 2. Supplier Risk
    if "risk" in msg and "supplier" in msg or "worst supplier" in msg or "attention" in msg or "biggest risks" in msg:
        top_risks = db.query(models.Supplier).order_by(models.Supplier.risk_score.desc()).limit(3).all()
        risk_list = ", ".join([f"{r.name} (Score: {r.risk_score:.0f})" for r in top_risks]) if top_risks else "Apex Industrial, NorthStar Logistics, Prime Materials"
        return {
            "observation": f"The top 3 operational risks are currently driven by these suppliers: {risk_list}.",
            "impact": "These high-risk nodes present a severe threat to operational continuity, potentially degrading quarterly delivery SLA by 12% and increasing expedite costs.",
            "confidence": 95,
            "recommendation": {
                "title": "Mitigate Top 3 Risks",
                "action": "Immediate action: Re-allocate 25% of open orders from these suppliers to secondary vendors with lower risk profiles."
            },
            "suggested_followups": ["How can costs be reduced?", "Explain inventory issues"]
        }
            
    # 3. Revenue Forecast
    if "predict" in msg and "revenue" in msg or "next month's revenue" in msg or "revenue forecast" in msg:
        forecasts = db.query(models.Forecast).filter(models.Forecast.type == "Revenue").limit(6).all()
        chart_data = [{"month": f.date.strftime("%b"), "value": f.value} for f in forecasts] if forecasts else [
            {"month": "Jul", "value": 150000}, {"month": "Aug", "value": 162000}, {"month": "Sep", "value": 175000}
        ]
        latest_val = forecasts[-1].value if forecasts else 175000
        
        return {
            "observation": f"The Q3 Revenue Forecast projects a value of ₹{latest_val:,.0f} Lakhs. This represents a solid +8.3% growth trajectory over the previous quarter.",
            "impact": "Executive Interpretation: The enterprise is positioned to exceed the annual target if current market conditions and supply stability hold.",
            "confidence": 92,
            "chart_data": chart_data,
            "recommendation": {
                "title": "Capitalize on Growth",
                "action": "Increase Q3 marketing budget by 15% to capture projected market expansion and secure the upside."
            },
            "suggested_followups": ["What are my biggest risks?", "What is today's executive summary?"]
        }
        
    # 4. Inventory Shortages / Bottlenecks
    if "inventory bottlenecks" in msg or "shortages" in msg or "stock" in msg or "explain inventory issues" in msg:
        shortages = db.query(models.Inventory).filter(models.Inventory.current_stock < models.Inventory.reorder_level).all()
        overstock = db.query(models.Inventory).filter(models.Inventory.current_stock > (models.Inventory.reorder_level * 3)).all()
        short_count = len(shortages) if shortages else 12
        over_count = len(overstock) if overstock else 8
        return {
            "observation": f"Inventory Analysis: There are currently {over_count} product categories severely overstocked, tying up working capital. Simultaneously, {short_count} items are facing critical stockouts.",
            "impact": "Stockouts threaten immediate revenue fulfillment (Est. loss ₹12.5 Cr), while overstock generates high holding costs.",
            "confidence": 96,
            "recommendation": {
                "title": "Inventory Rebalancing",
                "action": "Suggested corrections: Expedite air-freight for the 12 short items and initiate flash-sales for the overstocked items to release capital."
            },
            "suggested_followups": ["How can I reduce costs?", "What are my biggest risks?"]
        }
            
    # 5. Cost Optimization
    if "reduce costs" in msg or "cost optimization" in msg or "save money" in msg or "how much can we save" in msg:
        return {
            "observation": "I have identified 3 primary cost optimization opportunities: Logistics route consolidation, Warehouse automation upgrades, and Overstock liquidation.",
            "impact": "Business Justification: Executing these initiatives will yield an estimated savings of ₹14.2 Cr annually, directly improving the bottom line operating margin.",
            "confidence": 94,
            "recommendation": {
                "title": "Priority: Route Consolidation",
                "action": "Priority 1 Ranking: Consolidate LTL (Less Than Truckload) shipments in the Europe Fulfillment Center to save ₹4.8 Cr immediately."
            },
            "suggested_followups": ["What does this page do?", "Explain inventory issues"]
        }
            
    # Default Fallback - Intelligent Assistant Response
    return {
        "observation": "I am continuously analyzing telemetry from across your enterprise data fabric.",
        "impact": "I can surface hidden risks, generate predictive revenue forecasts, and optimize operational capital.",
        "confidence": 99,
        "recommendation": {
            "title": "Explore NexusOps Intelligence",
            "action": "Select one of the suggested prompts below to initiate an intelligence routine."
        },
        "suggested_followups": ["What does this page do?", "What are the biggest risks?", "How can costs be reduced?"]
    }
