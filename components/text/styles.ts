import { styled } from '@/theme/config'

export const StyledText = styled('p', {
  variants: {
    type: {
      secondary: {
        color: '$labelColor',
      },
      tertiary: {
        color: '$secondaryLabelColor',
      },
      quaternary: {
        color: '$tertiaryLabelColor',
      },
      default: {
        color: '$textColor',
      },
    },
  },
  defaultVariants: {
    type: 'default',
  },
})
