"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { MessageCircle, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { chatIntroMessage, generateChatResponse, suggestedPrompts } from "@/lib/chatbot"
import { cn } from "@/lib/utils"

type ChatMessage = {
  id: number
  role: "user" | "assistant"
  content: string
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "assistant", content: chatIntroMessage },
  ])
  const [inputValue, setInputValue] = useState("")
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const messageIdRef = useRef(0)

  useEffect(() => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const getNextId = () => {
    messageIdRef.current += 1
    return messageIdRef.current
  }

  const sendPrompt = (prompt: string) => {
    const normalizedPrompt = prompt.trim()

    if (!normalizedPrompt) {
      return
    }

    const userMessage: ChatMessage = {
      id: getNextId(),
      role: "user",
      content: normalizedPrompt,
    }

    const assistantMessage: ChatMessage = {
      id: getNextId(),
      role: "assistant",
      content: generateChatResponse(normalizedPrompt),
    }

    setMessages((previous) => [...previous, userMessage, assistantMessage])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = inputValue.trim()
    if (!trimmed) {
      return
    }

    sendPrompt(trimmed)
    setInputValue("")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Open AI chat assistant"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex h-full w-full max-w-lg flex-col p-0">
        <SheetHeader className="border-b px-6 py-5 text-left">
          <SheetTitle className="text-lg">Portfolio AI Guide</SheetTitle>
          <SheetDescription className="text-sm">
            Ask about Sam's background, skills, featured work, or how to connect.
          </SheetDescription>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendPrompt(prompt)}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
              >
                {prompt}
              </button>
            ))}
          </div>
        </SheetHeader>
        <div ref={viewportRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "assistant"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground shadow-sm"
                )}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="border-t px-6 py-4">
          <div className="flex items-end gap-2">
            <label className="sr-only" htmlFor="chat-input">
              Ask the AI assistant
            </label>
            <textarea
              id="chat-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask anything about Sam..."
              rows={2}
              className="h-20 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
