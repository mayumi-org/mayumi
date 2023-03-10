import { styled } from '@/theme/config'
import { tv } from 'tailwind-variants'

export const button = tv({
  base: 'cursor-pointer border-none text-center appearance-none font-sans shadow-md font-normal',
  variants: {
    disabled: {
      true: 'cursor-not-allowed',
    },
    size: {
      md: 'py-1 px-4 text-sm rounded-md',
      sm: 'py-0.5 px-2 text-xs rounded-md',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const StyledButton = styled('button', {
  '&:focus': {
    outline: 'none',
    border: 'none',
  },
  variants: {
    color: {
      primary: {
        backgroundColor: '$primary',
        color: '$textColor',
        '&.mayumi-button__enabled:active': {
          backgroundColor: '$keyboardFocusIndicatorColor',
        },
      },
      gray: {
        backgroundColor: '$tertiaryLabelColor',
        color: '$textColor',
        '&.mayumi-button__enabled:active': {
          backgroundColor: '$secondaryLabelColor',
        },
      },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})

// export const StyledButton = styled('button', {
//   cursor: 'pointer',
//   border: 'none',
//   textAlign: 'center',
//   appearance: 'none',
//   fontFamily: '$default',
//   boxShadow: '$default',
//   fontWeight: '$normal',
//   '&:focus': {
//     outline: 'none',
//     border: 'none',
//   },
//   variants: {
//     disabled: {
//       true: {
//         cursor: 'not-allowed',
//       },
//     },
//     color: {
//       primary: {
//         backgroundColor: '$primary',
//         color: '$textColor',
//         '&.mayumi-button__enabled:active': {
//           backgroundColor: '$keyboardFocusIndicatorColor',
//         },
//       },
//       gray: {
//         backgroundColor: '$tertiaryLabelColor',
//         color: '$textColor',
//         '&.mayumi-button__enabled:active': {
//           backgroundColor: '$secondaryLabelColor',
//         },
//       },
//     },
//     size: {
//       md: {
//         py: '$1',
//         px: '$4',
//         text: '$sm',
//         rounded: '$md',
//       },
//       sm: {
//         py: '$0.5',
//         px: '$2',
//         text: '$xs',
//         rounded: '$md',
//       },
//     },
//   },
//   defaultVariants: {
//     color: 'primary',
//     size: 'md',
//   },
// })
