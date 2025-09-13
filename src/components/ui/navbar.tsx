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
import { useEffect, useState } from "react"
import { useThemeStore } from "@/lib/theme-store"
import { Separator } from "@/components/ui/separator"

const links = [
    { href: "/", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contacts", label: "Contacts" },
]

export default function Navbar({ initialTheme }: { initialTheme: "light" | "dark" }) {
    const theme = useThemeStore((state) => state.theme)
    const setTheme = useThemeStore((state) => state.setTheme)
    const toggleTheme = useThemeStore((state) => state.toggleTheme)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setTheme(initialTheme)
        setMounted(true)
    }, [initialTheme, setTheme])

    const currentTheme = mounted ? theme : initialTheme

    return (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                      <div className="relative h-6 w-6">
                          <Image
                              src={currentTheme === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
                              alt="Logo"
                              fill
                              sizes="24px"
                              className="object-contain"
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
                    <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme}>
                        {currentTheme === "dark" ? <FaSun /> : <FaMoon />}
                    </Button>
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
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
            </div>
            <Separator />
        </header>
    )
}
