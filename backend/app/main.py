from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import database, models
from .routers import (
    suppliers, inventory, logistics, dashboard, 
    insights, quality, predictive, anomalies, 
    digital_twin, risk, esg, copilot, scenarios
)

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Volvo Supply Chain Intelligence API",
    description="Backend API for the Supply Chain Intelligence & Business Analytics Platform",
    version="1.0.0"
)

# CORS setup for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(suppliers.router)
app.include_router(inventory.router)
app.include_router(logistics.router)
app.include_router(insights.router)
app.include_router(quality.router)
app.include_router(predictive.router)
app.include_router(anomalies.router)
app.include_router(digital_twin.router)
app.include_router(risk.router)
app.include_router(esg.router)
app.include_router(copilot.router)
app.include_router(scenarios.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Volvo Supply Chain Intelligence API"}
