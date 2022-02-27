import React, { useCallback } from 'react'
import { Transition } from '@react-spring/web'
import cx from 'clsx'

// import { useDropdown } from '@components/dropdown/dropdown-context'
import { useMenu } from './menu-context'
import { StyledMenuItem } from './styles'

export type MenuItemProps = Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> & {
  onClick?: (e: any, itemKey?: string) => void
  itemKey?: string
  action?: 'remove' | 'insert'
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  type?: 'default' | 'action'
  selected?: boolean
}

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  ({ itemKey, onClick, ...props }: MenuItemProps, ref) => {
    const { selectedKeys, handleSelect, size } = useMenu()
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
    const hasAction = 'action' in props
    return (
      <Transition
        items={hasAction ? props.action : 'insert'}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
        // FIXME: height 100% has runtime error
        // from={{ height: 0, opacity: 0 }}
        // enter={{ height: '100%', opacity: 1 }}
        // leave={{ height: 0, opacity: 0 }}
        delay={200}
        // TODO: typo
        // initial={(!hasAction ? 'enter' : 'from') as any}
      >
        {(styles, item) =>
          item && (
            <StyledMenuItem
              ref={ref}
              selected={selected}
              aria-selected={selected}
              {...props}
              onClick={handleClick}
              style={styles}
              size={size}
              className={cx('mayumi-menu-item', props.className)}
            >
              {props.children}
            </StyledMenuItem>
          )
        }
      </Transition>
    )
  },
)

MenuItem.displayName = 'MenuItem'
