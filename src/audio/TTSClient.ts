import audioManager from './audioManagerSingleton'

type Pending = {
  resolve: (ab: ArrayBuffer) => void
  reject: (err: Error) => void
}

class TTSClient {
  private worker: Worker
  private pending = new Map<string, Pending>()
  private counter = 0

  constructor(){
    this.worker = new Worker(new URL('../workers/ttsWorker.js', import.meta.url), { type: 'module' })
    this.worker.onmessage = (evt) => {
      const { type, id, arrayBuffer, error } = evt.data
      if(type === 'fetched'){
        const entry = this.pending.get(id)
        if(entry){
          entry.resolve(arrayBuffer)
          this.pending.delete(id)
        }
      }
      if(type === 'error'){
        const entry = this.pending.get(id)
        if(entry){
          entry.reject(new Error(error))
          this.pending.delete(id)
        }
      }
    }
  }

  private nextId(){
    this.counter += 1
    return `tts-${Date.now()}-${this.counter}`
  }

  private fetchArrayBuffer(url: string){
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const id = this.nextId()
      this.pending.set(id, { resolve, reject })
      this.worker.postMessage({ type: 'fetchArrayBuffer', payload: { url, id } })
    })
  }

  async speakFromUrl(url: string, channel: string = 'tts'){
    if(!audioManager.isEnabled()){
      return
    }
    await audioManager.resume()
    const ab = await this.fetchArrayBuffer(url)
    const buffer = await audioManager.decodeAudioData(ab)
    audioManager.playBuffer(buffer, channel)
  }
}

const ttsClient = new TTSClient()

export default ttsClient
