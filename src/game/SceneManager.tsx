import React from 'react'
import { useGameStore } from '../store/useGameStore'
import IntroScene from './tasks/IntroScene'
import NameEntryScene from './tasks/NameEntryScene'
import SpreadsheetScene from './tasks/SpreadsheetScene'
import SpellcheckScene from './tasks/SpellcheckScene'
import BossAlertScene from './tasks/BossAlertScene'
import CompleteScene from './tasks/CompleteScene'

export default function SceneManager(){
  const scene = useGameStore((s) => s.scene)
  const nextScene = useGameStore((s) => s.nextScene)

  switch(scene){
    case 'intro':
      return <IntroScene />
    case 'nameEntry':
      return <NameEntryScene />
    case 'spreadsheet1':
      return <SpreadsheetScene variant={1} onComplete={nextScene} />
    case 'spellcheck':
      return <SpellcheckScene onComplete={nextScene} />
    case 'bossAlert':
      return <BossAlertScene onContinue={nextScene} />
    case 'spreadsheet2':
      return <SpreadsheetScene variant={2} onComplete={nextScene} />
    case 'complete':
      return <CompleteScene />
    default:
      return <IntroScene />
  }
}
