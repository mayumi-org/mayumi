import React, { useEffect, useState } from 'react'
import { useSpring, useSpringRef, useChain, animated, config } from '@react-spring/web'
import useMeasure from 'react-use-measure'
import { StyledAside } from './styles'

import cx from 'clsx'

type LayoutAsideProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean
}

export const LayoutAside = ({ children, ...props }: LayoutAsideProps) => {
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
    setW(width)
  }, [forceUpdate, width, contentRef])
  useChain(props.open ? [widthRef, opacityRef] : [opacityRef, widthRef], [0, 0.2])
  return (
    <StyledAside
      {...props}
      style={props.style}
      className={cx('mayumi-layout-aside', props.className)}
    >
      <animated.div className="mayumi-aside-inner" style={widthStyle}>
        <animated.div className="mayumi-aside-content" style={opacityStyle} ref={contentRef}>
          {children}
        </animated.div>
      </animated.div>
    </StyledAside>
  )
}
