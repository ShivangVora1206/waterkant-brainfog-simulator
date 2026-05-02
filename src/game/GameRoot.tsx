import React from 'react'
import SceneManager from './SceneManager'
import AudioBootstrap from '../audio/AudioBootstrap'
import VersionBadge from '../components/VersionBadge'

export default function GameRoot(){
  return (
    <main className="game-root">
      <AudioBootstrap />
      <SceneManager />
      <VersionBadge />
    </main>
  )
}
