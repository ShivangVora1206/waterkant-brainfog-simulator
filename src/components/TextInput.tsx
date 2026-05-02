import React from 'react'
import useFrustrationGate from '../hooks/useFrustrationGate'

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  frustration?: boolean
}

export default function TextInput({
  frustration = true,
  onPointerDown,
  onMouseDown,
  onTouchStart,
  disabled,
  ...props
}: TextInputProps){
  const gate = useFrustrationGate(frustration && !disabled)
  const className = ['text-input', props.className].filter(Boolean).join(' ')
  const handlePointerDown = gate.gatePointerDown(onPointerDown)
  const handleMouseDown = gate.gatePointerDown(onMouseDown)
  const handleTouchStart = gate.gatePointerDown(onTouchStart)
  return (
    <input
      {...props}
      className={className}
      onPointerDown={handlePointerDown}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      disabled={disabled}
    />
  )
}
