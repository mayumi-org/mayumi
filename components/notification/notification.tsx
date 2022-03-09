import React, { useState, useMemo, MouseEvent } from 'react'
import { animated, useTransition } from '@react-spring/web'
import cx from 'clsx'
import { createPortal } from 'react-dom'

import { Description } from '@/description'
import { Close } from '@/icons/close'
import { StyledNotification } from './styles'

let id = 0
interface MessageHubProps {
  config?: {
    tension: number
    friction: number
    precision: number
  }
  className?: string
  timeout?: number
  limit?: number
  forwardAPI?: (add: AddFunction) => void
}

interface Item {
  key?: number | string
  title: React.ReactNode
  description?: React.ReactNode
  btn?: React.ReactNode
}

type AddFunction = (msg: Item) => void
type CancelFunction = (key: string) => void

let add: AddFunction
const cancelMap = new Map()

export const info: AddFunction = (msg: Item) => {
  add(msg)
  return () => {
    cancelMap.get(msg.key)?.()
  }
}

export const cancel: CancelFunction = (key: string) => {
  cancelMap.get(key)?.()
}

export function Notification({
  config = { tension: 125, friction: 20, precision: 0.1 },
  // inf will never close
  timeout = Infinity,
  ...props
}: MessageHubProps) {
  const refMap = useMemo(() => new WeakMap(), [])
  const [items, setItems] = useState<Item[]>([])

  add = (msg: Item) => {
    id += 1
    setItems((state) => {
      if (props.limit) {
        return [...state, { ...msg, key: msg.key || id }].slice(0, props.limit)
      }
      return [...state, { ...msg, key: msg.key || id }]
    })
  }

  const transitions = useTransition(items, {
    from: { opacity: 0, height: 0, life: '100%' },
    keys: (item) => item.key!,
    enter: (item) => async (next, cancel) => {
      cancelMap.set(item.key, cancel)
      await next({ opacity: 1, height: refMap.get(item).offsetHeight })
      await next({ life: '0%' })
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    onRest: (_result, _ctrl, item) => {
      setItems((state) =>
        state.filter((i) => {
          return i.key !== item.key
        }),
      )
    },
    config: (_item, _index, phase) => (key) =>
      phase === 'enter' && key === 'life' ? { duration: timeout } : config,
  })

  if (typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <StyledNotification className={cx('mayumi-notification', props.className)}>
      {transitions(({ ...style }, item) => (
        <animated.div className="mayumi-notification-message" style={style as any}>
          <div
            className="mayumi-notification-content"
            ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
          >
            <Description size="md" title={item.title}>
              {item.description}
            </Description>
            {item.btn && <div className="mayumi-notification-operation">{item.btn}</div>}
          </div>
          <Close
            css={{
              position: 'absolute',
              top: '$1_5',
              right: '$2',
            }}
            light={false}
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              if (cancelMap.has(item.key)) {
                cancelMap.get(item.key)()
              }
            }}
          />
        </animated.div>
      ))}
    </StyledNotification>,
    document.body,
  )
}
