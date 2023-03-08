import React from 'react'
import './App.css'
import { ThemeProvider, styled } from 'mayumi/theme'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import { Menu } from 'mayumi/menu'
import { Box } from 'mayumi/box'

const FrameDemo = () => (
  <div className="Container">
    <AspectRatio.Root ratio={16 / 9}>
      <Box>
        <Menu size="md" ghost={true}>
          <Menu.SubMenu title="Actions">
            <Menu.Item itemKey="button">Button</Menu.Item>
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
