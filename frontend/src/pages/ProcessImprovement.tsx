import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react"
import { formatINR } from "@/lib/utils"

export default function ProcessImprovement() {
  const recommendations = [
    {
      id: 1,
      title: "Reduce Inventory Overstock",
      type: "Optimize Costs",
      impact: "Reallocate 15% of Warehouse C inventory to regional distribution centers.",
      savings: 48000000,
      priority: "High",
      confidence: 94,
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />
    },
    {
      id: 2,
      title: "Mitigate Supplier Risk",
      type: "Reduce Risk",
      impact: "Shift 20% of active volume from Tier 2 suppliers to Tier 1 backup vendors due to emerging delays.",
      savings: 12000000,
      priority: "Critical",
      confidence: 88,
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />
    },
    {
      id: 3,
      title: "Improve Capacity Utilization",
      type: "Improve Utilization",
      impact: "Consolidate Q3 freight shipments on the Asia-Pacific corridor to increase container utilization by 12%.",
      savings: 22000000,
      priority: "Medium",
      confidence: 91,
      icon: <CheckCircle2 className="h-5 w-5 text-primary" />
    },
    {
      id: 4,
      title: "Enhance Forecast Accuracy",
      type: "Improve Forecast Accuracy",
      impact: "Implement dynamic weather-based demand routing for North American fulfillment centers.",
      savings: 8500000,
      priority: "Medium",
      confidence: 82,
      icon: <ShieldCheck className="h-5 w-5 text-blue-500" />
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'bg-destructive/10 text-destructive border-destructive'
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500'
      default: return 'bg-primary/10 text-primary border-primary'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight">Executive Decision Center</h2>
        <p className="text-muted-foreground mt-1 text-lg">AI-generated operational recommendations and execution workflows.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="flex flex-col border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-muted">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    {rec.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{rec.title}</CardTitle>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">{rec.type}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                  {rec.priority} Priority
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1 space-y-6">
              
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Business Impact</p>
                <p className="text-base font-medium">{rec.impact}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Potential Savings</p>
                  <p className="text-2xl font-black text-emerald-700">{formatINR(rec.savings)}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI Confidence</p>
                  <p className="text-2xl font-black text-primary">{rec.confidence}%</p>
                </div>
              </div>

            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6">
              <Button className="w-full h-12 text-md font-bold shadow-md hover:scale-[1.02] transition-transform">
                <Zap className="h-5 w-5 mr-2 fill-current" />
                Execute Recommendation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
