'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Standard import logic
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export default function DebugVideoPage() {
  return (
    <div style={{ padding: '50px', backgroundColor: 'white' }}>
      <h1>Debug Video Player</h1>
      <p>If this video doesn&apos;t load, something blocks YouTube globally (network/browser).</p>
      
      <div style={{ border: '2px solid red', width: '640px', height: '360px', position: 'relative' }}>
        <ReactPlayer 
           url="https://res.cloudinary.com/dou53k2lp/video/upload/v1769946798/demo-video_gog7ht.mp4"
           controls
           playing={true}
           muted={true}
           width="100%"
           height="100%"
        />
      </div>

      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ccc' }}>
        <h3>Native HTML5 Video Tag</h3>
        <p>If this works, ReactPlayer is the problem.</p>
        <video 
          src="https://res.cloudinary.com/dou53k2lp/video/upload/v1769946798/demo-video_gog7ht.mp4"
          controls
          width="640"
          height="360"
          style={{ backgroundColor: 'black' }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Direct Link</h3>
        <p>If this link fails to open, your network is blocking the video.</p>
        <a 
          href="https://res.cloudinary.com/dou53k2lp/video/upload/v1769946798/demo-video_gog7ht.mp4" 
          target="_blank" 
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Open Video in New Tab
        </a>
      </div>
    </div>
  )
}
