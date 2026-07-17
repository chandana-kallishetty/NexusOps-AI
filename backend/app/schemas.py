from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class SupplierBase(BaseModel):
    name: str
    region: str
    average_delivery_time: float
    rating: float

class Supplier(SupplierBase):
    id: int
    class Config:
        from_attributes = True

class WarehouseBase(BaseModel):
    name: str
    capacity: int
    current_utilization: int

class Warehouse(WarehouseBase):
    id: int
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    category: str
    unit_cost: float

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class InventoryBase(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    reorder_level: int
    warehouse_id: int
    inventory_value: float

class Inventory(InventoryBase):
    id: int
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    product_id: int
    supplier_id: int
    warehouse_id: int
    order_date: date
    delivery_date: Optional[date] = None
    quantity_ordered: int
    quantity_delivered: Optional[int] = None
    order_cost: float
    delivery_status: str

class Order(OrderBase):
    id: int
    class Config:
        from_attributes = True
