import { styled } from '@/theme/config'
import { tv } from 'tailwind-variants'

export const input = tv({
  slots: {
    base: 'text-mayumi-gray-1200 bg-mayumi-gray-400 outline-none relative w-full border-box inline-flex items-center justify-start overflow-visible rounded-md p-2 text-sm',
    input:
      'appearance-none bg-mayumi-gray-400 border-none bg-transparent outline-none w-full box-border indent-1 rounded-md',
    effect:
      'absolute top-0 left-0 w-full h-full rounded-md pointer-events-none transform-origin-center',
  },
  variants: {
    light: {
      true: {
        base: 'outline-none outline-[0px]',
      },
    },
    focus: {
      true: {
        base: 'outline-none outline-[0px] border-transparent',
        // blue-700
        effect: 'shadow-[0px_0px_0px_4px_hsla(211,_85.1%,_27.4%,_1)]',
      },
    },
    ghost: {
      true: 'border-none bg-transparent',
    },
    size: {
      sm: {
        input: 'leading-3 h-3',
      },
      md: {
        input: 'leading-4 h-4',
      },
    },
  },
  compoundVariants: [
    {
      light: true,
      focus: true,
      class: 'focus:ring ring-4 ring-offset-[0px] ring-mayumi-primary-700',
    },
  ],
  defaultVariants: {
    light: false,
    focus: false,
    size: 'md',
  },
})

export const StyledInput = styled('div', {
  border: '1px solid $quaternaryLabelColor',
  '& .mayumi-input-icon': {
    flexBox: 'center',
    mr: '$1',
    color: '$placeholderTextColor',
    '--ggs': 0.75,
    '& i': {
      color: '$placeholderTextColor',
    },
  },
  variants: {
    size: {
      sm: {
        '& .mayumi-input-icon': {
          w: '$3',
          h: '$3',
        },
      },
      md: {
        '& .mayumi-input-icon': {
          w: '$4',
          h: '$4',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
