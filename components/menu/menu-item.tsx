import React, { useCallback } from 'react'
import cx from 'clsx'

import type { CSS } from '@/theme/config'

import { useMenu } from './menu-context'
import { StyledMenuItem } from './styles'
import { ClickParams } from './types'

export type MenuItemProps = Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> & {
  onClick?: (params: ClickParams) => void
  itemKey?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  selected?: boolean
  css?: CSS
}

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  ({ itemKey, onClick, ...props }: MenuItemProps, ref) => {
    const { selectedKeys, handleSelect } = useMenu()
    const selected =
      'selected' in props ? props.selected : selectedKeys?.includes(itemKey as string)
    const handleClick = useCallback(
      (e) => {
        if (itemKey) {
          handleSelect?.({ domEvent: e, itemKey })
        }
        onClick?.({ domEvent: e, itemKey })
        e.stopPropagation()
      },
      [itemKey, handleSelect, onClick],
    )
    return (
      <StyledMenuItem
        ref={ref}
        aria-selected={selected}
        {...props}
        onClick={handleClick}
        className={cx(
          'mayumi-menu-item',
          { 'mayumi-menu-item__selected': selected },
          props.className,
        )}
      >
        {props.children}
      </StyledMenuItem>
    )
  },
)

MenuItem.displayName = 'MenuItem'
