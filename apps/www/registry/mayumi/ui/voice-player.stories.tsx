import type { Meta, StoryObj } from "@storybook/react-vite"
import { VoicePlayer, VoiceWaveform } from "./voice-player"

const meta: Meta<typeof VoicePlayer> = {
  title: "ui/VoicePlayer",
  component: VoicePlayer,
}
export default meta

export const Default: StoryObj<typeof VoicePlayer> = {
  render: () => (
    <div className="w-full max-w-lg p-6">
      <VoicePlayer
        src="/audio/voice-player-demo.wav"
        duration={12.28}
        title="Mayumi 语音播放器"
        description="点击播放，点阵声波会跟随真实音频变化。"
      />
    </div>
  ),
}

export const StaticWaveform: StoryObj = {
  render: () => (
    <div className="w-full max-w-lg rounded-card border border-border bg-surface p-6">
      <VoiceWaveform levels={[0.08, 0.16, 0.4, 0.72, 0.38, 0.18, 0.08]} />
    </div>
  ),
}

export const ActiveWaveform: StoryObj = {
  render: () => (
    <div className="w-full max-w-lg rounded-card border border-border bg-surface p-6">
      <VoiceWaveform
        active
        levels={[0.08, 0.16, 0.4, 0.72, 0.38, 0.18, 0.08]}
      />
    </div>
  ),
}
