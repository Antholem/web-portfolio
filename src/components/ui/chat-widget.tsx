"use client";

import { FormEvent, useEffect, useRef, type HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SendHorizontal, X } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "@/lib/chat-store";

const markdownComponents: Components = {
    p: ({ className, ...props }) => (
        <p {...props} className={cn("leading-relaxed [&:not(:first-child)]:mt-2", className)} />
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
                className
            )}
        />
    ),
    pre: ({ className, ...props }) => (
        <pre
            {...props}
            className={cn(
                "overflow-x-auto rounded-lg bg-muted px-3 py-2 text-sm [&:not(:first-child)]:mt-2",
                className
            )}
        />
    ),
};

export function ChatWidget() {
    const {
        messages,
        addMessage,
        isResponding,
        setIsResponding,
        inputDraft,
        setInputDraft,
        isChatOpen,
        scrollPosition,
        setScrollPosition,
    } = useChatStore();
    const endRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const previousOpenStateRef = useRef(isChatOpen);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!isChatOpen && scrollContainerRef.current) {
            setScrollPosition(scrollContainerRef.current.scrollTop);
        }
    }, [isChatOpen, setScrollPosition]);

    useEffect(() => {
        if (isChatOpen && !previousOpenStateRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            requestAnimationFrame(() => {
                container.scrollTop = scrollPosition;
            });
        }
        previousOpenStateRef.current = isChatOpen;
    }, [isChatOpen, scrollPosition]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            setScrollPosition(scrollContainerRef.current.scrollTop);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isResponding) return;
        const trimmed = inputDraft.trim();
        if (!trimmed) return;

        const timestamp = Date.now();
        const userMessage = { id: timestamp, sender: "user" as const, text: trimmed };
        addMessage(userMessage);
        setInputDraft("");
        setIsResponding(true);

        fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [...messages, userMessage].map((m) => ({
                    role: m.sender === "bot" ? "assistant" : "user",
                    content: m.text,
                })),
            }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const { error } = (await response.json()) as { error?: string };
                    throw new Error(error || "Failed to get assistant response.");
                }
                const { reply } = (await response.json()) as { reply?: string };
                const botMessage = {
                    id: timestamp + 1,
                    sender: "bot" as const,
                    text:
                        reply?.trim() ||
                        "I'm having trouble thinking of a response right now. Try again later!",
                };
                addMessage(botMessage);
            })
            .catch((error) => {
                const botMessage = {
                    id: timestamp + 1,
                    sender: "bot" as const,
                    text:
                        error instanceof Error
                            ? error.message
                            : "Something went wrong. Please try again later.",
                };
                addMessage(botMessage);
            })
            .finally(() => setIsResponding(false));
    };

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
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 min-h-0 space-y-3 overflow-y-auto px-4 py-3 text-sm"
                >
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex",
                                message.sender === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-xl px-3 py-2 text-sm shadow-sm",
                                    message.sender === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-gradient-to-br from-muted to-background text-foreground border border-border"
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
                    {isResponding && (
                        <div className="text-xs text-muted-foreground">
                            The assistant is typing...
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 border-t px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
                >
                    <input
                        value={inputDraft}
                        onChange={(e) => setInputDraft(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <Button type="submit" size="icon" disabled={isResponding}>
                        <SendHorizontal className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
