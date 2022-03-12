import type { NextPage } from 'next'
import { Layout } from 'mayumi/layout'
import { styled } from 'mayumi/theme'

import { Logo } from '@/components/logo'
import { Cursor } from '@/components/cursor'

const HomePageLayout = styled(Layout, {
  flexBox: 'center',
})

const Home: NextPage = () => {
  return (
    <Cursor>
      <HomePageLayout size="screen">
        <Logo large={true} />
      </HomePageLayout>
    </Cursor>
  )
}

export default Home
