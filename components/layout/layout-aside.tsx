import React, { useEffect, useState } from 'react'
import { useSpring, useSpringRef, useChain, animated, config } from '@react-spring/web'
import useMeasure from 'react-use-measure'
import { StyledAside } from './styles'

import cx from 'clsx'

const MinWidth = 300

type LayoutAsideProps = {
  children?: React.ReactNode
  open?: boolean
  className?: string
  style?: React.CSSProperties
}

export const LayoutAside = (props: LayoutAsideProps) => {
  const [w, setW] = useState<number>()
  /**
   * Spring animate ref
   */
  const opacityRef = useSpringRef()
  const opacityStyle = useSpring({
    opacity: props.open ? 1 : 0,
    config: config.default,
    ref: opacityRef,
  })
  const widthRef = useSpringRef()
  const widthStyle = useSpring({
    width: props.open ? w : 0,
    config: config.default,
    ref: widthRef,
  })
  const [contentRef, { width }, forceUpdate] = useMeasure()
  useEffect(() => {
    if (!contentRef || !width) {
      return
    }
    forceUpdate()
    setW(Math.max(width, MinWidth))
  }, [forceUpdate, width, contentRef])
  useChain(props.open ? [widthRef, opacityRef] : [opacityRef, widthRef], [0, 0.2])
  return (
    <StyledAside style={props.style} className={cx('mayumi-layout-aside', props.className)}>
      <animated.div className="mayumi-aside-inner" style={widthStyle}>
        <animated.div className="mayumi-aside-content" style={opacityStyle} ref={contentRef}>
          {props.children}
        </animated.div>
      </animated.div>
    </StyledAside>
  )
}
