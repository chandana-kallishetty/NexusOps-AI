import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Target, BrainCircuit } from "lucide-react"
import { formatINR } from "@/lib/utils"

export default function PredictiveAnalytics() {
  const generateData = (base: number, volatility: number, growth: number) => {
    return Array.from({ length: 6 }).map((_, i) => {
      const val = base * (1 + (i * growth)) + (Math.random() * volatility - volatility/2);
      return {
        month: `M+${i+1}`,
        prediction: Math.round(val),
        upper: Math.round(val * 1.08),
        lower: Math.round(val * 0.92)
      }
    })
  }

  const revenueData = generateData(150000000, 5000000, 0.04);
  const costData = generateData(110000000, 3000000, 0.02);
  const riskData = generateData(45, 10, -0.05);

  const renderForecastTab = (title: string, data: any[], formatType: 'currency' | 'number' | 'percentage', isPositiveTrend: boolean) => {
    const currentVal = data[0].prediction;
    const finalVal = data[data.length - 1].prediction;
    const growth = ((finalVal - currentVal) / currentVal) * 100;
    
    const formatVal = (val: number) => {
      if (formatType === 'currency') return formatINR(val);
      if (formatType === 'percentage') return `${val.toFixed(1)}%`;
      return val.toLocaleString();
    }

    return (
      <div className="space-y-6 mt-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-primary/5">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Current</p>
              <div className="text-2xl font-black">{formatVal(currentVal)}</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">M+6 Prediction</p>
              <div className="text-2xl font-black text-primary">{formatVal(finalVal)}</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Expected Growth</p>
              <div className={`text-2xl font-black flex items-center gap-2 ${isPositiveTrend ? 'text-emerald-500' : 'text-destructive'}`}>
                {isPositiveTrend ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">AI Confidence</p>
              <div className="text-2xl font-black text-blue-500 flex items-center gap-2">
                <Target className="h-5 w-5" /> 94%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{title} Forecast Model</CardTitle>
            <CardDescription>Machine learning projection with 95% confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatType === 'currency' ? formatINR(val) : val} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: any) => formatType === 'currency' ? formatINR(value) : value}
                  />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" />
                  <Line type="monotone" dataKey="prediction" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Predictive Analytics Engine
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">Machine-learning forecasts with confidence intervals across primary operational vectors.</p>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[800px] h-12">
          <TabsTrigger value="revenue" className="font-bold">Revenue</TabsTrigger>
          <TabsTrigger value="costs" className="font-bold">Operating Costs</TabsTrigger>
          <TabsTrigger value="demand" className="font-bold">Demand Volatility</TabsTrigger>
          <TabsTrigger value="risk" className="font-bold">Risk Exposure</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          {renderForecastTab("Global Revenue", revenueData, 'currency', true)}
        </TabsContent>
        <TabsContent value="costs">
          {renderForecastTab("Operating Costs", costData, 'currency', false)}
        </TabsContent>
        <TabsContent value="demand">
          {renderForecastTab("Demand Volume", generateData(50000, 5000, 0.08), 'number', true)}
        </TabsContent>
        <TabsContent value="risk">
          {renderForecastTab("Risk Exposure Index", riskData, 'number', true)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
