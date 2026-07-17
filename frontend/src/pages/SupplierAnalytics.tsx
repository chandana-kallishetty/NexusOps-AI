import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, Clock } from "lucide-react"

export default function SupplierAnalytics() {
  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/suppliers")
      return res.data
    }
  })

  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ['supplierKpis'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/suppliers/kpis")
      return res.data
    }
  })

  if (isLoadingSuppliers || isLoadingKpis) return <div className="p-8">Loading supplier analytics...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Supplier Analytics</h2>
        <p className="text-muted-foreground mt-1">Vendor Performance & Reliability</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Supplier</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.top_supplier_name}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.average_supplier_rating} / 5.0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Supplier Delay %</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{kpis?.overall_supplier_delay_percent}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Suppliers Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3">Supplier Name</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Avg Delivery (Days)</th>
                  <th className="px-4 py-3">Total Orders</th>
                  <th className="px-4 py-3">Delay %</th>
                </tr>
              </thead>
              <tbody>
                {suppliers?.slice(0, 20).map((supplier: any) => (
                  <tr key={supplier.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{supplier.name}</td>
                    <td className="px-4 py-3">{supplier.region}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${(supplier.rating / 5) * 100}%` }}></div>
                        </div>
                        <span className="w-8 text-right">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{supplier.average_delivery_time}</td>
                    <td className="px-4 py-3">{supplier.total_orders}</td>
                    <td className={`px-4 py-3 font-medium ${supplier.delay_percent > 15 ? 'text-destructive' : ''}`}>
                      {supplier.delay_percent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
