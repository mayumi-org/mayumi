import { styled } from '@/theme/config'

export const StyledNotification = styled('div', {
  position: 'fixed',
  bottom: '$8',
  right: '64px',
  zIndex: '$50',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  w: 'auto',
  mx: '$0',
  my: 'auto',
  pointerEvents: 'none',
  '& .mayumi-notification-message': {
    pointerEvents: 'none',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    mt: '$2',
    p: '$0',
    w: '$100',
    rounded: '$md',
    glass: '5px',
    boxShadow: '$outline',
    borderStyle: 'solid',
    borderColor: '$quaternaryLabelColor',
    borderWidth: '$px',
  },
  '& .mayumi-notification-content': {
    opacity: '0.9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    h: 'auto',
    text: '$base',
    pt: '$1',
    pb: '$2',
    pl: '$4',
    pr: '$16',
  },
  '& .mayumi-notification-operation': {
    display: 'flex',
    justifyContent: 'flex-end',
    pb: '$2',
  },
})
