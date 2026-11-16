"use client"

import { LineChart } from "@/registry/mayumi/ui/line-chart"

const data = [
  { label: "09:00", value: 57630.15 },
  { label: "09:45", value: 57740.67 },
  { label: "10:30", value: 57881.9 },
  { label: "11:15", value: 57824.68 },
  { label: "12:00", value: 58078.61 },
  { label: "12:45", value: 58156.95 },
  { label: "13:30", value: 58180.3 },
  { label: "14:15", value: 58518.55 },
  { label: "15:00", value: 58354.12 },
  { label: "15:45", value: 58573.06 },
  { label: "16:30", value: 58647.64 },
  { label: "17:15", value: 58834.75 },
]

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const windows = [
  { label: "1H", hint: "最近一小时", data: data.slice(-5) },
  { label: "4H", hint: "最近四小时", data: data.slice(-8) },
  { label: "1D", hint: "今天", data },
]

export function LineChartDemo() {
  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <div>
        <h2 className="text-ui font-medium text-fg">资产走势</h2>
        <p className="mt-1 text-xs text-fg-tertiary">
          横向移动查看连续读数，切换时间范围观察不同窗口。
        </p>
      </div>
      <LineChart
        aria-label="资产走势"
        data={data}
        height={130}
        smooth
        includeZero={false}
        showArea={false}
        showGrid={false}
        showLabels={false}
        windows={windows}
        formatValue={(value) => money.format(value)}
      />
    </div>
  )
}
