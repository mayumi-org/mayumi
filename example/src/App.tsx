import React from 'react'
import './App.css'
import { Description } from 'mayumi/description'
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
      <Description title="Title">Description</Description>
      <Description size="md" title="Title">
        Description
      </Description>
    </div>
  )
}

export default App
