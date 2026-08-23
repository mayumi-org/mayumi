import { ChevronRight } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"

function GroupedList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="grouped-list"
      className={cn(
        "divide-y divide-border overflow-hidden rounded-card border border-border bg-surface",
        className
      )}
    />
  )
}

type GroupedListItemProps = Omit<React.ComponentProps<"button">, "value"> & {
  icon?: React.ReactNode
  label: React.ReactNode
  description?: React.ReactNode
  value?: React.ReactNode
  chevron?: boolean
}

function GroupedListItem({
  icon,
  label,
  description,
  value,
  chevron = false,
  className,
  onClick,
  ...props
}: GroupedListItemProps) {
  const interactive = Boolean(onClick)
  const Comp = (interactive ? "button" : "div") as "button"
  return (
    <Comp
      {...props}
      {...(interactive ? { type: "button" as const } : {})}
      data-slot="grouped-list-item"
      onClick={onClick}
      className={cn(
        "flex min-h-10 w-full items-center gap-3 px-3 py-2 text-left leading-tight",
        interactive &&
          "outline-none transition-colors duration-150 ease-out hover:bg-surface-2/50 focus-visible:bg-surface-2/50 active:bg-surface-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {icon}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-ui text-fg">{label}</span>
        {description ? (
          <span className="truncate text-xs text-fg-tertiary">
            {description}
          </span>
        ) : null}
      </span>
      {value ? (
        <span className="shrink-0 text-ui text-fg-secondary">{value}</span>
      ) : null}
      {chevron ? (
        <ChevronRight
          aria-hidden="true"
          className="size-3 shrink-0 text-fg-tertiary"
          strokeWidth={2}
        />
      ) : null}
    </Comp>
  )
}

export { GroupedList, GroupedListItem }
