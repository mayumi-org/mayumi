"use client"

import { type VariantProps, cva } from "class-variance-authority"
import { useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"
import print1 from "./fingerprints/print-1.png"
import print2 from "./fingerprints/print-2.png"
import print3 from "./fingerprints/print-3.png"
import print4 from "./fingerprints/print-4.png"
import print5 from "./fingerprints/print-5.png"

const prints = [print1, print2, print3, print4, print5]
const MAX_MARKS = 12

type PrintAsset = string | { src: string }

function assetSrc(asset: PrintAsset) {
  return typeof asset === "string" ? asset : asset.src
}

type Mark = {
  id: number
  x: number
  y: number
  rotate: number
  src: string
}

let nextMarkId = 0

function stamp(x: number, y: number): Mark {
  const src = prints[Math.floor(Math.random() * prints.length)]
  return {
    id: nextMarkId++,
    x,
    y,
    // 指尖按下去基本是竖的，只有小角度偏转
    rotate: Math.round(Math.random() * 50 - 25),
    src: assetSrc(src),
  }
}

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap text-ui font-medium outline-none transition-[background-color,border-color,color,scale,filter,transform,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg shadow-[inset_0_1px_0_0_var(--highlight)] hover:bg-accent/90",
        // secondary 是凸起控件：hover 用更实的面推进一档，而不是靠降低透明度
        secondary:
          "border border-border bg-surface-2 text-fg shadow-[inset_0_1px_0_0_var(--highlight)] hover:bg-surface-2-hover",
        // ghost 直接坐在 chrome 上，用中性 tint 才不会在毛玻璃上糊掉
        ghost: "text-fg-secondary hover:bg-fill-hover hover:text-fg",
        danger: "bg-danger text-accent-fg hover:bg-danger/90",
        // 厚度 --tactile-depth 按尺寸给；按下时整颗沉下同样距离，侧壁和交接亮线一起消失。
        tactile:
          "relative isolate mb-(--tactile-depth) overflow-hidden rounded-card bg-[image:var(--tactile-face)] font-semibold text-accent-fg shadow-[inset_0_0_0_1px_var(--tactile-rim),inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_-2px_0_0_var(--tactile-bevel),0_var(--tactile-depth)_0_0_var(--tactile-wall),0_calc(var(--tactile-depth)+6px)_18px_-8px_var(--tactile-ground)] motion-safe:active:translate-y-(--tactile-depth) motion-safe:active:shadow-[inset_0_0_0_1px_var(--tactile-rim),inset_0_1px_0_0_rgba(255,255,255,0.18),inset_0_0_0_0_transparent,0_0_0_0_transparent,0_2px_6px_-4px_var(--tactile-ground)] motion-reduce:active:brightness-95",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        "icon-sm": "shrink-0",
        "icon-md": "shrink-0",
        "icon-lg": "shrink-0",
      },
    },
    compoundVariants: [
      {
        variant: ["primary", "secondary", "ghost", "danger"],
        class:
          "rounded-control motion-safe:active:scale-97 motion-reduce:active:brightness-90",
      },
      {
        variant: ["primary", "secondary", "ghost", "danger"],
        size: "sm",
        class: "h-6 px-2",
      },
      {
        variant: ["primary", "secondary", "ghost", "danger"],
        size: "md",
        class: "h-7 px-3",
      },
      {
        variant: ["primary", "secondary", "ghost", "danger"],
        size: "lg",
        class: "h-8 px-4",
      },
      {
        variant: ["primary", "secondary", "ghost", "danger"],
        size: "icon-sm",
        class: "size-6 [&_svg:not([class*='size-'])]:size-3.5",
      },
      {
        variant: ["primary", "secondary", "ghost", "danger"],
        size: "icon-md",
        class: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
      },
      {
        variant: ["primary", "secondary", "ghost", "danger"],
        size: "icon-lg",
        class: "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
      { variant: "tactile", size: "sm", class: "h-8 px-4 [--tactile-depth:3px]" },
      { variant: "tactile", size: "md", class: "h-10 px-5 [--tactile-depth:4px]" },
      {
        variant: "tactile",
        size: "lg",
        class: "h-12 px-6 text-base [--tactile-depth:5px]",
      },
      {
        variant: "tactile",
        size: "icon-sm",
        class: "size-8 [--tactile-depth:3px] [&_svg:not([class*='size-'])]:size-4",
      },
      {
        variant: "tactile",
        size: "icon-md",
        class: "size-10 [--tactile-depth:4px] [&_svg:not([class*='size-'])]:size-4",
      },
      {
        variant: "tactile",
        size: "icon-lg",
        class: "size-12 [--tactile-depth:5px] [&_svg:not([class*='size-'])]:size-5",
      },
    ],
    defaultVariants: { variant: "secondary", size: "md" },
  }
)

function Button({
  className,
  variant,
  size,
  onPointerDown,
  onKeyDown,
  children,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  const tactile = variant === "tactile"
  const [marks, setMarks] = useState<Mark[]>([])

  function addMark(x: number, y: number) {
    setMarks((current) => [...current, stamp(x, y)].slice(-MAX_MARKS))
  }

  return (
    <button
      {...props}
      data-slot="button"
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (!tactile || props.disabled || event.button !== 0) return
        const rect = event.currentTarget.getBoundingClientRect()
        addMark(event.clientX - rect.left, event.clientY - rect.top)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!tactile || props.disabled) return
        if (event.key !== "Enter" && event.key !== " ") return
        if (event.repeat) return
        const rect = event.currentTarget.getBoundingClientRect()
        addMark(rect.width / 2, rect.height / 2)
      }}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {tactile ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-card"
        >
          {marks.map((mark) => (
            <img
              key={mark.id}
              alt=""
              data-slot="button-fingerprint"
              src={mark.src}
              className="absolute h-[140%] w-auto max-w-none opacity-50 mix-blend-screen motion-safe:[animation:mayumi-print-in_180ms_ease-out]"
              style={{
                left: mark.x,
                top: mark.y,
                transform: `translate(-50%, -50%) rotate(${mark.rotate}deg)`,
              }}
            />
          ))}
        </span>
      ) : null}
      {tactile ? <span className="relative">{children}</span> : children}
    </button>
  )
}

export { Button, buttonVariants }
