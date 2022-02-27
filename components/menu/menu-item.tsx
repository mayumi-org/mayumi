import React, { useCallback } from 'react'
import cx from 'clsx'

import { useMenu } from './menu-context'
import { StyledMenuItem } from './styles'

export type MenuItemProps = Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> & {
  onClick?: (e: any, itemKey?: string) => void
  itemKey?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  selected?: boolean
}

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  ({ itemKey, onClick, ...props }: MenuItemProps, ref) => {
    const { selectedKeys, handleSelect } = useMenu()
    const selected =
      'selected' in props ? props.selected : selectedKeys?.includes(itemKey as string)
    const handleClick = useCallback(
      (e) => {
        if (itemKey) {
          handleSelect?.(itemKey)
        }
        onClick?.(e, itemKey)
      },
      [itemKey, handleSelect, onClick],
    )
    return (
      <StyledMenuItem
        ref={ref}
        selected={selected}
        aria-selected={selected}
        {...props}
        onClick={handleClick}
        className={cx('mayumi-menu-item', props.className)}
      >
        {props.children}
      </StyledMenuItem>
    )
  },
)

MenuItem.displayName = 'MenuItem'
