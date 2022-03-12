import type { NextPage } from 'next'
import { Layout } from 'mayumi/layout'
import { styled } from 'mayumi/theme'
import { Link } from 'mayumi/link'

import { Logo } from '@/components/logo'
import { Cursor } from '@/components/cursor'

const HomePageLayout = styled(Layout, {
  flexBox: 'center',
  flexDirection: 'column',
  gap: '$4',
  backgroundColor: '$black',
  '& .links': {
    display: 'inline-flex',
    justifyContent: 'flex-start',
    gap: '$10',
    textAlign: 'center',
  },
})

const Home: NextPage = () => {
  return (
    <Cursor>
      <HomePageLayout size="screen">
        <Logo large={true} />
        <div className="links">
          <Link href="https://github.com/mayumi-org/mayumi">Github</Link>
          <Link href="/docs/components/button">Components</Link>
        </div>
      </HomePageLayout>
    </Cursor>
  )
}

export default Home
