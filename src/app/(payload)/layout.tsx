import React from 'react'
import './custom.scss'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Debug Layout</title>
      </head>
      <body style={{ backgroundColor: 'yellow', color: 'black', fontSize: '30px', padding: '50px' }}>
        <h1>DEBUG MODE: HELLO WORLD</h1>
        <p>If you see this, Next.js is working.</p>
        <div style={{ border: '5px solid red', padding: '20px' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
