import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// 与 theme.css 的 --text-* / --radius-* 保持一致；不登记的话 text-ui 会被当成颜色类，
// 和 text-fg 合并时被吞掉。
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["ui"],
      radius: ["window", "card", "control", "icon"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
