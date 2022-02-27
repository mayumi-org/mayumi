import React, { useMemo, useRef, useState } from 'react'
import keyby from 'lodash.keyby'
import cx from 'clsx'

import { useMenu } from '@/menu/menu-context'
import { ChevronRight } from '@/icons/chevron-right'

import { StyledDropdownCollapsedMenu, StyledDropdownMenu, StyledDropdownMenuItem } from './styles'
import { useDropdown } from './dropdown-context'
import { useOnClickOutside } from '../hooks'

type DropdownMenuProps = {
  children?: React.ReactNode
  className?: string
}

export const DropdownMenu = (props: DropdownMenuProps) => {
  const { mode, switchKey } = useDropdown()
  const groups: Record<string, React.ReactNode> = useMemo(() => {
    return mode === 'switch' ? keyby(React.Children.toArray(props.children), 'props.itemKey') : {}
  }, [mode, props.children])
  if (mode === 'switch') {
    return (
      <StyledDropdownMenu className={cx('mayumi-dropdown-menu', props.className)} size="sm">
        {groups[switchKey!]}
      </StyledDropdownMenu>
    )
  }
  return (
    <StyledDropdownMenu className={cx('mayumi-dropdown-menu', props.className)}>
      {props.children}
    </StyledDropdownMenu>
  )
}

type CollapsedMenuProps = {
  children?: React.ReactNode
  content?: React.ReactNode
  visible?: boolean
}

const DropdownCollapsedMenu = (props: CollapsedMenuProps) => {
  const { glassmorphism } = useDropdown()
  return (
    <StyledDropdownCollapsedMenu
      trigger="hover"
      visible={props.visible}
      content={props.content}
      placement="right-start"
      animation="opacity"
      className="mayumi-dropdown-collapsed-menu"
      offset={[-5, 10]}
      glassmorphism={glassmorphism}
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
  onClick?: (params: { itemKey?: React.Key }) => void
  selected?: boolean
  className?: string
}

export const DropdownMenuItem = ({ collapsedMenu, onClick, ...props }: DropdownMenuItemProps) => {
  const [selected, setSelected] = useState(false)
  const { onChangeVisible, collapsedVisible, onChangeCollapsedVisible, mode } = useDropdown()
  const { subMenuPopupVisible, handleSubMenuPopupVisible } = useMenu()
  const itemRef = useRef<HTMLLIElement>(null)
  const controlledSelected = 'selected' in props ? props.selected : selected
  useOnClickOutside(
    itemRef,
    () => {
      handleSubMenuPopupVisible?.(false)
    },
    { disable: false, includes: [] },
  )
  const handleClickItem = () => {
    onClick?.({ itemKey: props.itemKey })
    if (mode === 'switch') {
      return
    }
    if (collapsedVisible && !collapsedMenu) {
      onChangeCollapsedVisible(false)
    }
    if (!collapsedVisible && collapsedMenu) {
      onChangeCollapsedVisible(true)
    }
    if (!collapsedMenu) {
      onChangeVisible(false)
    }
  }

  /**
   * Control original submenu popup visible, only control by mouse hover event
   * because of dropdown collapsed menu trigger is `hover`
   */
  const handleEnterItem = () => {
    setSelected(true)
    if (collapsedMenu) {
      handleSubMenuPopupVisible?.(true)
    }
  }
  const handleLeaveItem = () => {
    setSelected(false)
    handleSubMenuPopupVisible?.(false)
  }
  return (
    <StyledDropdownMenuItem
      ref={itemRef}
      selected={controlledSelected}
      {...props}
      onClick={handleClickItem}
      onMouseEnter={handleEnterItem}
      onMouseLeave={handleLeaveItem}
      className={cx('mayumi-dropdown-menu-item', props.className)}
    >
      {collapsedMenu ? (
        <DropdownCollapsedMenu
          key="drop"
          visible={collapsedVisible === false ? false : subMenuPopupVisible}
          content={collapsedMenu}
        >
          {props.children}
        </DropdownCollapsedMenu>
      ) : (
        props.children
      )}
    </StyledDropdownMenuItem>
  )
}
