import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import { cookies } from "next/headers"
import type { ReactNode } from "react"
import ThemeScript from "@/components/theme-script"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antholem",
  description: "Personal portfolio showcasing projects and skills",
  icons: {
    icon: [
      {
        url: "/logo-dark.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-light.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const cookieStore = await cookies()
  const initialTheme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light"

  return (
    <html
      lang="en"
      className={initialTheme === "dark" ? "dark" : ""}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <Navbar initialTheme={initialTheme} />
        <main>{children}</main>
      </body>
    </html>
  );
}
