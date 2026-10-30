import type { Meta, StoryObj } from "@storybook/react-vite"
import { LineChart } from "./line-chart"

const data = [
  { label: "周一", value: 32 },
  { label: "周二", value: 46 },
  { label: "周三", value: 38 },
  { label: "周四", value: 61 },
  { label: "周五", value: 54 },
  { label: "周六", value: 78 },
  { label: "周日", value: 70 },
]

const meta: Meta<typeof LineChart> = {
  title: "ui/LineChart",
  component: LineChart,
}
export default meta

export const Default: StoryObj<typeof LineChart> = {
  render: () => (
    <div className="w-full max-w-lg p-6">
      <LineChart aria-label="每周访问量" data={data} />
    </div>
  ),
}

export const WithoutArea: StoryObj<typeof LineChart> = {
  render: () => (
    <div className="w-full max-w-lg p-6">
      <LineChart aria-label="每周访问量" data={data} showArea={false} />
    </div>
  ),
}


export const ContinuousWindows: StoryObj<typeof LineChart> = {
  render: () => (
    <div className="w-full max-w-md p-6">
      <LineChart
        aria-label="资产走势"
        data={data}
        height={130}
        smooth
        includeZero={false}
        showArea={false}
        showGrid={false}
        showLabels={false}
        windows={[
          { label: "1H", data: data.slice(-4) },
          { label: "1D", data },
        ]}
      />
    </div>
  ),
}
