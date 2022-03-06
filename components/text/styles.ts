import { styled } from '@/theme/config'

export const StyledText = styled('p', {
  color: '$textColor',
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
    },
  },
})
