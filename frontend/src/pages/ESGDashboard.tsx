import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Leaf, Zap, Cloud } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ESGDashboard() {
  const { data: esg, isLoading } = useQuery({
    queryKey: ['esg'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/esg")
      return res.data
    }
  })

  if (isLoading) return <div className="p-8">Loading ESG & Sustainability metrics...</div>

  // Prepare top 10 suppliers by carbon footprint
  const topEmitters = [...(esg?.suppliers || [])]
    .sort((a, b) => b.carbon_footprint - a.carbon_footprint)
    .slice(0, 10)
    .map(s => ({
      name: s.name.substring(0, 15) + "...",
      carbon: Math.round(s.carbon_footprint)
    }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ESG & Sustainability Dashboard</h2>
        <p className="text-muted-foreground mt-1">Monitor environmental impact across the entire supply chain</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Carbon Footprint</CardTitle>
            <Cloud className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(esg?.kpis?.total_carbon || 0).toLocaleString()} <span className="text-sm text-muted-foreground font-normal">tCO2e</span></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Energy Usage (Warehouses)</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(esg?.kpis?.total_energy || 0).toLocaleString()} <span className="text-sm text-muted-foreground font-normal">kWh</span></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Supplier Sustainability Score</CardTitle>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {Math.round(esg?.kpis?.avg_sustainability || 0)} / 100
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top 10 Carbon Emitters (Suppliers)</CardTitle>
            <CardDescription>Suppliers with the highest carbon footprint across the network</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEmitters} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="carbon" fill="#64748b" radius={[0, 4, 4, 0]} name="Carbon Footprint (tCO2e)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
