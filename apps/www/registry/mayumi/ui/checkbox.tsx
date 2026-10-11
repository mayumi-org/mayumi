import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      {...props}
      data-slot="checkbox"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-icon border border-border bg-fill outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 data-checked:border-accent data-checked:bg-accent disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <BaseCheckbox.Indicator
        data-slot="checkbox-indicator"
        className="flex text-accent-fg data-unchecked:hidden"
      >
        <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}

export { Checkbox }
