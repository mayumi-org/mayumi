import { describe, expect, it } from "vitest"
import { springs } from "./motion"

describe("springs", () => {
  it("exposes the four canonical presets as duration/bounce springs", () => {
    for (const name of ["snappy", "smooth", "gentle", "momentum"] as const) {
      expect(springs[name].type).toBe("spring")
      expect(springs[name].duration).toBeGreaterThan(0)
      expect(springs[name].bounce).toBeGreaterThanOrEqual(0)
    }
  })
  it("keeps UI presets critically damped — overshoot is reserved for momentum", () => {
    expect(springs.snappy.bounce).toBe(0)
    expect(springs.smooth.bounce).toBe(0)
    expect(springs.gentle.bounce).toBe(0)
    expect(springs.momentum.bounce).toBeGreaterThan(0)
    expect(springs.momentum.bounce).toBeLessThanOrEqual(0.3)
  })
  it("keeps every response within the UI band (≤ 0.5s)", () => {
    for (const preset of Object.values(springs)) {
      expect(preset.duration).toBeLessThanOrEqual(0.5)
    }
  })
})
