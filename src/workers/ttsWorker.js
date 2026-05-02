// Simple TTS worker stub. In production this will request pre-generated files or a local TTS endpoint.
self.onmessage = async (evt) => {
  const {type, payload} = evt.data
  if(type === 'fetchArrayBuffer'){
    const {url, id} = payload
    try{
      const resp = await fetch(url)
      const ab = await resp.arrayBuffer()
      self.postMessage({type: 'fetched', id, arrayBuffer: ab}, [ab])
    }catch(err){
      self.postMessage({type:'error', id, error: String(err)})
    }
  }
}
