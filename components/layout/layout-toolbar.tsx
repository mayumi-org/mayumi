import React from 'react'
import * as RadixUIToolBar from '@radix-ui/react-toolbar'
import type { CSS } from '@/theme/config'
import type {
  ToolbarToggleGroupSingleProps,
  ToolbarToggleGroupMultipleProps,
  ToolbarToggleItemProps,
  ToolbarProps,
} from '@radix-ui/react-toolbar'
import cx from 'clsx'
import { toolbar, StyledToolbar } from './styles'

export const Toolbar = ({ className, ...props }: ToolbarProps & { css?: CSS }) => (
  <StyledToolbar className={cx('mayumi-toolbar', className, toolbar().base())} {...props}>
    {props.children}
  </StyledToolbar>
)

export const ToolbarToggleGroup = ({
  className,
  ...props
}: ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps) => (
  <RadixUIToolBar.ToggleGroup className={cx('mayumi-toogle-group', className)} {...props}>
    {props.children}
  </RadixUIToolBar.ToggleGroup>
)

export const ToolbarToggleItem = ({ className, ...props }: ToolbarToggleItemProps) => (
  <RadixUIToolBar.ToggleItem
    className={cx('mayumi-toolbar-toggle-item', className, toolbar().item())}
    {...props}
  >
    {props.children}
  </RadixUIToolBar.ToggleItem>
)
