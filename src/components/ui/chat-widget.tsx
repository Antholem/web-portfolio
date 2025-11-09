"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SendHorizontal, X } from "lucide-react"

type Message = {
    id: number
    sender: "user" | "bot"
    text: string
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

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

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

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsResponding(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((message) => ({
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

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            const assistantMessage: Message = {
                id: timestamp + 1,
                sender: "bot",
                text:
                    error instanceof Error
                        ? error.message
                        : "Sorry, something went wrong. Please try again in a moment.",
            }

            setMessages((prev) => [...prev, assistantMessage])
        } finally {
            setIsResponding(false)
        }
    }

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                <div className="relative flex items-center justify-center px-4 py-3 text-sm font-semibold">
                    <span>Chat Assistant</span>
                    <SheetClose asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2.5 top-2.5"
                            aria-label="Close chat assistant"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </SheetClose>
                </div>
            </div>
            <div className="flex h-full flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
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
                                    "max-w-[80%] rounded-lg px-3 py-2",
                                    message.sender === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {message.text}
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
