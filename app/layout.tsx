import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/store/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MathonGo - Chapter Management",
  description: "Track your learning progress across Physics, Chemistry, and Mathematics",
    generator: 'devradheee.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
