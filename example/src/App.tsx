import React from 'react'
import './App.css'
import { Input } from 'mayumi/input'
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
      <div style={{ width: '200px' }}>
        <Input placeholder="搜索" />
      </div>
      <div style={{ width: '200px' }}>
        <Input prefix={<i className="gg-search" />} placeholder="搜索" />
      </div>
    </div>
  )
}

export default App
