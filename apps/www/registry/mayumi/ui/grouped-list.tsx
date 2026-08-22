import { cn } from "@/registry/mayumi/lib/utils"

function GroupedList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grouped-list"
      className={cn(
        "divide-y divide-border overflow-hidden rounded-card border border-border bg-surface",
        className
      )}
      {...props}
    />
  )
}

type GroupedListItemProps = React.ComponentProps<"button"> & {
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
      {...(interactive ? { type: "button" as const } : {})}
      data-slot="grouped-list-item"
      onClick={onClick}
      className={cn(
        "flex min-h-10 w-full items-center gap-3 px-3 py-2 text-left leading-tight",
        interactive &&
          "outline-none transition-colors duration-150 ease-out hover:bg-surface-2/50 focus-visible:bg-surface-2/50 active:bg-surface-2",
        className
      )}
      {...props}
    >
      {icon}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[13px] text-fg">{label}</span>
        {description ? (
          <span className="truncate text-xs text-fg-tertiary">
            {description}
          </span>
        ) : null}
      </span>
      {value ? (
        <span className="shrink-0 text-[13px] text-fg-secondary">{value}</span>
      ) : null}
      {chevron ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 8 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-3 shrink-0 text-fg-tertiary"
        >
          <path d="M1.5 1.5 6 6l-4.5 4.5" />
        </svg>
      ) : null}
    </Comp>
  )
}

export { GroupedList, GroupedListItem }
