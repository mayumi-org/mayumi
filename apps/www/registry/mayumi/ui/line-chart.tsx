"use client"

import { motion, useReducedMotion } from "motion/react"
import { useId, useState } from "react"

import { springs } from "@/registry/mayumi/lib/motion"
import { cn } from "@/registry/mayumi/lib/utils"

const WIDTH = 640
const GRID_COUNT = 4

type LineChartDatum = {
  label: string
  value: number
}

type LineChartWindow = {
  label: string
  hint?: string
  data: LineChartDatum[]
}

type LineChartProps = Omit<React.ComponentProps<"div">, "children" | "onChange"> & {
  data: LineChartDatum[]
  height?: number
  showArea?: boolean
  showGrid?: boolean
  showLabels?: boolean
  smooth?: boolean
  includeZero?: boolean
  formatValue?: (value: number) => string
  windows?: LineChartWindow[]
}

type Coordinate = { x: number; y: number }

function defaultFormat(value: number) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function makeCurve(coordinates: Coordinate[], smooth: boolean) {
  if (coordinates.length === 1) {
    return { line: `M${coordinates[0].x},${coordinates[0].y}`, at: () => coordinates[0] }
  }

  const segments = coordinates.slice(0, -1).map((p1, index) => {
    const p0 = coordinates[index - 1] ?? p1
    const p2 = coordinates[index + 1]
    const p3 = coordinates[index + 2] ?? p2
    return {
      p1,
      p2,
      c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
    }
  })

  let line = `M${coordinates[0].x.toFixed(2)},${coordinates[0].y.toFixed(2)}`
  for (const segment of segments) {
    line += smooth
      ? ` C${segment.c1.x.toFixed(2)},${segment.c1.y.toFixed(2)} ${segment.c2.x.toFixed(2)},${segment.c2.y.toFixed(2)} ${segment.p2.x.toFixed(2)},${segment.p2.y.toFixed(2)}`
      : ` L${segment.p2.x.toFixed(2)},${segment.p2.y.toFixed(2)}`
  }

  function at(u: number) {
    const index = Math.min(segments.length - 1, Math.max(0, Math.floor(u)))
    const segment = segments[index]
    const t = clamp(u - index, 0, 1)
    const m = 1 - t
    if (!smooth) {
      return {
        x: m * segment.p1.x + t * segment.p2.x,
        y: m * segment.p1.y + t * segment.p2.y,
      }
    }
    return {
      x:
        m ** 3 * segment.p1.x +
        3 * m * m * t * segment.c1.x +
        3 * m * t * t * segment.c2.x +
        t ** 3 * segment.p2.x,
      y:
        m ** 3 * segment.p1.y +
        3 * m * m * t * segment.c1.y +
        3 * m * t * t * segment.c2.y +
        t ** 3 * segment.p2.y,
    }
  }

  return { line, at }
}

function LineChart({
  data,
  height = 200,
  showArea = true,
  showGrid = true,
  showLabels = true,
  smooth = false,
  includeZero = true,
  formatValue = defaultFormat,
  windows = [],
  className,
  "aria-label": ariaLabel = "折线图",
  ...props
}: LineChartProps) {
  const gradientId = useId()
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [focused, setFocused] = useState(false)
  const [windowIndex, setWindowIndex] = useState(0)
  const [windowInstant, setWindowInstant] = useState(false)
  const selectedWindow = Math.min(windowIndex, Math.max(0, windows.length - 1))
  const points = (windows[selectedWindow]?.data ?? data).filter((point) =>
    Number.isFinite(point.value)
  )
  const chartHeight = Math.min(400, Math.max(120, Math.round(height)))
  const margin = { top: 16, right: 16, bottom: 32, left: 44 }
  const innerWidth = WIDTH - margin.left - margin.right
  const innerHeight = chartHeight - margin.top - margin.bottom

  if (points.length === 0) {
    return (
      <div
        {...props}
        data-slot="line-chart-empty"
        className={cn(
          "flex w-full items-center justify-center rounded-card border border-dashed border-border text-ui text-fg-tertiary",
          className
        )}
        style={{ height: chartHeight }}
      >
        暂无数据
      </div>
    )
  }

  const values = points.map((point) => point.value)
  const min = includeZero ? Math.min(0, ...values) : Math.min(...values)
  const max = includeZero ? Math.max(0, ...values) : Math.max(...values)
  const range = max - min || 1
  const coordinates = points.map((point, index) => ({
    x:
      points.length === 1
        ? margin.left + innerWidth / 2
        : margin.left + (index / (points.length - 1)) * innerWidth,
    y: margin.top + ((max - point.value) / range) * innerHeight,
  }))
  const curve = makeCurve(coordinates, smooth)
  const baseline = margin.top + ((max - clamp(0, min, max)) / range) * innerHeight
  const area = `${curve.line} L${coordinates.at(-1)!.x.toFixed(2)},${baseline.toFixed(2)} L${coordinates[0].x.toFixed(2)},${baseline.toFixed(2)} Z`
  const labelStep = Math.max(1, Math.ceil(points.length / 6))
  const selectedIndex = activeIndex === null ? null : clamp(activeIndex, 0, points.length - 1)
  const activePoint = selectedIndex === null ? null : points[Math.round(selectedIndex)]
  const activeCoordinate = selectedIndex === null ? null : curve.at(selectedIndex)
  const activeValue =
    selectedIndex === null
      ? null
      : (() => {
          const low = Math.floor(selectedIndex)
          const high = Math.ceil(selectedIndex)
          return points[low].value + (points[high].value - points[low].value) * (selectedIndex - low)
        })()
  const shownValue = activeValue ?? points.at(-1)!.value
  const change = shownValue - points[0].value
  const percent = points[0].value === 0 ? 0 : (change / points[0].value) * 100
  const formattedValue = formatValue(shownValue)
  const decimalAt = formattedValue.lastIndexOf(".")

  function inspect(clientX: number, element: SVGSVGElement) {
    const rect = element.getBoundingClientRect()
    if (!rect.width) return
    const x = ((clientX - rect.left) / rect.width) * WIDTH
    const index = clamp((x - margin.left) / innerWidth, 0, 1) * (points.length - 1)
    setActiveIndex(index)
  }

  return (
    <div
      {...props}
      role="group"
      aria-label={ariaLabel}
      tabIndex={0}
      data-slot="line-chart"
      className={cn(
        "relative w-full rounded-card text-accent outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        windows.length > 0 && "border border-border bg-surface p-4",
        className
      )}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false)
        setActiveIndex(null)
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0
        if (direction) {
          event.preventDefault()
          setActiveIndex((current) =>
            clamp((current ?? (direction > 0 ? -1 : points.length)) + direction, 0, points.length - 1)
          )
        } else if (event.key === "Home") {
          event.preventDefault()
          setActiveIndex(0)
        } else if (event.key === "End") {
          event.preventDefault()
          setActiveIndex(points.length - 1)
        } else if (event.key === "Escape") {
          setActiveIndex(null)
        }
      }}
    >
      {windows.length > 0 ? (
        <div className="mb-3 text-fg">
          <div className="text-3xl font-medium tracking-tight tabular-nums">
            {decimalAt > 0 ? (
              <>
                {formattedValue.slice(0, decimalAt)}
                <span className="text-[0.6em] text-fg-tertiary">
                  {formattedValue.slice(decimalAt)}
                </span>
              </>
            ) : (
              formattedValue
            )}
          </div>
          <div className={cn("mt-1 text-xs", change >= 0 ? "text-success" : "text-danger")}>
            {change >= 0 ? "+" : "−"}
            {formatValue(Math.abs(change))} · {Math.abs(percent).toFixed(1)}%{" "}
            <span className="ml-1 text-fg-tertiary">
              {activePoint?.label ?? windows[selectedWindow]?.hint ?? "当前"}
            </span>
          </div>
        </div>
      ) : null}
      <svg
        viewBox={`0 0 ${WIDTH} ${chartHeight}`}
        className="block h-auto w-full touch-pan-y"
        data-slot="line-chart-svg"
        aria-hidden="true"
        onPointerMove={(event) => inspect(event.clientX, event.currentTarget)}
        onPointerDown={(event) => inspect(event.clientX, event.currentTarget)}
        onPointerLeave={() => {
          if (!focused) setActiveIndex(null)
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {showGrid
          ? Array.from({ length: GRID_COUNT + 1 }, (_, index) => {
              const value = max - (index / GRID_COUNT) * range
              const y = margin.top + (index / GRID_COUNT) * innerHeight
              return (
                <g key={index} data-slot="line-chart-grid-line">
                  <line
                    x1={margin.left}
                    x2={WIDTH - margin.right}
                    y1={y}
                    y2={y}
                    className="stroke-border"
                    strokeDasharray={index === GRID_COUNT ? undefined : "3 5"}
                  />
                  {showLabels ? (
                    <text
                      x={margin.left - 10}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-fg-tertiary text-[10px] tabular-nums"
                    >
                      {formatValue(value)}
                    </text>
                  ) : null}
                </g>
              )
            })
          : null}
        {showArea ? <path d={area} fill={`url(#${gradientId})`} data-slot="line-chart-area" /> : null}
        <path
          d={curve.line}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          data-slot="line-chart-line"
        />
        {showLabels
          ? points.map((point, index) =>
              index === 0 || index === points.length - 1 || index % labelStep === 0 ? (
                <text
                  key={`${point.label}-${index}`}
                  x={coordinates[index].x}
                  y={chartHeight - 8}
                  textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
                  className="fill-fg-tertiary text-[10px]"
                >
                  {point.label}
                </text>
              ) : null
            )
          : null}
        {points.length === 1 ? (
          <circle
            cx={coordinates[0].x}
            cy={coordinates[0].y}
            r={4.5}
            fill="currentColor"
            data-slot="line-chart-single-point"
          />
        ) : null}
        {activeCoordinate ? (
          <g data-slot="line-chart-indicator">
            <line
              x1={activeCoordinate.x}
              x2={activeCoordinate.x}
              y1={margin.top}
              y2={margin.top + innerHeight}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeDasharray="3 3"
            />
            <circle
              cx={activeCoordinate.x}
              cy={activeCoordinate.y}
              r={4.5}
              className="fill-surface stroke-[2.5]"
              stroke="currentColor"
            />
          </g>
        ) : null}
      </svg>
      {activePoint && activeCoordinate && activeValue !== null ? (
        <div
          aria-hidden="true"
          data-slot="line-chart-tooltip"
          className="pointer-events-none absolute z-10 rounded-control border border-border bg-surface px-2.5 py-1.5 text-xs whitespace-nowrap text-fg shadow-md"
          style={{
            left: `${(clamp(activeCoordinate.x, 64, WIDTH - 64) / WIDTH) * 100}%`,
            top: `${(activeCoordinate.y / chartHeight) * 100}%`,
            transform:
              activeCoordinate.y < 48
                ? "translate(-50%, 12px)"
                : "translate(-50%, calc(-100% - 12px))",
          }}
        >
          <span className="text-fg-secondary">{activePoint.label}</span>
          <span className="ml-2 font-medium tabular-nums">{formatValue(activeValue)}</span>
        </div>
      ) : null}
      {windows.length ? (
        <div role="group" aria-label="时间范围" className="relative mt-3 flex rounded-control bg-surface-2 p-0.5">
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{ transform: `translateX(${selectedWindow * 100}%)` }}
            transition={windowInstant || reduceMotion ? { duration: 0 } : springs.snappy}
            className="absolute inset-y-0.5 left-0.5 rounded-control bg-surface shadow-sm"
            style={{ width: `calc((100% - 4px) / ${windows.length})` }}
          />
          {windows.map((window, index) => (
            <button
              key={window.label}
              type="button"
              aria-pressed={selectedWindow === index}
              data-slot="line-chart-window"
              className={cn(
                "relative z-10 h-6 flex-1 rounded-control text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                selectedWindow === index ? "text-fg" : "text-fg-tertiary"
              )}
              onClick={(event) => {
                setWindowInstant(event.detail === 0)
                setWindowIndex(index)
                setActiveIndex(null)
              }}
            >
              {window.label}
            </button>
          ))}
        </div>
      ) : null}
      <span aria-live="polite" className="sr-only">
        {focused && activePoint && activeValue !== null
          ? `${activePoint.label}，${formatValue(activeValue)}`
          : ""}
      </span>
      <table className="sr-only">
        <caption>{ariaLabel}数据</caption>
        <thead>
          <tr>
            <th scope="col">项目</th>
            <th scope="col">数值</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point, index) => (
            <tr key={`${point.label}-${index}`}>
              <th scope="row">{point.label}</th>
              <td>{formatValue(point.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { LineChart }
export type { LineChartDatum, LineChartProps, LineChartWindow }
