import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, FileSpreadsheet, FileIcon, Settings } from "lucide-react"
// @ts-ignore
import html2pdf from "html2pdf.js"
import { createRoot } from "react-dom/client"
import ExecutivePDFTemplate from "../components/reports/ExecutivePDFTemplate"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axios from "axios"

export default function ReportsHub() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    
    // Create a temporary container
    const container = document.createElement('div')
    // Must be visible for Recharts to render, but position it way off screen
    container.style.position = 'absolute'
    container.style.top = '-9999px'
    container.style.left = '-9999px'
    container.style.width = '1200px' // Fix width for consistent rendering
    document.body.appendChild(container)

    // Render the React component into the container
    const queryClient = new QueryClient()
    const root = createRoot(container)
    
    // Wrap in providers needed by the template
    root.render(
      <QueryClientProvider client={queryClient}>
        <ExecutivePDFTemplate />
      </QueryClientProvider>
    )

    // Wait for data to fetch and charts to render
    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const opt: any = {
        margin:       0, // No margins, let the component handle padding
        filename:     `NexusOps_Executive_Briefing_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(container).save()
    } finally {
      // Cleanup
      setTimeout(() => {
        root.unmount()
        document.body.removeChild(container)
        setIsGenerating(false)
      }, 1000)
    }
  }

  const exportCSV = async () => {
    const res = await axios.get("http://localhost:8000/api/dashboard/executive")
    const kpis = res.data.kpis
    const csvContent = `Metric,Value\nTotal Revenue,${kpis.total_revenue}\nInventory Value,${kpis.total_inventory_value}\nDelivery Rate,${kpis.on_time_delivery_rate}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `NexusOps_Data_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Reports & Exports Hub
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">Generate executive briefings and export enterprise data.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="text-2xl">Executive Briefing Report</CardTitle>
            <CardDescription>Comprehensive multi-page PDF analysis containing KPIs, predictive forecasts, risk profiling, and AI recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
              <FileText className="h-10 w-10 text-primary opacity-80" />
              <div>
                <p className="font-bold text-sm">Included in this export:</p>
                <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1 space-y-1">
                  <li>Executive Summary Cover Page</li>
                  <li>Financial KPI Health Overview</li>
                  <li>Predictive Revenue & Cost Models</li>
                  <li>Global Risk Heatmap</li>
                  <li>AI Mitigation Recommendations</li>
                </ul>
              </div>
            </div>
            <Button 
              className="w-full h-12 text-md font-bold shadow-md hover:scale-[1.02] transition-transform" 
              onClick={generatePDF} 
              disabled={isGenerating}
            >
              {isGenerating ? (
                "Compiling AI Report..."
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Generate Enterprise PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-emerald-500 shadow-lg overflow-hidden">
          <CardHeader className="bg-emerald-500/5 pb-4">
            <CardTitle className="text-2xl">Raw Data Export</CardTitle>
            <CardDescription>Export structured telemetry data for downstream analysis in Excel, Power BI, or Tableau.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-emerald-500 hover:text-emerald-600 transition-colors" onClick={exportCSV}>
                <FileSpreadsheet className="h-8 w-8" />
                <span>Export as CSV</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-emerald-500 hover:text-emerald-600 transition-colors" onClick={exportCSV}>
                <FileIcon className="h-8 w-8" />
                <span>Export as Excel (XLSX)</span>
              </Button>
            </div>
            <div className="p-4 border rounded-lg bg-muted/20 flex items-start gap-3 mt-4">
              <Settings className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-bold">API Access Configured</p>
                <p className="text-xs text-muted-foreground">Automated daily extracts are currently active for the Global Finance team via the NexusOps API.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
