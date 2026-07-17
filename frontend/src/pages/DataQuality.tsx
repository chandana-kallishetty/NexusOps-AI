import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Database, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react"

export default function DataQuality() {
  const dataSources = [
    { name: "ERP Systems", health: 98, missing: 12, duplicates: 3, freshness: "Real-time" },
    { name: "Supplier Portal API", health: 85, missing: 430, duplicates: 12, freshness: "1 Hour Delay" },
    { name: "Logistics Telemetry", health: 92, missing: 85, duplicates: 4, freshness: "5 Min Delay" },
    { name: "External ESG Data", health: 70, missing: 1205, duplicates: 88, freshness: "24 Hour Delay" },
  ]


  const trustScore = 91;

  const getHealthColor = (score: number) => {
    if (score > 90) return 'text-emerald-500 bg-emerald-500/10'
    if (score > 75) return 'text-orange-500 bg-orange-500/10'
    return 'text-destructive bg-destructive/10'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          Data Quality Monitor
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">Enterprise data governance, integrity scoring, and AI validation.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Pipeline Health</CardTitle>
              <CardDescription>Integrity metrics across primary ingestion streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dataSources.map((source, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-sm">{source.name}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getHealthColor(source.health)}`}>
                          {source.health}% Health
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${source.health > 90 ? 'bg-emerald-500' : source.health > 75 ? 'bg-orange-500' : 'bg-destructive'}`} style={{ width: `${source.health}%` }} />
                      </div>
                      <div className="flex gap-6 mt-4">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Missing Values</p>
                          <p className="text-sm font-semibold">{source.missing.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Duplicates</p>
                          <p className="text-sm font-semibold">{source.duplicates.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Freshness</p>
                          <p className="text-sm font-semibold">{source.freshness}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card className="bg-primary border-primary shadow-lg text-primary-foreground">
            <CardContent className="p-6 text-center space-y-2">
              <ShieldCheck className="h-12 w-12 mx-auto opacity-90" />
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">Data Trust Score</h3>
              <div className="text-6xl font-black">{trustScore}</div>
              <p className="text-sm opacity-90 pt-2">Highly reliable for executive AI predictions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Quality Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Financial Master Data</p>
                  <p className="text-xs text-muted-foreground">Reconciled with zero critical discrepancies.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Supplier Risk Profiles</p>
                  <p className="text-xs text-muted-foreground">14 profiles missing ESG certifications. Requires manual audit.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Legacy Logistics DB</p>
                  <p className="text-xs text-muted-foreground">Deprecation warning. Data freshness exceeded 48 hours.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
