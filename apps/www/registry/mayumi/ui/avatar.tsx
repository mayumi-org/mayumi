import { Avatar as BaseAvatar } from "@base-ui/react/avatar"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-fill align-middle font-medium text-fg-secondary",
  {
    variants: {
      size: {
        sm: "size-5 text-[10px]",
        md: "size-8 text-xs",
        lg: "size-12 text-ui",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <BaseAvatar.Root
      {...props}
      data-slot="avatar"
      className={cn(avatarVariants({ size, className }))}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Image>) {
  return (
    <BaseAvatar.Image
      {...props}
      data-slot="avatar-image"
      className={cn("size-full object-cover", className)}
    />
  )
}

/** 图片加载失败或未提供时的兜底，通常放姓名首字母 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Fallback>) {
  return (
    <BaseAvatar.Fallback
      {...props}
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center", className)}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage, avatarVariants }
