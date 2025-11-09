"use client"

import {
    FormEvent,
    useEffect,
    useRef,
    useState,
    type HTMLAttributes,
} from "react"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SendHorizontal, X } from "lucide-react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

type Message = {
    id: number
    sender: "user" | "bot"
    text: string
}

const markdownComponents: Components = {
    p: ({ className, ...props }) => (
        <p
            {...props}
            className={cn("leading-relaxed [&:not(:first-child)]:mt-2", className)}
        />
    ),
    strong: ({ className, ...props }) => (
        <strong {...props} className={cn("font-semibold", className)} />
    ),
    em: ({ className, ...props }) => (
        <em {...props} className={cn("italic", className)} />
    ),
    code: ({
        inline,
        className,
        ...props
    }: { inline?: boolean; className?: string } & HTMLAttributes<HTMLElement>) => (
        <code
            {...props}
            className={cn(
                "rounded bg-muted px-1 py-0.5 text-[0.85em]",
                inline ? "" : "block whitespace-pre-wrap",
                className,
            )}
        />
    ),
    pre: ({ className, ...props }) => (
        <pre
            {...props}
            className={cn(
                "overflow-x-auto rounded-lg bg-muted px-3 py-2 text-sm [&:not(:first-child)]:mt-2",
                className,
            )}
        />
    ),
    ul: ({ className, ...props }) => (
        <ul
            {...props}
            className={cn(
                "list-disc space-y-1 pl-4 [&:not(:first-child)]:mt-2",
                className,
            )}
        />
    ),
    ol: ({ className, ...props }) => (
        <ol
            {...props}
            className={cn(
                "list-decimal space-y-1 pl-5 [&:not(:first-child)]:mt-2",
                className,
            )}
        />
    ),
    li: ({ className, ...props }) => (
        <li {...props} className={cn("leading-relaxed", className)} />
    ),
    a: ({ className, ...props }) => (
        <a
            {...props}
            className={cn("text-primary underline underline-offset-4", className)}
        />
    ),
    blockquote: ({ className, ...props }) => (
        <blockquote
            {...props}
            className={cn(
                "border-l-2 border-muted-foreground/50 pl-3 italic [&:not(:first-child)]:mt-2",
                className,
            )}
        />
    ),
}

const initialBotMessage: Message = {
    id: 0,
    sender: "bot",
    text: "Hi there! I'm your friendly assistant. How can I help you today?",
}

export function ChatWidget() {
    const [messages, setMessages] = useState<Message[]>([initialBotMessage])
    const [inputValue, setInputValue] = useState("")
    const [isResponding, setIsResponding] = useState(false)
    const endRef = useRef<HTMLDivElement | null>(null)
    const messagesRef = useRef<Message[]>(messages)
    const isMounted = useRef(false)

    useEffect(() => {
        messagesRef.current = messages
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isResponding) return
        const trimmed = inputValue.trim()
        if (!trimmed) return

        const timestamp = Date.now()
        const userMessage: Message = {
            id: timestamp,
            sender: "user",
            text: trimmed,
        }

        const nextMessages = [...messagesRef.current, userMessage]

        messagesRef.current = nextMessages
        setMessages(nextMessages)
        setInputValue("")
        setIsResponding(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: nextMessages.map((message) => ({
                        role: message.sender === "bot" ? "assistant" : "user",
                        content: message.text,
                    })),
                }),
            })

            if (!response.ok) {
                const errorPayload = (await response.json()) as {
                    error?: string
                }

                throw new Error(
                    errorPayload.error ||
                        "Sorry, I couldn't reach the assistant. Please try again."
                )
            }

            const payload = (await response.json()) as { reply?: string }

            const assistantMessage: Message = {
                id: timestamp + 1,
                sender: "bot",
                text:
                    payload.reply?.trim() ||
                    "I'm having trouble thinking of a response right now, but please feel free to ask another question!",
            }

            const completedMessages = [...messagesRef.current, assistantMessage]

            messagesRef.current = completedMessages

            if (isMounted.current) {
                setMessages(completedMessages)
            }
        } catch (error) {
            const assistantMessage: Message = {
                id: timestamp + 1,
                sender: "bot",
                text:
                    error instanceof Error
                        ? error.message
                        : "Sorry, something went wrong. Please try again in a moment.",
            }

            const completedMessages = [...messagesRef.current, assistantMessage]

            messagesRef.current = completedMessages

            if (isMounted.current) {
                setMessages(completedMessages)
            }
        } finally {
            if (isMounted.current) {
                setIsResponding(false)
            }
        }
    }

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <div
                className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur"
                style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
                <div className="relative flex items-center justify-center px-4 py-3 text-sm font-semibold">
                    <span>Chat Assistant</span>
                    <SheetClose asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2"
                            aria-label="Close chat assistant"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </SheetClose>
                </div>
            </div>
            <div className="flex h-full min-h-0 flex-col">
                <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-4 py-3 text-sm">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex",
                                message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                                    message.sender === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                    className="space-y-2"
                                >
                                    {message.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isResponding ? (
                        <div className="text-xs text-muted-foreground">
                            The assistant is typing...
                        </div>
                    ) : null}
                    <div ref={endRef} />
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 border-t px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
                >
                    <input
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <Button type="submit" size="icon" disabled={isResponding}>
                        <SendHorizontal className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
