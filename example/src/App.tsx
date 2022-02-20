import React from 'react'
import './App.css'
import { Button } from 'mayumi/button'

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
      <Button>Button</Button>
      <Button color="gray">Button</Button>
      <Button size="sm">Button</Button>
    </div>
  )
}

export default App
