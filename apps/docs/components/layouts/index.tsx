import React from 'react'
import { MDXProvider, MDXProviderComponentsProp } from '@mdx-js/react'
import { Text } from 'mayumi/text'
import { Layout as DefaultLayout } from 'mayumi/layout'
import { Menu } from 'mayumi/menu'
import { useRouter } from 'next/router'
import { styled } from 'mayumi/theme'

import { TableOfContent, getHeadings } from '@/components/table-of-content'
import { Logo } from '@/components/logo'

const components: MDXProviderComponentsProp = {
  // code: CodeBlock,
  h1: (props: any) => <Text {...props} h1={true} />,
  h2: (props: any) => <Text {...props} h2={true} />,
  h3: (props: any) => <Text {...props} h3={true} />,
  h4: (props: any) => <Text {...props} h4={true} />,
  h5: (props: any) => <Text {...props} h5={true} />,
  h6: (props: any) => <Text {...props} h6={true} />,
  p: (props: any) => <Text {...props} type="secondary" p={true} />,
}

const Main = styled(DefaultLayout, {
  display: 'block',
  backgroundColor: '#000000',
  overflowY: 'auto',
})

const Content = styled('section', {
  display: 'flex',
  justifyContent: 'center',
  gap: '$10',
  py: '$8',
  mx: 'auto',
  w: '80%',
  '.mdx-container': {
    minWidth: '70%',
  },
})

const Header = styled('header', {
  glass: '5px',
  w: '$full',
  h: '$16',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'sticky',
  top: '$0',
  zIndex: '$50',
  borderStyle: 'solid',
  borderColor: '$quaternaryLabelColor',
  borderBottomWidth: '$px',
  '.header-logo': {
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
      <Header>
        <div className="header-logo">
          <Logo />
        </div>
      </Header>
      <Content>
        <div>
          <Menu light={true} onClick={handleClickMenuItem}>
            <Menu.SubMenu title="Components">
              <Menu.Item itemKey="button">Button</Menu.Item>
              <Menu.Item itemKey="input">Input</Menu.Item>
              <Menu.Item itemKey="avatar">Avatar</Menu.Item>
              <Menu.Item itemKey="box">Box</Menu.Item>
              <Menu.Item itemKey="description">Description</Menu.Item>
              <Menu.Item itemKey="separator">Separator</Menu.Item>
              <Menu.Item itemKey="tooltip">Tooltip</Menu.Item>
              <Menu.Item itemKey="dropdown">Dropdown</Menu.Item>
              <Menu.Item itemKey="menu">Menu</Menu.Item>
              <Menu.Item itemKey="text">Text</Menu.Item>
              <Menu.Item itemKey="icons">Icons</Menu.Item>
              <Menu.Item itemKey="notification">Notification</Menu.Item>
              <Menu.Item itemKey="link">Link</Menu.Item>
              <Menu.Item itemKey="dot">Dot</Menu.Item>
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
