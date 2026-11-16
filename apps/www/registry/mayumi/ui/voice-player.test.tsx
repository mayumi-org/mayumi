import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { VoicePlayer, VoiceWaveform, formatTime } from "./voice-player"

const motionPreference = vi.hoisted(() => ({ reduceMotion: false }))
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => motionPreference.reduceMotion,
}))

const canvasContext = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  fillStyle: "",
  shadowColor: "",
  shadowBlur: 0,
  globalAlpha: 1,
}

function audioElement() {
  return document.querySelector("audio") as HTMLAudioElement
}

function loadMetadata(duration = 12) {
  const audio = audioElement()
  Object.defineProperty(audio, "duration", { configurable: true, value: duration })
  fireEvent.loadedMetadata(audio)
  fireEvent.canPlay(audio)
  return audio
}

function installAudioContext() {
  const analyser = {
    fftSize: 512,
    smoothingTimeConstant: 0,
    connect: vi.fn(),
    disconnect: vi.fn(),
    getByteTimeDomainData: vi.fn((samples: Uint8Array) => samples.fill(160)),
  }
  const source = { connect: vi.fn(), disconnect: vi.fn() }
  const context = {
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    createMediaElementSource: vi.fn(() => source),
    createAnalyser: vi.fn(() => analyser),
  }
  const Constructor = vi.fn(function AudioContext() {
    return context
  })
  vi.stubGlobal("AudioContext", Constructor as unknown as typeof AudioContext)
  return { analyser, context, source, Constructor }
}

beforeEach(() => {
  motionPreference.reduceMotion = false
  vi.clearAllMocks()
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    canvasContext as unknown as CanvasRenderingContext2D
  )
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1)
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {})
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined)
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {})
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("VoiceWaveform", () => {
  it("draws a static dot matrix without scheduling animation", () => {
    render(<VoiceWaveform levels={[0.1, 0.5, 0.9, 0.4]} />)
    expect(document.querySelector('[data-slot="voice-waveform"]')).toBeInTheDocument()
    expect(canvasContext.arc).toHaveBeenCalled()
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it("starts while active and cancels when paused", () => {
    const { rerender } = render(<VoiceWaveform active levels={[0.2, 0.7, 0.3]} />)
    expect(window.requestAnimationFrame).toHaveBeenCalled()
    rerender(<VoiceWaveform active={false} levels={[0.2, 0.7, 0.3]} />)
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
  })

  it("keeps an active waveform static with reduced motion", () => {
    motionPreference.reduceMotion = true
    render(<VoiceWaveform active levels={[0.2, 0.7, 0.3]} />)
    expect(canvasContext.arc).toHaveBeenCalled()
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })
})

describe("VoicePlayer", () => {
  it("plays and pauses through accessible controls", async () => {
    const { context, source } = installAudioContext()
    render(<VoicePlayer src="/voice.mp3" title="设计摘要" />)
    loadMetadata()
    expect(screen.getByRole("group", { name: "设计摘要语音播放器" })).toBeInTheDocument()
    expect(context.createMediaElementSource).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole("button", { name: "播放" }))
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
    expect(context.createMediaElementSource).toHaveBeenCalledWith(audioElement())
    expect(source.connect).toHaveBeenCalled()
    expect(context.resume).toHaveBeenCalled()

    fireEvent.play(audioElement())
    expect(screen.getByRole("button", { name: "暂停" })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "暂停" }))
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
    fireEvent.pause(audioElement())
    expect(screen.getByRole("button", { name: "播放" })).toBeInTheDocument()
  })

  it("keeps playback available without Web Audio support", async () => {
    vi.stubGlobal("AudioContext", undefined)
    vi.stubGlobal("webkitAudioContext", undefined)
    render(<VoicePlayer src="/voice.mp3" title="设计摘要" />)
    loadMetadata()
    await userEvent.click(screen.getByRole("button", { name: "播放" }))
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
    fireEvent.play(audioElement())
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("updates time and seeks with the keyboard", async () => {
    render(<VoicePlayer src="/voice.mp3" title="设计摘要" />)
    const audio = loadMetadata(12)
    expect(screen.getByText("0:00 / 0:12")).toBeInTheDocument()

    audio.currentTime = 4
    fireEvent.timeUpdate(audio)
    expect(screen.getByText("0:04 / 0:12")).toBeInTheDocument()

    const slider = screen.getByRole("slider", { name: "播放进度" })
    slider.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(audio.currentTime).toBeGreaterThan(4)
  })

  it("reads duration from canplay when metadata did not arrive", () => {
    render(<VoicePlayer src="/voice.mp3" title="设计摘要" />)
    const audio = audioElement()
    Object.defineProperty(audio, "duration", { configurable: true, value: 12 })
    fireEvent.canPlay(audio)
    expect(screen.getByText("0:00 / 0:12")).toBeInTheDocument()
  })

  it("uses a duration hint until media metadata is available", () => {
    render(<VoicePlayer src="/voice.mp3" title="设计摘要" duration={12.28} />)
    expect(screen.getByText("待播放")).toBeInTheDocument()
    expect(screen.getByText("0:00 / 0:12")).toBeInTheDocument()
    expect(screen.getByRole("slider", { name: "播放进度" })).toBeEnabled()
  })

  it("can hide the progress control", () => {
    render(<VoicePlayer src="/voice.mp3" title="设计摘要" showProgress={false} />)
    expect(screen.queryByRole("slider")).not.toBeInTheDocument()
  })

  it("restarts after reaching the end", async () => {
    render(<VoicePlayer src="/voice.mp3" title="设计摘要" />)
    const audio = loadMetadata(12)
    audio.currentTime = 12
    fireEvent.ended(audio)
    expect(screen.getByText("已结束")).toBeInTheDocument()
    expect(screen.getByText("0:12 / 0:12")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "重新播放" }))
    expect(audio.currentTime).toBe(0)
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })

  it("reports playback failures", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(new Error(" denied "))
    render(<VoicePlayer src="/missing.mp3" title="设计摘要" />)
    await userEvent.click(screen.getByRole("button", { name: "播放" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("无法播放这段音频")
    expect(screen.getByText("播放失败")).toBeInTheDocument()
  })

  it("formats durations safely", () => {
    expect(formatTime(65)).toBe("1:05")
    expect(formatTime(Number.NaN)).toBe("0:00")
    expect(formatTime(-1)).toBe("0:00")
  })
})
