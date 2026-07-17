import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Map as MapIcon, ShieldAlert, Activity, GitBranch, Zap, Navigation } from "lucide-react"
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, Popup } from 'react-leaflet'

// Hub Data
const hubs = [
  { 
    id: 1, 
    name: "North America Distribution Hub", 
    coords: [39.8283, -98.5795], 
    throughput: 4200, 
    risk: 15, 
    inventory: '94%',
    status: 'Normal',
    color: '#10b981' // emerald-500
  },
  { 
    id: 2, 
    name: "Europe Fulfillment Center", 
    coords: [51.1657, 10.4515], 
    throughput: 3800, 
    risk: 65, 
    inventory: '115% (Overstock)',
    status: 'Congested',
    color: '#f97316' // orange-500
  },
  { 
    id: 3, 
    name: "Global Logistics Hub (Dubai)", 
    coords: [25.2048, 55.2708], 
    throughput: 2100, 
    risk: 42, 
    inventory: '78%',
    status: 'Normal',
    color: '#10b981'
  },
  { 
    id: 4, 
    name: "Asia Pacific Operations Center", 
    coords: [1.3521, 103.8198], 
    throughput: 2400, 
    risk: 92, 
    inventory: '12% (Stockout Warning)',
    status: 'Critical',
    color: '#ef4444' // red-500
  }
];

// Route Data
const routes = [
  {
    from: hubs[0].coords,
    to: hubs[1].coords,
    status: 'Normal',
    color: '#10b981'
  },
  {
    from: hubs[1].coords,
    to: hubs[2].coords,
    status: 'Congested',
    color: '#f97316'
  },
  {
    from: hubs[2].coords,
    to: hubs[3].coords,
    status: 'Critical',
    color: '#ef4444'
  },
  {
    from: hubs[3].coords,
    to: hubs[0].coords,
    status: 'Normal',
    color: '#10b981'
  }
];

export default function DigitalTwin() {
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
          <Card className="h-[600px] border-primary/20 shadow-xl overflow-hidden relative flex flex-col">
            <CardHeader className="absolute top-0 left-0 right-0 z-[1000] bg-background/80 backdrop-blur-md border-b pointer-events-none flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Global Network Topology</CardTitle>
                <CardDescription>Live node status and active supply routes</CardDescription>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Normal</span>
                <span className="flex items-center gap-2 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" /> Congested</span>
                <span className="flex items-center gap-2 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" /> Critical</span>
              </div>
            </CardHeader>
            
            <div className="flex-1 w-full h-full relative mt-16 z-0">
              <MapContainer 
                center={[30, 10]} 
                zoom={2.5} 
                scrollWheelZoom={true} 
                className="w-full h-full z-0"
                style={{ background: '#0f172a' }} // Deep slate background to match dark matter
              >
                {/* CartoDB Dark Matter Base Map */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Logistics Routes */}
                {routes.map((route, idx) => (
                  <Polyline 
                    key={`route-${idx}`}
                    positions={[route.from as [number, number], route.to as [number, number]]}
                    color={route.color}
                    weight={3}
                    opacity={0.6}
                    className="animate-route"
                  />
                ))}

                {/* Hub Nodes */}
                {hubs.map((hub) => (
                  <CircleMarker
                    key={hub.id}
                    center={hub.coords as [number, number]}
                    radius={10}
                    pathOptions={{ 
                      color: hub.color, 
                      fillColor: hub.color, 
                      fillOpacity: 0.8,
                      weight: 2
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} className="bg-card border-primary/20 text-foreground p-3 rounded-xl shadow-xl">
                      <div className="font-sans">
                        <p className="font-black text-sm mb-1">{hub.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">Network Node</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium flex justify-between gap-4">Throughput: <span className="font-bold">{hub.throughput.toLocaleString()} units</span></p>
                          <p className="text-xs font-medium flex justify-between gap-4">Risk Score: <span className={`font-bold ${hub.risk > 70 ? 'text-destructive' : 'text-emerald-500'}`}>{hub.risk}/100</span></p>
                        </div>
                      </div>
                    </Tooltip>
                    
                    <Popup className="font-sans">
                      <div className="p-1 min-w-[200px]">
                        <h4 className="font-black text-base mb-1 text-slate-900">{hub.name}</h4>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-4 px-2 py-1 rounded-full inline-block ${
                          hub.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                          hub.status === 'Congested' ? 'bg-orange-100 text-orange-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {hub.status}
                        </p>
                        
                        <div className="space-y-2 border-t pt-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Inventory</span>
                            <span className="font-bold text-slate-900">{hub.inventory}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Active Shipments</span>
                            <span className="font-bold text-slate-900">{Math.floor(hub.throughput * 0.15)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Capacity Util.</span>
                            <span className="font-bold text-slate-900">{hub.status === 'Congested' ? '98%' : '74%'}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>

              {/* KPI Overlay */}
              <div className="absolute bottom-6 left-6 z-[1000] flex gap-4 pointer-events-none">
                <div className="bg-background/90 backdrop-blur-md border shadow-lg rounded-xl p-4 min-w-[140px]">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Navigation className="w-3 h-3 text-primary"/> Active Routes</p>
                  <p className="text-3xl font-black mt-1">12</p>
                </div>
                <div className="bg-background/90 backdrop-blur-md border shadow-lg rounded-xl p-4 min-w-[140px]">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><GitBranch className="w-3 h-3 text-orange-500"/> Congested</p>
                  <p className="text-3xl font-black mt-1 text-orange-500">4</p>
                </div>
                <div className="bg-background/90 backdrop-blur-md border shadow-lg rounded-xl p-4 min-w-[140px]">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Zap className="w-3 h-3 text-destructive"/> Critical Nodes</p>
                  <p className="text-3xl font-black mt-1 text-destructive">1</p>
                </div>
                <div className="bg-background/90 backdrop-blur-md border shadow-lg rounded-xl p-4 min-w-[140px]">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Activity className="w-3 h-3 text-emerald-500"/> Global Vol</p>
                  <p className="text-3xl font-black mt-1">12.5k</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panels */}
        <div className="md:col-span-3 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="pb-3 bg-secondary/30">
              <CardTitle className="text-lg">Network Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Global Throughput</span>
                  <span className="font-bold text-primary">12,500 units/day</span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Congestion Index</span>
                  <span className="font-bold text-orange-500">Moderate Risk</span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[45%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
            <CardHeader className="pb-3 bg-destructive/5">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" /> Active Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {hubs.filter(h => h.risk > 60).map((node, i) => (
                  <div key={i} className="p-5 hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="font-bold text-base mb-1">{node.name}</p>
                    <p className="text-sm text-muted-foreground mb-3">Risk Exposure: <span className="font-bold text-foreground">{node.risk}/100</span></p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${node.status === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-orange-500/10 text-orange-500'}`}>
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
