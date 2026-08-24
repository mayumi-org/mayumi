"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { docsMeta } from "@/lib/docs-meta"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/mayumi/ui/command"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="组件导航">
      <CommandInput placeholder="跳转到组件…" autoFocus />
      <CommandList>
        <CommandEmpty>无结果</CommandEmpty>
        <CommandGroup heading="组件">
          {docsMeta.map((d) => (
            <CommandItem
              key={d.slug}
              value={`${d.title} ${d.slug}`}
              onSelect={() => {
                setOpen(false)
                router.push(`/components/${d.slug}`)
              }}
            >
              {d.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
