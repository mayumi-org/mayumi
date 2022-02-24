import React from 'react'
import './App.css'
import { Avatar } from 'mayumi/avatar'
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
      <Avatar src="http://img01.yohoboys.com/contentimg/2017/08/12/21/012a1eab9842a752f8c4d98b8fc2777ad7.jpg" />
    </div>
  )
}

export default App
