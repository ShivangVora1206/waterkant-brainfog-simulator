# Brainfog Simulator

Scaffolded React + Vite project for the Brainfog Simulator exhibit.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run serve
```

## Notes
- Scenes live in `src/game/tasks/`.
- Global state uses Zustand in `src/store/useGameStore.ts`.
- Audio system lives in `src/audio/` and uses a Web Worker for TTS fetching.
