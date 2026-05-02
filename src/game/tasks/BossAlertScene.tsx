import React, { useEffect } from 'react'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import useNoiseLoop from '../../audio/useNoiseLoop'
import noiseScheduler from '../../audio/noiseSchedulerSingleton'
import { timings } from './taskTimings'
import type { SoundKey } from '../../audio/soundCatalog'

const phoneKeys: SoundKey[] = ['phoneRingShort', 'phoneRingLong']
const whisperKeys: SoundKey[] = ['whisper1', 'whisper2']

type BossAlertSceneProps = {
  onContinue: () => void
}

export default function BossAlertScene({ onContinue }: BossAlertSceneProps){
  useEffect(() => {
    void noiseScheduler.playOnce('alertBoss')
  }, [])

  useNoiseLoop(true, {
    keys: phoneKeys,
    minMs: timings.bossAlert.phoneRing.minMs,
    maxMs: timings.bossAlert.phoneRing.maxMs,
    channel: 'sfx'
  })
  useNoiseLoop(true, {
    keys: whisperKeys,
    minMs: timings.bossAlert.whisper.minMs,
    maxMs: timings.bossAlert.whisper.maxMs,
    channel: 'sfx'
  })

  return (
    <Panel title="Dringende Nachricht!!" style={{color:'red', boxShadow: '0 8px 24px rgba(255, 0, 0, 0.4)'}}>
      <p style={{color:'black'}}>Du hast einen Fehler in der Tabelle gemacht. Korrigiere ihn jetzt.</p>
      <p style={{color:'black'}}>You made an error in the spreadsheet. Fix it now.</p>
      <Button onClick={onContinue}>Korrigieren</Button>
    </Panel>
  )
}
