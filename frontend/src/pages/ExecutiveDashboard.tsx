import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { createRoot } from "react-dom/client"
// @ts-ignore
import html2pdf from "html2pdf.js"
import ExecutivePDFTemplate from "../components/reports/ExecutivePDFTemplate"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatINR } from "@/lib/utils"
import { IndianRupee, Users, Target, Activity, Zap, TrendingUp, AlertTriangle } from "lucide-react"
import { useDrillDown } from "@/contexts/DrillDownContext"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function ExecutiveDashboard() {
  const { openDrillDown } = useDrillDown();

  const { data, isLoading } = useQuery({
    queryKey: ['executiveDashboard'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/dashboard/executive")
      return res.data
    }
  })

  const { data: feedData } = useQuery({
    queryKey: ['insightsFeed'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/insights/feed")
      return res.data
    }
  })

  const [isGenerating, setIsGenerating] = useState(false)

  if (isLoading) return <div className="p-8">Loading dashboard metrics...</div>
  
  const kpis = data?.kpis || {}
  const trends = data?.trends || []

  // Calculate an Enterprise Health Score
  const revenueScore = kpis.total_revenue > 1000000 ? 95 : 75;
  const deliveryScore = kpis.on_time_delivery_rate || 0;
  const qualityScore = 92; // Mock for now
  const healthScore = Math.round((revenueScore + deliveryScore + qualityScore) / 3);

  // AI Briefing Logic
  const getBriefing = () => {
    if (healthScore > 90) return `Enterprise health is excellent (${healthScore}/100). Revenue is growing stably. Operational risks are minimal. Inventory optimization is holding steady.`
    return `Enterprise health is currently ${healthScore}/100. There are immediate operational risks requiring attention. Supplier delays are impacting delivery rates. Recommend shifting volume to secondary suppliers.`
  }



  const generatePDF = async () => {
    setIsGenerating(true)
    
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = '-9999px'
    container.style.left = '-9999px'
    container.style.width = '1200px'
    document.body.appendChild(container)

    const queryClient = new QueryClient()
    const root = createRoot(container)
    
    root.render(
      <QueryClientProvider client={queryClient}>
        <ExecutivePDFTemplate />
      </QueryClientProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const opt: any = {
        margin:       0,
        filename:     `NexusOps_Executive_Briefing_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      await html2pdf().set(opt).from(container).save()
    } finally {
      setTimeout(() => {
        root.unmount()
        document.body.removeChild(container)
        setIsGenerating(false)
      }, 1000)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Executive Command Center</h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Global Operations & Financial Intelligence
          </p>
        </div>
        <Button 
          onClick={generatePDF} 
          disabled={isGenerating}
          className="shadow-md font-bold"
        >
          {isGenerating ? "Compiling Report..." : (
            <>
              <FileText className="w-4 h-4 mr-2" /> Generate Executive Report
            </>
          )}
        </Button>
      </div>

      {/* Top Banner Row */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Health Score Gauge */}
        <div className="md:col-span-3">
          <Card className="h-full bg-primary/5 border-primary/20 flex flex-col items-center justify-center py-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Enterprise Health Score</h3>
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/20">
              {/* Circular Progress Mock */}
              <svg className="absolute w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="56" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray="351" strokeDashoffset={351 - (351 * healthScore) / 100} className="transition-all duration-1000" />
              </svg>
              <div className="text-4xl font-extrabold">{healthScore}</div>
            </div>
            <p className="text-sm font-medium text-emerald-500 mt-4 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> +2.4% vs last month
            </p>
          </Card>
        </div>

        {/* AI Briefing */}
        <div className="md:col-span-9">
          <Card className="h-full backdrop-blur-xl bg-background/70 border-primary/20 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5 fill-current" />
                AI Executive Briefing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-medium leading-relaxed">{getBriefing()}</p>
              <div className="relative mt-6 flex gap-4">
                <div className="bg-background/80 backdrop-blur-md rounded-xl p-4 border shadow-sm flex-1 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Forecast Confidence</p>
                    <Activity className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-emerald-500">92%</p>
                  <p className="text-xs text-muted-foreground mt-1">High Accuracy Model</p>
                </div>
                <div className="bg-background/80 backdrop-blur-md rounded-xl p-4 border shadow-sm flex-1 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Cost Savings Tracker</p>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-black text-primary">₹14.2 Cr</p>
                  <p className="text-xs text-muted-foreground mt-1">Identified Opportunities</p>
                </div>
                <div className="bg-background/80 backdrop-blur-md rounded-xl p-4 border shadow-sm flex-1 hover:shadow-md transition-all cursor-pointer" onClick={() => openDrillDown('risk')}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-muted-foreground">AI Recommendation Score</p>
                    <Zap className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-black text-yellow-500">98/100</p>
                  <p className="text-xs text-muted-foreground mt-1">3 Critical Actions Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card onClick={() => openDrillDown('revenue')} className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(kpis.total_revenue || 0)}</div>
          </CardContent>
        </Card>
        
        <Card onClick={() => openDrillDown('profit')} className="cursor-pointer hover:border-emerald-500/50 transition-colors shadow-sm hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-emerald-500 transition-colors">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
          </CardContent>
        </Card>
        
        <Card onClick={() => openDrillDown('inventory')} className="cursor-pointer hover:border-amber-500/50 transition-colors shadow-sm hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-amber-500 transition-colors">Inventory Value</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(kpis.total_inventory_value || 0)}</div>
          </CardContent>
        </Card>

        <Card onClick={() => openDrillDown('delivery')} className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Delivery Perf.</CardTitle>
            <Target className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{kpis.on_time_delivery_rate}%</div>
          </CardContent>
        </Card>

        <Card onClick={() => openDrillDown('supplier')} className="cursor-pointer hover:border-blue-500/50 transition-colors shadow-sm hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-blue-500 transition-colors">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.supplier_count}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row */}
      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Charts */}
        <div className="md:col-span-8 space-y-6">
          <Card className="backdrop-blur-md bg-background/90 shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle>Enterprise Revenue Trend</CardTitle>
              <CardDescription>Monthly realized revenue across global network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatINR(value)} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: any) => formatINR(value)}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Feeds */}
        <div className="md:col-span-4 space-y-6">
          <Card className="h-[415px] flex flex-col backdrop-blur-md bg-background/90 shadow-lg border-primary/10">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center justify-between">
                Critical Alerts Feed
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="divide-y">
                {feedData?.map((item: any) => (
                  <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.type === 'Risk' ? 'bg-destructive/10 text-destructive' :
                        item.type === 'Opportunity' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.type === 'Forecast' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                  </div>
                ))}
                {(!feedData || feedData.length === 0) && (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No critical alerts detected in the network.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
