import React from 'react'
import './App.css'
import { Notification } from 'mayumi/notification'
import { globalStyles } from 'mayumi/preflight'

function App() {
  globalStyles()
  const handleClick = () => {
    Notification.info({
      title: 'loremIpsum()',
      description: 'loremIpsum()',
    })
  }
  return (
    <div
      onClick={handleClick}
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
      <Notification />
    </div>
  )
}

export default App
