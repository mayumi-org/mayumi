import React from 'react'
import './App.css'
import { ThemeProvider } from 'mayumi/theme'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import { Menu } from 'mayumi/menu'
import { Dot } from 'mayumi/dot'
import { Text } from 'mayumi/text'
import { Layout } from 'mayumi/layout'

const FrameDemo = () => (
  <div className="Container rounded-xl overflow-hidden shadow-xl bg-slate-900">
    <AspectRatio.Root ratio={16 / 9}>
      <div className="w-ful h-9 flex items-center border-dark border-b bg-[#363636]">
        <div className="flex gap-2 px-4">
          {/* TODO: size: 10px */}
          <Dot type="danger" size="md" />
          <Dot type="warning" size="md" />
          <Dot type="success" size="md" />
        </div>
      </div>
      {/* non-transparent box will make menu hover style wired */}
      <Layout>
        <Layout.Aside open={true}>
          <Menu size="md" ghost={true} css={{ minWidth: '150px' }}>
            <Menu.SubMenu title="Actions">
              <Menu.Item itemKey="button">
                <i
                  className="gg-search"
                  style={{ '--ggs': 0.5, color: 'white', fontWeight: 'bold' }}
                />
                <Text size="sm" css={{ ml: '$2' }}>
                  Button
                </Text>
              </Menu.Item>
              <Menu.Item itemKey="input">Input</Menu.Item>
              <Menu.Item itemKey="tooltip">Tooltip</Menu.Item>
              <Menu.Item itemKey="dropdown">Dropdown</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Display">
              <Menu.Item itemKey="avatar">Avatar</Menu.Item>
              <Menu.Item itemKey="box">Box</Menu.Item>
              <Menu.Item itemKey="description">Description</Menu.Item>
              <Menu.Item itemKey="separator">Separator</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Layout.Aside>
        <Layout.Main css={{ p: '$0' }}>
          <img src="https://images.unsplash.com/photo-1515266591878-f93e32bc5937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJsdWV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" />
        </Layout.Main>
      </Layout>
    </AspectRatio.Root>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <div className="w-screen h-screen flex justify-center items-center gap-3 bg-slate-900 relative">
        <div className="bg-happyfisher w-full h-full absolute top-0 left-0" />
        <FrameDemo />
      </div>
    </ThemeProvider>
  )
}

export default App
