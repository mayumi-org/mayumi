import { styled } from '@/theme/config'
import { Icon } from './icon'

export const ChevronRight = styled(Icon, {
  boxSizing: 'border-box',
  position: 'relative',
  display: 'block',
  transform: 'scale(var(--ggs, 1))',
  w: '$5_5',
  h: '$5_5',
  border: '$space$0_5 solid transparent',
  borderRadius: '100px',
  '&::after': {
    content: '',
    display: 'block',
    boxSizing: 'border-box',
    position: 'absolute',
    w: '$2_5',
    h: '$2_5',
    borderBottom: '$space$0_5 solid',
    borderRight: '$space$0_5 solid',
    transform: 'rotate(-45deg)',
    right: '$1_5',
    top: '$1',
  },
})
