"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Menu, MessageCircle } from "lucide-react"
import { FaMoon, FaSun } from "react-icons/fa"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useThemeStore } from "@/lib/theme-store"
import { Separator } from "@/components/ui/separator"

const links = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contacts" },
]

export default function Navbar({ initialTheme }: { initialTheme?: "light" | "dark" }) {
    const theme = useThemeStore((state) => state.theme)
    const setTheme = useThemeStore((state) => state.setTheme)
    const toggleTheme = useThemeStore((state) => state.toggleTheme)
    const [mounted, setMounted] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [messages, setMessages] = useState<
        Array<{ id: number; sender: "user" | "bot"; text: string }>
    >([
        {
            id: 0,
            sender: "bot",
            text: "Hi there! How can I help you today?",
        },
    ])
    const [messageInput, setMessageInput] = useState("")

    useEffect(() => {
        if (initialTheme) {
            setTheme(initialTheme)
        }
        setMounted(true)
    }, [initialTheme, setTheme])

    const currentTheme = mounted ? theme : initialTheme || theme

    return (
        <header className="sticky top-0 z-40 w-full bg-card backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">
                                Site navigation links
                            </SheetDescription>
                            <nav className="grid gap-4 py-4">
                                {links.map((l) => (
                                    <Button key={l.href} variant="ghost" asChild>
                                        <Link href={l.href}>{l.label}</Link>
                                    </Button>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="relative h-6 w-6">
                        <Image
                            src="/logo-dark.svg"
                            alt="Logo"
                            fill
                            sizes="24px"
                            className="object-contain dark:hidden"
                        />
                        <Image
                            src="/logo-light.svg"
                            alt="Logo"
                            fill
                            sizes="24px"
                            className="hidden object-contain dark:block"
                        />
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-4">
                    {links.map((l) => (
                        <Button key={l.href} variant="ghost" asChild>
                            <Link href={l.href}>{l.label}</Link>
                        </Button>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={isChatOpen ? "Close chat" : "Open chat"}
                        onClick={() => setIsChatOpen((prev) => !prev)}
                    >
                        <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme}>
                        {currentTheme === "dark" ? <FaSun /> : <FaMoon />}
                    </Button>
                </div>
                {isChatOpen ? (
                    <div className="fixed bottom-20 right-4 z-50 w-72 rounded-lg border bg-background shadow-lg">
                        <div className="flex items-center justify-between border-b px-4 py-2">
                            <p className="text-sm font-semibold">Chat with Antholem</p>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                                aria-label="Close chat"
                                onClick={() => setIsChatOpen(false)}
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="max-h-64 space-y-2 overflow-y-auto px-4 py-3 text-sm">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <span
                                        className={`rounded-2xl px-3 py-2 ${
                                            message.sender === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {message.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <form
                            className="flex items-center gap-2 border-t px-3 py-2"
                            onSubmit={(event) => {
                                event.preventDefault()
                                const trimmed = messageInput.trim()
                                if (!trimmed) return
                                setMessages((prev) => {
                                    const nextId = prev.length ? prev[prev.length - 1].id + 1 : 0
                                    const userMessage = {
                                        id: nextId,
                                        sender: "user" as const,
                                        text: trimmed,
                                    }
                                    const botMessage = {
                                        id: nextId + 1,
                                        sender: "bot" as const,
                                        text: "Thanks for your message! I'll get back to you soon.",
                                    }
                                    return [...prev, userMessage, botMessage]
                                })
                                setMessageInput("")
                            }}
                        >
                            <input
                                className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(event) => setMessageInput(event.target.value)}
                            />
                            <Button type="submit" size="sm">
                                Send
                            </Button>
                        </form>
                    </div>
                ) : null}
            </div>
            <Separator />
        </header>
    )
}
