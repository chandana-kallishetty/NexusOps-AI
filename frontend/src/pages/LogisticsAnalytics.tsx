import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, CheckCircle2, Map } from "lucide-react"

export default function LogisticsAnalytics() {
  const { data: logistics, isLoading: isLoadingLog } = useQuery({
    queryKey: ['logistics'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/logistics")
      return res.data
    }
  })

  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ['logisticsKpis'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/logistics/kpis")
      return res.data
    }
  })

  if (isLoadingLog || isLoadingKpis) return <div className="p-8">Loading logistics data...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Logistics Analytics</h2>
        <p className="text-muted-foreground mt-1">Warehouse & Delivery Performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.average_delivery_time} Days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Shipments</CardTitle>
            <Map className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{kpis?.delayed_shipments?.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{kpis?.delivery_success_rate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Performance Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mt-4">
            {logistics?.map((wh: any) => (
              <div key={wh.id} className="flex items-center justify-between">
                <div className="space-y-1 w-1/3">
                  <p className="text-sm font-medium leading-none">{wh.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Capacity: {wh.capacity.toLocaleString()} units
                  </p>
                </div>
                
                <div className="w-1/3 px-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Utilization</span>
                    <span className="font-medium">{wh.utilization_percent}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${wh.utilization_percent > 85 ? 'bg-destructive' : 'bg-primary'}`} 
                      style={{ width: `${wh.utilization_percent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="w-1/4 text-right">
                  <div className="text-sm font-medium">Delay Rate: {wh.delay_rate}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
