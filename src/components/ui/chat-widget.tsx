"use client";

import { FormEvent, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Maximize2, Minus, Minimize2, SendHorizontal, Square, X } from "lucide-react";
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
        isAtBottom,
        setIsAtBottom,
        viewMode,
        setViewMode,
    } = useChatStore();
    const endRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const previousMessageCountRef = useRef(messages.length);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(min-width: 1024px)");
        const update = (event?: MediaQueryListEvent) => {
            setIsLargeScreen(event ? event.matches : query.matches);
        };

        update();

        if (typeof query.addEventListener === "function") {
            query.addEventListener("change", update);
            return () => query.removeEventListener("change", update);
        }

        query.addListener(update);
        return () => query.removeListener(update);
    }, []);

    useEffect(() => {
        if (!isLargeScreen && viewMode !== "docked") {
            setViewMode("docked");
        }
    }, [isLargeScreen, setViewMode, viewMode]);

    const isFullscreen = viewMode === "fullscreen";
    const isMinimized = viewMode === "minimized";

    useEffect(() => {
        if (messages.length > previousMessageCountRef.current && isAtBottom && !isMinimized) {
            endRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        previousMessageCountRef.current = messages.length;
    }, [messages, isAtBottom, isMinimized]);

    useLayoutEffect(() => {
        if (!isChatOpen || !scrollContainerRef.current || isMinimized) return;

        const container = scrollContainerRef.current;
        if (Math.abs(container.scrollTop - scrollPosition) > 1) {
            container.scrollTop = scrollPosition;
        }

        const { scrollHeight, clientHeight, scrollTop } = container;
        const atBottom = scrollHeight - (scrollTop + clientHeight) < 8;
        if (atBottom !== isAtBottom) {
            setIsAtBottom(atBottom);
        }
    }, [isChatOpen, scrollPosition, isAtBottom, setIsAtBottom, isMinimized]);

    useEffect(() => {
        if (!isChatOpen && scrollContainerRef.current) {
            setScrollPosition(scrollContainerRef.current.scrollTop);
        }
    }, [isChatOpen, setScrollPosition]);

    const handleScroll = () => {
        if (scrollContainerRef.current && !isMinimized) {
            const container = scrollContainerRef.current;
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 8;
            setScrollPosition(scrollTop);
            setIsAtBottom(isNearBottom);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isResponding) return;
        const trimmed = inputDraft.trim();
        if (!trimmed) return;

        const timestamp = Date.now();
        const userMessage = { id: timestamp, sender: "user" as const, text: trimmed };
        setIsAtBottom(true);
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

    const toggleFullscreen = () => {
        setViewMode(isFullscreen ? "docked" : "fullscreen");
    };

    const toggleMinimize = () => {
        setViewMode(isMinimized ? "docked" : "minimized");
    };

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <div
                className={cn(
                    "sticky top-0 z-10 border-b bg-background/95 backdrop-blur",
                    isMinimized && "relative border-none bg-background",
                )}
                style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
                <div className="relative flex items-center justify-center px-4 py-3 text-sm font-semibold">
                    <span>Chat Assistant</span>
                    <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                        {isLargeScreen && (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleMinimize}
                                    aria-label={isMinimized ? "Restore chat assistant" : "Minimize chat assistant"}
                                    className="pointer-events-auto"
                                >
                                    {isMinimized ? (
                                        <Square className="h-4 w-4" />
                                    ) : (
                                        <Minus className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleFullscreen}
                                    aria-label={
                                        isFullscreen ? "Exit fullscreen chat assistant" : "Enter fullscreen chat assistant"
                                    }
                                    className="pointer-events-auto"
                                >
                                    {isFullscreen ? (
                                        <Minimize2 className="h-4 w-4" />
                                    ) : (
                                        <Maximize2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </>
                        )}
                        <SheetClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Close chat assistant"
                                className="pointer-events-auto"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </SheetClose>
                    </div>
                </div>
            </div>

            <div className={cn("flex h-full min-h-0 flex-col", isMinimized && "hidden")}>
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
