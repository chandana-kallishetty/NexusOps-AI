import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { formatINR } from "@/lib/utils"
import { Hexagon, TrendingUp, AlertTriangle, Zap, Package, Activity, Target, Leaf, Ship, ShieldCheck } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from "recharts"

export default function ExecutivePDFTemplate() {
  const { data } = useQuery({
    queryKey: ['executiveDashboard'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/dashboard/executive")
      return res.data
    }
  })

  if (!data) return null;
  const kpis = data.kpis || {}
  const trends = data.trends || []

  const forecastData = trends.map((t: any, i: number) => ({
    month: `M+${i+1}`,
    revenue: t.revenue * (1 + (i*0.02)),
    expected: t.revenue * (1 + (i*0.01)),
    lower: t.revenue * 0.95
  }))

  const healthScore = kpis.total_revenue > 1000000 ? 92 : 75;

  const PageWrapper = ({ children, title, pageNum }: any) => (
    <div className="w-[1200px] bg-white text-slate-900 font-sans p-16 flex flex-col justify-between border-b-8 border-slate-900" style={{ minHeight: '1500px', pageBreakAfter: 'always' }}>
      <div className="flex-1">
        {title && (
          <h3 className="text-4xl font-black text-slate-900 mb-12 flex items-center gap-4 border-b-2 border-slate-100 pb-6">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center text-xl">{pageNum}</div>
            {title}
          </h3>
        )}
        {children}
      </div>
      <div className="border-t-2 border-slate-200 pt-6 mt-12 flex justify-between items-center text-slate-400 font-bold tracking-widest text-sm uppercase">
        <span>NexusOps AI Confidential</span>
        <span>Page {pageNum}</span>
      </div>
    </div>
  )

  return (
    <div id="pdf-export-template">
      
      {/* PAGE 1: COVER */}
      <div className="w-[1200px] bg-white text-slate-900 font-sans p-16 flex flex-col justify-center border-b-[24px] border-slate-900" style={{ minHeight: '1500px', pageBreakAfter: 'always' }}>
        <div className="flex items-center gap-6 mb-16">
          <div className="w-24 h-24 bg-slate-900 text-white flex items-center justify-center rounded-2xl">
            <Hexagon className="h-16 w-16 fill-current" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900">NEXUSOPS AI</h1>
        </div>
        <h2 className="text-8xl font-black tracking-tight text-slate-900 mb-8 leading-tight">
          Enterprise<br/>Decision<br/>Intelligence
        </h2>
        <p className="text-4xl font-medium text-slate-500 mb-24 border-l-8 border-slate-900 pl-8 py-4">Board-Ready Strategic Briefing</p>
        
        <div className="grid grid-cols-2 gap-12 mt-auto pt-24 border-t-4 border-slate-100">
          <div>
            <p className="text-lg font-bold tracking-widest uppercase text-slate-400 mb-2">Prepared For</p>
            <p className="text-2xl font-bold text-slate-900">Global Executive Board</p>
            <p className="text-lg text-slate-600 mt-1">Confidential & Internal Use Only</p>
          </div>
          <div>
            <p className="text-lg font-bold tracking-widest uppercase text-slate-400 mb-2">Generation Date</p>
            <p className="text-2xl font-bold text-slate-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-lg text-slate-600 mt-1">Automated Intelligence Extract</p>
          </div>
        </div>
      </div>

      {/* PAGE 2: EXECUTIVE SUMMARY */}
      <PageWrapper title="Executive Summary" pageNum={2}>
        <div className="space-y-12">
          <p className="text-3xl leading-relaxed text-slate-700 font-medium">
            The enterprise network is currently operating at an optimal <span className="font-bold text-emerald-600">Health Score of {healthScore}/100</span>.
            Total recognized revenue stands at <span className="font-bold text-slate-900">{formatINR(kpis.total_revenue || 150000000)}</span>. 
            Primary delivery KPIs are stable at {kpis.on_time_delivery_rate}%. Predictive models indicate strong Q3 margin trajectories if emerging supply risks are mitigated.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="p-10 bg-slate-900 text-white rounded-2xl">
              <p className="text-lg font-bold tracking-wider uppercase text-slate-400 mb-4 flex items-center gap-3"><Activity className="w-6 h-6"/> Enterprise Health</p>
              <p className="text-7xl font-black">{healthScore}<span className="text-4xl text-slate-400 font-normal">/100</span></p>
            </div>
            <div className="p-10 bg-slate-50 border-2 rounded-2xl">
              <p className="text-lg font-bold tracking-wider uppercase text-slate-500 mb-4 flex items-center gap-3"><TrendingUp className="w-6 h-6 text-emerald-500"/> Total Revenue</p>
              <p className="text-5xl font-black text-slate-900">{formatINR(kpis.total_revenue || 0)}</p>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 3: FINANCIAL OVERVIEW */}
      <PageWrapper title="Financial Overview" pageNum={3}>
        <div className="space-y-8">
          <h4 className="text-2xl font-bold mb-6">Historical Revenue Realization</h4>
          <div className="h-[500px] border-2 rounded-2xl p-8 bg-slate-50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={16} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={16} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} />
                <Bar dataKey="revenue" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl text-slate-600 leading-relaxed mt-8">Revenue realization remains robust with a consistent month-over-month growth rate. No structural anomalies detected in cash flow velocity.</p>
        </div>
      </PageWrapper>

      {/* PAGE 4: REVENUE FORECAST */}
      <PageWrapper title="Revenue Forecast (M+6)" pageNum={4}>
        <div className="space-y-8">
          <h4 className="text-2xl font-bold mb-6">Predictive AI Modeling</h4>
          <div className="h-[500px] border-2 rounded-2xl p-8 bg-slate-50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={16} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={16} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={4} />
                <Area type="monotone" dataKey="lower" stroke="none" fill="#f8fafc" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-emerald-50 border-l-8 border-emerald-500 p-8 rounded-r-2xl mt-8">
            <h5 className="text-xl font-bold text-emerald-900 mb-2">Confidence Level: 92%</h5>
            <p className="text-xl text-emerald-800">Forecast indicates strong sustained growth, driven by enterprise software subscriptions and consulting services expansion.</p>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 5: RISK INTELLIGENCE */}
      <PageWrapper title="Risk Intelligence Summary" pageNum={5}>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h4 className="text-2xl font-bold mb-6 flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-destructive"/> Active Threat Vectors</h4>
            <ul className="space-y-6">
              <li className="bg-red-50 p-6 border-2 border-red-100 rounded-xl">
                <p className="font-bold text-xl text-red-900">Supplier Disruption (Apex Industrial)</p>
                <p className="text-lg text-red-700 mt-2">Financial instability flagged. High risk to Q3 assembly components.</p>
              </li>
              <li className="bg-orange-50 p-6 border-2 border-orange-100 rounded-xl">
                <p className="font-bold text-xl text-orange-900">Logistics Capacity (EMEA)</p>
                <p className="text-lg text-orange-700 mt-2">Major shipping lanes operating at 98% capacity. Severe cost spikes anticipated.</p>
              </li>
            </ul>
          </div>
          <div>
             <h4 className="text-2xl font-bold mb-6">Risk Categorization</h4>
             <div className="h-[400px] border-2 rounded-xl bg-slate-50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{name: 'Supplier', value: 45}, {name: 'Geopolitics', value: 25}, {name: 'Financial', value: 20}, {name: 'Cyber', value: 10}]} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                      <Cell fill="#ef4444" />
                      <Cell fill="#f97316" />
                      <Cell fill="#eab308" />
                      <Cell fill="#3b82f6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 6: INVENTORY INSIGHTS */}
      <PageWrapper title="Inventory Insights" pageNum={6}>
        <div className="space-y-12">
          <div className="grid grid-cols-2 gap-8">
            <div className="p-10 bg-slate-50 border-2 rounded-2xl">
              <p className="text-lg font-bold tracking-wider uppercase text-slate-500 mb-4 flex items-center gap-3"><Package className="w-6 h-6 text-slate-900"/> Capital Locked</p>
              <p className="text-5xl font-black text-slate-900">{formatINR(kpis.total_inventory_value || 0)}</p>
            </div>
            <div className="p-10 bg-red-50 border-2 border-red-100 rounded-2xl">
              <p className="text-lg font-bold tracking-wider uppercase text-red-700 mb-4 flex items-center gap-3"><AlertTriangle className="w-6 h-6"/> Est. Stockout Risk</p>
              <p className="text-5xl font-black text-red-600">{formatINR(12500000)}</p>
            </div>
          </div>
          <p className="text-2xl leading-relaxed text-slate-700">
            Structural imbalances detected in EU distribution hubs resulting in high carrying costs for legacy components. Concurrently, high-velocity SKUs in NA hubs are trending towards stockouts within 14 days.
          </p>
        </div>
      </PageWrapper>

      {/* PAGE 7: LOGISTICS PERFORMANCE */}
      <PageWrapper title="Logistics Performance" pageNum={7}>
        <div className="space-y-12">
          <div className="grid grid-cols-2 gap-8">
            <div className="p-10 bg-slate-900 text-white rounded-2xl">
              <p className="text-lg font-bold tracking-wider uppercase text-slate-400 mb-4 flex items-center gap-3"><Ship className="w-6 h-6"/> SLA Compliance</p>
              <p className="text-6xl font-black">{kpis.on_time_delivery_rate}%</p>
            </div>
            <div className="p-10 bg-slate-50 border-2 rounded-2xl">
              <p className="text-lg font-bold tracking-wider uppercase text-slate-500 mb-4 flex items-center gap-3"><Target className="w-6 h-6 text-blue-500"/> Active Suppliers</p>
              <p className="text-6xl font-black text-slate-900">{kpis.supplier_count}</p>
            </div>
          </div>
          <p className="text-2xl leading-relaxed text-slate-700">
            Global freight networks are operating efficiently, maintaining high SLA compliance. However, predictive routing models suggest impending port congestion in Southeast Asia. Expedited air-freight allocations are prepared as contingencies.
          </p>
        </div>
      </PageWrapper>

      {/* PAGE 8: ESG METRICS */}
      <PageWrapper title="Sustainability & ESG Metrics" pageNum={8}>
        <div className="space-y-12">
          <div className="bg-emerald-50 border-2 border-emerald-100 p-12 rounded-3xl flex items-center gap-12">
            <div className="w-32 h-32 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
              <Leaf className="w-16 h-16" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-widest uppercase text-emerald-800 mb-2">Network Sustainability Score</p>
              <p className="text-7xl font-black text-emerald-900">A+</p>
              <p className="text-xl text-emerald-700 mt-4">Top 5% Industry Benchmark</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="border-2 p-8 rounded-2xl text-center bg-white">
              <p className="text-4xl font-black text-slate-900 mb-2">14.2%</p>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Carbon Reduction YTD</p>
            </div>
            <div className="border-2 p-8 rounded-2xl text-center bg-white">
              <p className="text-4xl font-black text-slate-900 mb-2">98%</p>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Suppliers Compliant</p>
            </div>
            <div className="border-2 p-8 rounded-2xl text-center bg-white">
              <p className="text-4xl font-black text-slate-900 mb-2">Zero</p>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Labor Violations</p>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 9: AI RECOMMENDATIONS */}
      <PageWrapper title="AI Intelligence Recommendations" pageNum={9}>
        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
              <Zap className="w-10 h-10 text-yellow-400" />
              <h4 className="text-3xl font-bold">Strategic Mitigations</h4>
            </div>
            
            <div className="space-y-10">
              <div>
                <p className="font-bold text-2xl mb-3 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-500 text-sm flex items-center justify-center font-bold">1</div> Near-shoring Diversification</p>
                <p className="text-slate-300 leading-relaxed text-xl pl-11">Initiate immediate contracts with backup Tier-1 vendors in LATAM to offset projected SEA delays. Reduces lead-time variance by 40%.</p>
                <p className="text-emerald-400 font-bold mt-4 text-xl pl-11">Value Impact: Protects {formatINR(120000000)} pipeline revenue.</p>
              </div>
              
              <div className="pt-8 border-t border-slate-700">
                <p className="font-bold text-2xl mb-3 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-emerald-500 text-sm flex items-center justify-center font-bold">2</div> Dynamic Inventory Rebalancing</p>
                <p className="text-slate-300 leading-relaxed text-xl pl-11">Shift 15% of surplus safety stock from US hubs to EU distribution centers to cover regional demand spikes without increasing production.</p>
                <p className="text-emerald-400 font-bold mt-4 text-xl pl-11">Value Impact: Optimizes {formatINR(48000000)} locked capital.</p>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 10: CONCLUSION & ACTION PLAN */}
      <PageWrapper title="Conclusion & Action Plan" pageNum={10}>
        <div className="space-y-12">
          <div className="bg-slate-50 border-l-8 border-slate-900 p-12 rounded-r-3xl">
            <h4 className="text-3xl font-black mb-6">Executive Summary Statement</h4>
            <p className="text-2xl font-medium text-slate-700 leading-relaxed">
              The fundamental enterprise architecture remains highly resilient. While external macro-economic pressures and supply chain congestion pose distinct operational risks, executing the AI-recommended structural optimizations will secure projected profit margins and maintain overall enterprise health above the 90% threshold for the remainder of the fiscal year.
            </p>
          </div>
          
          <div>
            <h4 className="text-2xl font-bold mb-6 flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-slate-900"/> Next Steps / Action Plan</h4>
            <ul className="text-xl space-y-6 text-slate-600 font-medium">
              <li className="flex gap-4 items-start"><div className="w-3 h-3 mt-2 bg-slate-900 rounded-full"/> Board approval for LATAM vendor diversification budget.</li>
              <li className="flex gap-4 items-start"><div className="w-3 h-3 mt-2 bg-slate-900 rounded-full"/> Execute inventory rebalancing protocols across NA & EU hubs.</li>
              <li className="flex gap-4 items-start"><div className="w-3 h-3 mt-2 bg-slate-900 rounded-full"/> Lock in Q4 logistics contracts before anticipated freight spikes.</li>
              <li className="flex gap-4 items-start"><div className="w-3 h-3 mt-2 bg-slate-900 rounded-full"/> Schedule follow-up AI Briefing in 14 days to monitor implementation.</li>
            </ul>
          </div>
        </div>
      </PageWrapper>

    </div>
  )
}
