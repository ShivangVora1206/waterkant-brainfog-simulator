import { useEffect } from 'react'
import ttsClient from '../audio/TTSClient'

function randBetween(min: number, max: number){
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function normalizeName(name: string){
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

export default function useNameCallLoop(name: string, enabled: boolean){
  useEffect(() => {
    if(!enabled || !name){
      return
    }
    let active = true
    let timer: number | undefined
    const key = normalizeName(name) || 'guest'
    const url = `/assets/sounds/tts/name_call_${key}.wav`

    const schedule = () => {
      const delay = randBetween(7000, 14000)
      timer = window.setTimeout(async () => {
        if(!active){
          return
        }
        try{
          await ttsClient.speakFromUrl(url)
        }catch{
          // Ignore missing files during scaffolding
        }
        schedule()
      }, delay)
    }

    schedule()

    return () => {
      active = false
      if(timer){
        window.clearTimeout(timer)
      }
    }
  }, [enabled, name])
}
