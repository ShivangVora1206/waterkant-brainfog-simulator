import React, { useMemo, useState } from 'react'
import Panel from '../../components/Panel'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import useBlurLoop from '../../effects/useBlurLoop'
import useNoiseLoop from '../../audio/useNoiseLoop'
import useNameCallLoop from '../../effects/useNameCallLoop'
import { useGameStore } from '../../store/useGameStore'
import { timings } from './taskTimings'
import type { SoundKey } from '../../audio/soundCatalog'

const phoneKeys: SoundKey[] = ['phoneRingShort', 'phoneRingLong']

const words = [
  { wrong: 'recieve', correct: 'receive' },
  { wrong: 'acommodate', correct: 'accommodate' },
  { wrong: 'occured', correct: 'occurred' }
]

type SpellcheckSceneProps = {
  onComplete: () => void
}

export default function SpellcheckScene({ onComplete }: SpellcheckSceneProps){
  const [values, setValues] = useState(() => words.map((w) => w.wrong))
  const [submitted, setSubmitted] = useState(false)
  const playerName = useGameStore((s) => s.playerName)
  const blurOptions = timings.spellcheck.blur
  const globalBlur = useBlurLoop({
    enabled: true,
    minDelayMs: blurOptions.minDelayMs,
    maxDelayMs: blurOptions.maxDelayMs,
    minDurationMs: blurOptions.minDurationMs,
    maxDurationMs: blurOptions.maxDurationMs,
    minBlur: blurOptions.minBlur,
    maxBlur: blurOptions.maxBlur
  })
  const wordBlur = useBlurLoop({
    enabled: true,
    minDelayMs: Math.max(500, blurOptions.minDelayMs - 200),
    maxDelayMs: blurOptions.maxDelayMs,
    minDurationMs: blurOptions.minDurationMs,
    maxDurationMs: blurOptions.maxDurationMs + 200,
    minBlur: blurOptions.minBlur,
    maxBlur: blurOptions.maxBlur + 1
  })

  useNoiseLoop(true, {
    keys: phoneKeys,
    minMs: timings.spellcheck.phoneRing.minMs,
    maxMs: timings.spellcheck.phoneRing.maxMs,
    channel: 'sfx'
  })
  useNameCallLoop(playerName, true)

  const correctFlags = useMemo(
    () => values.map((v, i) => v.trim().toLowerCase() === words[i].correct),
    [values]
  )
  const allCorrect = correctFlags.every(Boolean)

  const onChange = (idx: number, value: string) => {
    const next = values.slice()
    next[idx] = value
    setValues(next)
  }

  const onSubmit = () => {
    setSubmitted(true)
    if(allCorrect){
      onComplete()
    }
  }

  return (
    <Panel title="Rechtschreibprüfung" className="blur-target" style={{ filter: `blur(${globalBlur}px)` }}>
      <p className="status">Korrigiere die Rechtschreibfehler. Die rot markierten Wörter werden grün, sobald sie korrigiert sind.</p>
      <p className="status">Fix the spelling mistakes. Red words turn green when corrected.</p>
      <div className="blur-target" style={{ filter: `blur(${wordBlur}px)` }}>
        {words.map((w, i) => (
          <div className="row" key={w.correct}>
            <TextInput
              value={values[i]}
              onChange={(e) => onChange(i, e.target.value)}
              style={{
                borderColor: correctFlags[i] ? 'var(--ok)' : 'var(--danger)',
                color: correctFlags[i] ? 'var(--ok)' : 'var(--danger)'
              }}
            />
          </div>
        ))}
      </div>
      <Button onClick={onSubmit}>Absenden</Button>
      {submitted && !allCorrect ? (
        <p className="status error">Einige Wörter sind noch falsch.</p>
      ) : null}
    </Panel>
  )
}
