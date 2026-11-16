import { Search } from "lucide-react"

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
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-fg-tertiary"
        strokeWidth={1.5}
      />
      <input
        type="search"
        {...props}
        className="h-7 w-full rounded-control border border-border bg-fill pr-2 pl-7 text-ui text-fg outline-none transition-[border-color,background-color] duration-150 ease-out placeholder:text-fg-tertiary focus:border-accent/60 focus:ring-2 focus:ring-accent/30 [&::-webkit-search-cancel-button]:hidden"
      />
    </div>
  )
}

export { SearchField }
