import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"
import { CommandMenu } from "@/components/command-menu"
import { Toaster } from "@/registry/mayumi/ui/toast"
import "./globals.css"

export const metadata: Metadata = {
  title: "mayumi",
  description:
    "Mac-style React components for building desktop-grade app UIs (Raycast / Linear aesthetic).",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
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
