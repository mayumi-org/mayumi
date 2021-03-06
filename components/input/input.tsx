import React, { useMemo, useState, useRef, useImperativeHandle } from 'react'
import { animated, useSpring } from '@react-spring/web'
import cx from 'clsx'

import { useOnClickOutside } from '@/hooks'
import { StyledInput } from './styles'
import type { CSS } from '@/theme/config'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  style?: React.CSSProperties
  className?: string
  placeholder?: string
  /**
   * Prefix input icon
   */
  prefix?: React.ReactNode
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
  defaultValue?: string
  css?: CSS
  /**
   * Disable default focus effect and outline
   * @default false
   */
  ghost?: boolean
}

const springConfig = { mass: 1, tension: 210, friction: 26, precision: 0.01, velocity: 0 }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { style, className, prefix, ghost = false, ...props },
    ref: React.Ref<HTMLInputElement | null>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [focus, setFocus] = useState(false)
    const [selfValue, setSelfValue] = useState(props.defaultValue)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelfValue(e.target.value)
      props?.onChange?.(e)
    }
    const isControlled = 'value' in props
    const controlledValue = useMemo(() => {
      return isControlled ? props.value : selfValue
    }, [isControlled, selfValue, props.value])
    // forward <input />.ref to ref, instead of <StyledInput />.ref
    useImperativeHandle(ref, () => inputRef.current)
    const styles = useSpring({
      transform: focus ? 'scale(1, 1)' : 'scale(1.2, 1.5)',
      duration: 50,
      config: springConfig,
    })
    useOnClickOutside(inputRef, () => setFocus(false))
    return (
      <StyledInput
        focus={focus}
        style={style}
        className={cx('mayumi-input', className)}
        css={props.css}
        ghost={ghost}
      >
        {prefix && <span className="mayumi-input-icon">{prefix}</span>}
        {!ghost && <animated.div className="mayumi-input-effect" style={styles as any} />}
        <input
          {...props}
          value={controlledValue}
          onFocus={() => {
            setFocus(true)
          }}
          ref={inputRef}
          onChange={handleChange}
        />
      </StyledInput>
    )
  },
)

Input.displayName = 'input'
