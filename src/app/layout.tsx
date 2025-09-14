import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import { cookies } from "next/headers"
import type { ReactNode } from "react"
import Script from "next/script"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://antholem.com"),
  title: "Antholem",
  description: "Personal portfolio showcasing projects and skills",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Antholem",
    description: "Personal portfolio showcasing projects and skills",
    url: "https://antholem.com",
    siteName: "Antholem",
    images: [
      {
        url: "/logo-dark.svg",
        width: 1200,
        height: 630,
        alt: "Antholem logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Antholem",
    description: "Personal portfolio showcasing projects and skills",
    images: ["/logo-dark.svg"],
  },
  robots: {
    index: true,
    follow: true,
    sitemap: "https://antholem.com/sitemap.xml",
  },
  manifest: "/site.webmanifest",
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const cookieStore = await cookies()
  const cookieTheme = cookieStore.get("theme")?.value as 'light' | 'dark' | undefined

  return (
    <html
      lang="en"
      className={cookieTheme === "dark" ? "dark" : ""}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              const cookie = document.cookie.match(/(?:^|; )theme=([^;]+)/)?.[1];
              const stored = localStorage.getItem('theme') || cookie;
              if (stored) {
                document.documentElement.classList.toggle('dark', stored === 'dark');
              } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', prefersDark);
              }
            })();
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <Navbar initialTheme={cookieTheme} />
        <main>{children}</main>
      </body>
    </html>
  );
}

