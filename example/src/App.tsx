import React from 'react'
import './App.css'
import { Menu } from 'mayumi/menu'
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
      <Menu light={true}>
        <Menu.Item itemKey="button">Button</Menu.Item>
        <Menu.Item itemKey="input">Input</Menu.Item>
        <Menu.Item itemKey="avatar">Avatar</Menu.Item>
        <Menu.Item itemKey="box">Box</Menu.Item>
        <Menu.Item itemKey="description">Description</Menu.Item>
        <Menu.Item itemKey="separator">Separator</Menu.Item>
        <Menu.Item itemKey="tooltip">Tooltip</Menu.Item>
        <Menu.Item itemKey="dropdown">Dropdown</Menu.Item>
      </Menu>
    </div>
  )
}

export default App
