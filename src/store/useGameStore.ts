import { create } from 'zustand'

export type SceneId =
  | 'intro'
  | 'nameEntry'
  | 'spreadsheet1'
  | 'spellcheck'
  | 'bossAlert'
  | 'spreadsheet2'
  | 'complete'

const sceneOrder: SceneId[] = [
  'intro',
  'nameEntry',
  'spreadsheet1',
  'spellcheck',
  'bossAlert',
  'spreadsheet2',
  'complete'
]

type GameState = {
  playerName: string
  scene: SceneId
  setPlayerName: (name: string) => void
  goToScene: (scene: SceneId) => void
  nextScene: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: '',
  scene: 'intro',
  setPlayerName: (name) => set({ playerName: name }),
  goToScene: (scene) => set({ scene }),
  nextScene: () => {
    const current = get().scene
    const idx = sceneOrder.indexOf(current)
    const next = sceneOrder[Math.min(idx + 1, sceneOrder.length - 1)]
    set({ scene: next })
  }
}))
