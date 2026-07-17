import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ShieldCheck, BarChart3, Globe2, Hexagon } from "lucide-react"

export default function PortfolioLanding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Hexagon className="h-5 w-5 fill-current" />
          </div>
          NexusOps AI
        </div>
        <Button onClick={() => navigate("/")} className="bg-indigo-600 hover:bg-indigo-700">
          Access Platform
        </Button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Enterprise Operations <span className="text-indigo-500">Intelligence</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A production-ready full-stack digital twin for global supply chain analytics. Built to handle millions of data points, detect anomalies, forecast demand, and drive executive decisions.
          </p>
          <div className="pt-4">
            <Button size="lg" onClick={() => navigate("/")} className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6 rounded-full shadow-lg shadow-indigo-600/20">
              Enter Command Center <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <BarChart3 className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Predictive Analytics Engine</h3>
            <p className="text-slate-400">Forecasting models powered by time-series data to predict revenue, demand, and warehouse capacity with confidence intervals.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <Globe2 className="h-10 w-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Digital Twin Command Center</h3>
            <p className="text-slate-400">Real-time geospatial visualization of the entire supply chain network, logistics routes, and regional distribution centers.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <ShieldCheck className="h-10 w-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Risk & ESG Management</h3>
            <p className="text-slate-400">Automated risk scoring matrices and environmental impact monitoring across all global suppliers and assets.</p>
          </div>
        </div>

        <div className="py-12 border-t border-slate-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Modern Tech Stack</h2>
            <p className="text-slate-400 mt-2">Built for scale, speed, and maintainability.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['React 19', 'TypeScript', 'FastAPI', 'Python', 'Tailwind CSS', 'Shadcn UI', 'Recharts', 'React-Leaflet', 'SQLite/PostgreSQL'].map(tech => (
              <span key={tech} className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-500 border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} NexusOps AI. Built for Enterprise Scale.</p>
      </footer>
    </div>
  )
}
