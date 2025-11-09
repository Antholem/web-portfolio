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
import { FaComments, FaMoon, FaSun, FaTimes } from "react-icons/fa"
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
    const [chatInput, setChatInput] = useState("")
    const [messages, setMessages] = useState<
        { sender: "user" | "bot"; text: string }[]
    >([
        {
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
                        aria-label="Open chat"
                        onClick={() => setIsChatOpen((prev) => !prev)}
                    >
                        <FaComments />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme}>
                        {currentTheme === "dark" ? <FaSun /> : <FaMoon />}
                    </Button>
                </div>
            </div>
            <Separator />
            {isChatOpen && (
                <div className="fixed bottom-4 right-4 z-50 w-72 overflow-hidden rounded-xl border bg-background shadow-xl">
                    <div className="flex items-center justify-between border-b px-3 py-2">
                        <p className="text-sm font-semibold">Chat with me</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label="Close chat"
                            onClick={() => setIsChatOpen(false)}
                        >
                            <FaTimes className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="max-h-60 space-y-2 overflow-y-auto px-3 py-3 text-sm">
                        {messages.map((message, index) => (
                            <div
                                key={`${message.sender}-${index}`}
                                className={`flex ${
                                    message.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <span
                                    className={`inline-block rounded-2xl px-3 py-2 ${
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
                            const trimmed = chatInput.trim()
                            if (!trimmed) {
                                return
                            }
                            setMessages((prev) => [
                                ...prev,
                                { sender: "user", text: trimmed },
                            ])
                            setChatInput("")
                            setTimeout(() => {
                                setMessages((prev) => [
                                    ...prev,
                                    {
                                        sender: "bot",
                                        text: "Thanks for your message! I'll get back to you shortly.",
                                    },
                                ])
                            }, 400)
                        }}
                    >
                        <input
                            type="text"
                            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Type your message..."
                            value={chatInput}
                            onChange={(event) => setChatInput(event.target.value)}
                        />
                        <Button type="submit" size="sm">
                            Send
                        </Button>
                    </form>
                </div>
            )}
        </header>
    )
}
