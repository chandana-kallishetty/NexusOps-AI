import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldAlert, ShieldCheck, Activity } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { useDrillDown } from "@/contexts/DrillDownContext"

export default function RiskManagement() {
  const { openDrillDown } = useDrillDown();

  const riskHeatmapData = [
    { subject: 'Financial', A: 120, fullMark: 150 },
    { subject: 'Operational', A: 98, fullMark: 150 },
    { subject: 'Geopolitical', A: 86, fullMark: 150 },
    { subject: 'Compliance', A: 99, fullMark: 150 },
    { subject: 'Cybersecurity', A: 85, fullMark: 150 },
    { subject: 'Reputational', A: 65, fullMark: 150 },
  ];

  const riskTrendData = [
    { month: 'Jan', index: 65 },
    { month: 'Feb', index: 59 },
    { month: 'Mar', index: 80 },
    { month: 'Apr', index: 81 },
    { month: 'May', index: 56 },
    { month: 'Jun', index: 55 },
    { month: 'Jul', index: 40 },
  ];

  const topRisks = [
    { id: 1, name: "Supplier Bankruptcy (Tier 2)", severity: 95, impact: "Critical", trend: "up" },
    { id: 2, name: "Suez Canal Congestion", severity: 88, impact: "High", trend: "up" },
    { id: 3, name: "Currency Fluctuation (EUR/INR)", severity: 75, impact: "Medium", trend: "stable" },
    { id: 4, name: "Labor Strike (EU Distribution)", severity: 60, impact: "Low", trend: "down" },
  ]

  const getSeverityColor = (sev: number) => {
    if (sev > 90) return 'text-destructive bg-destructive/10 border-destructive'
    if (sev > 75) return 'text-orange-500 bg-orange-500/10 border-orange-500'
    return 'text-yellow-500 bg-yellow-500/10 border-yellow-500'
  }



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-destructive" />
          Risk Intelligence Center
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">Real-time threat monitoring, vulnerability scoring, and AI mitigation.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Main Heatmap */}
        <div className="md:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Enterprise Risk Distribution</CardTitle>
              <CardDescription>Multi-vector vulnerability assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskHeatmapData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar name="Vulnerability" dataKey="A" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Risks */}
        <div className="md:col-span-4">
          <Card className="h-full flex flex-col cursor-pointer hover:border-destructive/50 transition-colors shadow-sm group" onClick={() => openDrillDown('risk')}>
            <CardHeader>
              <CardTitle className="group-hover:text-destructive transition-colors">Top Critical Risks</CardTitle>
              <CardDescription>Click to view risk vectors</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {topRisks.map(risk => (
                <div key={risk.id} className={`p-4 rounded-lg border ${getSeverityColor(risk.severity)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm leading-tight">{risk.name}</h4>
                    <span className="font-black text-lg ml-2">{risk.severity}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
                    <span>{risk.impact} Impact</span>
                    <span className="bg-background px-2 py-1 rounded shadow-sm opacity-80">AI Mitigation Ready</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Global Risk Trend Analysis</CardTitle>
            <CardDescription>Historical risk index across all operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="index" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--destructive))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Mitigation Recommendations</CardTitle>
            <CardDescription>Automated counter-measures for active threats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg border-l-4 border-l-primary">
              <div className="flex gap-2 items-center mb-1">
                <Activity className="h-4 w-4 text-primary" />
                <h4 className="font-bold text-sm">Hedge Currency Exposure</h4>
              </div>
              <p className="text-sm text-muted-foreground">Automatically lock in EUR/INR exchange rates for Q3 supplier contracts to mitigate volatility.</p>
            </div>
            <div className="bg-muted p-4 rounded-lg border-l-4 border-l-emerald-500">
              <div className="flex gap-2 items-center mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <h4 className="font-bold text-sm">Diversify EU Distribution</h4>
              </div>
              <p className="text-sm text-muted-foreground">Reroute 15% of European volume through port of Rotterdam to bypass potential strike action.</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
