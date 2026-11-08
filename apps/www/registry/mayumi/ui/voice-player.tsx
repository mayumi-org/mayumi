"use client"

import { Pause, Play, RotateCcw } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"
import { Button } from "@/registry/mayumi/ui/button"
import { Slider } from "@/registry/mayumi/ui/slider"

const DEFAULT_LEVEL = 0.12

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00"
  const seconds = Math.floor(value)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

type VoiceWaveformProps = Omit<React.ComponentProps<"canvas">, "height" | "width"> & {
  levels?: readonly number[]
  analyser?: AnalyserNode | null
  active?: boolean
  height?: number
}

function VoiceWaveform({
  levels = [],
  analyser = null,
  active = false,
  height = 64,
  className,
  ...props
}: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const levelsRef = useRef(levels)
  const analyserRef = useRef(analyser)
  const activeRef = useRef(active)
  const invalidateRef = useRef<(() => void) | null>(null)
  const reduceMotion = useReducedMotion()
  const canvasHeight = clamp(Math.round(height), 40, 120)

  useEffect(() => {
    levelsRef.current = levels
    invalidateRef.current?.()
  }, [levels])

  useEffect(() => {
    analyserRef.current = analyser
    invalidateRef.current?.()
  }, [analyser])

  useEffect(() => {
    activeRef.current = active
    invalidateRef.current?.()
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    let frame = 0
    let previous = 0
    let time = 0
    let width = 1
    let samples = new Uint8Array(0)
    let sampled = false
    let color = getComputedStyle(canvas).color
    const targets = new Float32Array(96)
    const smoothed = new Float32Array(96)

    function resize() {
      if (!canvas || !context) return
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width || 320)
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.round(width * ratio)
      const nextHeight = Math.round(canvasHeight * ratio)
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      color = getComputedStyle(canvas).color
    }

    function interpolate(values: ArrayLike<number>, position: number) {
      const low = Math.floor(position)
      const high = Math.ceil(position)
      return values[low] + (values[high] - values[low]) * (position - low)
    }

    function levelAt(index: number, columns: number) {
      const currentAnalyser = analyserRef.current
      if (currentAnalyser) {
        if (samples.length !== currentAnalyser.fftSize) {
          samples = new Uint8Array(currentAnalyser.fftSize)
        }
        if (!sampled) {
          currentAnalyser.getByteTimeDomainData(samples)
          sampled = true
        }
        const sample = interpolate(samples, (index / (columns - 1)) * (samples.length - 1))
        return clamp(Math.abs(sample - 128) / 72, 0, 1)
      }
      const currentLevels = levelsRef.current
      if (currentLevels.length === 0) return DEFAULT_LEVEL
      const value = interpolate(
        currentLevels,
        (index / (columns - 1)) * (currentLevels.length - 1)
      )
      return clamp(Number.isFinite(value) ? value : 0, 0, 1)
    }

    function draw(now: number, advance: boolean) {
      if (!context) return
      const elapsed = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60
      previous = now
      if (advance) time += elapsed
      sampled = false

      context.clearRect(0, 0, width, canvasHeight)
      context.fillStyle = color
      context.shadowColor = color
      context.shadowBlur = 4
      const columns = clamp(Math.round(width / 6), 36, 80)
      const rows = 9
      const center = canvasHeight / 2
      const rowGap = canvasHeight / 10

      for (let column = 0; column < columns; column++) {
        targets[column] = levelAt(column, columns)
      }

      for (let column = 0; column < columns; column++) {
        const x = column / (columns - 1)
        const envelope = Math.pow(Math.sin(Math.PI * x), 0.55)
        const previousLevel = targets[Math.max(0, column - 1)]
        const nextLevel = targets[Math.min(columns - 1, column + 1)]
        const target = previousLevel * 0.25 + targets[column] * 0.5 + nextLevel * 0.25
        smoothed[column] += (target - smoothed[column]) * (advance ? 0.2 : 1)
        const energy = 0.32 + smoothed[column] * 0.68
        const amplitude = canvasHeight * 0.46 * envelope * energy
        const primary =
          center +
          (Math.sin(x * Math.PI * 3.1 - time * 2.6) * 0.72 +
            Math.sin(x * Math.PI * 6.4 + time * 1.5) * 0.28) *
            amplitude
        const echo =
          center + Math.sin(x * Math.PI * 3.8 - time * 1.8 + 1.7) * amplitude * 0.86

        for (let row = 0; row < rows; row++) {
          const y = center + (row - (rows - 1) / 2) * rowGap
          const primaryDistance = (y - primary) / (canvasHeight * 0.11)
          const echoDistance = (y - echo) / (canvasHeight * 0.16)
          const primaryLight = Math.exp(-primaryDistance * primaryDistance * 2)
          const echoLight = Math.exp(-echoDistance * echoDistance * 2) * 0.55
          const alpha = clamp(
            0.04 * envelope + (primaryLight + echoLight) * envelope * (0.65 + energy * 0.35),
            0,
            0.96
          )
          if (alpha < 0.02) continue
          context.globalAlpha = alpha
          context.beginPath()
          context.arc(x * width, y, 1 + primaryLight * 0.45, 0, Math.PI * 2)
          context.fill()
        }
      }
      context.globalAlpha = 1
      context.shadowBlur = 0
    }

    function animate(now: number) {
      draw(now, true)
      frame = activeRef.current && !document.hidden ? requestAnimationFrame(animate) : 0
    }

    function invalidate() {
      cancelAnimationFrame(frame)
      frame = 0
      previous = 0
      draw(performance.now(), false)
      if (activeRef.current && !reduceMotion && !document.hidden) {
        frame = requestAnimationFrame(animate)
      }
    }

    invalidateRef.current = invalidate
    const observer = new ResizeObserver(() => {
      resize()
      invalidate()
    })
    observer.observe(canvas)
    const themeObserver = new MutationObserver(() => {
      color = getComputedStyle(canvas).color
      invalidate()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })
    document.addEventListener("visibilitychange", invalidate)
    resize()
    invalidate()

    return () => {
      cancelAnimationFrame(frame)
      invalidateRef.current = null
      observer.disconnect()
      themeObserver.disconnect()
      document.removeEventListener("visibilitychange", invalidate)
    }
  }, [canvasHeight, reduceMotion])

  return (
    <canvas
      {...props}
      ref={canvasRef}
      aria-hidden="true"
      data-slot="voice-waveform"
      className={cn("block w-full text-fg", className)}
      style={{ height: canvasHeight, ...props.style }}
    />
  )
}

type VoicePlayerProps = Omit<React.ComponentProps<"div">, "children"> & {
  src: string
  title: string
  description?: string
  duration?: number
  showProgress?: boolean
}

function VoicePlayerContent({
  src,
  title,
  description,
  duration: durationHint = 0,
  showProgress = true,
  className,
  "aria-label": ariaLabel,
  ...props
}: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(
    !Number.isFinite(durationHint) || durationHint <= 0
  )
  const [ended, setEnded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(
    Number.isFinite(durationHint) ? Math.max(0, durationHint) : 0
  )
  const [error, setError] = useState<string | null>(null)

  const prepareAnalyser = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (contextRef.current && analyserRef.current) {
      void contextRef.current.resume()
      setAnalyser(analyserRef.current)
      return
    }

    const AudioContextConstructor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioContextConstructor) return

    try {
      const context = new AudioContextConstructor()
      const source = context.createMediaElementSource(audio)
      const nextAnalyser = context.createAnalyser()
      nextAnalyser.fftSize = 512
      nextAnalyser.smoothingTimeConstant = 0.72
      source.connect(nextAnalyser)
      nextAnalyser.connect(context.destination)
      contextRef.current = context
      sourceRef.current = source
      analyserRef.current = nextAnalyser
      setAnalyser(nextAnalyser)
      void context.resume()
    } catch {
      setAnalyser(null)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      audio?.pause()
      sourceRef.current?.disconnect()
      analyserRef.current?.disconnect()
      void contextRef.current?.close()
      contextRef.current = null
      sourceRef.current = null
      analyserRef.current = null
    }
  }, [])

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      return
    }

    setError(null)
    if (audio.ended || ended) {
      audio.currentTime = 0
      audio.load()
      setCurrentTime(0)
      setEnded(false)
    }
    prepareAnalyser()
    try {
      await audio.play()
    } catch {
      setPlaying(false)
      setLoading(false)
      setError("无法播放这段音频，请检查音频地址后重试。")
    }
  }

  function updateDuration(audio: HTMLAudioElement) {
    if (Number.isFinite(audio.duration)) setDuration(audio.duration)
  }

  const status = error
    ? "播放失败"
    : loading
      ? "加载中"
      : ended
        ? "已结束"
        : playing
          ? "正在播放"
          : currentTime > 0
            ? "已暂停"
            : "待播放"

  return (
    <div
      {...props}
      role="group"
      aria-label={ariaLabel ?? `${title}语音播放器`}
      data-slot="voice-player"
      className={cn("w-full rounded-card border border-border bg-surface p-4", className)}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        aria-hidden="true"
        onLoadedMetadata={(event) => updateDuration(event.currentTarget)}
        onDurationChange={(event) => updateDuration(event.currentTarget)}
        onCanPlay={(event) => {
          updateDuration(event.currentTarget)
          setLoading(false)
        }}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onPlay={() => {
          setPlaying(true)
          setEnded(false)
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onEnded={(event) => {
          const audio = event.currentTarget
          const finalTime = Number.isFinite(audio.duration) ? audio.duration : audio.currentTime
          setPlaying(false)
          setLoading(false)
          setEnded(true)
          setDuration((current) => current || finalTime)
          setCurrentTime(finalTime)
          setAnalyser(null)
        }}
        onError={() => {
          setPlaying(false)
          setLoading(false)
          setError("无法播放这段音频，请检查音频地址后重试。")
        }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 data-slot="voice-player-title" className="truncate text-ui font-medium text-fg">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-fg-tertiary">{description}</p>
          ) : null}
        </div>
        <span
          data-slot="voice-player-status"
          className="shrink-0 rounded-full bg-fill px-2 py-0.5 text-[11px] text-fg-secondary"
        >
          {status}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          aria-label={ended ? "重新播放" : playing ? "暂停" : "播放"}
          onClick={togglePlayback}
          className="rounded-full"
        >
          {ended ? (
            <RotateCcw aria-hidden="true" />
          ) : playing ? (
            <Pause aria-hidden="true" fill="currentColor" />
          ) : (
            <Play aria-hidden="true" fill="currentColor" />
          )}
        </Button>
        <VoiceWaveform
          active={playing && analyser !== null}
          analyser={analyser}
          className="min-w-0 flex-1"
          height={64}
        />
        <span className="shrink-0 text-right text-xs whitespace-nowrap text-fg-secondary tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      {showProgress ? (
        <Slider
          aria-label="播放进度"
          min={0}
          max={Math.max(duration, 0.1)}
          step={0.1}
          value={clamp(currentTime, 0, Math.max(duration, 0.1))}
          disabled={duration <= 0}
          onValueChange={(value) => {
            const next = typeof value === "number" ? value : (value[0] ?? 0)
            if (audioRef.current) audioRef.current.currentTime = next
            setCurrentTime(next)
            if (next < duration) setEnded(false)
          }}
          className="mt-2 [&_[data-slot=slider-thumb]]:size-3"
        />
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      ) : null}
      <span aria-live="polite" className="sr-only">
        {playing ? `正在播放${title}` : ended ? `${title}播放结束` : ""}
      </span>
    </div>
  )
}

function VoicePlayer(props: VoicePlayerProps) {
  return <VoicePlayerContent key={props.src} {...props} />
}

export { VoicePlayer, VoiceWaveform, formatTime }
export type { VoicePlayerProps, VoiceWaveformProps }
