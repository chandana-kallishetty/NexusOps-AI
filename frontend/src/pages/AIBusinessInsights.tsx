import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Sparkles, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function FinancialIntelligence() {
  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['aiInsights'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/insights/ai-business")
      return res.data
    }
  })

  const { data: quality, isLoading: isLoadingQuality } = useQuery({
    queryKey: ['dataQuality'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/data-quality")
      return res.data
    }
  })

  if (isLoadingInsights || isLoadingQuality) return <div className="p-8">Analyzing data...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Intelligence Dashboard</h2>
          <p className="text-muted-foreground mt-1">Enterprise-grade financial metrics, profitability, and cost analysis</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Generated Insights
          </h3>
          
          <div className="grid gap-4">
            {insights?.map((insight: any) => (
              <Card key={insight.id} className="relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  insight.priority === 'High' ? 'bg-destructive' :
                  insight.priority === 'Medium' ? 'bg-amber-500' : 'bg-primary'
                }`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-background">
                      {insight.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Priority: 
                      <span className={`font-medium ${
                        insight.priority === 'High' ? 'text-destructive' :
                        insight.priority === 'Medium' ? 'text-amber-500' : 'text-primary'
                      }`}>{insight.priority}</span>
                    </span>
                  </div>
                  <CardTitle className="text-xl mt-2">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {insight.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            Data Quality Monitor
          </h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-muted-foreground text-sm font-medium">
                Overall Data Quality Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Simulated gauge using border radius */}
                <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-primary border-r-transparent border-b-transparent -rotate-45"
                  style={{ transform: `rotate(${((quality?.quality_score || 0) / 100) * 180 - 135}deg)` }}
                ></div>
                <div className="text-4xl font-bold text-center">
                  {quality?.quality_score}
                  <span className="text-sm text-muted-foreground block mt-1">out of 100</span>
                </div>
              </div>

              <div className="w-full mt-8 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Missing Values</span>
                  <span className="font-medium">{quality?.missing_values}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duplicate Records</span>
                  <span className="font-medium">{quality?.duplicate_records}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invalid Dates</span>
                  <span className="font-medium text-destructive">{quality?.invalid_dates}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
