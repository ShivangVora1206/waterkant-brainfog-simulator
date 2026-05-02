import React from 'react'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import { useGameStore } from '../../store/useGameStore'

export default function IntroScene(){
  const nextScene = useGameStore((s) => s.nextScene)

  return (
    <Panel title="Brain Fog Simulator">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
        {/* German side */}
        <div>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
            Willkommen! In dieser Ausstellung werden Sie erleben, wie es sich anfühlt, unter kognitiver Belastung und Ablenkungen zu arbeiten eine Simulation der Auswirkungen von Gehirnnebel, Müdigkeit und Umwelteinflüssen.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
            Sie werden mehrere konzentrierte Aufgaben erledigen, während Sie mit zunehmenden Ablenkungsgraden konfrontiert werden: verschwommenes Sehen, plötzliche Geräusche, Unterbrechungen und schwindende Konzentration. Achten Sie darauf, wie sich Ihre Leistung verändert und wie diese Stressoren Ihre Konzentrationsfähigkeit beeinflussen.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            Sind Sie bereit, den Nebel zu erleben?
          </p>
        </div>
        
        {/* English side */}
        <div>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
            Welcome! In this exhibit, you will experience what it feels like to work under cognitive strain 
            and distractions simulating the effects of brain fog, fatigue, and environmental interference.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
            You'll complete several focused tasks while facing increasing levels of distraction: blurred vision, 
            sudden noise, interruptions, and diminishing focus. Pay attention to how your performance changes and 
            how these stressors affect your ability to concentrate.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            Are you ready to experience the fog?
          </p>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Button onClick={nextScene}>Los Geht's</Button>
      </div>
    </Panel>
  )
}
