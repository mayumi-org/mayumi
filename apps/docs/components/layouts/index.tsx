import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import { Text } from 'mayumi/text'

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
  return <MDXProvider components={components}>{props.children}</MDXProvider>
}
