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
import { Menu } from "lucide-react"
import { FaComments, FaMoon, FaSun } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"
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
    const [messageInput, setMessageInput] = useState("")
    const [messages, setMessages] = useState<
        { id: number; sender: "user" | "bot"; text: string }
    >([
        {
            id: Date.now(),
            sender: "bot",
            text: "Hi there! How can I help you today?",
        },
    ])

    useEffect(() => {
        if (initialTheme) {
            setTheme(initialTheme)
        }
        setMounted(true)
    }, [initialTheme, setTheme])

    const currentTheme = mounted ? theme : initialTheme || theme

    const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmed = messageInput.trim()
        if (!trimmed) return

        const userMessage = {
            id: Date.now(),
            sender: "user" as const,
            text: trimmed,
        }

        setMessages((prev) => [...prev, userMessage])
        setMessageInput("")

        const botMessage = {
            id: Date.now() + 1,
            sender: "bot" as const,
            text: "Thanks for reaching out! I'll get back to you shortly.",
        }

        setTimeout(() => {
            setMessages((prev) => [...prev, botMessage])
        }, 400)
    }

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
                        onClick={() => setIsChatOpen((prev) => !prev)}
                        aria-label={isChatOpen ? "Close chat" : "Open chat"}
                    >
                        {isChatOpen ? <IoMdClose /> : <FaComments />}
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme}>
                        {currentTheme === "dark" ? <FaSun /> : <FaMoon />}
                    </Button>
                </div>
                {isChatOpen && (
                    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border bg-card shadow-lg">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="font-semibold">Chat</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                                onClick={() => setIsChatOpen(false)}
                                aria-label="Close chat"
                            >
                                <IoMdClose className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto px-4 py-3 text-sm">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={
                                        message.sender === "user"
                                            ? "self-end rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                                            : "self-start rounded-lg bg-muted px-3 py-2"
                                    }
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="border-t px-3 py-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChange={(event) => setMessageInput(event.target.value)}
                                    aria-label="Message"
                                />
                                <Button type="submit" size="sm">
                                    Send
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            <Separator />
        </header>
    )
}
