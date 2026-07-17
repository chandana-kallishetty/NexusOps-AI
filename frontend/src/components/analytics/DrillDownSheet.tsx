import { useDrillDown } from "@/contexts/DrillDownContext"
import { X, Activity, Filter, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatINR } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts"

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', '#f59e0b', '#10b981', '#3b82f6'];

// MOCK DATA GENERATORS
const mockRevenueRegion = [
  { name: 'North America', value: 45000000 },
  { name: 'EMEA', value: 38000000 },
  { name: 'APAC', value: 67000000 },
];

const mockRevenueTrend = [
  { month: 'Jan', revenue: 12000000, target: 11000000 },
  { month: 'Feb', revenue: 13500000, target: 12000000 },
  { month: 'Mar', revenue: 14200000, target: 13000000 },
  { month: 'Apr', revenue: 13800000, target: 14000000 },
  { month: 'May', revenue: 15100000, target: 14500000 },
  { month: 'Jun', revenue: 16800000, target: 15000000 },
];

const mockRiskCategories = [
  { name: 'Supplier', value: 40 },
  { name: 'Geopolitical', value: 25 },
  { name: 'Financial', value: 20 },
  { name: 'Cyber', value: 15 },
];

export default function DrillDownSheet() {
  const { isOpen, type, closeDrillDown } = useDrillDown();

  if (!isOpen && !type) return null;

  const renderContent = () => {
    switch(type) {
      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Global Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={mockRevenueRegion} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {mockRevenueRegion.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(val: any) => formatINR(val)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-2 text-xs font-medium">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> NA</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive" /> EMEA</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> APAC</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Key Drivers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-sm">Enterprise Software</span>
                    <span className="text-emerald-500 font-bold text-sm">+24%</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-sm">Consulting Services</span>
                    <span className="text-emerald-500 font-bold text-sm">+18%</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-sm">Hardware Sales</span>
                    <span className="text-destructive font-bold text-sm">-5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Realization vs Target</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockRevenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} />
                      <Tooltip formatter={(val: any) => formatINR(val)} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'risk':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Categorization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockRiskCategories} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                  Active Supplier Risks
                  <div className="flex gap-2">
                    <Input placeholder="Search suppliers..." className="w-48 h-8 text-xs" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['TechCorp Global', 'Apex Systems', 'Nexa Logistics'].map((sup, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50">
                      <div>
                        <p className="font-bold text-sm">{sup}</p>
                        <p className="text-xs text-destructive">Financial Instability Flagged</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Review</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Total Overstock Value</p>
                <p className="text-3xl font-black text-amber-700">{formatINR(48000000)}</p>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
                <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-2">Est. Stockout Loss</p>
                <p className="text-3xl font-black text-destructive">{formatINR(12500000)}</p>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Frankfurt Hub', value: 85 },
                      { name: 'Singapore DC', value: 65 },
                      { name: 'Texas Central', value: 92 },
                      { name: 'Mumbai Local', value: 45 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'supplier':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Total Active Partners</p>
                <p className="text-3xl font-black text-blue-700">124</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">SLA Compliance Rate</p>
                <p className="text-3xl font-black text-emerald-700">94.2%</p>
              </div>
            </div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                  Top Performing Suppliers
                  <div className="flex gap-2">
                    <Input placeholder="Search network..." className="w-48 h-8 text-xs" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Global Manufacturing Partner', delay: '2.1 Days', score: 98 },
                    { name: 'Vertex Electronics', delay: '2.8 Days', score: 95 },
                    { name: 'OmniTech Components', delay: '3.4 Days', score: 92 }
                  ].map((sup, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50">
                      <div>
                        <p className="font-bold text-sm">{sup.name}</p>
                        <p className="text-xs text-muted-foreground">Avg Delay: {sup.delay}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">{sup.score}/100</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return <div className="p-8 text-center text-muted-foreground">Deep dive analytics currently compiling...</div>
    }
  }

  const getTitle = () => {
    switch(type) {
      case 'revenue': return "Revenue Analytics Drill-Down";
      case 'inventory': return "Inventory Diagnostics";
      case 'risk': return "Risk Vector Assessment";
      case 'supplier': return "Supplier Intelligence";
      case 'profit': return "Margin Optimization Analysis";
      default: return "Analytics Drill-Down";
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrillDown}
      />
      
      {/* Slide-out Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[600px] bg-background border-l shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg tracking-tight">{getTitle()}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 shadow-sm">
              <Calendar className="h-4 w-4 mr-2" /> Q3 2026
            </Button>
            <Button variant="outline" size="sm" className="h-8 shadow-sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="ghost" size="icon" onClick={closeDrillDown} className="rounded-full ml-2">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {renderContent()}
        </div>
      </div>
    </>
  )
}
