import React, { useMemo, useRef, useState, useCallback, useImperativeHandle } from 'react'
import keyby from 'lodash.keyby'
import cx from 'clsx'

import { useMenu } from '@/menu/menu-context'
import { ChevronRight } from '@/icons/chevron-right'
import { ClickParams } from '@/menu/types'
import type { CSS } from '@/theme/config'

import { StyledDropdownCollapsedMenu, StyledDropdownMenu, StyledDropdownMenuItem } from './styles'
import { useDropdown } from './dropdown-context'
import { MenuProps } from '@/menu'

type DropdownMenuProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  children?: React.ReactNode
  className?: string
  css?: CSS
  ghost?: MenuProps['ghost']
}

export const DropdownMenu = (props: DropdownMenuProps) => {
  const { mode, switchKey } = useDropdown()
  const groups: Record<string, React.ReactNode> = useMemo(() => {
    return mode === 'switch' ? keyby(React.Children.toArray(props.children), 'props.itemKey') : {}
  }, [mode, props.children])
  if (mode === 'switch') {
    return (
      <StyledDropdownMenu
        {...props}
        css={props.css}
        className={cx('mayumi-dropdown-menu', props.className)}
        size="sm"
        ghost={props.ghost}
      >
        {groups[switchKey!]}
      </StyledDropdownMenu>
    )
  }
  return (
    <StyledDropdownMenu
      {...props}
      ghost={props.ghost}
      css={props.css}
      className={cx('mayumi-dropdown-menu', props.className)}
    >
      {props.children}
    </StyledDropdownMenu>
  )
}

type CollapsedMenuProps = {
  children?: React.ReactNode
  content?: React.ReactNode
  visible?: boolean
  css?: CSS
}

const DropdownCollapsedMenu = (props: CollapsedMenuProps) => {
  const { glassmorphism, collapsedTrigger } = useDropdown()
  return (
    <StyledDropdownCollapsedMenu
      trigger={collapsedTrigger}
      visible={props.visible}
      content={props.content}
      placement="right-start"
      animation="opacity"
      className="mayumi-dropdown-collapsed-menu"
      offset={[-5, 10]}
      glassmorphism={glassmorphism}
      css={props.css}
      outsideCloseable={false}
    >
      <div className="mayumi-dropdown-collapsed-menu-inner">
        {props.children}
        <ChevronRight />
      </div>
    </StyledDropdownCollapsedMenu>
  )
}

type DropdownMenuItemProps = {
  children?: React.ReactNode
  collapsedMenu?: React.ReactNode
  itemKey?: string
  onClick?: (params: ClickParams) => void
  selected?: boolean
  className?: string
}

export const DropdownMenuItem = React.forwardRef<HTMLLIElement, DropdownMenuItemProps>(
  ({ collapsedMenu, onClick, ...props }, ref: React.Ref<HTMLLIElement | null>) => {
    const [selected, setSelected] = useState(false)
    const { onChangeVisible, onChangeCollapsedVisible, mode, collapsedTrigger } = useDropdown()
    const { subMenuPopupVisible, handleSubMenuPopupVisible } = useMenu()
    const itemRef = useRef<HTMLLIElement>(null)
    const controlledSelected = 'selected' in props ? props.selected : selected
    useImperativeHandle(ref, () => itemRef.current)
    const handleCollapsedVisibleChange = useCallback(
      (params: ClickParams) => {
        onClick?.(params)
        setSelected((prev) => !prev)
        params.domEvent.stopPropagation()
        /**
         * In Switch mode, collapsed menu is not allowed
         */
        if (mode === 'switch') {
          return false
        }
        /**
         * Disable on hover trigger
         */
        if (collapsedTrigger !== 'click') {
          return false
        }
        /**
         * Not collapsed menu, click menu item will hidden dropdown popup
         */
        if (!collapsedMenu) {
          onChangeVisible?.(false)
          return false
        }
        handleSubMenuPopupVisible?.((prev) => !prev)
        onChangeCollapsedVisible?.((prev) => !prev)
        return false
      },
      [
        mode,
        onClick,
        collapsedMenu,
        onChangeCollapsedVisible,
        collapsedTrigger,
        onChangeVisible,
        handleSubMenuPopupVisible,
      ],
    )

    /**
     * Control original submenu popup visible
     */
    const handleCollapsedVisibleChangeByMouse = useCallback(
      (visible: boolean) => {
        /**
         * In Switch mode, collapsed menu is not allowed
         */
        if (mode === 'switch') {
          return
        }
        /**
         * Disable on click trigger
         */
        if (collapsedTrigger !== 'hover' || !collapsedMenu) {
          return
        }
        onChangeCollapsedVisible?.(visible)
        handleSubMenuPopupVisible?.(visible)
      },
      [mode, collapsedMenu, onChangeCollapsedVisible, collapsedTrigger, handleSubMenuPopupVisible],
    )

    return (
      <StyledDropdownMenuItem
        ref={itemRef}
        selected={controlledSelected}
        {...props}
        onClick={handleCollapsedVisibleChange}
        onMouseEnter={() => handleCollapsedVisibleChangeByMouse(true)}
        onMouseLeave={() => handleCollapsedVisibleChangeByMouse(false)}
        className={cx('mayumi-dropdown-menu-item', props.className)}
      >
        {collapsedMenu ? (
          <DropdownCollapsedMenu key="drop" visible={subMenuPopupVisible} content={collapsedMenu}>
            {props.children}
          </DropdownCollapsedMenu>
        ) : (
          props.children
        )}
      </StyledDropdownMenuItem>
    )
  },
)

DropdownMenuItem.displayName = 'DropdownMenuItem'
