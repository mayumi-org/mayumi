import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { CommandMenu } from "@/components/command-menu"
import { Toaster } from "@/registry/mayumi/ui/toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "mayumi",
  description:
    "Mac-style React components for building desktop-grade app UIs (Raycast / Linear aesthetic).",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <CommandMenu />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
