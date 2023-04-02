import { styled } from '@/theme/config'
import { tv } from 'tailwind-variants'

export const button = tv({
  base: 'cursor-pointer border-none text-center appearance-none shadow text-mayumi-gray-1200',
  variants: {
    color: {
      primary: 'bg-mayumi-primary hover:bg-mayumi-primary/80',
      gray: 'bg-mayumi-gray-1200/10 hover:bg-mayumi-gray-1200/20 text-mayumi-gray-1200/60 shadow-[inset_0_0_0_1px_#343434]',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})

export const StyledButton = styled('button', {
  fontFamily: '$default',
  fontWeight: '$normal',
  transition: '$colors',
  '&:focus': {
    outline: 'none',
    border: 'none',
  },
  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
      },
    },
    color: {
      primary: {
        '&.mayumi-button__enabled:active': {
          backgroundColor: 'hsla(217.15,100%,53%,.8)',
        },
      },
      gray: {
        '&.mayumi-button__enabled:active': {
          backgroundColor: '$gray500',
        },
      },
    },
    size: {
      md: {
        py: '$1',
        px: '$4',
        text: '$sm',
        rounded: '$md',
      },
      sm: {
        py: '$1',
        px: '$2',
        text: '$xs',
        rounded: '$md',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})
