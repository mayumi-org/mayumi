import { styled } from '@/theme'

export const StyledMain = styled('div', {
  flexBasis: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '$windowBackgroundColor',
})

export const StyledContent = styled('section', {
  backgroundColor: '$windowBackgroundColor',
  w: '$full',
  h: '$full',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  p: '$4',
})

export const StyledAside = styled('aside', {
  transformOrigin: '0% 50%',
  w: '$fit',
  borderRight: '1px solid red',
  backgroundColor: '$windowBackgroundColor',
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
    },
  },
})

export const StyledLayout = styled('article', {
  display: 'flex',
  w: '$full',
  h: '$full',
  // TODO:
  // '& .toolbar': {
  //   position: 'relative',
  //   zIndex: '$10',
  // },
})
