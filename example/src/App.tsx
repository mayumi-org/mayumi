import React from 'react'
import './App.css'
import { ThemeProvider } from 'mayumi/theme'
import { Separator } from 'mayumi/separator'

function App() {
  return (
    <ThemeProvider>
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
        <h1>Mayumi</h1>
        <Separator css={{ padding: '-$2' }} />
      </div>
    </ThemeProvider>
  )
}

export default App
