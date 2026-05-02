import audioManager from './audioManagerSingleton'
import { soundCatalog, SoundKey } from './soundCatalog'

type NoiseLoopOptions = {
  key?: SoundKey
  keys?: SoundKey[]
  minMs: number
  maxMs: number
  channel?: string
}

type PendingMap = Map<SoundKey, Promise<AudioBuffer | null>>

function randBetween(min: number, max: number){
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function chooseKey(key?: SoundKey, keys?: SoundKey[]){
  if(key){
    return key
  }
  if(keys && keys.length > 0){
    return keys[randBetween(0, keys.length - 1)]
  }
  return null
}

export default class NoiseScheduler {
  private timers = new Set<number>()
  private bufferCache = new Map<SoundKey, AudioBuffer>()
  private loading: PendingMap = new Map()

  stopAll(){
    this.timers.forEach((id) => window.clearTimeout(id))
    this.timers.clear()
  }

  private async getBuffer(key: SoundKey){
    if(this.bufferCache.has(key)){
      return this.bufferCache.get(key) || null
    }
    if(this.loading.has(key)){
      return await this.loading.get(key)!
    }
    const url = soundCatalog[key]
    if(!url){
      return null
    }
    const promise = audioManager
      .loadBufferFromUrl(url)
      .then((buffer) => {
        this.bufferCache.set(key, buffer)
        this.loading.delete(key)
        return buffer
      })
      .catch(() => {
        const fallback = this.createFallbackBuffer(key)
        if(fallback){
          this.bufferCache.set(key, fallback)
        }
        this.loading.delete(key)
        return fallback
      })
    this.loading.set(key, promise)
    return await promise
  }

  private createFallbackBuffer(key: SoundKey){
    const ctx = audioManager.getContext()
    const sampleRate = ctx.sampleRate

    const makeBuffer = (durationSec: number) => {
      const length = Math.max(1, Math.floor(durationSec * sampleRate))
      return ctx.createBuffer(1, length, sampleRate)
    }

    const noiseBurst = (durationSec: number, gain: number) => {
      const buffer = makeBuffer(durationSec)
      const data = buffer.getChannelData(0)
      for(let i = 0; i < data.length; i += 1){
        const env = 1 - i / data.length
        data[i] = (Math.random() * 2 - 1) * gain * env
      }
      return buffer
    }

    const sineTone = (freq: number, durationSec: number, gain: number, wobbleHz = 0) => {
      const buffer = makeBuffer(durationSec)
      const data = buffer.getChannelData(0)
      for(let i = 0; i < data.length; i += 1){
        const t = i / sampleRate
        const wobble = wobbleHz ? Math.sin(2 * Math.PI * wobbleHz * t) * 0.2 : 0
        const env = Math.sin(Math.PI * (i / data.length))
        data[i] = Math.sin(2 * Math.PI * (freq + freq * wobble) * t) * gain * env
      }
      return buffer
    }

    switch(key){
      case 'doorKnock1':
      case 'doorKnock2':
        return noiseBurst(0.18, 0.7)
      case 'phoneRingShort':
        return sineTone(880, 0.5, 0.35, 6)
      case 'phoneRingLong':
        return sineTone(880, 1.0, 0.35, 6)
      case 'whisper1':
      case 'whisper2':
        return noiseBurst(0.9, 0.12)
      case 'alertBoss':
        return sineTone(1046, 0.4, 0.5, 10)
      case 'submitClick':
        return noiseBurst(0.05, 0.5)
      default:
        return noiseBurst(0.2, 0.3)
    }
  }

  async playOnce(keyOrKeys: SoundKey | SoundKey[], channel: string = 'sfx'){
    if(!audioManager.isEnabled()){
      return
    }
    const key = Array.isArray(keyOrKeys)
      ? keyOrKeys[randBetween(0, keyOrKeys.length - 1)]
      : keyOrKeys
    await audioManager.resume()
    const buffer = await this.getBuffer(key)
    if(buffer){
      audioManager.playBuffer(buffer, channel)
    }
  }

  startLoop(options: NoiseLoopOptions){
    const { key, keys, minMs, maxMs, channel = 'sfx' } = options
    if(!audioManager.isEnabled()){
      return () => {}
    }
    let active = true
    let timer: number | undefined

    const schedule = () => {
      if(!active){
        return
      }
      const delay = randBetween(minMs, maxMs)
      timer = window.setTimeout(async () => {
        if(!active){
          return
        }
        const resolved = chooseKey(key, keys)
        if(resolved){
          await this.playOnce(resolved, channel)
        }
        schedule()
      }, delay)
      this.timers.add(timer)
    }

    schedule()

    return () => {
      active = false
      if(timer){
        window.clearTimeout(timer)
        this.timers.delete(timer)
      }
    }
  }
}

export type { NoiseLoopOptions }
