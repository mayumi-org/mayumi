import { redirect } from "next/navigation"

import { docs } from "@/lib/docs"

export default function ComponentsIndex() {
  redirect(`/components/${docs[0].slug}`)
}
