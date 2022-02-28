import React from 'react'
import './App.css'
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
      <Tooltip content="content" animation="scale" placement="right-end">
        <div>tooltip</div>
      </Tooltip>
    </div>
  )
}

export default App
