import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import WowPanel from "./WowPanel"
import GlobalCopilot from "./GlobalCopilot"
import DrillDownSheet from "../analytics/DrillDownSheet"
import { Bot } from "lucide-react"
import { useState } from "react"

export default function DashboardLayout() {
  const [copilotOpen, setCopilotOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto p-4 md:p-6" id="dashboard-content">
            <Outlet />
          </div>
        </main>
      </div>
      <WowPanel />
      
      {/* Global AI Copilot FAB */}
      {!copilotOpen && (
        <button 
          onClick={() => setCopilotOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 border-4 border-background"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* Global Copilot Side Panel */}
      <GlobalCopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />

      {/* Global Drill-Down Sheet */}
      <DrillDownSheet />
    </div>
  )
}
