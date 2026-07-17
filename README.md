# NexusOps AI - Enterprise Operations Intelligence Platform

A modern, production-quality enterprise operations intelligence and supply chain analytics platform built for global manufacturing companies. This system acts as a digital twin, predictive engine, and AI copilot to manage, monitor, and optimize massive supply chain networks.

## 🌟 Key Modules & Features

1. **Executive Dashboard**: High-level KPI monitoring (Revenue, Costs, Margins, Orders).
2. **Supplier Analytics**: Performance tracking, delivery times, and quality ratings.
3. **Inventory Intelligence**: Global stock levels, valuation, and stockout alerts.
4. **Logistics Analytics**: Transit times, shipment costs, and route efficiency.
5. **Predictive Analytics Engine**: AI-powered models forecasting revenue, demand, and warehouse capacity with confidence intervals.
6. **Digital Twin Command Center**: Interactive geographical visualization of warehouses, suppliers, and shipping routes worldwide.
7. **Anomaly Detection**: Automated system to catch unusual spikes, drops, or operational bottlenecks in real-time.
8. **Risk Intelligence Center**: Enterprise vulnerability matrix analyzing critical suppliers and regional dependencies.
9. **AI Copilot**: Strategic AI assistant providing actionable insights and highlighting cost reduction opportunities.
10. **ESG & Sustainability Dashboard**: Real-time carbon footprint tracking (tCO2e) and energy usage visualization.
11. **Data Quality Monitor**: Integrity checks, freshness, and completeness tracking for enterprise data pipelines.
12. **Role-Based Access**: Specialized views for Admin, Manager, Analyst, and Executive users.
13. **Reports & Exports Hub**: Centralized data export and one-click PDF report generation.

## 🛠️ Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- Recharts (Analytics & Data Visualization)
- React Leaflet (Digital Twin Mapping)
- html2canvas & jsPDF (Export Engine)
- TanStack Query (Data Fetching)

**Backend:**
- Python 3.10+
- FastAPI
- SQLAlchemy
- SQLite (Configured to scale to PostgreSQL)
- Faker & Pandas (Data Engine)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Generate the massive synthetic database (Takes ~1 minute)
python -m app.data_generator

# Start the API server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

You can navigate to `http://localhost:5173` to view the platform.

## 🌍 Localization

The entire platform is localized for the Indian market, utilizing Indian Rupees (INR) and the Indian numbering format (e.g., ₹1,25,00,000) for all financial metrics.

## 📄 License

This project is licensed under the MIT License.
