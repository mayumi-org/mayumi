import React from 'react'
import './App.css'
import { ThemeProvider } from 'mayumi/theme'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import { Menu } from 'mayumi/menu'
import { Dot } from 'mayumi/dot'
import { Text } from 'mayumi/text'
import { Layout } from 'mayumi/layout'

const FrameDemo = () => (
  <div className="Container rounded-xl overflow-hidden shadow-md bg-slate-900">
    <AspectRatio.Root ratio={16 / 9}>
      <div className="w-ful h-9 flex items-center border-dark border-b bg-[#363636]">
        <div className="flex gap-2 px-3">
          {/* TODO: size: 10px */}
          <Dot type="danger" />
          <Dot type="warning" />
          <Dot type="success" />
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
      </Layout>
    </AspectRatio.Root>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#1d1d1d',
        }}
      >
        <FrameDemo />
      </div>
    </ThemeProvider>
  )
}

export default App
