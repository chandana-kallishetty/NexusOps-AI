import { useState } from "react"
import { Sparkles, Check, ChevronRight, X } from "lucide-react"

export default function WowPanel() {
  const [isOpen, setIsOpen] = useState(true)

  const capabilities = [
    "AI Copilot",
    "Forecasting Engine",
    "Risk Intelligence",
    "Scenario Simulation",
    "Anomaly Detection",
    "Recommendation Engine",
    "Digital Twin",
    "Executive Reporting"
  ]

  if (!isOpen) {
    return (
      <div 
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-2xl cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="h-6 w-6" />
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 bg-card border border-primary/20 shadow-2xl rounded-xl overflow-hidden backdrop-blur-md bg-card/95 supports-[backdrop-filter]:bg-card/80">
      <div className="bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-sm tracking-tight text-foreground">Platform Capabilities</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 space-y-2.5">
        {capabilities.map((cap, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div className="bg-emerald-500/20 text-emerald-500 rounded-full p-0.5">
              <Check className="h-3 w-3" />
            </div>
            <span className="font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default">{cap}</span>
          </div>
        ))}
      </div>
      <div className="p-3 bg-muted/50 border-t flex justify-between items-center text-xs text-muted-foreground">
        <span>NexusOps AI Engine v2.0</span>
        <ChevronRight className="h-3 w-3" />
      </div>
    </div>
  )
}
