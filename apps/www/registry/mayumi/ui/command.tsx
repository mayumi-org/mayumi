"use client"

import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/registry/mayumi/ui/dialog"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      {...props}
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden text-fg",
        className
      )}
    />
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex shrink-0 items-center gap-2 border-b border-border px-3"
    >
      <Search
        aria-hidden="true"
        className="size-4 shrink-0 text-fg-tertiary"
        strokeWidth={1.5}
      />
      <CommandPrimitive.Input
        {...props}
        data-slot="command-input"
        className={cn(
          "h-11 flex-1 bg-transparent text-ui text-fg outline-none placeholder:text-fg-tertiary",
          className
        )}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      {...props}
      data-slot="command-list"
      className={cn("max-h-80 overflow-y-auto overscroll-contain p-1", className)}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      {...props}
      data-slot="command-empty"
      className={cn("py-6 text-center text-ui text-fg-tertiary", className)}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      {...props}
      data-slot="command-group"
      className={cn(
        "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-fg-tertiary",
        className
      )}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      {...props}
      data-slot="command-item"
      className={cn(
        "flex h-9 cursor-default items-center gap-2 rounded-icon px-2 text-ui leading-tight text-fg outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-surface-raised [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-secondary",
        className
      )}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      {...props}
      data-slot="command-separator"
      className={cn("mx-2 my-1 h-px bg-border", className)}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      data-slot="command-shortcut"
      className={cn("ml-auto text-xs text-fg-tertiary", className)}
    />
  )
}

function CommandDialog({
  children,
  className,
  title = "命令面板",
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  children?: React.ReactNode
  className?: string
  title?: string
}) {
  return (
    <Dialog {...props}>
      {/* 命令面板靠快捷键高频唤起，开合不做动效——动画只会拖慢肌肉记忆 */}
      <DialogContent
        transition="instant"
        className={cn(
          "top-[20%] w-[560px] max-w-[calc(100vw-2rem)] -translate-y-0 overflow-hidden p-0",
          className
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
