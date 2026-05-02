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
    // Increase delay between blur events (less frequent) and lengthen duration
    const delayMultiplier = 2.5 // make blurs less frequent
    const durationMultiplier = 1.6 // make each blur last longer

    const schedule = () => {
      const baseDelay = randBetween(bounds.minDelayMs, bounds.maxDelayMs)
      const delay = Math.max(0, Math.floor(baseDelay * delayMultiplier))
      timer = window.setTimeout(() => {
        if(!active) return
        const amount = randBetween(bounds.minBlur, bounds.maxBlur)
        setBlur(amount)
        const baseDuration = randBetween(bounds.minDurationMs, bounds.maxDurationMs)
        const duration = Math.max(0, Math.floor(baseDuration * durationMultiplier))
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
