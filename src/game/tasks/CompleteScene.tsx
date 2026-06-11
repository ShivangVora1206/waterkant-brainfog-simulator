import React, { useEffect } from 'react'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import noiseScheduler from '../../audio/noiseSchedulerSingleton'
import audioManager from '../../audio/audioManagerSingleton'

export default function CompleteScene(){
  useEffect(() => {
    noiseScheduler.stopAll()
    // fade ambience out smoothly, then stop the channel
    try{
      audioManager.fadeChannel('ambience', 0, 1.2)
      setTimeout(() => {
        try{ audioManager.stopChannel('ambience') }catch(e){}
      }, 1300)
    }catch(e){
      try{ audioManager.stopChannel('ambience') }catch(_){}
    }
    // also stop other remaining sources after a short delay
    setTimeout(() => { try{ audioManager.stopAll() }catch(_){} }, 1400)
  }, [])

  return (
    <Panel title="Erledigte Aufgaben">
      <p>Alle Aufgaben erledigt. Atme tief durch.</p>
      <p>All tasks finished. Take a breath.</p>
      
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Button onClick={() => window.location.reload()}>Neues Spiel / New Game</Button>
      </div>
    </Panel>
  )
}
