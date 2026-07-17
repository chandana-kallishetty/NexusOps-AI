import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import DashboardLayout from "./components/layout/DashboardLayout"
import ExecutiveDashboard from "./pages/ExecutiveDashboard"
import SupplierAnalytics from "./pages/SupplierAnalytics"
import InventoryIntelligence from "./pages/InventoryIntelligence"
import LogisticsAnalytics from "./pages/LogisticsAnalytics"
import ProcessImprovement from "./pages/ProcessImprovement"
import AIBusinessInsights from "./pages/AIBusinessInsights"

import PredictiveAnalytics from "./pages/PredictiveAnalytics"
import AnomalyDetection from "./pages/AnomalyDetection"
import DigitalTwin from "./pages/DigitalTwin"
import RiskManagement from "./pages/RiskManagement"
import ExecutiveCopilot from "./pages/ExecutiveCopilot"
import ESGDashboard from "./pages/ESGDashboard"
import DataQuality from "./pages/DataQuality"
import ReportsHub from "./pages/ReportsHub"
import ScenarioSimulator from "./pages/ScenarioSimulator"
import PortfolioLanding from "./pages/PortfolioLanding"

import { AuthProvider } from "./contexts/AuthContext"
import { DrillDownProvider } from "./contexts/DrillDownContext"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DrillDownProvider>
          <Router>
            <Routes>
              <Route path="/portfolio" element={<PortfolioLanding />} />
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<ExecutiveDashboard />} />
                <Route path="suppliers" element={<SupplierAnalytics />} />
                <Route path="inventory" element={<InventoryIntelligence />} />
                <Route path="logistics" element={<LogisticsAnalytics />} />
                <Route path="process-improvement" element={<ProcessImprovement />} />
                <Route path="insights" element={<AIBusinessInsights />} />
                
                {/* New Advanced Modules */}
                <Route path="predictive" element={<PredictiveAnalytics />} />
                <Route path="anomalies" element={<AnomalyDetection />} />
                <Route path="digital-twin" element={<DigitalTwin />} />
                <Route path="risk" element={<RiskManagement />} />
                <Route path="copilot" element={<ExecutiveCopilot />} />
                <Route path="esg" element={<ESGDashboard />} />
                <Route path="data-quality" element={<DataQuality />} />
                <Route path="reports" element={<ReportsHub />} />
                <Route path="scenarios" element={<ScenarioSimulator />} />
              </Route>
            </Routes>
          </Router>
        </DrillDownProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
