"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { MessageCircle, SendHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const knowledgeBase = [
  {
    keywords: ["name", "who", "antholem", "sam", "manalo", "about you"],
    response:
      "I'm Sam Antholem Manalo, a principal software engineer who partners with founders and product leaders to turn ambitious product ideas into measurable delivery. I guide teams from discovery through launch with systems thinking, inclusive design practices, and AI-accelerated workflows.",
  },
  {
    keywords: ["experience", "years", "background", "career", "lead"],
    response:
      "I bring more than nine years of experience leading distributed engineering teams across finance, commerce, and SaaS. My focus is orchestrating architecture decisions, modernizing platforms, and translating complex requirements into cohesive digital experiences.",
  },
  {
    keywords: ["skills", "tech", "stack", "toolkit", "expertise", "capabilities"],
    response:
      "My core toolkit spans front-end engineering with React and Next.js, resilient backend and API design in Node.js, data platforms like MongoDB and PostgreSQL, DevOps workflows with Docker and Vercel, collaborative design in Figma, and emerging AI tools such as Hugging Face and Google Gemini.",
  },
  {
    keywords: ["services", "offer", "help", "engagement", "partner", "partnership"],
    response:
      "I offer three primary engagement areas: design systems and experience design, full-stack web engineering, and AI-assisted product enablement. Each partnership balances strategy, implementation, and coaching so teams can ship faster with confidence.",
  },
  {
    keywords: ["projects", "portfolio", "work", "case", "examples"],
    response:
      "Recent highlights include the Atlas Insights analytics dashboard, the Aurora Commerce headless storefront, and the Horizon Studio creative portfolio. Each project blends thoughtful design, performant systems, and measurable outcomes.",
  },
  {
    keywords: ["location", "where", "based", "place", "philippines", "mabalacat", "clark"],
    response:
      "I'm based in Clark and collaborate from Mabalacat in Pampanga, Philippines, partnering with teams remotely across time zones.",
  },
  {
    keywords: ["contact", "email", "phone", "reach", "connect"],
    response:
      "You can reach me at +63 977 333 6944 or antholemlemmanalo@gmail.com. I'm happy to schedule conversations about opportunities or collaborations and typically respond within two business days.",
  },
  {
    keywords: ["resume", "cv", "download", "profile"],
    response:
      "My resume is available directly on this site—use the Download Resume button on the hero section to grab a PDF copy or open it in a new tab for a closer look.",
  },
  {
    keywords: ["ai", "automation", "copilot", "intelligent", "workflow"],
    response:
      "AI enablement is a core part of my practice. I integrate copilots, knowledge bases, and automated workflows so teams can move from discovery to delivery with clarity while staying thoughtful about ethical implementation.",
  },
]

const defaultResponse =
  "I'm here to talk about Sam's work. Ask me about experience, skills, services, featured projects, or how to get in touch, and I'll share the details from this portfolio and resume."

type Message = {
  id: string
  role: "assistant" | "user"
  content: string
}

function getAssistantResponse(input: string) {
  const normalized = input.trim().toLowerCase()
  if (!normalized) {
    return "Let me know what you're curious about and I'll share the right details."
  }

  const entry = knowledgeBase.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  )

  if (entry) {
    return entry.response
  }

  return defaultResponse
}

function useAutoScroll<T extends HTMLElement>(dependency: unknown[]) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, dependency)

  return ref
}

export function ChatAI({
  triggerClassName,
}: {
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "intro",
      role: "assistant",
      content:
        "Hi! I'm the Antholem AI guide. I know the highlights from Sam's portfolio and resume, so ask anything about their background, skills, services, or how to connect.",
    },
  ])

  const listRef = useAutoScroll<HTMLDivElement>([messages])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = input.trim()

    if (!trimmed) {
      return
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    }

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: getAssistantResponse(trimmed),
    }

    setMessages((current) => [...current, userMessage, assistantMessage])
    setInput("")
  }

  const toggleOpen = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (!nextOpen) {
      return
    }

    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
    })
  }

  const triggerLabel = open ? "Close Antholem AI" : "Open Antholem AI"

  return (
    <Sheet open={open} onOpenChange={toggleOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-8", triggerClassName)}
          aria-label={triggerLabel}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-4 p-0">
        <SheetHeader className="border-b border-border px-6 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5" aria-hidden />
            Antholem AI
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Ask about Sam's background, capabilities, and how they collaborate.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4">
          <div
            ref={listRef}
            className="flex-1 space-y-4 overflow-y-auto px-6 py-4 text-sm"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1 rounded-lg border px-4 py-3",
                  message.role === "assistant"
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-background"
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  {message.role === "assistant" ? "Antholem AI" : "You"}
                </span>
                <p className="leading-relaxed text-foreground">{message.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 border-t border-border px-6 py-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Ask a question
              </span>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about experience, skills, services, or resume..."
                className="min-h-[96px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                aria-label="Message to Antholem AI"
              />
            </label>
            <div className="flex justify-end">
              <Button type="submit" className="inline-flex items-center gap-2">
                Send
                <SendHorizontal className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
