// AudioManager skeleton using Web Audio API
export default class AudioManager {
  private ctx: AudioContext | null = null
  private channels: Record<string, GainNode> = {}
  private activeSources: Record<string, AudioBufferSourceNode[]> = {}
  private enabled = false
  private enabledListeners = new Set<(enabled: boolean) => void>()

  setEnabled(enabled: boolean){
    this.enabled = enabled
    this.enabledListeners.forEach((listener) => listener(enabled))
  }

  isEnabled(){
    return this.enabled
  }

  onEnabledChange(listener: (enabled: boolean) => void){
    this.enabledListeners.add(listener)
    return () => this.enabledListeners.delete(listener)
  }

  init(){
    if(this.ctx){
      return
    }
    this.ctx = new AudioContext()
    this.channels = {
      ambience: this.ctx.createGain(),
      sfx: this.ctx.createGain(),
      tts: this.ctx.createGain(),
      music: this.ctx.createGain()
    }
    // track active sources per channel
    Object.keys(this.channels).forEach(k => { this.activeSources[k] = [] })
    // connect to destination
    Object.values(this.channels).forEach(g => g.connect(this.ctx!.destination))
  }

  async resume(){
    if(!this.ctx){
      this.init()
    }
    if(this.ctx && this.ctx.state !== 'running'){
      await this.ctx.resume()
    }
  }

  getContext(){
    if(!this.ctx){
      this.init()
    }
    return this.ctx!
  }

  setChannelVolume(channel: string, volume: number){
    if(!this.ctx){
      this.init()
    }
    if(this.channels[channel]){
      this.channels[channel].gain.value = volume
    }
  }

  async decodeAudioData(arrayBuffer: ArrayBuffer){
    if(!this.ctx) this.init()
    return await this.ctx!.decodeAudioData(arrayBuffer)
  }

  async loadBufferFromUrl(url: string){
    const resp = await fetch(url)
    if(!resp.ok){
      throw new Error(`Failed to load audio: ${resp.status} ${resp.statusText}`)
    }
    const ab = await resp.arrayBuffer()
    return await this.decodeAudioData(ab)
  }

  // Play an AudioBuffer on a given channel
  playBuffer(buffer: AudioBuffer, channel = 'sfx', when = 0, loop = false){
    if(!this.enabled){
      return null
    }
    if(!this.ctx) this.init()
    const src = this.ctx!.createBufferSource()
    src.buffer = buffer
    src.loop = loop
    src.connect(this.channels[channel])
    src.start(this.ctx!.currentTime + when)
    // track the source so it can be stopped later
    if(!this.activeSources[channel]) this.activeSources[channel] = []
    this.activeSources[channel].push(src)
    const removeFromActive = () => {
      const list = this.activeSources[channel]
      if(!list) return
      const idx = list.indexOf(src)
      if(idx >= 0) list.splice(idx, 1)
    }
    src.onended = removeFromActive
    return src
  }

  // Stop all sources on a channel (safe to call even if none)
  stopChannel(channel: string){
    const list = this.activeSources[channel]
    if(!list || list.length === 0) return
    while(list.length){
      const s = list.pop()!
      try{ s.stop() }catch(e){}
      try{ s.disconnect() }catch(e){}
    }
  }

  // Stop all active sources across all channels
  stopAll(){
    Object.keys(this.activeSources).forEach(ch => this.stopChannel(ch))
  }

  // Smoothly ramp a channel's gain to a target over `durationSec` seconds.
  fadeChannel(channel: string, targetVolume: number, durationSec = 1){
    if(!this.ctx) this.init()
    const g = this.channels[channel]
    if(!g) return
    const now = this.ctx!.currentTime
    try{
      g.gain.cancelScheduledValues(now)
      g.gain.setValueAtTime(g.gain.value, now)
      g.gain.linearRampToValueAtTime(targetVolume, now + durationSec)
    }catch(e){
      try{ g.gain.value = targetVolume }catch(_){}
    }
  }
}
