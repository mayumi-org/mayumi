import { styled } from '@/theme/config'
import { tv } from 'tailwind-variants'

export const input = tv({
  slots: {
    base: 'outline-none relative w-full border-box inline-flex items-center justify-start overflow-visible rounded-md p-2 text-sm',
    input:
      'appearance-none border-none bg-transparent outline-none w-full box-border indent-1 rounded-md',
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
        base: 'outline-none outline-[0px] border-none',
      },
    },
    ghost: {
      true: 'border-none bg-transparent',
    },
  },
  compoundVariants: [
    {
      light: true,
      focus: true,
      class: 'focus:outline outline-4 outline-offset-[0px] outline-mayumi-primary-800',
    },
  ],
  defaultVariants: {
    light: false,
    focus: false,
  },
})

export const StyledInput = styled('div', {
  color: '$textColor',
  border: '1px solid $quaternaryLabelColor',
  backgroundColor: '$windowBackgroundColor',
  '& .mayumi-input-icon': {
    flexBox: 'center',
    mr: '$1',
    color: '$placeholderTextColor',
    '--ggs': 0.75,
    '& i': {
      color: '$placeholderTextColor',
    },
  },
  '& input': {
    backgroundColor: '$windowBackgroundColor',
  },
  variants: {
    size: {
      sm: {
        '& .mayumi-input-icon': {
          w: '$3',
          h: '$3',
        },
        '& input': {
          leading: '$3',
          h: '$3',
        },
      },
      md: {
        '& .mayumi-input-icon': {
          w: '$4',
          h: '$4',
        },
        '& input': {
          leading: '$4',
          h: '$4',
        },
      },
    },
    focus: {
      true: {
        '& .mayumi-input-effect': {
          boxShadow: '$focus',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
