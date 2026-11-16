import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const theme = readFileSync(
  path.join(import.meta.dirname, "theme.css"),
  "utf-8"
)

const shadowOverlay = [...theme.matchAll(/--shadow-overlay:([^;]+);/g)].map(
  (m) => m[1]
)

describe("theme tokens", () => {
  it("defines --shadow-overlay in both schemes", () => {
    expect(shadowOverlay).toHaveLength(2)
  })

  it("keeps --shadow-overlay free of a 1px ring", () => {
    // 所有浮层自带 border border-border；再叠一圈 0 0 0 1px 就是 2px 双边框
    for (const value of shadowOverlay) {
      expect(value).not.toMatch(/0\s+0\s+0\s+1px/)
    }
  })

  it("drops the inner bevel highlight on dark surfaces", () => {
    // 暗色下边框本身是浅色，同亮度的内高光只会读成第二条边框
    const dark = theme.slice(theme.indexOf(".dark"))
    expect(dark).toMatch(/--highlight:\s*transparent/)
  })
})
