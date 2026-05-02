import React, { useState } from 'react'
import Panel from '../../components/Panel'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import { useGameStore } from '../../store/useGameStore'

export default function NameEntryScene(){
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const setPlayerName = useGameStore((s) => s.setPlayerName)
  const nextScene = useGameStore((s) => s.nextScene)

  const onStart = () => {
    const trimmed = name.trim()
    if(!trimmed){
      setError('Bitte geben Sie Ihre ID ein.')
      return
    }
    setPlayerName(trimmed)
    setError('')
    nextScene()
  }

  return (
    <Panel title="Willkommen, Mitarbeiter!">
      <div className="row">
        <TextInput
          placeholder="Ihre Mitarbeiter-ID"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={onStart}>Anmelden</Button>
      </div>
      {error ? <p className="status error">{error}</p> : <p className="status">Geben Sie Ihre Mitarbeiter-ID ein, um sich anzumelden.</p>}
    </Panel>
  )
}
