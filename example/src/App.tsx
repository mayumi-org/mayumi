import React from 'react'
import './App.css'
import { Separator } from 'mayumi/separator'
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
      <Separator />
      <Separator type="vertical" />
    </div>
  )
}

export default App
