import { codeToHtml } from "shiki"
import type { BundledLanguage } from "shiki"

export async function CodeBlock({
  code,
  lang = "tsx",
}: {
  code: string
  lang?: BundledLanguage
}) {
  const html = await codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
  return (
    <div
      className="overflow-x-auto rounded-card border border-border bg-surface p-4 text-xs leading-relaxed"
      // shiki 输出为可信的本地生成 HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
