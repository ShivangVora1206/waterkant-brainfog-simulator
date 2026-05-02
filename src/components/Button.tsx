import React from 'react'
import useFrustrationGate from '../hooks/useFrustrationGate'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  frustration?: boolean
}

export default function Button({
  variant = 'primary',
  className = '',
  frustration = true,
  onClick,
  disabled,
  ...props
}: ButtonProps){
  const gate = useFrustrationGate(frustration && !disabled)
  const handleClick = gate.gateClick(onClick)
  const classes = ['button', variant === 'secondary' ? 'secondary' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      className={classes}
      {...props}
      onClick={handleClick}
      disabled={disabled}
      data-frustration-attempts={gate.attempts}
      data-frustration-required={gate.requiredTries}
    />
  )
}
