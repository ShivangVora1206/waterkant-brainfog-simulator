import React, { useEffect, useRef, useState } from 'react'
import audioManager from './audioManagerSingleton'
import Button from '../components/Button'
import { soundCatalog } from './soundCatalog'

export default function AudioBootstrap(){
  const [ready, setReady] = useState(false)
  const ambienceRef = useRef<AudioBufferSourceNode | null>(null)

  useEffect(() => {
    audioManager.init()
  }, [])

  const onEnable = async () => {
    audioManager.setEnabled(true)
    await audioManager.resume()
    audioManager.setChannelVolume('ambience', 0.22)
    if(!ambienceRef.current){
      try{
        const buffer = await audioManager.loadBufferFromUrl(soundCatalog.ambientOffice)
        ambienceRef.current = audioManager.playBuffer(buffer, 'ambience', 0, true)
      }catch{
        // Ambient will fall back to silence if missing.
      }
    }
    setReady(true)
  }

  if(ready){
    return null
  }

  return (
    <div className="audio-gate">
      <span style={{ marginRight: 8 }}>Ton aktivieren</span>
      <Button onClick={onEnable} frustration={false}>Aktivieren</Button>
    </div>
  )
}
