import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { cookies } from "next/headers"
import type { ReactNode } from "react"
import Script from "next/script"


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
      <body className="font-sans" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          <Navbar initialTheme={cookieTheme} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
