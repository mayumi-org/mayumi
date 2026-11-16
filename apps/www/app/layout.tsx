import type { Metadata, Viewport } from "next"

import { ThemeProvider } from "@/components/theme-provider"
import { CommandMenu } from "@/components/command-menu"
import { Toaster } from "@/registry/mayumi/ui/toast"
import "./globals.css"

export const metadata: Metadata = {
  title: "mayumi",
  description:
    "Mac-style React components for building desktop-grade app UIs (Raycast / Linear aesthetic).",
}

// 移动端基线：viewport-fit=cover 让页面延伸到刘海/home 指示条区域（配合 env(safe-area-*)），
// theme-color 按明暗主题分别匹配页面顶部背景色
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
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
