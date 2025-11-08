"use client"

import { FormEvent, useRef, useState } from "react"
import { MessageCircle, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"

type Message = {
    id: string
    role: "user" | "ai"
    content: string
}

type KnowledgeEntry = {
    keywords: string[]
    answer: string
}

const knowledgeBase: KnowledgeEntry[] = [
    {
        keywords: ["who", "you", "sam", "antholem", "about", "introduction"],
        answer:
            "Sam Antholem Manalo is a principal software engineer who blends systems thinking, accessible design, and AI-accelerated workflows to ship resilient, human-centered products.",
    },
    {
        keywords: ["where", "based", "location", "live"],
        answer:
            "Sam works remotely from Clark in Pampanga, Philippines, and connects with partners throughout the region, including Mabalacat in Pampanga for local collaborations.",
    },
    {
        keywords: ["experience", "background", "career", "years"],
        answer:
            "With more than nine years leading distributed teams across finance, commerce, and SaaS, Sam guides product organizations from discovery through delivery with a focus on maintainability and observability.",
    },
    {
        keywords: ["skills", "tech", "toolkit", "stack", "capabilities"],
        answer:
            "Core capabilities span front-end engineering with React and Next.js, backend services across Node.js, Express, PHP, Python, and Java, data platforms like MongoDB, MySQL, PostgreSQL, Firebase, and Supabase, plus DevOps tooling including Docker, Vercel, GitHub, and GitLab. Sam also collaborates with Figma and Adobe XD and experiments with Hugging Face and Google Gemini for AI initiatives.",
    },
    {
        keywords: ["services", "offer", "engagements", "help"],
        answer:
            "Engagements include design systems and experience design, full-stack web engineering, and AI-assisted product enablement—each pairing strategic planning with measurable delivery.",
    },
    {
        keywords: ["projects", "work", "portfolio", "case"],
        answer:
            "Featured projects highlight marketing analytics with Atlas Insights Dashboard, headless commerce through Aurora Commerce Platform, and cinematic storytelling via Horizon Studio Portfolio—all built with modern web stacks.",
    },
    {
        keywords: ["contact", "email", "phone", "reach", "connect"],
        answer:
            "You can reach Sam at +63 977 333 6944 or email antholemlemmanalo@gmail.com. There is also a contact form on this site for tailored inquiries.",
    },
    {
        keywords: ["resume", "cv", "download"],
        answer:
            "Sam's latest resume is available directly from the hero section—use the Download Resume button or open the PDF viewer for a closer look.",
    },
    {
        keywords: ["ai", "automation", "copilot", "workflow"],
        answer:
            "AI-assisted enablement is part of Sam's practice, blending automation and human judgment to prototype, iterate, and operate products confidently.",
    },
]

const defaultAnswer =
    "Ask me anything about Sam's background, services, projects, or how to get in touch—I'm trained on every section of this portfolio and the published resume."

function generateId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID()
    }

    return Math.random().toString(36).slice(2)
}

function findAnswers(input: string) {
    const normalized = input.toLowerCase()
    const matches = knowledgeBase.filter((entry) =>
        entry.keywords.some((keyword) => normalized.includes(keyword)),
    )

    if (matches.length === 0) {
        return [defaultAnswer]
    }

    return matches.map((entry) => entry.answer)
}

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState("")
    const [messages, setMessages] = useState<Message[]>(() => [
        {
            id: generateId(),
            role: "ai",
            content:
                "Hi! I'm your portfolio guide. Ask me anything about Sam's experience, services, projects, or resume, and I'll surface the details for you.",
        },
    ])

    const endOfMessages = useRef<HTMLDivElement | null>(null)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const question = value.trim()

        if (!question) {
            return
        }

        const userMessage: Message = {
            id: generateId(),
            role: "user",
            content: question,
        }

        const answers = findAnswers(question)

        setMessages((prev) => [
            ...prev,
            userMessage,
            ...answers.map((answer) => ({
                id: generateId(),
                role: "ai" as const,
                content: answer,
            })),
        ])
        setValue("")

        requestAnimationFrame(() => {
            endOfMessages.current?.scrollIntoView({ behavior: "smooth" })
        })
    }

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
                aria-pressed={isOpen}
                onClick={() => setIsOpen((open) => !open)}
            >
                <MessageCircle className="h-5 w-5" aria-hidden />
            </Button>

            {isOpen ? (
                <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm md:bottom-28 md:right-8">
                    <div className="flex flex-col overflow-hidden rounded-lg border bg-background shadow-xl">
                        <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Sparkles className="h-4 w-4" aria-hidden />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Ask Sam's AI</p>
                                    <p className="text-xs text-muted-foreground">
                                        I'm trained on this portfolio content and resume.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-md p-1 text-muted-foreground transition hover:bg-muted"
                                aria-label="Dismiss AI chat"
                            >
                                <X className="h-4 w-4" aria-hidden />
                            </button>
                        </div>

                        <div className="flex max-h-80 flex-col gap-3 overflow-y-auto px-4 py-3 text-sm">
                            {messages.map((message) => (
                                <div key={message.id} className="flex">
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                                            message.role === "user"
                                                ? "ml-auto bg-primary text-primary-foreground"
                                                : "bg-muted text-foreground"
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={endOfMessages} />
                        </div>

                        <form className="border-t px-4 py-3" onSubmit={handleSubmit}>
                            <label className="sr-only" htmlFor="chat-question">
                                Ask a question
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="chat-question"
                                    name="chat-question"
                                    value={value}
                                    onChange={(event) => setValue(event.target.value)}
                                    placeholder="Ask about Sam's work..."
                                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    autoComplete="off"
                                />
                                <Button type="submit" size="sm" className="px-3">
                                    Send
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    )
}
