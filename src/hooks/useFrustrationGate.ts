import { useCallback, useRef, useState } from 'react'

type Handler = (event: any) => void

type Gate = {
  requiredTries: number
  attempts: number
  gateClick: (handler?: Handler) => Handler
  gatePointerDown: (handler?: Handler) => Handler
}

export default function useFrustrationGate(enabled = true): Gate {
  const requiredRef = useRef<number>(enabled ? Math.floor(Math.random() * 2) : 0)
  const [attempts, setAttempts] = useState(0)

  const gate = useCallback(
    (handler?: Handler) => {
      return (event: any) => {
        if(!enabled || attempts >= requiredRef.current){
          handler?.(event)
          return
        }
        event.preventDefault()
        event.stopPropagation()
        setAttempts((prev) => prev + 1)
      }
    },
    [attempts, enabled]
  )

  return {
    requiredTries: requiredRef.current,
    attempts,
    gateClick: gate,
    gatePointerDown: gate
  }
}
