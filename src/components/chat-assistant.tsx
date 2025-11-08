"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MessageCircle, Sparkles } from "lucide-react"

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

interface Message {
    id: number
    role: "assistant" | "user"
    content: string
}

const knowledgeBase = [
    {
        keywords: ["name", "who", "you", "introduce"],
        response:
            "I'm Sam Antholem Manalo, a software engineer who helps founders and product leaders ship resilient, human-centered platforms.",
    },
    {
        keywords: ["where", "based", "location", "live"],
        response: "I'm based in Clark, Pampanga, Philippines and collaborate remotely with distributed teams.",
    },
    {
        keywords: ["experience", "background", "years", "career", "lead"],
        response:
            "I bring over nine years of experience leading engineering teams, modernizing legacy systems, and launching data-informed products across finance, commerce, and SaaS.",
    },
    {
        keywords: ["skills", "stack", "tech", "technologies", "tools"],
        response:
            "My toolkit spans Next.js, React, Tailwind CSS, Node.js, Express, PHP, Python, Java, plus data platforms like MongoDB, PostgreSQL, Firebase, and DevOps tools including Docker, Vercel, GitHub, and GitLab.",
    },
    {
        keywords: ["ai", "workflow", "automation", "assist"],
        response:
            "I blend AI-assisted workflows with systems thinking to prototype, iterate, and operate products efficiently and inclusively.",
    },
    {
        keywords: ["projects", "work", "case", "portfolio"],
        response:
            "Explore highlights like the Atlas Insights Dashboard, Aurora Commerce Platform, and Horizon Studio Portfolio—each pairing thoughtful design with scalable systems.",
    },
    {
        keywords: ["resume", "cv", "download"],
        response: "You can download or view my resume directly from the hero section's “Download Resume” button at the top of the page.",
    },
    {
        keywords: ["services", "offer", "help", "partner"],
        response:
            "I guide cross-functional teams through architecture decisions, experience strategy, platform evolution, and AI-assisted enablement to deliver measurable outcomes.",
    },
] as const

const fallbackResponses = [
    "I'm happy to share more—ask me about my skills, experience, services, or recent projects.",
    "I keep a balanced focus on resilient engineering, inclusive design, and measurable product strategy—feel free to dive into any of those areas.",
    "Everything on this site and my resume is fair game. What would you like to know about how I build and lead digital products?",
]

function generateResponse(message: string, index: number) {
    const normalized = message.toLowerCase()

    for (const entry of knowledgeBase) {
        if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
            return entry.response
        }
    }

    return fallbackResponses[index % fallbackResponses.length]
}

export default function ChatAssistant() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const [isThinking, setIsThinking] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 0,
            role: "assistant",
            content:
                "Hi there! I'm Sam's portfolio assistant. Ask me anything about his experience, skills, services, or resume and I'll point you to the right details.",
        },
    ])

    const [interactionCount, setInteractionCount] = useState(0)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!open) {
            return
        }

        const timeout = setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 50)

        return () => clearTimeout(timeout)
    }, [messages, isThinking, open])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmed = input.trim()
        if (!trimmed) {
            return
        }

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: trimmed,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsThinking(true)

        const nextIndex = interactionCount + 1
        setInteractionCount(nextIndex)

        const assistantReply = generateResponse(trimmed, nextIndex)

        window.setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: assistantReply,
                },
            ])
            setIsThinking(false)
        }, 400)
    }

    const chatMessages = useMemo(() => messages, [messages])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Open portfolio chat assistant"
                >
                    <MessageCircle className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-lg"
                aria-describedby="portfolio-chat-description"
            >
                <SheetHeader className="border-b border-border px-6 py-5 text-left">
                    <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                        Portfolio AI Guide
                    </SheetTitle>
                    <SheetDescription id="portfolio-chat-description" className="text-sm text-muted-foreground">
                        Ask about Sam’s experience, skills, services, featured work, or resume.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-6 overflow-hidden">
                    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6" role="log" aria-live="polite">
                        {chatMessages.map((message) => (
                            <div
                                key={message.id}
                                className={cn("flex", message.role === "assistant" ? "justify-start" : "justify-end")}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                        message.role === "assistant"
                                            ? "bg-muted text-foreground"
                                            : "bg-primary text-primary-foreground",
                                    )}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isThinking ? (
                            <div className="flex justify-start text-xs text-muted-foreground" role="status">
                                Sam is thinking…
                            </div>
                        ) : null}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="border-t border-border px-6 py-4">
                        <label htmlFor="portfolio-chat-input" className="sr-only">
                            Ask the portfolio assistant a question
                        </label>
                        <div className="flex items-end gap-3">
                            <textarea
                                id="portfolio-chat-input"
                                name="message"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder="Ask about Sam’s background, skills, or resume…"
                                rows={2}
                                className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                aria-label="Message"
                            />
                            <Button type="submit" disabled={!input.trim() || isThinking}>
                                Send
                            </Button>
                        </div>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
