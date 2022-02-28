import React, { useState } from 'react'
import './App.css'
import { Layout } from 'mayumi/layout'
import { Menu } from 'mayumi/menu'
import { globalStyles } from 'mayumi/preflight'

function App() {
  globalStyles()
  const [open, setOpen] = useState(true)
  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
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
      <Layout>
        <Layout.Aside open={open}>
          <Menu>
            <Menu.SubMenu title="SubMenu One">
              <Menu.Item>Item 1</Menu.Item>
              <Menu.Item>Item 1</Menu.Item>
              <Menu.Item>Item 1</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="SubMenu Two">
              <Menu.Item>Item 1</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Layout.Aside>
        <Layout.Main>content</Layout.Main>
      </Layout>
    </div>
  )
}

export default App
