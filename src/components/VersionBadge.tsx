import React from 'react'
import pkg from '../../package.json'

export default function VersionBadge(){
  const ver = pkg.version || '0.0.0'
  return (
    <div style={{
      position: 'fixed',
      right: 8,
      bottom: 8,
      fontSize: 12,
      color: 'rgba(255,255,255,0.85)',
      background: 'rgba(0,0,0,0.55)',
      padding: '4px 8px',
      borderRadius: 6,
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      v{ver}
    </div>
  )
}
