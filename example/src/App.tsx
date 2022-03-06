import React from 'react'
import './App.css'
import { Text } from 'mayumi/text'
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
      <Text type="secondary">text</Text>
      <Text type="tertiary">text</Text>
      <Text type="quaternary">text</Text>
    </div>
  )
}

export default App
