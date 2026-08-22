import { cn } from "@/registry/mayumi/lib/utils"

function SearchField({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div
      data-slot="search-field"
      className={cn("relative", className)}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-fg-tertiary"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="h-7 w-full rounded-control border border-border bg-surface-2/50 pr-2 pl-7 text-[13px] text-fg outline-none transition-[border-color,background-color] duration-150 ease-out placeholder:text-fg-tertiary focus:border-accent/60 focus:ring-2 focus:ring-accent/30 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
    </div>
  )
}

export { SearchField }
