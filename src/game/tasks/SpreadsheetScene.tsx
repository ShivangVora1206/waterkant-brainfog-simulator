import React, { useMemo, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Panel from '../../components/Panel'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import useBlurLoop from '../../effects/useBlurLoop'
import useNoiseLoop from '../../audio/useNoiseLoop'
import noiseScheduler from '../../audio/noiseSchedulerSingleton'
import { timings } from './taskTimings'
import type { SoundKey } from '../../audio/soundCatalog'

const doorKnockKeys: SoundKey[] = ['doorKnock1', 'doorKnock2']
const whisperKeys: SoundKey[] = ['whisper1', 'whisper2']
const phoneKeys: SoundKey[] = ['phoneRingShort', 'phoneRingLong']

const dataSetA = [
  { a: 12, b: 7 },
  { a: 9, b: 13 },
  { a: 5, b: 8 },
  { a: 11, b: 3 },
  { a: 6, b: 14 }
]

const dataSetB = [
  { a: 12, b: 7 },
  { a: 9, b: 14 },
  { a: 5, b: 8 },
  { a: 11, b: 3 },
  { a: 6, b: 14 }
]

type SpreadsheetSceneProps = {
  variant: 1 | 2
  onComplete: () => void
}

export default function SpreadsheetScene({ variant, onComplete }: SpreadsheetSceneProps){
  const data = useMemo(() => (variant === 1 ? dataSetA : dataSetB), [variant])
  const [inputs, setInputs] = useState<string[]>(() => data.map(() => ''))
  const [status, setStatus] = useState('Füllen Sie die Summen aus und senden Sie das Formular ab.')
  const [error, setError] = useState('')
  const isVariant2 = variant === 2
  const blurOptions = isVariant2 ? timings.spreadsheet.blurFast : timings.spreadsheet.blur
  const globalBlur = useBlurLoop({
    enabled: true,
    minDelayMs: blurOptions.minDelayMs,
    maxDelayMs: blurOptions.maxDelayMs,
    minDurationMs: blurOptions.minDurationMs,
    maxDurationMs: blurOptions.maxDurationMs,
    minBlur: blurOptions.minBlur,
    maxBlur: blurOptions.maxBlur
  })
  const tableBlur = useBlurLoop({
    enabled: true,
    minDelayMs: Math.max(400, blurOptions.minDelayMs - 300),
    maxDelayMs: blurOptions.maxDelayMs,
    minDurationMs: blurOptions.minDurationMs,
    maxDurationMs: blurOptions.maxDurationMs + 200,
    minBlur: blurOptions.minBlur + (isVariant2 ? 1 : 0),
    maxBlur: blurOptions.maxBlur + (isVariant2 ? 2 : 1)
  })

  useNoiseLoop(true, {
    keys: doorKnockKeys,
    minMs: isVariant2 ? timings.spreadsheet.doorKnockFast.minMs : timings.spreadsheet.doorKnock.minMs,
    maxMs: isVariant2 ? timings.spreadsheet.doorKnockFast.maxMs : timings.spreadsheet.doorKnock.maxMs,
    channel: 'sfx'
  })

  // Carry over stress sounds on the redo task.
  useNoiseLoop(isVariant2, {
    keys: whisperKeys,
    minMs: 2600,
    maxMs: 5200,
    channel: 'sfx'
  })
  useNoiseLoop(isVariant2, {
    keys: phoneKeys,
    minMs: 2600,
    maxMs: 5200,
    channel: 'sfx'
  })

  const onChange = (idx: number, value: string) => {
    const next = inputs.slice()
    next[idx] = value
    setInputs(next)
  }
  // Vignette for variant 2: slowly grow until submit
  const [vignetteLevel, setVignetteLevel] = useState(0)
  const [vignetteActive, setVignetteActive] = useState(isVariant2)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if(!isVariant2) return
    let last = performance.now()
    const step = (now: number) => {
      const dt = now - last
      last = now
      if(vignetteActive){
        // growth speed tuned to be slow; adjust multiplier to taste
        setVignetteLevel((v) => Math.min(1, v + dt * 0.00002))
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if(rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isVariant2, vignetteActive])

  const onSubmit = () => {
    const correct = inputs.every((v, i) => Number(v) === data[i].a + data[i].b)
    if(!correct){
      setError('Einige Antworten sind falsch. Bitte überprüfe sie noch einmal.')
      setStatus('')
      return
    }
    setError('')
    setStatus('All correct.')
    void noiseScheduler.playOnce('submitClick')
    if(!isVariant2){
      void noiseScheduler.playOnce([...whisperKeys])
    }
    // stop vignette growth when the user finally submits
    setVignetteActive(false)
    onComplete()
  }

  const vignetteOverlay = isVariant2 ? createPortal(
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        transition: 'background 300ms linear',
        background: (() => {
          const eased = Math.pow(vignetteLevel, 1.4)
          const opacity = Math.min(0.9, 0.85 * eased)
          const innerStop = Math.max(0, 100 - eased * 88)
          return `radial-gradient(ellipse at center, rgba(0,0,0,0) ${innerStop}%, rgba(0,0,0,${opacity}) ${innerStop}%, rgba(0,0,0,${opacity}) 100%)`
        })()
      }}
    />,
    document.body
  ) : null

  return (
    <>
      {vignetteOverlay}
      <Panel
        title={variant === 1 ? 'Spreadsheet Task' : 'Den Fehler beheben'}
        className="blur-target"
        style={{ filter: `blur(${globalBlur}px)` }}
      >
        <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className='column'>
          <p className="status">Addiere die Zahlen in jeder Zeile und trage die Summe ein.</p>
          <p className="status">Add the numbers in each row and enter the sum.</p></div>
          <Button onClick={onSubmit}>Absenden</Button>
        </div>
        <div className="blur-target" style={{ filter: `blur(${tableBlur}px)` }}>
          <table className="table" aria-label="Spreadsheet">
            <thead>
              <tr>
                <th>Value A</th>
                <th>Value B</th>
                <th>Summe</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={`${row.a}-${row.b}-${i}`}>
                  <td>{row.a}</td>
                  <td>{row.b}</td>
                  <td>
                    <TextInput
                      inputMode="numeric"
                      value={inputs[i]}
                      onChange={(e) => onChange(i, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error ? <p className="status error">{error}</p> : null}
        {status && !error ? <p className="status ok">{status}</p> : null}
      </Panel>
    </>
  )
}
