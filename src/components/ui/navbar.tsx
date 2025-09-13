"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetTrigger,
    SheetContent
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { FaMoon, FaSun } from "react-icons/fa"
import Image from "next/image"
import { useTheme } from "@/lib/theme"

const links = [
    { href: "/", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contacts", label: "Contacts" },
]

export default function Navbar() {
    const { theme, toggle } = useTheme()
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Image
                        src={theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
                        alt="Logo"
                        width={24}
                        height={24}
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-4">
                    {links.map((l) => (
                        <Button key={l.href} variant="ghost">
                            {l.label}
                        </Button>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={toggle}
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </Button>
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <nav className="flex flex-col gap-4 mt-4">
                                {links.map((l) => (
                                    <Link key={l.href} href={l.href} className="text-lg">
                                        {l.label}
                                    </Link>
                                ))}
                            </nav>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mt-4"
                                onClick={toggle}
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? <FaMoon /> : <FaSun />}
                            </Button>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
