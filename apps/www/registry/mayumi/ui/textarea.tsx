import { cn } from "@/registry/mayumi/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      data-slot="textarea"
      className={cn(
        "min-h-16 w-full resize-none rounded-control border border-border bg-fill px-2 py-1.5 text-ui leading-relaxed text-fg outline-none transition-[border-color,background-color] duration-150 ease-out placeholder:text-fg-tertiary focus:border-accent/60 focus:ring-2 focus:ring-accent/30 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    />
  )
}

export { Textarea }
