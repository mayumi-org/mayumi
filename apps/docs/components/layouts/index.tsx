import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import type { Props as MDXProps } from '@mdx-js/react/lib'
import { Text } from 'mayumi/text'
import { Layout as DefaultLayout } from 'mayumi/layout'
import { Menu } from 'mayumi/menu'
import { useRouter } from 'next/router'
import { styled } from 'mayumi/theme'

import { TableOfContent, getHeadings } from '@/components/table-of-content'

const components: MDXProps['components'] = {
  // code: CodeBlock,
  h1: (props: any) => <Text {...props} h1={true} />,
  h2: (props: any) => <Text {...props} h2={true} />,
  h3: (props: any) => <Text {...props} h3={true} />,
  h4: (props: any) => <Text {...props} h4={true} />,
  h5: (props: any) => <Text {...props} h5={true} />,
  h6: (props: any) => <Text {...props} h6={true} />,
  p: (props: any) => <Text {...props} p={true} />,
}

const Main = styled(DefaultLayout, {
  display: 'flex',
  flexDirection: 'column',
  w: '100vw',
  h: '100vh',
  backgroundColor: '#000000',
})

const Content = styled('article', {
  display: 'flex',
  justifyContent: 'center',
  gap: '$10',
  flex: 1,
  py: '$8',
  mx: 'auto',
  w: '80%',
  h: '$full',
  overflowY: 'auto',
  '.mdx-container': {
    minWidth: '70%',
  },
})

const Nav = styled('nav', {
  glass: '5px',
  backgroundColor: 'rgba(36, 36, 36, 0.7)',
  w: '$full',
  h: '$16',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'sticky',
  top: '$0',
  borderStyle: 'solid',
  borderColor: '$quaternaryLabelColor',
  borderBottomWidth: '$px',
  '.nav-content': {
    w: '80%',
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif",
  },
})

export const Layout = (props: React.PropsWithChildren<{}>) => {
  const router = useRouter()
  const handleClickMenuItem = (params: any) => {
    router.push(`/docs/components/${params.itemKey}`)
  }
  return (
    <Main size="screen">
      <Nav>
        <div className="nav-content">
          <Text weight="black" h5={true}>
            {'mayumi'.toUpperCase()}
          </Text>
        </div>
      </Nav>
      <Content>
        <div>
          <Menu onClick={handleClickMenuItem}>
            <Menu.SubMenu title="Actions">
              <Menu.Item itemKey="button">Button</Menu.Item>
              <Menu.Item itemKey="input">Input</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
        <div className="mdx-container">
          <MDXProvider components={components}>{props.children}</MDXProvider>
        </div>
        <TableOfContent headings={getHeadings(props.children)} />
      </Content>
    </Main>
  )
}
