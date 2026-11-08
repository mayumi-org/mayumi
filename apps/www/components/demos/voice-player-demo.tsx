"use client"

import { VoicePlayer } from "@/registry/mayumi/ui/voice-player"

export function VoicePlayerDemo() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-5">
      <div>
        <h2 className="text-ui font-medium text-fg">语音摘要</h2>
        <p className="mt-1 text-xs text-fg-tertiary">
          播放一段本地语音，点阵声波会跟随真实音频变化。
        </p>
      </div>
      <VoicePlayer
        src="/audio/voice-player-demo.wav"
        duration={12.28}
        title="Mayumi 语音播放器"
        description="点击播放，随时暂停，或拖动进度继续收听。"
      />
    </div>
  )
}
