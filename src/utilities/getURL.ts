import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL
  
  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (!url && process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`
  }

  if (!url) {
     // If we are in production (e.g. Vercel build), use the live URL
     // Otherwise assume local dev
     url = process.env.NODE_ENV === 'production' 
        ? 'https://skillsformed-payload.vercel.app' 
        : 'http://localhost:3000'
  }

  return url
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port
    
    // DEBUG: Check what URL is being resolved
    console.log('getClientSideURL (DOM):', `${protocol}//${domain}${port ? `:${port}` : ''}`)

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || 'https://skillsformed-payload.vercel.app'
}
