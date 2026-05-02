import React from 'react'
import SceneManager from './SceneManager'
import AudioBootstrap from '../audio/AudioBootstrap'

export default function GameRoot(){
  return (
    <main className="game-root">
      <AudioBootstrap />
      <SceneManager />
    </main>
  )
}
