import { styled, globalCss } from 'mayumi/theme'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import useMeasure from 'react-use-measure'
import mobile from 'is-mobile'

const CursorFollower = styled(animated.div, {
  $$size: '14px',
  $$sizeOuter: '32px',
  height: '$$sizeOuter',
  width: '$$sizeOuter',
  position: 'fixed',
  left: 0,
  pointerEvents: 'none',
  mixBlendMode: 'difference',
  top: 0,
  zIndex: 9999,
  cursor: 'none',
  '.outer': {
    mixBlendMode: 'difference',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    borderColor: 'transparent',
    rounded: '$full',
    borderWidth: '1px',
    height: '$$size',
    width: '$$size',
    willChange: 'transform',
    transition: 'border-color .1s ease-in-out, width .22s ease-in-out, height .22s ease-in-out',
  },

  '.inner': {
    background: '$white',
    rounded: '$full',
    mixBlendMode: 'difference',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    height: '$$size',
    width: '$$size',
    transition: 'all .1s ease-in-out',
    border: '1px solid transparent',
  },

  variants: {
    type: {
      pointer: {
        '.outer': {
          borderColor: '$white',
          height: '$$sizeOuter',
          width: '$$sizeOuter',
        },
      },
      text: {
        '.inner': {
          width: '4px',
          borderRadius: '1px',
          height: '26px',
        },
      },
      grab: {
        '.inner': {
          borderWidth: '2px',
          background: 'transparent',
          borderColor: '$white',
        },
      },
      grabbing: {
        '.inner': {
          borderWidth: '4px',
          background: 'transparent',
          borderColor: '$white',
        },
      },
    },
  },
})

const globalStyles = globalCss({
  '*, :active, :focus': {
    outline: 'none',
    cursor: 'none',
  },
  '::selection': {
    backgroundColor: '$white',
    color: '$black',
    '-webkit-text-fill-color': '$black',
  },
})

type CursorType = 'pointer' | 'text' | 'grab' | 'grabbing' | undefined

const classNames = ['outer', 'inner']

const CursorContext = React.createContext<
  { setType: React.Dispatch<React.SetStateAction<CursorType>> } | undefined
>(undefined)

const trans = (x: number, y: number) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

export const Cursor = ({ children }: { children?: React.ReactNode }) => {
  const [type, setType] = useState<CursorType>()
  const [isMobile, setIsMobile] = useState<boolean>()
  const isCursorInit = useRef<boolean>(false)

  const [trail, api] = useSpring(() => ({
    xy: [0, 0],
    opacity: 0,
  }))
  const [ref, { left, top }] = useMeasure()

  useEffect(() => {
    globalStyles()
    setIsMobile(mobile())
  }, [])

  useEffect(() => {
    if (!ref) return

    function handleMouseMove(e: MouseEvent) {
      if (isCursorInit.current) {
        api.start({ xy: [e.clientX - left, e.clientY - top], opacity: 1 })
      } else {
        api.start({
          xy: [e.clientX, e.clientY],
          opacity: 1,
          immediate: true,
        })
      }
      isCursorInit.current = true
      if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
        if (e.target.dataset.cursor) {
          setType(e.target.dataset.cursor as any)
          return
        }
        if (e.target.closest('button') || e.target.closest('a')) {
          setType('pointer')
          return
        } else if (
          e.target.closest('p') ||
          e.target.closest('span') ||
          e.target.closest('h1') ||
          e.target.closest('h2') ||
          e.target.closest('h3') ||
          e.target.closest('h4') ||
          e.target.closest('h5') ||
          e.target.closest('h5') ||
          e.target.closest('input') ||
          e.target.closest('textarea')
        ) {
          setType('text')
          return
        }
      }
      setType(undefined)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  return (
    <>
      {isMobile === false && (
        <CursorFollower
          ref={ref}
          type={type}
          style={{ transform: trail.xy.to(trans), opacity: trail.opacity }}
        >
          {classNames.map((props, index) => (
            <div key={index} className={classNames[index]} />
          ))}
        </CursorFollower>
      )}
      <CursorContext.Provider value={{ setType }}>{children}</CursorContext.Provider>
    </>
  )
}
