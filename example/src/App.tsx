import React from 'react'
import './App.css'
import { Box } from 'mayumi/box'

function App() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <Box>Button</Box>
    </div>
  )
}

export default App
