import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Truck, 
  TrendingUp, 
  Lightbulb,
  Settings,
  LineChart,
  Map as MapIcon,
  ShieldAlert,
  Leaf,
  Activity,
  Hexagon,
  FileText,
  TestTubes
} from "lucide-react"

const navCategories = [
  {
    title: "Intelligence Centers",
    items: [
      { name: "Executive Command Center", href: "/", icon: LayoutDashboard },
      { name: "AI Copilot", href: "/copilot", icon: Lightbulb },
      { name: "Predictive Analytics Center", href: "/predictive", icon: LineChart },
      { name: "Financial Intelligence Dashboard", href: "/insights", icon: TrendingUp },
      { name: "Scenario Simulation Studio", href: "/scenarios", icon: TestTubes },
    ]
  },
  {
    title: "Operations & Execution",
    items: [
      { name: "Executive Decision Center", href: "/process-improvement", icon: Activity },
      { name: "Supplier Analytics", href: "/suppliers", icon: Users },
      { name: "Inventory Intelligence", href: "/inventory", icon: Package },
      { name: "Logistics Analytics", href: "/logistics", icon: Truck },
    ]
  },
  {
    title: "Enterprise Risk",
    items: [
      { name: "Risk Intelligence Center", href: "/risk", icon: ShieldAlert },
      { name: "Sustainability & ESG Dashboard", href: "/esg", icon: Leaf },
    ]
  },
  {
    title: "Data & Reporting",
    items: [
      { name: "Digital Twin Command Center", href: "/digital-twin", icon: MapIcon },
      { name: "Data Quality Monitor", href: "/data-quality", icon: Activity },
      { name: "Reports & Exports Hub", href: "/reports", icon: FileText },
    ]
  }
]

export default function Sidebar() {
  return (
    <aside className="w-64 hidden md:flex flex-col border-r bg-card h-full">
      <div className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Hexagon className="h-5 w-5 fill-current" />
          </div>
          NexusOps AI
        </div>
      </div>
      
      <div className="flex-1 py-6 space-y-6 overflow-y-auto">
        {navCategories.map((category, idx) => (
          <div key={idx} className="px-4 space-y-1">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              {category.title}
            </div>
            
            {category.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full transition-colors">
          <Settings className="h-4 w-4" />
          System Settings
        </button>
      </div>
    </aside>
  )
}
