import { styled } from '@/theme/config'

export const Container = styled('div', {
  position: 'fixed',
  zIndex: '$50',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  margin: '$auto',
  pointerEvents: 'none',
  '.mayumi-modal': {
    w: '$screenSM',
    h: '$96',
    boxShadow: '$lg',
    rounded: '$lg',
    flexBox: 'flex-start',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '$underPageBackgroundColor',
    pointerEvents: 'all',
    position: 'relative',
    p: '$0',
    zIndex: '$50',
    '.mayumi-close-icon': {
      cursor: 'pointer',
    },
    '.mayumi-modal-body': {
      w: '$full',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '$4',
    },
    '.mayumi-modal-title': {
      w: '$full',
      h: '$16',
      padding: '$2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: '$windowBackgroundColor',
      flex: 0,
      boxShadow: '$sm',
    },
  },
  '.mayumi-modal-mask': {
    position: 'fixed',
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    opacity: 0.2,
    pointerEvents: 'all',
    zIndex: '$10',
    cursor: 'pointer',
    backgroundColor: '$shadowColor',
  },
  variants: {
    glassmorphism: {
      true: {
        '.mayumi-modal': {
          glass: '8px',
        },
      },
    },
    center: {
      true: {
        '&': {
          flexBox: 'center',
        },
      },
      false: {
        '.mayumi-modal': {
          position: 'absolute',
          top: '20%',
          left: 0,
          right: 0,
          m: 'auto',
        },
      },
    },
  },
})
