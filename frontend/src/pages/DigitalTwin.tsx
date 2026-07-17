import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Map as MapIcon, ShieldAlert } from "lucide-react"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts"

export default function DigitalTwin() {
  // Mock geospatial data for warehouses and suppliers mapped to an abstract 2D coordinate system
  const networkNodes = [
    { name: "Shanghai Port (Primary)", x: 80, y: 30, z: 2500, risk: 20, type: "Supplier", status: "Normal" },
    { name: "Rotterdam Dist.", x: 20, y: 70, z: 1800, risk: 85, type: "Warehouse", status: "Congested" },
    { name: "Los Angeles Hub", x: -40, y: 40, z: 3200, risk: 40, type: "Warehouse", status: "Normal" },
    { name: "Mumbai Assembly", x: 60, y: 20, z: 1200, risk: 65, type: "Assembly", status: "Warning" },
    { name: "Frankfurt Hub", x: 25, y: 65, z: 2100, risk: 15, type: "Assembly", status: "Normal" },
    { name: "Shenzhen Electronics", x: 85, y: 25, z: 1900, risk: 10, type: "Supplier", status: "Normal" },
    { name: "Mexico City Plant", x: -20, y: 20, z: 900, risk: 92, type: "Assembly", status: "Critical" },
  ];



  const getNodeColor = (status: string) => {
    switch (status) {
      case "Critical": return "hsl(var(--destructive))"
      case "Congested": return "#f97316"
      case "Warning": return "#eab308"
      default: return "hsl(var(--primary))"
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border shadow-lg p-3 rounded-lg">
          <p className="font-bold text-sm mb-1">{data.name}</p>
          <p className="text-xs text-muted-foreground">{data.type}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium">Throughput: <span className="text-foreground">{data.z.toLocaleString()} units/day</span></p>
            <p className="text-xs font-medium">Risk Score: <span className={`font-bold ${data.risk > 75 ? 'text-destructive' : 'text-emerald-500'}`}>{data.risk}</span></p>
            <p className="text-xs font-medium">Status: <span className="text-foreground">{data.status}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <MapIcon className="h-8 w-8 text-primary" />
          Digital Twin Command Center
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">Real-time geospatial network visualization, congestion tracking, and flow dynamics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-9">
          <Card className="h-full border-primary/20 shadow-lg overflow-hidden bg-gradient-to-br from-card to-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Global Network Topology</CardTitle>
                <CardDescription>Live node status and active supply routes</CardDescription>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-primary" /> Normal</span>
                <span className="flex items-center gap-1 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-orange-500" /> Congested</span>
                <span className="flex items-center gap-1 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-destructive" /> Critical</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full bg-slate-900/5 dark:bg-slate-950 rounded-xl border relative overflow-hidden">
                {/* Simulated connection lines (SVG overlay for effect) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <path d="M 100 200 Q 250 50 400 300 T 700 150" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <path d="M 300 400 Q 500 450 600 250" fill="transparent" stroke="#f97316" strokeWidth="3" />
                  <path d="M 150 100 L 300 150" fill="transparent" stroke="hsl(var(--destructive))" strokeWidth="4" />
                </svg>

                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="number" dataKey="x" name="Longitude" hide domain={[-100, 100]} />
                    <YAxis type="number" dataKey="y" name="Latitude" hide domain={[-100, 100]} />
                    <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Volume" />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Facilities" data={networkNodes}>
                      {networkNodes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getNodeColor(entry.status)} fillOpacity={0.8} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Network Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Throughput</span>
                  <span className="font-bold">12,500 / day</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Congestion Index</span>
                  <span className="font-bold text-orange-500">Moderate</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[45%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 shadow-md">
            <CardHeader className="pb-3 bg-destructive/5">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" /> Active Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {networkNodes.filter(n => n.risk > 70).map((node, i) => (
                  <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                    <p className="font-bold text-sm">{node.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">Risk Score: {node.risk}/100</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${node.status === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-orange-500/10 text-orange-500'}`}>
                      {node.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
