import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowDownToLine, PackageSearch } from "lucide-react"
import { useDrillDown } from "@/contexts/DrillDownContext"

export default function InventoryIntelligence() {
  const { openDrillDown } = useDrillDown();

  const { data: inventory, isLoading: isLoadingInv } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/inventory")
      return res.data
    }
  })

  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ['inventoryKpis'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/inventory/kpis")
      return res.data
    }
  })

  if (isLoadingInv || isLoadingKpis) return <div className="p-8">Loading inventory intelligence...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inventory Intelligence</h2>
        <p className="text-muted-foreground mt-1">Stock Levels & Risk Management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card onClick={() => openDrillDown('inventory')} className="cursor-pointer hover:border-destructive/50 transition-colors shadow-sm hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-destructive transition-colors">Low Stock Products</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{kpis?.low_stock_products}</div>
          </CardContent>
        </Card>
        
        <Card onClick={() => openDrillDown('inventory')} className="cursor-pointer hover:border-amber-500/50 transition-colors shadow-sm hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-amber-500 transition-colors">Overstocked Products</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{kpis?.overstock_products}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Turnover Rate</CardTitle>
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.inventory_turnover}x</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critical Inventory Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Reorder Level</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory?.filter((i: any) => i.status !== 'Healthy').slice(0, 20).map((item: any) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.product_name}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.warehouse}</td>
                    <td className={`px-4 py-3 font-bold ${item.status === 'Low Stock' ? 'text-destructive' : 'text-amber-500'}`}>
                      {item.current_stock}
                    </td>
                    <td className="px-4 py-3">{item.reorder_level}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Low Stock' 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {item.status}
                      </span>
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
