import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Code,
  Ellipsis,
  FileText,
  HardDrive,
  Italic,
  Minus,
  Nfc,
  ScanFace,
  Search,
  Settings,
  SquareDashed,
  Strikethrough,
  Underline,
  Upload,
  UserRoundCheck,
  Users,
  Video,
  Wallet,
  X,
  Zap,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { springs } from "@/registry/mayumi/lib/motion"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Bento, BentoCell } from "./bento"
import { Tabs, TabsList, TabsTab } from "./tabs"

const meta: Meta = { title: "demo/Bento" }
export default meta

const PEOPLE = [
  { dept: "Finance", name: "Maximilian Thompson" },
  { dept: "Product", name: "Emma Williams" },
  { dept: "Sales", name: "Benjamin Scott" },
  { dept: "People", name: "Zoe Mitchell" },
  { dept: "Legal", name: "Samuel Reed" },
  { dept: "Marketing", name: "Lily Turner" },
]

const FEATURES = [
  {
    icon: SquareDashed,
    title: "Expand at your pace.",
    body: "Start with one floor or exec group and expand. Every card moved to a phone is one less to clone or replace.",
  },
  {
    icon: UserRoundCheck,
    title: "Identity integrated.",
    body: "Access follows the employee record — issued before day one, revoked as offboarding starts.",
  },
  {
    icon: Wallet,
    title: "Upgrade your keys.",
    body: "Mobile is additive, not a rip-and-replace. Keep your access control system — move the keys to the phone.",
  },
  {
    icon: ScanFace,
    title: "Biometrics on device.",
    body: "Face ID unlocks the credential, so there's no biometric database to own, defend or manage.",
  },
]

const GLYPHS = "abcdefghjkmnpqrstuvwxyz23456789#%&*+<>/="

function randomCode(length: number) {
  let out = ""
  for (let i = 0; i < length; i++) {
    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  }
  return out
}

/** 格子里不断「解码」刷新的乱码串，纯装饰，对读屏隐藏 */
function ScrambleText({
  length = 10,
  interval = 2000,
  className,
}: {
  length?: number
  interval?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const [text, setText] = useState(() => randomCode(length))

  useEffect(() => {
    if (reduceMotion) return
    let id: ReturnType<typeof setInterval> | undefined
    // 各实例错开节拍，格子才不会同步闪
    const start = setTimeout(() => {
      setText(randomCode(length))
      id = setInterval(() => setText(randomCode(length)), interval)
    }, Math.random() * interval)
    return () => {
      clearTimeout(start)
      if (id) clearInterval(id)
    }
  }, [length, interval, reduceMotion])

  return (
    <motion.span
      aria-hidden="true"
      key={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {text}
    </motion.span>
  )
}

/** 工卡中央的建筑线稿 */
function BuildingArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 44h80M14 44V18l14-8 14 8v26M42 44V10h40v34" />
      <path d="M20 24h4m-4 6h4m-4 6h4m4-12h4m-4 6h4m-4 6h4m18-24h4m-4 6h4m-4 6h4m-4 6h4m4-18h4m-4 6h4m-4 6h4m-4 6h4m4-18h4m-4 6h4m-4 6h4m-4 6h4m4-18h4m-4 6h4m-4 6h4m-4 6h4" />
    </svg>
  )
}

function IdBadge({ dept, name }: { dept: string; name: string }) {
  return (
    <div className="flex aspect-[8/5] w-full max-w-[240px] flex-col justify-between rounded-xl border border-white/15 bg-[linear-gradient(140deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_55%,rgba(255,255,255,0.09))] p-3 shadow-(--shadow-raised)">
      <div className="flex items-start justify-between text-white/80">
        <SquareDashed aria-hidden="true" className="size-4" />
        <Nfc aria-hidden="true" className="size-4" />
      </div>
      <BuildingArt className="mx-auto h-12 text-white/35" />
      <div>
        <p className="text-[10px] tracking-wide text-white/55 uppercase">{dept}</p>
        <p className="text-xs font-semibold text-white">{name}</p>
      </div>
    </div>
  )
}

/** 中央 2×2 格：工卡在员工间轮播 */
function CyclingBadge() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PEOPLE.length), 2200)
    return () => clearInterval(id)
  }, [])

  const person = PEOPLE[index]

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={person.name}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
        transition={springs.snappy}
        className="flex w-full justify-center"
      >
        <IdBadge {...person} />
      </motion.div>
    </AnimatePresence>
  )
}

function ScrambleCell({ length, className }: { length?: number; className?: string }) {
  return (
    <BentoCell className={`flex items-center justify-center p-3 ${className ?? ""}`}>
      <ScrambleText
        length={length}
        className="font-mono text-[11px] tracking-wider text-fg-tertiary/70"
      />
    </BentoCell>
  )
}

function IconCell({ icon: Icon, className }: { icon: typeof Nfc; className?: string }) {
  return (
    <BentoCell className={`flex items-center justify-center p-3 ${className ?? ""}`}>
      <Icon aria-hidden="true" className="size-5 text-fg-tertiary" />
    </BentoCell>
  )
}

export const CorporateId: StoryObj = {
  render: () => (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
        <h1 className="text-center text-4xl leading-tight font-semibold text-fg">
          Your corporate ID,
          <br />
          <span className="text-fg-tertiary">wherever you go.</span>
        </h1>

        <Tabs defaultValue="corporate">
          <TabsList className="justify-center border-b-0">
            <TabsTab value="corporate">Corporate ID</TabsTab>
            <TabsTab value="multifamily">Multifamily</TabsTab>
            <TabsTab value="hospitality">Hospitality</TabsTab>
          </TabsList>
        </Tabs>

        <Bento divided className="w-full grid-cols-4 auto-rows-[100px] rounded-2xl">
          <IconCell icon={SquareDashed} />
          <ScrambleCell length={12} />
          <ScrambleCell length={9} className="opacity-60" />
          <ScrambleCell length={11} />

          <IconCell icon={Nfc} />
          <BentoCell className="col-span-2 row-span-2 flex items-center justify-center p-4">
            <CyclingBadge />
          </BentoCell>
          <ScrambleCell length={10} />

          <IconCell icon={Wallet} />
          <IconCell icon={Nfc} />

          <ScrambleCell length={8} />
          <ScrambleCell length={12} />
          <ScrambleCell length={9} className="opacity-60" />
          <IconCell icon={Wallet} />
        </Bento>

        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-8 pt-4 sm:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon aria-hidden="true" className="size-4 text-fg-secondary" />
              <p className="mt-2 text-ui leading-relaxed">
                <span className="font-semibold text-fg">{title}</span>{" "}
                <span className="text-fg-secondary">{body}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

/* ------------------------------------------------------------------------
 * 第二张参考图：浅色 fintech 营销页的瓷砖式 Bento（留缝模式，跨度 3/3/3 + 2/4）
 * --------------------------------------------------------------------- */

const INTEGRATIONS = [
  { name: "Tatsua", time: "6:38 pm, 10 Oct 2025", avatar: "https://i.pravatar.cc/64?img=12" },
  { name: "Mariana", time: "7:15 pm, 10 Oct 2025", avatar: "https://i.pravatar.cc/64?img=32" },
  { name: "Hayato", time: "8:00 pm, 10 Oct 2025", avatar: "https://i.pravatar.cc/64?img=56" },
]

function IntegrationsTile() {
  return (
    <BentoCell className="col-span-2 flex h-[340px] flex-col overflow-hidden rounded-3xl p-5">
      <p className="text-lg font-semibold text-fg">Pre-built integrations</p>
      <p className="mt-1 text-ui text-fg-secondary">
        Integrate your ecommerce platform with our plugins.
      </p>
      <div className="relative mt-4 flex-1">
        <div className="absolute inset-x-0 top-0 rounded-2xl border border-border bg-background p-3 shadow-(--shadow-raised)">
          <div className="flex justify-end pb-1">
            <button
              type="button"
              className="inline-flex h-6 items-center gap-1 rounded-full bg-[#22c55e] px-2.5 text-xs font-medium text-white"
            >
              <Zap aria-hidden="true" className="size-3" fill="currentColor" />
              Connect
            </button>
          </div>
          {INTEGRATIONS.map((person) => (
            <div
              key={person.name}
              className="flex items-center gap-2.5 border-t border-border py-2.5 first:border-t-0"
            >
              <Avatar size="sm">
                <AvatarImage src={person.avatar} alt="" />
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-ui font-medium text-fg">{person.name}</p>
                <p className="truncate text-xs text-fg-tertiary">{person.time}</p>
              </div>
              <span className="text-xs font-medium text-[#16a34a]">Connect</span>
            </div>
          ))}
        </div>
        {/* 底部渐隐，列表被瓷砖裁掉一截的观感 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,transparent,var(--surface))]" />
      </div>
    </BentoCell>
  )
}

const INSIGHT_BARS = [10, 16, 12, 22, 18, 28]

function InsightsTile() {
  return (
    <BentoCell className="col-span-2 flex h-[340px] flex-col overflow-hidden rounded-3xl p-5">
      <p className="text-lg font-semibold text-fg">Payments, insights, cash.</p>
      <p className="mt-1 text-ui text-fg-secondary">
        Manage payments and insights with your dashboard.
      </p>
      <div className="relative flex-1">
        <div className="absolute top-6 left-1/2 w-[280px] -translate-x-1/2 rotate-[-4deg] rounded-2xl border border-border bg-background p-4 shadow-(--shadow-raised)">
          <div className="flex items-center justify-between">
            <Search aria-hidden="true" className="size-3.5 text-fg-tertiary" />
            <span className="text-ui font-medium text-fg">Insights</span>
            <span className="w-3.5" />
          </div>
          <p className="mt-4 text-xl font-semibold text-fg">Past month insights</p>
          <p className="mt-4 text-xs text-fg-tertiary">Average income activity</p>
          <p className="text-lg font-semibold text-[#16a34a]">$8.6</p>
          <div className="mt-2 flex h-14 items-end gap-1.5">
            {INSIGHT_BARS.map((height, i) => (
              <div
                key={i}
                className="w-full rounded-full bg-[#22c55e]/25 last:bg-[#22c55e]/60"
                style={{ height }}
              />
            ))}
          </div>
        </div>
      </div>
    </BentoCell>
  )
}

const SUPPORT_AVATARS = [
  { src: "https://i.pravatar.cc/64?img=5", className: "top-6 right-16" },
  { src: "https://i.pravatar.cc/64?img=15", className: "top-16 left-14" },
  { src: "https://i.pravatar.cc/64?img=47", className: "top-24 right-8" },
]

function SupportTile() {
  return (
    <BentoCell className="col-span-2 flex h-[340px] flex-col overflow-hidden rounded-3xl p-5">
      <p className="text-lg font-semibold text-fg">Top-notch support</p>
      <p className="mt-1 text-ui text-fg-secondary">
        Get industry-leading support whenever you need it.
      </p>
      <div className="relative flex-1">
        <div className="absolute top-8 left-1/2 flex size-20 -translate-x-1/2 items-center justify-center rounded-full bg-[linear-gradient(160deg,#4ade80,#16a34a)] text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(34,197,94,0.6)]">
          Credo
        </div>
        {SUPPORT_AVATARS.map(({ src, className }) => (
          <Avatar key={src} className={`absolute ${className}`}>
            <AvatarImage src={src} alt="" />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
        ))}
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background py-1.5 pr-4 pl-1.5 whitespace-nowrap shadow-(--shadow-raised)">
          <Avatar size="sm">
            <AvatarImage src="https://i.pravatar.cc/64?img=25" alt="" />
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-fg">
            Your report is ready for review!
          </span>
        </div>
      </div>
    </BentoCell>
  )
}

function GetPaidTile() {
  return (
    <BentoCell className="col-span-2 flex h-[320px] flex-col rounded-3xl p-5">
      <div className="flex flex-1 flex-col justify-center rounded-2xl bg-[#e9f9ef] px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#22c55e] text-white">
            <Zap aria-hidden="true" className="size-4" fill="currentColor" />
          </span>
          <span className="text-4xl font-medium tracking-tight text-[#15803d]">
            132.567
          </span>
        </div>
        <div className="mt-4 h-1.5 w-3/4 rounded-full bg-white/70">
          <div className="h-full w-1/2 rounded-full bg-[#22c55e]/60" />
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-fg">Get paid online</p>
      <p className="mt-1 text-ui text-fg-secondary">
        Boost sales and revenue with simple online payment options.
      </p>
    </BentoCell>
  )
}

const TEAM_ROWS = [
  { name: "Pixa", members: "3 members", value: "60%", dot: "bg-[#f0abfc]" },
  { name: "Rectang", members: "8 members", value: "30%", dot: "bg-[#bef264]" },
  { name: "Loop", members: "4 members", value: "80%", dot: "bg-[#fdba74]" },
]

function TrackingTile() {
  return (
    <BentoCell className="col-span-4 flex h-[320px] flex-col overflow-hidden rounded-3xl p-5">
      <div className="relative flex-1">
        <div className="absolute top-0 left-1/2 w-[300px] -translate-x-1/3 rotate-[2deg] rounded-[28px] border-6 border-[#101a14] bg-background shadow-xl">
          <div className="flex items-center gap-1 px-4 pt-3">
            <span className="size-1.5 rounded-full bg-border" />
            <span className="size-1.5 rounded-full bg-border" />
            <span className="size-1.5 rounded-full bg-border" />
          </div>
          <div className="flex items-center justify-between px-4 pt-2">
            <p className="text-ui font-semibold text-fg">Team activity</p>
            <span className="flex items-center gap-1 rounded-md bg-fill px-1.5 py-0.5 text-[10px] text-fg-secondary">
              <CalendarDays aria-hidden="true" className="size-3" />
              October 2021
            </span>
            <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-fg-secondary">
              Month
            </span>
          </div>
          <div className="space-y-2.5 px-4 py-3">
            {TEAM_ROWS.map((row) => (
              <div key={row.name} className="flex items-center gap-2.5">
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-fg ${row.dot}`}
                >
                  {row.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-fg">{row.name}</p>
                  <p className="text-[10px] text-fg-tertiary">{row.members}</p>
                </div>
                <span className="text-xs text-fg-secondary">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-24 left-6 rotate-[-3deg] rounded-xl border border-border bg-background px-3 py-2 shadow-(--shadow-raised)">
          <p className="text-[10px] text-fg-tertiary">Invite Roles</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-fg">3,729</span>
            <span className="text-[10px] font-medium text-[#16a34a]">+10%</span>
            <svg
              viewBox="0 0 48 16"
              fill="none"
              stroke="#16a34a"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="h-4 w-10"
            >
              <path d="M1 12 8 8l6 4 8-8 6 3 8-5 6 6 5-3" />
            </svg>
          </div>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-fg">Easy tracking</p>
      <p className="mt-1 text-ui text-fg-secondary">
        Stay updated on every account with real-time alerts and smart automation.
      </p>
    </BentoCell>
  )
}

export const Fintech: StoryObj = {
  globals: { theme: "light" },
  render: () => (
    <div className="min-h-screen px-6 py-16">
      <Bento className="mx-auto max-w-5xl grid-cols-6 gap-4">
        <IntegrationsTile />
        <InsightsTile />
        <SupportTile />
        <GetPaidTile />
        <TrackingTile />
      </Bento>
    </div>
  ),
}

/* ------------------------------------------------------------------------
 * 第三张参考图：浅色 2×2 产品套件 Bento（第一行 2:3、第二行 3:2），
 * 每块瓷砖底部是探出头来、被瓷砖下边裁掉的迷你 App 界面
 * --------------------------------------------------------------------- */

function SuiteChip({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center self-start rounded-full px-2.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  )
}

function SuiteCopy({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <>
      <p className="mt-4 text-[22px] leading-snug font-semibold tracking-tight text-fg">
        {title}
      </p>
      <p className="mt-2 max-w-[36ch] text-ui leading-relaxed text-fg-secondary">
        {description}
      </p>
    </>
  )
}

/* 迷你 App 的公共外壳：从瓷砖底部探出头，下边被裁掉 */
function MockSurface({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`absolute rounded-t-xl border border-b-0 border-border bg-background shadow-(--shadow-raised) ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

function CalendarMock() {
  return (
    <MockSurface className="inset-x-4 top-4 bottom-0 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1 font-medium text-fg">
          <ChevronLeft aria-hidden="true" className="size-3 text-fg-tertiary" />
          Yesterday
        </span>
        <span className="font-medium text-fg-secondary">11:50 AM</span>
        <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1 font-medium text-fg">
          Tomorrow
          <ChevronRight aria-hidden="true" className="size-3 text-fg-tertiary" />
        </span>
      </div>
      <div className="relative mt-3 h-full">
        <div className="w-[62%] rounded-lg border border-[#bbdefb] bg-[#e3f2fd] p-2.5">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#90caf9] text-white">
              <Video aria-hidden="true" className="size-3" />
            </span>
            <div>
              <p className="text-xs font-semibold text-fg">Team Update</p>
              <p className="text-[10px] text-fg-secondary">11:00 AM - 12:00 AM</p>
            </div>
          </div>
        </div>
        <div className="absolute top-16 right-0 w-[58%] rounded-lg border border-[#f8bbd0] bg-[#fce4ec] p-2.5">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#f48fb1] text-white">
              <X aria-hidden="true" className="size-3" />
            </span>
            <div>
              <p className="text-xs font-semibold text-fg">Design help</p>
              <p className="text-[10px] text-fg-secondary">11:45 AM - 12:10 AM</p>
            </div>
          </div>
        </div>
        {/* 当前时刻红线 */}
        <div className="absolute top-[42%] right-0 left-6 border-t border-[#ef5350]">
          <span className="absolute -top-[3px] -left-1 size-1.5 rounded-full bg-[#ef5350]" />
        </div>
      </div>
    </MockSurface>
  )
}

function DriveMock() {
  return (
    <>
      <MockSurface className="inset-x-4 top-4 bottom-0 flex overflow-hidden">
        <div className="flex w-[38%] flex-col gap-0.5 border-r border-border p-2.5">
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="flex size-6 items-center justify-center rounded-md bg-[#26a69a] text-white">
              <HardDrive aria-hidden="true" className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs leading-tight font-semibold text-fg">Drive</p>
              <p className="truncate text-[9px] text-fg-tertiary">johnwork's workspace</p>
            </div>
          </div>
          {[
            { icon: Upload, label: "Upload" },
            { icon: Search, label: "Search" },
            { icon: Settings, label: "Settings" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[11px] text-fg-secondary">
              <Icon aria-hidden="true" className="size-3" />
              {label}
            </span>
          ))}
          <span className="mt-2 flex items-center gap-2 rounded-md bg-fill px-1.5 py-1 text-[11px] font-medium text-fg">
            <HardDrive aria-hidden="true" className="size-3" />
            My Drive
          </span>
          <span className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[11px] text-fg-secondary">
            <Users aria-hidden="true" className="size-3" />
            Shared with me
          </span>
        </div>
        <div className="min-w-0 flex-1 p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-fg">My Drive</p>
            <span className="text-[10px] text-fg-tertiary">Sort by Name ⌄</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["Getting Started", "Project 02", "Project 03"].map((name) => (
              <div key={name} className="rounded-lg border border-border p-1.5">
                <div className="flex h-9 items-center justify-center rounded-md bg-fill">
                  <FileText aria-hidden="true" className="size-3.5 text-fg-tertiary" />
                </div>
                <p className="mt-1 truncate text-[9px] text-fg-secondary">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </MockSurface>
      {/* 浮在右上角的 Import 菜单 */}
      <div className="absolute top-2 right-6 w-40 rounded-xl border border-border bg-background p-1 shadow-(--shadow-overlay)">
        <p className="px-2 pt-1.5 pb-1 text-[10px] font-semibold text-fg">Import</p>
        {[
          { icon: Upload, label: "Upload files" },
          { icon: FileText, label: "Upload folder" },
          { icon: HardDrive, label: "Google Drive" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-2 rounded-md px-2 py-1 text-[10px] text-fg-secondary">
            <Icon aria-hidden="true" className="size-3" />
            {label}
          </span>
        ))}
      </div>
    </>
  )
}

const MAIL_ROWS = [
  { initial: "J", name: "Jones, me (5)", subject: "Startup seeking UI/UX Freelancer", color: "bg-[#ffcdd2]", checked: true, unread: true },
  { initial: "R", name: "Ryan M.", subject: "New project help", color: "bg-[#b2dfdb]", checked: false, unread: false },
  { initial: "M", name: "Max, me (3)", subject: "Team catchup", color: "bg-[#ffe0b2]", checked: true, unread: false },
  { initial: "V", name: "me, Viktoria (4)", subject: "04/01/2024", color: "bg-[#b2ebf2]", checked: true, unread: true },
  { initial: "B", name: "Ben Huffman", subject: "Our commitment to commission-free", color: "bg-[#f8bbd0]", checked: false, unread: true },
]

function MailMock() {
  return (
    <>
      <MockSurface className="top-4 bottom-0 left-4 w-[62%] p-2.5">
        <p className="px-1 pb-2 text-xs font-semibold text-fg">
          ⌄ Inbox <span className="text-[#e53935]">23</span>
        </p>
        {MAIL_ROWS.map((row) => (
          <div key={row.name} className="flex items-center gap-2 border-t border-border py-1.5">
            <span
              className={`flex size-3 items-center justify-center rounded-[3px] border ${
                row.checked ? "border-[#e53935] bg-[#e53935]" : "border-border"
              }`}
            >
              {row.checked ? <span className="text-[8px] text-white">✓</span> : null}
            </span>
            <span className={`flex size-5 items-center justify-center rounded-md text-[9px] font-semibold text-fg ${row.color}`}>
              {row.initial}
            </span>
            <span className="w-20 truncate text-[10px] font-semibold text-fg">{row.name}</span>
            <span className="min-w-0 flex-1 truncate text-[10px] text-fg-secondary">
              <span className="font-medium text-fg">{row.subject}</span>
            </span>
            {row.unread ? <span className="size-1.5 rounded-full bg-[#e53935]" /> : null}
          </div>
        ))}
      </MockSurface>
      {/* 浮在右侧的写信卡 */}
      <MockSurface className="top-16 right-4 bottom-0 w-[52%] p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-fg">New message</p>
          <span className="flex items-center gap-1.5 text-fg-tertiary">
            <Minus aria-hidden="true" className="size-3" />
            <X aria-hidden="true" className="size-3" />
          </span>
        </div>
        <div className="mt-2 space-y-1.5 text-[10px]">
          <p className="text-fg-secondary">From&nbsp;&nbsp;johnwork@mail.com ⌄</p>
          <p className="flex justify-between text-fg-secondary">
            <span>To&nbsp;&nbsp;maxwork@mail.com</span>
            <span className="text-fg-tertiary">BCC</span>
          </p>
          <p className="text-fg-secondary">Cc&nbsp;&nbsp;ryanwork@mail.com</p>
          <p className="pt-1 font-medium text-fg">Team Update</p>
          <p className="text-fg-tertiary">Hi Max,</p>
          <p className="leading-relaxed text-fg-tertiary">
            As we kick off the new year, I wanted to take a moment to provide you
            with some updates and highlights from our team's recent…
          </p>
        </div>
      </MockSurface>
    </>
  )
}

function PagesMock() {
  return (
    <>
      <MockSurface className="inset-x-4 top-4 bottom-0 p-3">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md border border-border">
            <ChevronLeft aria-hidden="true" className="size-3 text-fg-tertiary" />
          </span>
          <p className="text-xs font-semibold text-fg">Team Collaboration and Productivity</p>
        </div>
        <div className="mt-2 flex items-center gap-2.5 rounded-md border border-border px-2 py-1 text-fg-secondary">
          <Bold aria-hidden="true" className="size-3" />
          <Underline aria-hidden="true" className="size-3" />
          <Italic aria-hidden="true" className="size-3" />
          <Strikethrough aria-hidden="true" className="size-3" />
          <Code aria-hidden="true" className="size-3" />
          <span className="h-3 w-px bg-border" />
          <AlignLeft aria-hidden="true" className="size-3" />
          <AlignCenter aria-hidden="true" className="size-3" />
          <AlignRight aria-hidden="true" className="size-3" />
        </div>
        <p className="mt-3 text-sm font-bold text-fg">Team Collaboration and Productivity</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-fg-secondary">
          <span className="bg-[#bbdefb] px-0.5 font-medium text-fg">Introduction</span>
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-fg-tertiary">
          Project Nexus is designed to streamline communication, boost
          collaboration, and drive productivity within your team. With intuitive
          features tailored to your workflow…
        </p>
      </MockSurface>
      {/* 选中文字时浮出的深色小工具条 */}
      <div className="absolute top-[58%] left-1/3 flex items-center gap-2 rounded-md bg-[#1f2933] px-2 py-1 text-[10px] text-white shadow-(--shadow-overlay)">
        Heading 2 ⌄<span className="text-fg-tertiary">●</span>⌄
      </div>
    </>
  )
}

const SUITE_TILES = [
  {
    chip: { label: "Calendar", className: "bg-[#fce4ec] text-[#d81b60]" },
    title: "Your time, your way.",
    description:
      "We offer versatile calendar app crafted to empower you in managing your time.",
    span: "col-span-2",
    mock: <CalendarMock />,
  },
  {
    chip: { label: "Drive", className: "bg-[#e0f2f1] text-[#00897b]" },
    title: "Your secure digital safe.",
    description:
      "Your all-in-one solution for secure data storage and management with military-grade encryption.",
    span: "col-span-3",
    mock: <DriveMock />,
  },
  {
    chip: { label: "Mail", className: "bg-[#eceff1] text-[#546e7a]" },
    title: "Your email experience.",
    description:
      "The ultimate mail app designed to revolutionize the way you manage your email.",
    span: "col-span-3",
    mock: <MailMock />,
  },
  {
    chip: { label: "Pages", className: "bg-[#e3f2fd] text-[#1e88e5]" },
    title: "Your creativity empowered.",
    description:
      "Your go-to app for crafting stunning pages with ease.",
    span: "col-span-2",
    mock: <PagesMock />,
  },
]

export const ProductSuite: StoryObj = {
  globals: { theme: "light" },
  render: () => (
    <div className="min-h-screen px-6 py-16">
      <Bento className="mx-auto max-w-5xl grid-cols-5 gap-4">
        {SUITE_TILES.map((tile) => (
          <BentoCell
            key={tile.title}
            className={`relative flex h-[440px] flex-col overflow-hidden rounded-3xl p-6 ${tile.span}`}
          >
            <SuiteChip label={tile.chip.label} className={tile.chip.className} />
            <SuiteCopy title={tile.title} description={tile.description} />
            <div className="relative mt-4 flex-1">{tile.mock}</div>
          </BentoCell>
        ))}
      </Bento>
    </div>
  ),
}
