# 待实现组件

以下组件已全部完成，按 Checklist、WakeSlider、TimeScrubber、NumberStepper、LineChart、VoicePlayer 的顺序逐项实现并验证。

| 组件 | 参考 | 实现重点 |
| --- | --- | --- |
| Checklist | [Bencho Checklist](https://bencho.dev/blocks/checklist) | 勾选填充、对勾绘制、文字划线与列表收合反馈；保留键盘操作和清晰的项目状态 |
| WakeSlider | [Bencho Wake Slider](https://bencho.dev/blocks/wake-slider) | 条形刻度、1:1 拖动、根据拖动路径与速度产生尾随反馈 |
| TimeScrubber | [Bencho Time Scrubber](https://bencho.dev/blocks/time-scrubber) | 时间刻度拖动、释放速度接续、惯性落点预测与步长吸附；支持触控板和键盘 |
| NumberStepper | [Bencho Rolling Counter](https://bencho.dev/blocks/rolling-counter) | 加减按钮、长按加速、按位滚动与进位；支持可选拖动及 `min` / `max` / `step` |
| LineChart | Mayumi 原生设计 | SVG 折线、面积渐变、网格与标签；支持指针和键盘读数及隐藏数据表 |
| VoicePlayer | [OpenCode Mobile](https://opencode.ai/zh/mobile) | Canvas 点阵声波、Web Audio 实时采样、播放/暂停、进度拖动与本地语音 Demo |

统一要求：按 Mayumi 的组件 API、设计 tokens 和 spring 规范实现，覆盖双主题、ARIA、键盘操作与 reduced-motion；参考交互模型，不直接照搬整个组件文件。

流程要求：每个组件完成实现后，先使用本地 `.agents/skills/review-animations` 技能 review 并处理发现的问题，完成验证后再交给用户检查；随后才实现下一个组件。
