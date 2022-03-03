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
}

const Main = styled('main', {
  backgroundColor: '$windowBackgroundColor',
  display: 'flex',
  w: '$full',
  h: '$full',
})

export const Layout = (props: React.PropsWithChildren<{}>) => {
  const router = useRouter()
  const handleClickMenuItem = (params: any) => {
    router.push(`/docs/components/${params.itemKey}`)
  }
  return (
    <DefaultLayout size="screen">
      <Main>
        <div>
          <Menu onClick={handleClickMenuItem}>
            <Menu.SubMenu title="Actions">
              <Menu.Item itemKey="button">Button</Menu.Item>
              <Menu.Item itemKey="input">Input</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
        <div>
          <MDXProvider components={components}>{props.children}</MDXProvider>
        </div>
        <TableOfContent headings={getHeadings(props.children)} />
      </Main>
    </DefaultLayout>
  )
}
