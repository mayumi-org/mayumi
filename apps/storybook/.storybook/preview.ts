import type { Preview } from "@storybook/react-vite"

import "../../www/app/globals.css"

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color scheme",
      toolbar: { icon: "mirror", items: ["dark", "light"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "dark" },
  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle(
        "dark",
        context.globals.theme !== "light"
      )
      document.body.classList.add("bg-background", "text-fg")
      return Story()
    },
  ],
}

export default preview
