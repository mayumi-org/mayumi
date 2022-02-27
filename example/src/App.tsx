import React from 'react'
import './App.css'
// import { Menu } from 'mayumi/menu'
import { Tooltip } from 'mayumi/tooltip'
import { globalStyles } from 'mayumi/preflight'

function App() {
  globalStyles()
  return (
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
      {/* <div style={{ width: '200px' }}>
        <Menu size="md" selectedKeys={['item-1']}>
          <Menu.SubMenu title="SubMenu One">
            <Menu.Item itemKey="item-1">Item 1</Menu.Item>
            <Menu.Item itemKey="item-2">Item 2</Menu.Item>
            <Menu.Item itemKey="item-3">Item 3</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu title="SubMenu Two">
            <Menu.Item itemKey="item-4">Item 4</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </div> */}
      <Tooltip content={<div>test</div>} placement="left">
        tooltip
      </Tooltip>
    </div>
  )
}

export default App
