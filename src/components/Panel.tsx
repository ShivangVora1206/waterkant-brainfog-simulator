import React from 'react'

type PanelProps = {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Panel({ title, children, footer, className = '', style }: PanelProps){
  return (
    <section className={["scene", className].filter(Boolean).join(' ')} style={style}>
      {title ? <h1>{title}</h1> : null}
      <div>{children}</div>
      {footer ? <div style={{ marginTop: 16 }}>{footer}</div> : null}
    </section>
  )
}
