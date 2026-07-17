import { useState, useRef, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Send, User, Lightbulb, Zap, AlertTriangle, Crosshair, CheckCircle2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatINR } from "@/lib/utils"
import { useLocation } from "react-router-dom"

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
  suggested_followups?: string[]
}

const DEFAULT_PROMPTS = [
  "What does this page do?",
  "What are the biggest risks?",
  "How can costs be reduced?",
  "What is today's executive summary?"
]

export default function GlobalCopilot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      observation: "NexusOps AI Copilot initialized. I am deeply integrated into your enterprise data fabric.",
      impact: "I process live telemetry to forecast revenue, detect anomalies, mitigate risks, and optimize costs.",
      confidence: 100,
      recommendation: {
        title: "Initialize Intelligence Protocol",
        action: "Select a prompt below or ask me a direct analytical question."
      },
      suggested_followups: DEFAULT_PROMPTS
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const res = await axios.post("http://localhost:8000/api/copilot/chat", { 
        message,
        context_path: location.pathname
      })
      return res.data
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        observation: data.observation,
        impact: data.impact,
        confidence: data.confidence,
        chart_data: data.chart_data,
        recommendation: data.recommendation,
        suggested_followups: data.suggested_followups || DEFAULT_PROMPTS
      }])
    }
  })

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [messages, isOpen])

  const handleSend = (text: string) => {
    if (!text.trim() || isPending) return
    setMessages(prev => [...prev, { role: "user", content: text }])
    sendMessage(text)
    setInputValue("")
  }

  if (!isOpen) return null;

  const renderMessageContent = (msg: Message) => {
    if (msg.role === "user") {
      return <p className="text-sm leading-relaxed">{msg.content}</p>
    }

    return (
      <div className="space-y-4 w-full">
        <div className="grid gap-3">
          {msg.observation && (
            <div className="bg-background/40 p-3 rounded-lg border border-primary/10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <Crosshair className="h-3 w-3" /> Observation
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">{msg.observation}</p>
            </div>
          )}
          
          {msg.impact && (
            <div className="bg-destructive/5 p-3 rounded-lg border border-destructive/10">
              <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Business Impact
              </p>
              <p className="text-sm leading-relaxed font-medium text-destructive/90">{msg.impact}</p>
            </div>
          )}
        </div>
        
        {msg.chart_data && (
          <div className="h-[180px] w-full bg-card rounded-md border p-2 mt-2 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={msg.chart_data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatINR(val)} width={60} />
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
            <CardHeader className="py-2 pb-2 border-b border-primary/10 bg-primary/10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4" />
                  {msg.recommendation.title}
                </CardTitle>
                {msg.confidence && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/20 px-2 py-1 rounded-full uppercase tracking-wider">
                    {msg.confidence}% Conf
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-2 pb-2">
              <p className="text-xs font-medium leading-relaxed">{msg.recommendation.action}</p>
              <Button size="sm" className="mt-2 w-full text-[10px] h-7 shadow-sm uppercase tracking-wider font-bold">Execute Strategy</Button>
            </CardContent>
          </Card>
        )}

        {msg.suggested_followups && msg.suggested_followups.length > 0 && (
          <div className="pt-2 flex flex-col gap-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Suggested Queries</p>
            <div className="flex flex-wrap gap-2">
              {msg.suggested_followups.map((prompt, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  className="text-[11px] h-7 rounded-full bg-background shadow-sm hover:border-primary/50 transition-colors font-medium"
                  onClick={() => handleSend(prompt)}
                  disabled={isPending}
                >
                  <Lightbulb className="h-3 w-3 mr-1 text-amber-500" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-background border-l shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      <div className="h-16 border-b bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-md leading-none">AI Intelligence Copilot</h3>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3" /> Live Context Sync
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-br from-card to-secondary/5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 shadow-sm ${msg.role === "user" ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`p-4 rounded-xl min-w-[200px] max-w-[85%] shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/50 rounded-tl-sm border"}`}>
              {renderMessageContent(msg)}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex gap-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 bg-primary text-primary-foreground shadow-sm">
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
      </div>

      <div className="p-4 bg-background border-t shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} 
          className="flex w-full gap-2 relative"
        >
          <Input 
            placeholder="Ask AI to analyze this page..." 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="flex-1 pr-12 shadow-inner bg-muted/20 focus-visible:bg-background transition-colors"
          />
          <Button type="submit" size="icon" disabled={isPending || !inputValue.trim()} className="absolute right-1 top-1 bottom-1 h-8 w-8 shadow-md">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
