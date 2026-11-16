import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Airplay,
  Ellipsis,
  ListMusic,
  MessageSquareQuote,
  Music,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  X,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import { springs } from "@/registry/mayumi/lib/motion"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { GroupedListItem } from "./grouped-list"
import { ScrollArea } from "./scroll-area"
import { Slider } from "./slider"
import { TitleBar } from "./titlebar"
import { Window, WindowBody } from "./window"

const meta: Meta = { title: "demo/MusicPlayer" }
export default meta

type Track = {
  title: string
  artist: string
  /** 时长（秒） */
  duration: number
  cover: string
}

const OPENING_TRACK: Track = {
  title: "Give A Little",
  artist: "Maggie Rogers - Heard It In A Past Life",
  duration: 227,
  cover: "https://picsum.photos/seed/give-a-little/640/640",
}

const UP_NEXT: Track[] = [
  {
    title: "Too Good at Goodbyes",
    artist: "Sam Smith - The Thrill of It All",
    duration: 201,
    cover: "https://picsum.photos/seed/too-good/96/96",
  },
  {
    title: "Blue",
    artist: "Kamal. - Single",
    duration: 185,
    cover: "https://picsum.photos/seed/blue-kamal/96/96",
  },
  {
    title: "You Say",
    artist: "Lauren Daigle - Look Up Child",
    duration: 275,
    cover: "https://picsum.photos/seed/you-say/96/96",
  },
  {
    title: "Bad Liar",
    artist: "Imagine Dragons - Origins",
    duration: 260,
    cover: "https://picsum.photos/seed/bad-liar/96/96",
  },
  {
    title: "Lost in Japan",
    artist: "Shawn Mendes - Shawn Mendes",
    duration: 201,
    cover: "https://picsum.photos/seed/lost-in-japan/96/96",
  },
]

const TRACKS = [OPENING_TRACK, ...UP_NEXT]

/* 设计稿里滑杆的填充与拨钮都是白色，覆写默认的 accent 填充 */
const WHITE_SLIDER =
  "[&_[data-slot=slider-indicator]]:bg-fg [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:shadow-none"

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/* Slider 的 onValueChange 类型是 number | readonly number[]，本 demo 只用单值 */
function singleValue(value: number | readonly number[]) {
  return typeof value === "number" ? value : (value[0] ?? 0)
}

function PlayerWindow({ showVolume = false }: { showVolume?: boolean }) {
  const [trackIndex, setTrackIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [playing, setPlaying] = useState(true)
  const [elapsed, setElapsed] = useState(115)
  const [volume, setVolume] = useState(37)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const reduceMotion = useReducedMotion()

  const track = TRACKS[trackIndex]

  /* dir 记录在队列里的移动方向：下一首/点队列 = 1（新封面从右进），上一首 = -1 */
  function playTrack(index: number, dir: 1 | -1) {
    setDirection(dir)
    setTrackIndex(index)
    setElapsed(0)
    setPlaying(true)
  }

  const artworkVariants = {
    enter: (dir: 1 | -1) =>
      reduceMotion ? { opacity: 0 } : { opacity: 1, x: `${dir * 100}%` },
    center: { opacity: 1, x: 0 },
    exit: (dir: 1 | -1) =>
      reduceMotion ? { opacity: 0 } : { opacity: 1, x: `${dir * -100}%` },
  }

  return (
    <Window vibrancy className="h-[680px] w-[340px] flex-col">
      <TitleBar className="h-11">
        <button
          type="button"
          aria-label="关闭"
          className="app-region-no-drag absolute left-3 flex size-5 items-center justify-center rounded-full bg-fill text-fg-secondary outline-none transition-colors duration-150 ease-out hover:bg-fill-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <X aria-hidden="true" className="size-3" strokeWidth={2.5} />
        </button>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-ui font-medium text-fg">
          <Music aria-hidden="true" className="size-3 text-fg-secondary" />
          Playing Now…
        </span>
      </TitleBar>

      <WindowBody className="flex-col">
        <div className="shrink-0 px-3 pt-1">
          {/* iOS Music 的封面"呼吸"：暂停时缩小，播放时回弹 */}
          <motion.div
            animate={{ scale: !reduceMotion && !playing ? 0.94 : 1 }}
            transition={springs.smooth}
            className="rounded-card shadow-(--shadow-raised)"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-card bg-surface-2">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={track.title}
                  src={track.cover}
                  alt={`${track.title} 专辑封面`}
                  custom={direction}
                  variants={artworkVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={springs.snappy}
                  className="absolute inset-0 size-full object-cover"
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {showVolume ? (
          <div className="mt-3 flex shrink-0 items-center gap-2 border-y border-border bg-fill px-3 py-2.5">
            <Volume1 aria-hidden="true" className="size-3.5 shrink-0 text-fg-secondary" />
            <Slider
              aria-label="音量"
              value={volume}
              onValueChange={(value) => setVolume(singleValue(value))}
              className={WHITE_SLIDER}
            />
            <Volume2 aria-hidden="true" className="size-3.5 shrink-0 text-fg-secondary" />
            <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs font-medium tabular-nums text-fg">
              {Math.round(volume)}%
            </span>
          </div>
        ) : null}

        <div className="flex shrink-0 items-center gap-2 px-3 pt-3">
          <Volume2 aria-hidden="true" className="size-4 shrink-0 text-fg-secondary" />
          <div className="min-w-0 flex-1 text-center">
            {/* 切歌时标题轻微淡入上移，掩盖文字瞬变 */}
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springs.gentle}
              className="min-w-0"
            >
              <p className="truncate text-[15px] font-semibold text-fg">{track.title}</p>
              <p className="truncate text-xs text-fg-tertiary">{track.artist}</p>
            </motion.div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="更多操作"
              className="h-auto border-transparent bg-transparent px-1.5 py-1 text-fg-secondary shadow-none hover:bg-fill-hover hover:text-fg"
            >
              <Ellipsis aria-hidden="true" className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem>添加到资料库</DropdownMenuItem>
              <DropdownMenuItem>添加到播放列表</DropdownMenuItem>
              <DropdownMenuItem>分享歌曲…</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex shrink-0 items-center justify-between px-8 pt-3">
          <Button
            variant="ghost"
            size="icon-md"
            aria-label="随机播放"
            aria-pressed={shuffle}
            onClick={() => setShuffle((on) => !on)}
            className={shuffle ? "text-accent" : "text-fg-tertiary"}
          >
            <Shuffle aria-hidden="true" className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="上一首"
            onClick={() =>
              playTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length, -1)
            }
            className="text-fg"
          >
            <SkipBack aria-hidden="true" className="size-6" fill="currentColor" />
          </Button>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={playing ? "暂停" : "播放"}
            onClick={() => setPlaying((on) => !on)}
            className="text-fg"
          >
            {playing ? (
              <Pause aria-hidden="true" className="size-7" fill="currentColor" />
            ) : (
              <Play aria-hidden="true" className="size-7" fill="currentColor" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="下一首"
            onClick={() => playTrack((trackIndex + 1) % TRACKS.length, 1)}
            className="text-fg"
          >
            <SkipForward aria-hidden="true" className="size-6" fill="currentColor" />
          </Button>
          <Button
            variant="ghost"
            size="icon-md"
            aria-label="重复播放"
            aria-pressed={repeat}
            onClick={() => setRepeat((on) => !on)}
            className={repeat ? "text-accent" : "text-fg-tertiary"}
          >
            <Repeat aria-hidden="true" className="size-4" />
          </Button>
        </div>

        <div className="flex shrink-0 items-center gap-2 px-3 pt-2">
          <span className="w-8 text-right text-xs tabular-nums text-fg-secondary">
            {formatTime(elapsed)}
          </span>
          <Slider
            aria-label="播放进度"
            min={0}
            max={track.duration}
            value={elapsed}
            onValueChange={(value) => setElapsed(singleValue(value))}
            className={`${WHITE_SLIDER} [&_[data-slot=slider-thumb]]:h-3.5 [&_[data-slot=slider-thumb]]:w-1.5`}
          />
          <span className="w-8 text-xs tabular-nums text-fg-secondary">
            -{formatTime(track.duration - elapsed)}
          </span>
        </div>

        <div className="flex shrink-0 gap-2 px-3 pt-3">
          <Button variant="secondary" aria-label="隔空播放" className="h-10 flex-1 rounded-card px-0">
            <Airplay aria-hidden="true" className="size-4" />
          </Button>
          <Button variant="secondary" aria-label="歌词" className="h-10 flex-1 rounded-card px-0">
            <MessageSquareQuote aria-hidden="true" className="size-4" />
          </Button>
          <Button variant="secondary" aria-label="待播列表" className="h-10 flex-1 rounded-card px-0">
            <ListMusic aria-hidden="true" className="size-4" />
          </Button>
        </div>

        <div className="mt-3 min-h-0 flex-1 border-t border-border">
          <ScrollArea className="h-full">
            <div className="[&>*+*]:border-t [&>*+*]:border-border">
              {UP_NEXT.map((item, index) => (
                <GroupedListItem
                  key={item.title}
                  onClick={() => playTrack(index + 1, 1)}
                  icon={
                    <img
                      src={item.cover}
                      alt=""
                      className="size-9 rounded-icon object-cover"
                    />
                  }
                  label={<span className="font-medium">{item.title}</span>}
                  description={item.artist}
                  className="px-3"
                  value={
                    <span className="flex flex-col items-end gap-1.5">
                      <Ellipsis aria-hidden="true" className="size-4 text-fg-tertiary" />
                      <span className="text-xs tabular-nums text-fg-secondary">
                        {formatTime(item.duration)}
                      </span>
                    </span>
                  }
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </WindowBody>
    </Window>
  )
}

function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,#24344d_0%,#131c2e_45%,#090d18_100%)] p-8">
      {children}
    </div>
  )
}

export const PlayingNow: StoryObj = {
  render: () => (
    <Desktop>
      <PlayerWindow />
    </Desktop>
  ),
}

export const VolumeControl: StoryObj = {
  render: () => (
    <Desktop>
      <PlayerWindow showVolume />
    </Desktop>
  ),
}
