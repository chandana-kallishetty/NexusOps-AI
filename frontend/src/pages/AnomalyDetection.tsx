import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingDown, Activity, Filter, Bell, Zap, Search } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock Realistic Anomalies
const mockAnomalies = [
  {
    id: "ANOM-001",
    category: "Revenue",
    type: "Revenue Drop",
    severity: "Critical",
    expected: "₹25,00,00,000",
    actual: "₹18,00,00,000",
    impact: "-28%",
    confidence: 95,
    rootCause: "Tier-1 Supplier disruption in Asia-Pacific region causing stockouts on high-margin SKUs.",
    recommendation: "Increase sourcing diversification and activate backup suppliers in EU.",
    timestamp: "2 hours ago"
  },
  {
    id: "ANOM-002",
    category: "Inventory",
    type: "Unusual Depletion",
    severity: "High",
    expected: "85,000 units",
    actual: "42,000 units",
    impact: "-50%",
    confidence: 88,
    rootCause: "Sudden demand spike triggered by viral marketing campaign in North America.",
    recommendation: "Expedite freight for next batch and increase production forecast by 15%.",
    timestamp: "5 hours ago"
  },
  {
    id: "ANOM-003",
    category: "Supplier Performance",
    type: "Delivery Delay Spike",
    severity: "Medium",
    expected: "95% On-Time",
    actual: "81% On-Time",
    impact: "-14%",
    confidence: 92,
    rootCause: "Port congestion at primary export hub.",
    recommendation: "Reroute upcoming shipments to secondary ports to bypass congestion.",
    timestamp: "12 hours ago"
  },
  {
    id: "ANOM-004",
    category: "Warehouse Utilization",
    type: "Capacity Overload",
    severity: "Critical",
    expected: "80% Capacity",
    actual: "98% Capacity",
    impact: "+18%",
    confidence: 99,
    rootCause: "Inbound shipments arrived early while outbound logistics faced carrier shortages.",
    recommendation: "Secure temporary 3PL storage and authorize overtime for dispatch teams.",
    timestamp: "1 day ago"
  },
  {
    id: "ANOM-005",
    category: "Logistics",
    type: "Freight Cost Spike",
    severity: "High",
    expected: "₹1,20,00,000",
    actual: "₹1,85,00,000",
    impact: "+54%",
    confidence: 91,
    rootCause: "Global fuel price surge combined with reliance on spot-market carriers.",
    recommendation: "Lock in long-term carrier contracts to stabilize rates.",
    timestamp: "1 day ago"
  },
  {
    id: "ANOM-006",
    category: "Risk",
    type: "Compliance Deviation",
    severity: "Low",
    expected: "100% Validated",
    actual: "92% Validated",
    impact: "-8%",
    confidence: 75,
    rootCause: "Missing updated ESG certifications from 3 minor suppliers.",
    recommendation: "Automate compliance follow-ups via portal.",
    timestamp: "2 days ago"
  }
]

// Mock Trend Data for the chart
const trendData = [
  { time: "00:00", anomalies: 2, severity: 10 },
  { time: "04:00", anomalies: 3, severity: 15 },
  { time: "08:00", anomalies: 1, severity: 5 },
  { time: "12:00", anomalies: 8, severity: 85 }, // Spike
  { time: "16:00", anomalies: 4, severity: 40 },
  { time: "20:00", anomalies: 2, severity: 20 },
  { time: "24:00", anomalies: 1, severity: 5 },
]

export default function AnomalyDetection() {
  const [filterSeverity, setFilterSeverity] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'bg-destructive/10 text-destructive border-destructive/50'
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/50'
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/50'
      case 'Low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getImpactColor = (impact: string) => {
    if (impact.startsWith("-")) return "text-destructive"
    if (impact.startsWith("+")) return "text-orange-500"
    return "text-primary"
  }

  const filteredAnomalies = useMemo(() => {
    return mockAnomalies.filter(a => {
      const matchesSeverity = filterSeverity === "All" || a.severity === filterSeverity
      const matchesSearch = a.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.rootCause.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSeverity && matchesSearch
    })
  }, [filterSeverity, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary" />
            Anomaly Detection Center
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">AI-powered identification of unusual business events and deviations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
            <Activity className="w-4 h-4 mr-2 inline" /> Engine Active
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm bg-destructive/10 text-destructive border-destructive/20">
            {mockAnomalies.filter(a => a.severity === 'Critical').length} Critical Alerts
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Main Content Area */}
        <div className="md:col-span-8 space-y-6">
          {/* Trend Chart */}
          <Card className="border-t-4 border-t-primary shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>System-wide Anomaly Frequency</CardTitle>
                <CardDescription>24-hour trailing detection volume and cumulative severity</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="severity" stroke="hsl(var(--destructive))" strokeWidth={2} fillOpacity={1} fill="url(#colorSeverity)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-xl border">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mr-2">Severity:</span>
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
                <Button 
                  key={sev} 
                  variant={filterSeverity === sev ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterSeverity(sev)}
                  className={`h-8 rounded-full ${filterSeverity === sev ? 'shadow-md' : ''}`}
                >
                  {sev}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search anomalies..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-background"
              />
            </div>
          </div>

          {/* Anomaly Cards List */}
          <div className="space-y-4">
            {filteredAnomalies.length === 0 ? (
              <div className="text-center p-12 border rounded-xl border-dashed">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold">No anomalies found</h3>
                <p className="text-muted-foreground">Try adjusting your severity filters or search query.</p>
              </div>
            ) : (
              filteredAnomalies.map(anomaly => (
                <Card key={anomaly.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Column: Metrics */}
                    <div className="p-6 md:w-1/3 bg-muted/10 border-r flex flex-col justify-center relative">
                      <div className={`absolute top-0 left-0 w-1 h-full ${
                        anomaly.severity === 'Critical' ? 'bg-destructive' :
                        anomaly.severity === 'High' ? 'bg-orange-500' :
                        anomaly.severity === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="uppercase tracking-widest text-[10px] font-black">
                          {anomaly.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">{anomaly.timestamp}</span>
                      </div>
                      
                      <h3 className="text-lg font-black leading-tight mb-4">{anomaly.type}</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Expected</p>
                          <p className="text-sm font-semibold">{anomaly.expected}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Actual</p>
                          <p className="text-sm font-black">{anomaly.actual}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Impact</p>
                          <p className={`text-xl font-black ${getImpactColor(anomaly.impact)}`}>{anomaly.impact}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
                          <p className="text-lg font-black text-primary">{anomaly.confidence}%</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column: AI Analysis */}
                    <div className="p-6 md:w-2/3 flex flex-col justify-center space-y-6">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getSeverityStyle(anomaly.severity)}`}>
                          {anomaly.severity} Severity
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">ID: {anomaly.id}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="w-4 h-4 text-muted-foreground" />
                          <h4 className="text-sm font-bold uppercase tracking-wider">Root Cause Analysis</h4>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                          {anomaly.rootCause}
                        </p>
                      </div>
                      
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-bold uppercase tracking-wider text-primary">AI Recommendation</h4>
                        </div>
                        <p className="text-sm font-bold leading-relaxed text-foreground">
                          {anomaly.recommendation}
                        </p>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button size="sm" variant="default" className="shadow-md">
                          Execute Recommendation
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Enterprise Alert Feed */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-t-4 border-t-amber-500 shadow-lg sticky top-6">
            <CardHeader className="bg-amber-500/5 pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-amber-500" /> Enterprise Alert Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[800px] overflow-y-auto">
                {[
                  { time: "10 min ago", msg: "CEO requested status on ANOM-001.", type: "system" },
                  { time: "45 min ago", msg: "Inventory reallocation script completed successfully.", type: "success" },
                  { time: "1 hour ago", msg: "New anomaly detected: Freight Cost Spike.", type: "alert" },
                  { time: "3 hours ago", msg: "Supplier portal sync delayed by 400ms.", type: "warning" },
                  { time: "5 hours ago", msg: "Warehouse capacity threshold exceeded 95%.", type: "alert" },
                  { time: "6 hours ago", msg: "Weekly compliance report generated.", type: "system" },
                ].map((feed, i) => (
                  <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      {feed.type === 'alert' && <div className="w-2 h-2 rounded-full bg-destructive" />}
                      {feed.type === 'warning' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                      {feed.type === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                      {feed.type === 'system' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{feed.time}</span>
                    </div>
                    <p className="text-sm font-medium">{feed.msg}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-muted/20">
                <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-wider">
                  View All Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
