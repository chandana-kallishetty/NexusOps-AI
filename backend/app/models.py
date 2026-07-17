from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from .database import Base

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    region = Column(String)
    average_delivery_time = Column(Float)
    rating = Column(Float)
    risk_score = Column(Float)
    risk_category = Column(String)
    carbon_footprint = Column(Float)
    sustainability_score = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)

class Warehouse(Base):
    __tablename__ = "warehouses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    capacity = Column(Integer)
    current_utilization = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    energy_usage = Column(Float)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    unit_cost = Column(Float)

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    product_name = Column(String)
    current_stock = Column(Integer)
    reorder_level = Column(Integer)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    inventory_value = Column(Float)
    risk_score = Column(Float, nullable=True)
    risk_category = Column(String, nullable=True)
    
    product = relationship("Product")
    warehouse = relationship("Warehouse")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    order_date = Column(Date)
    delivery_date = Column(Date, nullable=True)
    quantity_ordered = Column(Integer)
    quantity_delivered = Column(Integer, nullable=True)
    order_cost = Column(Float)
    delivery_status = Column(String) # e.g., "Delivered", "In Transit", "Delayed"
    
    product = relationship("Product")
    supplier = relationship("Supplier")
    warehouse = relationship("Warehouse")

class Forecast(Base):
    __tablename__ = "forecasts"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True) # Revenue, Demand, Inventory, etc.
    date = Column(Date)
    value = Column(Float)
    lower_bound = Column(Float)
    upper_bound = Column(Float)

class Anomaly(Base):
    __tablename__ = "anomalies"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True)
    description = Column(String)
    severity = Column(String) # Low, Medium, High, Critical
    detected_at = Column(Date)
    value = Column(Float, nullable=True)
    expected_value = Column(Float, nullable=True)
