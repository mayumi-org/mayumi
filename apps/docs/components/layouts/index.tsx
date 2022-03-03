import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Text } from 'mayumi/text'
import { Layout as DefaultLayout } from 'mayumi/layout'
import { Menu } from 'mayumi/menu'
import { useRouter } from 'next/router'

const components = {
  // code: CodeBlock,
  h1: (props: any) => <Text {...props} h1={true} />,
  h2: (props: any) => <Text {...props} h2={true} id={props.children} />,
  h3: (props: any) => <Text {...props} h3={true} id={props.children} />,
  h4: (props: any) => <Text {...props} h4={true} id={props.children} />,
  h5: (props: any) => <Text {...props} h5={true} id={props.children} />,
  h6: (props: any) => <Text {...props} h6={true} id={props.children} />,
  // wrapper: (props: any) => {
  //   return <Page {...props} />
  // },
}

export const Layout = (props: React.PropsWithChildren<any>) => {
  const router = useRouter()
  const handleClickMenuItem = (params: any) => {
    router.push(`/docs/components/${params.itemKey}`)
  }
  return (
    <DefaultLayout size="screen">
      <DefaultLayout.Aside open={true}>
        <Menu onClick={handleClickMenuItem}>
          <Menu.SubMenu title="Actions">
            <Menu.Item itemKey="button">Button</Menu.Item>
            <Menu.Item itemKey="input">Input</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </DefaultLayout.Aside>
      <DefaultLayout.Main>
        <MDXProvider components={components}>{props.children}</MDXProvider>
      </DefaultLayout.Main>
    </DefaultLayout>
  )
}
