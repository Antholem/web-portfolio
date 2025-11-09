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
import { ChatWidget } from "@/components/ui/chat-widget"

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
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label="Open chat assistant"
                            >
                                <MessageCircle className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="flex h-[100dvh] w-screen max-w-full flex-col gap-0 overflow-hidden p-0 sm:h-full sm:w-full sm:max-w-md [&>button[data-radix-dialog-close]]:hidden"
                            style={{
                                height: "100dvh",
                                maxHeight: "100dvh",
                                minHeight: "100svh",
                            }}
                        >
                            <SheetTitle className="sr-only">
                                Chat Assistant
                            </SheetTitle>
                            <SheetDescription className="sr-only">
                                Start a conversation with the portfolio assistant
                            </SheetDescription>
                            <ChatWidget />
                        </SheetContent>
                    </Sheet>
                    <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme}>
                        {currentTheme === "dark" ? <FaSun /> : <FaMoon />}
                    </Button>
                </div>
            </div>
            <Separator />
        </header>
    )
}
