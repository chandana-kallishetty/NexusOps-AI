import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatINR } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { BrainCircuit, AlertTriangle, Zap, CheckCircle2 } from "lucide-react"

export default function ScenarioSimulator() {
  const [params, setParams] = useState({
    demandGrowth: 15,
    revenueGrowth: 10,
    supplierDelay: 10,
    fuelCost: 5,
    warehouseCapacity: 85,
    inventoryLevel: 90
  })

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParams(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }))
  }

  // Live Calculations
  const baseRevenue = 150000000;
  const baseCost = 110000000;
  
  // Calculate impacts
  const revImpact = 1 + (params.revenueGrowth / 100) + (params.demandGrowth / 200) - (params.supplierDelay / 150);
  const costImpact = 1 + (params.fuelCost / 100) + (params.warehouseCapacity > 95 ? 0.08 : 0) + (params.supplierDelay / 200);
  
  const expectedRevenue = baseRevenue * revImpact;
  const expectedCost = baseCost * costImpact;
  const expectedProfit = expectedRevenue - expectedCost;
  const costIncrease = expectedCost - baseCost;
  
  const riskScore = Math.min(100, Math.max(0, 20 + params.supplierDelay + (params.warehouseCapacity - 80) + (100 - params.inventoryLevel) / 2));
  const deliveryPerf = Math.max(0, 100 - (params.supplierDelay * 0.5) - (params.demandGrowth * 0.1));

  // Dynamic AI Insights
  const generateInsights = () => {
    const insights = []
    if (params.supplierDelay > 15) {
      insights.push({ type: "risk", text: `Supplier delays above 15% may reduce quarterly profit by ${formatINR(expectedProfit * 0.15)}.` })
    }
    if (params.demandGrowth >= 20 && params.warehouseCapacity > 90) {
      insights.push({ type: "critical", text: "Demand growth of 20% combined with high utilization requires immediate warehouse expansion." })
    }
    if (params.fuelCost > 15) {
      insights.push({ type: "warning", text: `Fuel cost increase of ${params.fuelCost}% will drive up operational costs by ${formatINR(baseCost * (params.fuelCost/100))}.` })
    }
    if (params.inventoryLevel < 50) {
      insights.push({ type: "risk", text: "Inventory levels below 50% severely restrict demand capture potential." })
    }
    if (insights.length === 0) {
      insights.push({ type: "optimal", text: "Current variable configuration represents a balanced, highly-optimal operating state." })
    }
    return insights
  }

  const insights = generateInsights()

  // Generate chart data projecting 6 months
  const chartData = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const monthOffset = i + 1;
      // Best case: slightly higher rev, lower cost
      const bestRev = expectedRevenue * (1 + (monthOffset * 0.02));
      const bestCost = expectedCost * (1 + (monthOffset * 0.01));
      
      // Expected case
      const expRev = expectedRevenue * (1 + (monthOffset * 0.01));
      const expCost = expectedCost * (1 + (monthOffset * 0.015));
      
      // Worst case: lower rev, higher cost
      const worstRev = expectedRevenue * (1 - (monthOffset * 0.01));
      const worstCost = expectedCost * (1 + (monthOffset * 0.03));
      
      return {
        month: `M+${monthOffset}`,
        bestProfit: bestRev - bestCost,
        expectedProfit: expRev - expCost,
        worstProfit: worstRev - worstCost,
      }
    })
  }, [expectedRevenue, expectedCost])

  const renderCaseCard = (title: string, revMultiplier: number, costMultiplier: number, color: string) => {
    const r = expectedRevenue * revMultiplier;
    const c = expectedCost * costMultiplier;
    const p = r - c;
    
    return (
      <Card className={`border-t-4 ${color}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Revenue Impact</p>
            <p className="text-xl font-black">{formatINR(r)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profit Impact</p>
            <p className="text-xl font-black">{formatINR(p)}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Enterprise Simulation Engine
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">Inject macro-economic and operational shocks to visualize real-time business outcomes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Controls */}
        <div className="md:col-span-4 space-y-6">
          <Card className="h-full border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 pb-4 border-b">
              <CardTitle>Variable Injection</CardTitle>
              <CardDescription>Drag sliders to update models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {[
                { name: "demandGrowth", label: "Demand Growth (%)", min: -50, max: 100 },
                { name: "revenueGrowth", label: "Revenue Growth (%)", min: -50, max: 100 },
                { name: "supplierDelay", label: "Supplier Delays (%)", min: 0, max: 100 },
                { name: "fuelCost", label: "Fuel Cost Increase (%)", min: -20, max: 100 },
                { name: "warehouseCapacity", label: "Warehouse Capacity (%)", min: 30, max: 100 },
                { name: "inventoryLevel", label: "Inventory Levels (%)", min: 10, max: 200 },
              ].map((slider) => (
                <div key={slider.name} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{slider.label}</label>
                    <span className="text-sm font-black text-primary">{params[slider.name as keyof typeof params]}%</span>
                  </div>
                  <input 
                    type="range" 
                    name={slider.name} 
                    min={slider.min} max={slider.max} 
                    value={params[slider.name as keyof typeof params]} 
                    onChange={handleSliderChange}
                    className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Outputs */}
        <div className="md:col-span-8 space-y-6">
          {/* Main KPI Bar */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="bg-primary/5 border border-primary/10">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Rev Impact</p>
                <div className="text-lg font-black text-primary">{formatINR(expectedRevenue)}</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border border-primary/10">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Profit Impact</p>
                <div className="text-lg font-black text-primary">{formatINR(expectedProfit)}</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border border-primary/10">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Cost Increase</p>
                <div className="text-lg font-black text-destructive">+{formatINR(costIncrease)}</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border border-primary/10">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Risk Score</p>
                <div className={`text-xl font-black ${riskScore > 70 ? 'text-destructive' : 'text-emerald-500'}`}>
                  {riskScore.toFixed(1)}/100
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border border-primary/10">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Delivery Perf</p>
                <div className="text-xl font-black text-primary">{deliveryPerf.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* AI Insights Summary */}
            <Card className="flex flex-col h-full border-t-4 border-t-blue-500 shadow-md">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" /> Business Outcome Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex-1 space-y-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 bg-muted/40 rounded-lg border">
                    {insight.type === 'critical' && <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />}
                    {insight.type === 'risk' && <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />}
                    {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />}
                    {insight.type === 'optimal' && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                    <p className="text-sm font-medium leading-relaxed">{insight.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cases Comparison */}
            <div className="space-y-4">
              {renderCaseCard("Best Case Model", 1.05, 0.95, "border-t-emerald-500")}
              {renderCaseCard("Expected Case Model", 1.0, 1.0, "border-t-primary")}
              {renderCaseCard("Worst Case Model", 0.85, 1.15, "border-t-destructive")}
            </div>
          </div>

          {/* Interactive Chart */}
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Profitability Projection Analysis</CardTitle>
              <CardDescription>Comparing simulated trajectory variants over 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatINR(val)} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: any) => formatINR(value)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" name="Best Case Profit" dataKey="bestProfit" stroke="hsl(var(--emerald-500))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Expected Profit" dataKey="expectedProfit" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" name="Worst Case Profit" dataKey="worstProfit" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
