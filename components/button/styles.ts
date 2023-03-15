import { styled } from '@/theme/config'
import { tv } from 'tailwind-variants'

// box-sizing: border-box;
// margin: 0;
// font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
// -webkit-text-size-adjust: 100%;
// cursor: default;
// appearance: none;
// border: none;
// height: 30px;
// display: inline-flex;
// gap: 8px;
// align-items: center;
// border-radius: 6px;
// padding: 0 12px;
// font-weight: 500;
// font-size: 14px;
// position: relative;
// justify-content: center;
// background-color: hsla(0,0%,100%,.1);
// box-shadow: inset 0 0 0 1px #343434;
// color: hsla(0,0%,100%,.6);

export const button = tv({
  base: 'cursor-pointer border-none text-center appearance-none shadow',
  variants: {
    color: {
      gray: 'bg-[hsla(0,0%,100%,.1)] color-[hsla(0,0%,100%,.6)] shadow-[inset_0_0_0_1px_#343434]',
    },
  },
})

export const StyledButton = styled('button', {
  fontFamily: '$default',
  fontWeight: '$normal',
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
        backgroundColor: '$primary',
        color: '$textColor',
        '&.mayumi-button__enabled:active': {
          backgroundColor: '$keyboardFocusIndicatorColor',
        },
      },
      gray: {
        // backgroundColor: '$tertiaryLabelColor',
        // color: '$textColor',
        // '&.mayumi-button__enabled:active': {
        //   backgroundColor: '$secondaryLabelColor',
        // },
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
