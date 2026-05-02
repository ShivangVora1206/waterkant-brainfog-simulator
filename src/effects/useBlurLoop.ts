import { useEffect, useMemo, useState } from 'react'

type BlurOptions = {
  enabled: boolean
  minDelayMs: number
  maxDelayMs: number
  minDurationMs: number
  maxDurationMs: number
  minBlur: number
  maxBlur: number
}

function randBetween(min: number, max: number){
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function useBlurLoop(options: BlurOptions){
  const {
    enabled,
    minDelayMs,
    maxDelayMs,
    minDurationMs,
    maxDurationMs,
    minBlur,
    maxBlur
  } = options

  const [blur, setBlur] = useState(0)
  const bounds = useMemo(() => ({ minDelayMs, maxDelayMs, minDurationMs, maxDurationMs, minBlur, maxBlur }), [
    minDelayMs,
    maxDelayMs,
    minDurationMs,
    maxDurationMs,
    minBlur,
    maxBlur
  ])

  useEffect(() => {
    if(!enabled){
      setBlur(0)
      return
    }
    let active = true
    let timer: number | undefined

    const schedule = () => {
      const delay = randBetween(bounds.minDelayMs, bounds.maxDelayMs)
      timer = window.setTimeout(() => {
        if(!active) return
        const amount = randBetween(bounds.minBlur, bounds.maxBlur)
        setBlur(amount)
        const duration = randBetween(bounds.minDurationMs, bounds.maxDurationMs)
        timer = window.setTimeout(() => {
          if(!active) return
          setBlur(0)
          schedule()
        }, duration)
      }, delay)
    }

    schedule()

    return () => {
      active = false
      if(timer){
        window.clearTimeout(timer)
      }
      setBlur(0)
    }
  }, [enabled, bounds])

  return blur
}
