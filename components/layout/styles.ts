import { styled } from '@/theme/config'
import { tv } from 'tailwind-variants'
import { Root as ToolBarRoot } from '@radix-ui/react-toolbar'

export const StyledToolbar = styled(ToolBarRoot, {
  borderBottom: '1px solid $quaternaryLabelColor',
  glass: '12px',
  '.mayumi-toolbar-toggle-item': {
    transition: '$colors',
  },
  '.mayumi-toolbar-toggle-item:hover': {
    backgroundColor: '$unemphasizedSelectedTextBackgroundColor',
    color: '$tertiaryLabelColor',
    '.gg-chevron-left': {
      color: '$white',
    },
  },
  i: {
    transition: '$colors',
    color: '$tertiaryLabelColor',
    '&:hover': {
      opacity: '0.8',
      transition: '$all',
    },
  },
})

export const toolbar = tv({
  slots: {
    base: 'sticky top-0 left-0 z-auto flex w-full min-w-max rounded-sm px-2 py-3 shadow-sm bg-mayumi-gray-200',
    item: 'ml-1 flex items-center justify-center rounded-md px-2 py-1',
  },
})

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

export const StyledNav = styled('div', {
  backgroundColor: '$underPageBackgroundColor',
  borderColor: '$quaternaryLabelColor',
  '-webkit-app-region': 'drag',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  w: '$20',
  h: '$full',
  borderRightWidth: '1px',
  gap: '$8',
  py: '$4',
  '.mayumi-icon': {
    cursor: 'pointer',
  },
  '.mayumi-layout-navigate-top, .mayumi-layout-navigate-top': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '$8',
    w: '$full',
  },
})
