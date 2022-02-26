import React from 'react'
import cx from 'clsx'

import { StyledDescription } from './styles'

export type DescriptionProps = {
  title: React.ReactNode
  children: React.ReactNode
  className?: string
  /**
   * Description size
   * @default `sm`
   */
  size?: 'md' | 'sm'
}

export const Description = React.forwardRef<HTMLDListElement, DescriptionProps>((props, ref) => {
  return (
    <StyledDescription
      ref={ref}
      size={props.size}
      className={cx('mayumi-description', props.className)}
    >
      <dt className="mayumi-description-title">{props.title}</dt>
      <dd className="mayumi-description-content">{props.children}</dd>
    </StyledDescription>
  )
})

Description.displayName = 'Description'
