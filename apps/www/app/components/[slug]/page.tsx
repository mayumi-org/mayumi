import { promises as fs } from "node:fs"
import path from "node:path"
import { notFound } from "next/navigation"

import { CodeBlock } from "@/components/code-block"
import { docs, getDoc } from "@/lib/docs"

export const dynamicParams = false

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getDoc(slug)
  if (!doc) notFound()
  const source = await fs.readFile(
    path.join(process.cwd(), "registry/mayumi/ui", `${slug}.tsx`),
    "utf-8"
  )
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-fg">
          {doc.title}
        </h1>
        <p className="mt-1 text-ui text-fg-secondary">{doc.description}</p>
      </header>

      <section className="rounded-card border border-border bg-surface p-8">
        <doc.Demo />
      </section>

      <section className="space-y-2">
        <h2 className="text-ui font-semibold text-fg">安装</h2>
        <CodeBlock
          lang="bash"
          code={`npx shadcn@latest add https://mayumi.netlify.app/r/${slug}.json`}
        />
        <p className="text-xs text-fg-tertiary">
          在 components.json 配置 registries 后也可用{" "}
          <code>{`npx shadcn add @mayumi/${slug}`}</code>（见首页快速开始）。
        </p>
      </section>

      {doc.notes?.length ? (
        <section className="space-y-2">
          <h2 className="text-ui font-semibold text-fg">注意事项</h2>
          <ul className="list-disc space-y-1 pl-5 text-ui leading-relaxed text-fg-secondary">
            {doc.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {doc.wiring?.length ? (
        <section className="space-y-4">
          <h2 className="text-ui font-semibold text-fg">接线示例</h2>
          {doc.wiring.map((w) => (
            <div key={w.label} className="space-y-2">
              <h3 className="text-xs font-medium text-fg-secondary">
                {w.label}
              </h3>
              <CodeBlock lang="tsx" code={w.code} />
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-ui font-semibold text-fg">源码</h2>
        <CodeBlock code={source} />
      </section>
    </article>
  )
}
