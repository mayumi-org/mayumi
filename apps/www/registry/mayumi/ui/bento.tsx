import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const bentoVariants = cva("grid", {
  variants: {
    /**
     * divided：gap-px 透出容器底色当发丝分隔线，圆角裁切交给容器，
     * 适合一整块信息墙（仪表盘、营销页特性区）。
     * false：瓷砖之间留透明间距，gap 尺寸由 className 覆盖。
     */
    divided: {
      true: "gap-px overflow-hidden rounded-card border border-border bg-border",
      false: "gap-3",
    },
  },
  defaultVariants: { divided: false },
})

function Bento({
  className,
  divided,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof bentoVariants>) {
  return (
    <div
      {...props}
      data-slot="bento"
      data-divided={divided || undefined}
      className={cn(bentoVariants({ divided, className }))}
    />
  )
}

/**
 * 格子。跨格用 className 里的 col-span-N、row-span-N 表达（Tailwind 需要字面量），
 * 默认 bg-surface 让每块瓷砖抬离页面一层；divided 模式下也是分隔线之间的实色面。
 */
function BentoCell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="bento-cell"
      className={cn("min-w-0 bg-surface", className)}
    />
  )
}

export { Bento, BentoCell, bentoVariants }
