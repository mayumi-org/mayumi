import React from 'react'
import { SubTrigger, SubContent, Trigger, Content, Item } from '@radix-ui/react-menubar'
import type {
  MenubarProps,
  MenubarTriggerProps,
  MenubarContentProps,
  MenubarSubContentProps,
  MenuSubTriggerProps,
  MenuItemProps,
} from '@radix-ui/react-menubar'
import cx from 'clsx'

import { menubar, StyledMenuBarRoot } from './styles'
import { CSS } from '@/theme'
import { MenubarContext, useMenubarContext, MenubarContextProps } from './menu-context'

export const MenuBarRoot = React.forwardRef<
  HTMLDivElement,
  MenubarProps & { css?: CSS } & MenubarContextProps
>(({ children, className, color, glass, bordered, ...props }, ref) => {
  return (
    <MenubarContext.Provider value={{ color, glass, bordered }}>
      <StyledMenuBarRoot
        {...props}
        ref={ref}
        className={cx('mayumi-menubar-root', menubar({ className }).base())}
      >
        {children}
      </StyledMenuBarRoot>
    </MenubarContext.Provider>
  )
})

MenuBarRoot.displayName = 'MenuBarRoot'

export const MenuBarTriger = ({ children, className, ...props }: MenubarTriggerProps) => {
  return (
    <Trigger {...props} className={cx('mayumi-menubar-trigger', menubar({ className }).trigger())}>
      {children}
    </Trigger>
  )
}

export const MenuBarSubTriger = React.forwardRef<HTMLDivElement, MenuSubTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { color } = useMenubarContext()
    return (
      <SubTrigger
        {...props}
        ref={ref}
        className={cx('mayumi-menubar-subtrigger', menubar({ className, color }).subtrigger())}
      >
        {children}
      </SubTrigger>
    )
  },
)

MenuBarSubTriger.displayName = 'MenuBarSubTriger'

export const MenuBarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  ({ children, className, ...props }, ref) => {
    const { color, glass, bordered } = useMenubarContext()
    return (
      <Content
        align="start"
        sideOffset={5}
        alignOffset={-3}
        {...props}
        ref={ref}
        className={cx(
          'mayumi-menubar-content',
          menubar({ className, color, glass, bordered }).content(),
        )}
      >
        {children}
      </Content>
    )
  },
)

MenuBarContent.displayName = 'MenuBarContent'

export const MenuBarSubContent = React.forwardRef<HTMLDivElement, MenubarSubContentProps>(
  ({ children, className, ...props }, ref) => {
    const { color, glass, bordered } = useMenubarContext()
    return (
      <SubContent
        alignOffset={-5}
        {...props}
        ref={ref}
        className={cx(
          'mayumi-menubar-subcontent',
          menubar({ className, color, glass, bordered }).subcontent(),
        )}
      >
        {children}
      </SubContent>
    )
  },
)

MenuBarSubContent.displayName = 'MenuBarSubContent'

export const MenuBarItem = ({ children, className, ...props }: MenuItemProps) => {
  const { color } = useMenubarContext()
  return (
    <Item {...props} className={cx('mayumi-menubar-item', menubar({ className, color }).item())}>
      {children}
    </Item>
  )
}

export const MenuBarItemRightSlot = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cx('mayumi-menubar-item-right-slot', menubar({ className }).itemRightSlot())}
    >
      {children}
    </div>
  )
}
