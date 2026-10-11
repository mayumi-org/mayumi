"use client"

import { Toaster as SonnerToaster, toast } from "sonner"

function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      position="top-right"
      offset={16}
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "mayumi-vibrancy-thick flex w-80 items-start gap-3 rounded-card border border-border p-3 shadow-[var(--shadow-overlay)]",
          title: "text-ui leading-tight font-medium text-fg",
          description: "text-xs leading-tight text-fg-secondary",
        },
      }}
      {...props}
    />
  )
}

export { toast, Toaster }
