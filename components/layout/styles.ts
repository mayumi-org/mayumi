import { styled } from '@/theme/config'

export const StyledMain = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '$windowBackgroundColor',
  p: '$4',
})

export const StyledAside = styled('aside', {
  transformOrigin: '0% 50%',
  w: '$fit',
  borderRight: '1px solid $quaternaryLabelColor',
  backgroundColor: '$underPageBackgroundColor',
  '& .mayumi-aside-inner': {
    w: '$full',
    h: '$full',
    overflow: 'auto',
    willChange: 'width',
    '& .mayumi-aside-content': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',
      minWidth: '$72',
    },
  },
})

export const StyledLayout = styled('article', {
  display: 'flex',
  backgroundColor: '$windowBackgroundColor',
  variants: {
    size: {
      screen: {
        w: '100vw',
        h: '100vh',
      },
      full: {
        w: '$full',
        h: '$full',
      },
    },
  },
  defaultVariants: {
    size: 'full',
  },
})
