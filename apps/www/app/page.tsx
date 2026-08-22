export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-80 rounded-card border border-border bg-surface p-4 shadow-[var(--shadow-overlay)]">
        <p className="font-medium text-fg">mayumi v2</p>
        <p className="mt-1 text-fg-secondary">
          Design tokens live. 中文回退到苹方。
        </p>
        <p className="mt-1 text-fg-tertiary">tertiary text</p>
      </div>
    </main>
  )
}
