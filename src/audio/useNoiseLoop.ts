import { useEffect, useState } from 'react'
import audioManager from './audioManagerSingleton'
import noiseScheduler from './noiseSchedulerSingleton'
import type { NoiseLoopOptions } from './NoiseScheduler'

export default function useNoiseLoop(enabled: boolean, options: NoiseLoopOptions){
  const { key, keys, minMs, maxMs, channel } = options
  const [audioReady, setAudioReady] = useState(audioManager.isEnabled())

  useEffect(() => audioManager.onEnabledChange(setAudioReady), [])

  useEffect(() => {
    if(!enabled || !audioReady){
      return
    }
    const stop = noiseScheduler.startLoop({ key, keys, minMs, maxMs, channel })
    return () => stop()
  }, [enabled, audioReady, key, channel, maxMs, minMs, keys])
}
