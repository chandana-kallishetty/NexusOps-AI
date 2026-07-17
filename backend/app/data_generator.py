import os
import random
from datetime import datetime, timedelta
import pandas as pd
from faker import Faker
from sqlalchemy.orm import Session
from . import models, database

fake = Faker()

ENTERPRISE_COMPANIES = [
    "Global Manufacturing Partner", "Apex Industrial Components", "NorthStar Logistics",
    "Vertex Electronics", "Prime Materials Group", "Titan Supply Network",
    "Continental Manufacturing", "OmniTech Components", "Meridian Cargo Solutions",
    "Pinnacle Procurement", "Nexus Industrial", "Omega Supply Network"
]

ENTERPRISE_PRODUCTS = [
    "Industrial Microprocessors", "Automotive Transmissions", "High-Tensile Steel", 
    "Lithium-Ion Battery Packs", "Aerospace Grade Aluminum", "Robotic Assembly Arms",
    "Synthetic Lubricants", "Commercial Grade Packaging", "Precision Bearings", 
    "Fiber Optic Cables", "Semiconductor Wafers", "Hydraulic Valves"
]

def get_risk_category(score):
    if score < 30: return "Low Risk"
    if score < 60: return "Medium Risk"
    if score < 85: return "High Risk"
    return "Critical"

def generate_data():
    database.Base.metadata.create_all(bind=database.engine)
    db = database.SessionLocal()
    
    # Check if data already exists
    if db.query(models.Supplier).first():
        print("Data already exists. Skipping generation.")
        db.close()
        return

    print("Generating suppliers...")
    regions = ["North America", "Europe", "Asia Pacific", "South America", "Middle East"]
    suppliers = []
    for _ in range(100):
        r_score = random.uniform(10.0, 95.0)
        supplier = models.Supplier(
            name=random.choice(ENTERPRISE_COMPANIES),
            region=random.choice(regions),
            average_delivery_time=round(random.uniform(2.0, 15.0), 1),
            rating=round(random.uniform(3.0, 5.0), 1),
            risk_score=r_score,
            risk_category=get_risk_category(r_score),
            carbon_footprint=random.uniform(500.0, 5000.0),
            sustainability_score=random.uniform(40.0, 99.0),
            latitude=float(fake.latitude()),
            longitude=float(fake.longitude())
        )
        db.add(supplier)
        suppliers.append(supplier)
    db.commit()

    print("Generating warehouses...")
    WAREHOUSE_NAMES = [
        "North America Distribution Hub", "Europe Fulfillment Center", 
        "Asia Pacific Operations Center", "Global Logistics Hub", 
        "Regional Inventory Center"
    ]
    warehouses = []
    for _ in range(10):
        warehouse = models.Warehouse(
            name=random.choice(WAREHOUSE_NAMES),
            capacity=random.randint(50000, 200000),
            current_utilization=random.randint(20000, 180000),
            latitude=float(fake.latitude()),
            longitude=float(fake.longitude()),
            energy_usage=random.uniform(10000.0, 50000.0)
        )
        db.add(warehouse)
        warehouses.append(warehouse)
    db.commit()

    print("Generating products...")
    categories = ["Electronics", "Automotive Parts", "Raw Materials", "Packaging", "Machinery"]
    products = []
    for _ in range(500):
        product = models.Product(
            name=f"{random.choice(ENTERPRISE_PRODUCTS)} {random.randint(100, 9999)}",
            category=random.choice(categories),
            unit_cost=round(random.uniform(10.0, 1500.0), 2)
        )
        db.add(product)
        products.append(product)
    db.commit()

    print("Generating inventory...")
    inventories = []
    for product in products:
        warehouse = random.choice(warehouses)
        stock = random.randint(0, 1000)
        reorder = random.randint(50, 300)
        r_score = random.uniform(5.0, 80.0)
        inventory = models.Inventory(
            product_id=product.id,
            product_name=product.name,
            current_stock=stock,
            reorder_level=reorder,
            warehouse_id=warehouse.id,
            inventory_value=stock * product.unit_cost,
            risk_score=r_score,
            risk_category=get_risk_category(r_score)
        )
        db.add(inventory)
        inventories.append(inventory)
    db.commit()

    print("Generating orders (this might take a minute)...")
    statuses = ["Delivered", "Delivered", "Delivered", "In Transit", "In Transit", "Delayed"]
    orders = []
    
    start_date = datetime.now() - timedelta(days=365)
    
    # 15,000 orders
    for i in range(15000):
        product = random.choice(products)
        supplier = random.choice(suppliers)
        warehouse = random.choice(warehouses)
        
        o_date = start_date + timedelta(days=random.randint(0, 365))
        status = random.choice(statuses)
        
        qty_ordered = random.randint(10, 500)
        qty_delivered = qty_ordered if status == "Delivered" else (0 if status == "In Transit" else random.randint(0, qty_ordered))
        
        d_date = None
        if status == "Delivered":
            d_date = o_date + timedelta(days=int(supplier.average_delivery_time) + random.randint(-2, 5))
            if d_date > datetime.now():
                d_date = datetime.now()
        
        order = models.Order(
            product_id=product.id,
            supplier_id=supplier.id,
            warehouse_id=warehouse.id,
            order_date=o_date.date(),
            delivery_date=d_date.date() if d_date else None,
            quantity_ordered=qty_ordered,
            quantity_delivered=qty_delivered,
            order_cost=qty_ordered * product.unit_cost,
            delivery_status=status
        )
        orders.append(order)
        
        if len(orders) >= 1000:
            db.bulk_save_objects(orders)
            db.commit()
            orders = []
            
    if orders:
        db.bulk_save_objects(orders)
        db.commit()

    print("Generating forecasts...")
    forecasts = []
    base_date = datetime.now()
    types = ["Revenue", "Demand", "Capacity"]
    
    for t in types:
        base_value = random.uniform(100000, 500000) if t == "Revenue" else random.uniform(1000, 5000)
        for i in range(30): # 30 days forecast
            f_date = base_date + timedelta(days=i)
            # Add some trend and noise
            trend = base_value + (i * base_value * 0.01)
            noise = random.uniform(-0.05, 0.05) * trend
            val = trend + noise
            f = models.Forecast(
                type=t,
                date=f_date.date(),
                value=round(val, 2),
                lower_bound=round(val * 0.85, 2),
                upper_bound=round(val * 1.15, 2)
            )
            forecasts.append(f)
    db.bulk_save_objects(forecasts)
    db.commit()

    print("Generating anomalies...")
    anomalies = []
    anomaly_types = ["Order Spike", "Supplier Delay", "Inventory Drop", "Revenue Drop", "Warehouse Overload"]
    severities = ["Low", "Medium", "High", "Critical"]
    for i in range(25):
        a_date = datetime.now() - timedelta(days=random.randint(0, 30))
        t = random.choice(anomaly_types)
        exp = random.uniform(1000, 10000)
        val = exp * random.uniform(1.5, 3.0) if "Spike" in t or "Overload" in t else exp * random.uniform(0.1, 0.5)
        
        a = models.Anomaly(
            type=t,
            description=f"Detected unusual {t.lower()} on {a_date.strftime('%Y-%m-%d')}.",
            severity=random.choice(severities),
            detected_at=a_date.date(),
            value=round(val, 2),
            expected_value=round(exp, 2)
        )
        anomalies.append(a)
    db.bulk_save_objects(anomalies)
    db.commit()

    print("Data generation complete!")
    db.close()

if __name__ == "__main__":
    generate_data()
