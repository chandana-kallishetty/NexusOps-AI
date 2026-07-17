import { useState, useRef, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Send, User, Lightbulb, Zap, AlertTriangle, Crosshair, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatINR } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content?: string
  observation?: string
  impact?: string
  confidence?: number
  chart_data?: any[]
  recommendation?: {
    title: string
    action: string
  }
}

const SUGGESTED_PROMPTS = [
  "What are the biggest risks?",
  "Predict next month's revenue",
  "Show inventory bottlenecks",
  "How much can we save?",
  "Generate executive summary"
]

export default function ExecutiveCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      observation: "I am the NexusOps AI Copilot, deeply integrated into your enterprise data fabric.",
      impact: "I can process live telemetry to forecast revenue, detect anomalies, mitigate risks, and optimize costs across the entire supply chain.",
      confidence: 100,
      recommendation: {
        title: "Initialize Intelligence Protocol",
        action: "Select a suggested prompt below or ask me a direct analytical question."
      }
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const res = await axios.post("http://localhost:8000/api/copilot/chat", { message })
      return res.data
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        observation: data.observation,
        impact: data.impact,
        confidence: data.confidence,
        chart_data: data.chart_data,
        recommendation: data.recommendation
      }])
    }
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (text: string) => {
    if (!text.trim() || isPending) return
    setMessages(prev => [...prev, { role: "user", content: text }])
    sendMessage(text)
    setInputValue("")
  }

  const renderMessageContent = (msg: Message) => {
    if (msg.role === "user") {
      return <p className="text-sm leading-relaxed">{msg.content}</p>
    }

    return (
      <div className="space-y-4 w-full">
        {/* Core Analysis block */}
        <div className="grid gap-3">
          {msg.observation && (
            <div className="bg-background/40 p-3 rounded-lg border border-primary/10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <Crosshair className="h-3 w-3" /> Observation
              </p>
              <p className="text-sm leading-relaxed">{msg.observation}</p>
            </div>
          )}
          
          {msg.impact && (
            <div className="bg-destructive/5 p-3 rounded-lg border border-destructive/10">
              <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Business Impact
              </p>
              <p className="text-sm leading-relaxed font-medium">{msg.impact}</p>
            </div>
          )}
        </div>
        
        {msg.chart_data && (
          <div className="h-[200px] w-full bg-card rounded-md border p-2 mt-2 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={msg.chart_data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatINR(val)} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {msg.recommendation && (
          <Card className="bg-primary/5 border-primary/20 shadow-md">
            <CardHeader className="py-3 pb-2 border-b border-primary/10 bg-primary/10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4" />
                  {msg.recommendation.title}
                </CardTitle>
                {msg.confidence && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/20 px-2 py-1 rounded-full">
                    {msg.confidence}% Confidence
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-3 pb-3">
              <p className="text-sm font-medium">{msg.recommendation.action}</p>
              <Button size="sm" className="mt-3 w-full text-xs h-8 shadow-sm">Execute Recommendation</Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight">AI Copilot</h2>
        <p className="text-muted-foreground mt-1 text-lg">Contextual decision assistant powered by live telemetry</p>
      </div>

      <Card className="flex-1 flex flex-col border-primary/20 shadow-lg overflow-hidden bg-gradient-to-br from-card to-secondary/5">
        <CardHeader className="bg-primary/5 border-b py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">NexusOps Intelligence Core</CardTitle>
              <CardDescription className="flex items-center gap-1 font-medium text-emerald-500">
                <CheckCircle2 className="h-3 w-3" /> Live database connection active
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 mt-1 shadow-sm ${msg.role === "user" ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`p-4 rounded-xl min-w-[200px] max-w-[85%] shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/50 rounded-tl-sm border"}`}>
                {renderMessageContent(msg)}
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 mt-1 bg-primary text-primary-foreground shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border rounded-tl-sm flex items-center gap-2 h-12 shadow-sm">
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-.15s]" />
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-.3s]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>
        
        <div className="px-4 py-3 bg-muted/50 border-t flex gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <Button 
              key={i} 
              variant="outline" 
              size="sm" 
              className="shrink-0 text-xs rounded-full bg-background shadow-sm hover:border-primary/50 transition-colors font-medium"
              onClick={() => handleSend(prompt)}
              disabled={isPending}
            >
              <Lightbulb className="h-3 w-3 mr-1.5 text-amber-500" />
              {prompt}
            </Button>
          ))}
        </div>

        <CardFooter className="p-4 bg-background border-t m-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} 
            className="flex w-full gap-3"
          >
            <Input 
              placeholder="Ask about revenue forecasts, high risk suppliers, or inventory bottlenecks..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 shadow-inner bg-muted/20 focus-visible:bg-background transition-colors"
            />
            <Button type="submit" disabled={isPending || !inputValue.trim()} className="shadow-md">
              <Send className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
