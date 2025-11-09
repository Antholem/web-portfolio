"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
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

function createBotResponse(userMessage: string): string {
    return `You said: "${userMessage}". I'm just a demo bot, but I'm here to keep you company!`
}

export function ChatWidget({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([initialBotMessage])
    const [inputValue, setInputValue] = useState("")
    const [isResponding, setIsResponding] = useState(false)
    const endRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmed = inputValue.trim()
        if (!trimmed) return

        const timestamp = Date.now()
        setMessages((prev) => [
            ...prev,
            { id: timestamp, sender: "user", text: trimmed },
        ])
        setInputValue("")
        setIsResponding(true)

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: timestamp + 1,
                    sender: "bot",
                    text: createBotResponse(trimmed),
                },
            ])
            setIsResponding(false)
        }, 450)
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-3">
                <p className="text-sm font-semibold">Chat Assistant</p>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Close chat"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex max-h-96 flex-col">
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
                    className="flex items-center gap-2 border-t px-3 py-3"
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
