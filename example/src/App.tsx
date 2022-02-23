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
      <Text h1={true}>Button</Text>
      <Text h2={true}>Button</Text>
      <Text h3={true}>Button</Text>
      <Text h4={true}>Button</Text>
      <Text h5={true}>Button</Text>
      <Text h6={true}>Button</Text>
      <Text p={true} weight="bold">
        Button
      </Text>
    </div>
  )
}

export default App
