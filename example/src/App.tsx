import React, { useState } from 'react'
import './App.css'
import { Menu } from 'mayumi/menu'
// import { Tooltip } from 'mayumi/tooltip'
import { Dropdown } from 'mayumi/dropdown'
import { globalStyles } from 'mayumi/preflight'

function App() {
  globalStyles()
  const [activeKey2, setActiveKey2] = useState('test')
  const DropdownCollapsedMenu1 = (
    <Dropdown.Menu>
      <Dropdown.SubMenu title="iCloud3">
        <Dropdown.Item itemKey="iCloud3.1">3.1</Dropdown.Item>
        <Dropdown.Item itemKey="iCloud3.2">3.2</Dropdown.Item>
      </Dropdown.SubMenu>
    </Dropdown.Menu>
  )
  const DropdownCollapsedMenu = (
    <Dropdown.Menu>
      <Dropdown.SubMenu title="iCloud2">
        <Dropdown.Item collapsedMenu={DropdownCollapsedMenu1} itemKey="iCloud2/1">
          2.1
        </Dropdown.Item>
        <Dropdown.Item itemKey="iCloud2.2">2.2</Dropdown.Item>
      </Dropdown.SubMenu>
    </Dropdown.Menu>
  )
  const DropdownMenu = (
    <Dropdown.Menu>
      <Dropdown.SubMenu title="iCloud">
        <Dropdown.Item>1.2</Dropdown.Item>
        <Dropdown.Item collapsedMenu={DropdownCollapsedMenu} itemKey="test1.1">
          1.1
        </Dropdown.Item>
      </Dropdown.SubMenu>
    </Dropdown.Menu>
  )
  const DropdownSwitchMenu = (
    <Dropdown.Menu>
      <Dropdown.SubMenu title="iCloud" itemKey="test">
        <Dropdown.Item onClick={() => setActiveKey2('test2')}>1.1</Dropdown.Item>
      </Dropdown.SubMenu>
      <Dropdown.SubMenu title="iCloud2" itemKey="test2">
        <Dropdown.Item onClick={() => setActiveKey2('test')}>1.2</Dropdown.Item>
        <Dropdown.Item>1.3</Dropdown.Item>
      </Dropdown.SubMenu>
    </Dropdown.Menu>
  )
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
      <div style={{ width: '200px', border: '1px solid red' }}>
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
      </div>
      {/* <Tooltip content={<div>test</div>} placement="left">
        tooltip
      </Tooltip> */}
      <Dropdown content={DropdownMenu} glassmorphism={true}>
        tooltip
      </Dropdown>
      <Dropdown switchKey={activeKey2} content={DropdownSwitchMenu}>
        tooltip
      </Dropdown>
    </div>
  )
}

export default App
