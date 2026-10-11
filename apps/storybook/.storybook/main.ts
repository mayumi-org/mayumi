import path from "node:path"
import { fileURLToPath } from "node:url"

import type { StorybookConfig } from "@storybook/react-vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../../www/registry/**/*.stories.@(ts|tsx)"],
  async viteFinal(viteConfig) {
    const tailwindcss = (await import("@tailwindcss/vite")).default
    viteConfig.plugins ??= []
    viteConfig.plugins.push(tailwindcss())
    viteConfig.resolve ??= {}
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      "@": path.resolve(__dirname, "../../www"),
    }
    return viteConfig
  },
}

export default config
