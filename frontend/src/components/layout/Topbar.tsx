import { Bell, Search, Sun, Moon, Download, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useAuth, type Role } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
export default function Topbar() {
  const { role, setRole } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true)
    }
  }, [])

  const exportPDF = () => {
    navigate("/reports")
  }

  const toggleTheme = () => {
    const root = document.documentElement
    if (root.classList.contains("dark")) {
      root.classList.remove("dark")
      setIsDark(false)
    } else {
      root.classList.add("dark")
      setIsDark(true)
    }
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-card">
      <div className="flex items-center gap-4 text-muted-foreground">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search platform..."
            className="h-9 w-64 rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="sm" onClick={exportPDF} className="hidden md:flex gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
        <div className="h-6 w-px bg-border hidden md:block mx-1"></div>
        
        {/* Role Badge */}
        <div className="flex items-center bg-secondary/80 text-secondary-foreground rounded-full px-3 py-1 text-xs font-semibold tracking-wide border border-border">
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as Role)}
            className="bg-transparent border-none outline-none cursor-pointer appearance-none text-center"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Analyst">Analyst</option>
            <option value="Executive">Executive</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-background"></span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
          </Button>
        </div>
      </div>
      
    </header>
  )
}
