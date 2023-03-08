import React from 'react'
import './App.css'
import { ThemeProvider } from 'mayumi/theme'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import { Menu } from 'mayumi/menu'
import { Box } from 'mayumi/box'
import { Text } from 'mayumi/text'

const FrameDemo = () => (
  <div className="Container">
    <AspectRatio.Root ratio={16 / 9} style={{ border: '1px solid red' }}>
      {/* non-transparent box will make menu hover style wired */}
      <Box transparent={true}>
        <Menu size="md" ghost={true}>
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
      </Box>
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
