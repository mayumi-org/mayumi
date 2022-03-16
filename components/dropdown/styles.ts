import { styled } from '@/theme/config'
import { Tooltip } from '@/tooltip'
import { Menu } from '@/menu/menu'
import { MenuItem } from '@/menu/menu-item'

export const StyledDropdownCollapsedMenu = styled(Tooltip, {
  w: '$full',
  '& .mayumi-dropdown-collapsed-menu-inner': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    w: '$full',
  },
})

export const StyledDropdownMenu = styled(Menu, {
  p: '$0',
  '& .mayumi-icon': {
    '--ggs': 0.75,
    color: '$highlightColor',
  },
})

export const StyledDropdownMenuItem = styled(MenuItem, {
  minWidth: '$32',
})
