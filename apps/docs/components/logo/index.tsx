import { Text } from 'mayumi/text'
import { styled } from 'mayumi/theme'

const StyledLogo = styled(Text, {
  textAlign: 'center',
  fontFamily: "'Inter', sans-serif",
  variants: {
    large: {
      true: {
        text: '$7xl',
      },
    },
  },
})

export const Logo = (props: { large?: boolean }) => {
  return (
    <StyledLogo weight="black" h5={true} large={props.large}>
      {'mayumi'.toUpperCase()}
    </StyledLogo>
  )
}
