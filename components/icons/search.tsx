import { styled } from '@/theme/config'
import { Icon } from './icon'

export const Search = styled(Icon, {
  boxSizing: 'border-box',
  position: 'relative',
  display: 'block',
  transform: 'scale(var(--ggs,1))',
  width: '$4',
  height: '$4',
  border: '$space$0_5 solid',
  rounded: '$full',
  ml: '-$1',
  mt: '-$1',
  '&::after': {
    content: '',
    display: 'block',
    boxSizing: 'border-box',
    position: 'absolute',
    borderRadius: '3px',
    w: '$0_5',
    h: '$2',
    background: 'currentColor',
    transform: 'rotate(-45deg)',
    top: '$2_5',
    left: '$3',
  },
})
