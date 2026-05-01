## Plan: Brainfog Simulator

TL;DR - Build a modular React + react-game-kit web app that simulates brainfog through staged office tasks, layered randomized visual blur and audio distractions, and TTS/name-calls. Design as small, ticketed components so multiple agents can implement in parallel. Use a dedicated audio subsystem and worker-based TTS/background audio handling optimized for Raspberry Pi.

**Steps**
1. Project scaffolding
   - Create repo structure (web app with React + react-game-kit). *depends on nothing*
   - Ticket: "Scaffold app" — create package.json, basic webpack/Vite config, `src/index.tsx`, `public/index.html`.
   - Acceptance: App boots to a placeholder home page.

2. Core architecture & shared systems
   - Implement core game loop using react-game-kit and a scene/router system.
   - Implement global state (use Zustand or Redux) for player state, audio state, and task progress.
   - Ticket: "Core architecture + state" — `GameRoot`, `SceneManager`, `store`.
   - Acceptance: Can transition between placeholder scenes and update shared state.

3. Audio & TTS subsystem (priority for Pi performance)
   - Design AudioManager using Web Audio API: central AudioContext, named channels (SFX, Ambience, TTS, Music), gain nodes per channel, and methods to play/stop/pause/change volume with crossfades.
   - Implement a TTS worker pattern: a worker job queue that either (A) fetches pre-generated audio files, or (B) requests local TTS engine via a small local server on Pi. Worker performs decoding and posts back AudioBuffers for playback to AudioManager.
   - Ticket: "AudioManager + TTS worker" — implement `audio/AudioManager`, `workers/ttsWorker`.
   - Acceptance: Play a background loop, play ambiences, and request TTS for a short phrase without blocking UI.

4. Sound assets & asset pipeline
   - Define assets directory and naming conventions. Provide a CLI or npm script to preload and encode assets (use lower sample rate copies for Pi). Prefer `.ogg` and `.wav` (for TTS). Create metadata JSON mapping sound keys to files and durations.
   - Ticket: "Assets pipeline" — `assets/sounds/*` and `scripts/preload-sounds.js`.
   - Acceptance: All listed assets load and report play durations.

5. UI components & accessibility
   - Implement reusable UI primitives: TextInput, Button, SpreadsheetGrid, WordFixer, Modal, NotificationBanner.
   - Ensure keyboard navigation and screen-reader hints where appropriate.
   - Ticket: "UI primitives" — components in `src/components/`.
   - Acceptance: Components are accessible, stylable, and documented.

6. Task implementations (each as a separate ticket)
   - Task A: Name entry screen (beat 1). Ticket: "Task: Name entry". Acceptance: Accepts name and advances.
   - Task B: Spreadsheet arithmetic (beats 2-4). Ticket: "Task: Spreadsheet" — add column input grid, submit button, error check flow, blur events, door-knock SFX timeline.
   - Task C: Spell-check words (beats 5-6). Ticket: "Task: Spellcheck" — three red words to correct, validation, blur events, phone ringing SFX, TTS name calls.
   - Task D: Boss alert + repeat task (beats 7-8). Ticket: "Task: Boss alert + redo" — show alert, load almost identical spreadsheet with one changed number, faster blur cadence.
   - Task E: Victory screen (beat 9). Ticket: "Task: Calm completion" — mute audio, clear blur, show success message.
   - Acceptance for each: unit test for success/fail path; visually and aurally match behavior spec.

7. Randomized visual distraction engine
   - Implement a BlurManager that schedules global and per-component blur events using seeded RNG for repeatability. Blur effects should be CSS or canvas-based with GPU-accelerated transforms to lower CPU load.
   - Ticket: "BlurManager" — API: scheduleBlur(targetId, duration, intensity).
   - Acceptance: Can trigger blurs on arbitrary components without blocking main thread.

8. Background noise scheduler
   - Implement NoiseScheduler: controls frequency and intensity of events (door knocks, whispers, phone rings) by timeline and dynamic difficulty curve.
   - Ticket: "NoiseScheduler" — exposes start/stop, setIntensity(level), setSeed(seed).
   - Acceptance: Can increase event frequency over time and react to game state (e.g., when TTS occurs, increase whispers).

9. Performance & Raspberry Pi optimizations
   - Replace heavy DOM animations with canvas or GPU-accelerated CSS when necessary.
   - Use workers for TTS and audio decoding; use pre-mixed short loops to reduce simultaneous decode work.
   - Reduce audio sample rates; limit concurrent AudioBufferSources; implement audio pooling.
   - Ticket: "Pi optimizations" — benchmark profile and hardening.
   - Acceptance: Sustained 30+ FPS on target Pi model (specify Pi model in follow-up) and acceptable audio sync.

10. Testing, verification & CI
   - Add unit tests for state and key utilities; add end-to-end smoke tests for task flows (Cypress/Playwright). Include a Pi smoke-run script.
   - Ticket: "Testing + CI" — tests and CI pipeline.
   - Acceptance: All tests pass in CI; manual smoke test script runs on Pi.

11. Documentation & handoff
   - Write README, run instructions for Raspberry Pi, asset labeling guide, and developer handoff notes.
   - Ticket: "Docs + runbook".
   - Acceptance: New developer can run the app locally and on Pi following docs.

**Relevant files to create**
- src/index.tsx — app entry
- src/GameRoot.tsx — scene manager + router
- src/store/* — global state (player, audio, tasks)
- src/components/* — UI primitives and task components
- src/game/tasks/* — TaskA, TaskB, TaskC, TaskD, TaskE components
- src/audio/AudioManager.ts — central audio system
- src/workers/ttsWorker.ts — TTS & decode worker
- assets/sounds/* — organized sound files
- scripts/preload-sounds.js — asset pipeline helper
- public/index.html, package.json, vite.config.ts (or webpack)

**Assets (suggested filenames & labels)**
- ambience/office_hum_loop.ogg — low-volume ambient office hum
- sfx/door_knock_01.ogg, door_knock_02.ogg — door knocks
- sfx/phone_ring_short.ogg, phone_ring_long.ogg — phone rings
- sfx/whisper_faint_01.ogg, whisper_faint_02.ogg — layered whisper loops
- sfx/alert_boss.ogg — urgent boss alert tone
- sfx/submit_click.ogg — UI submit click
- tts/name_call_{{name}}.wav — generated TTS clips (pattern)
- ambience/calm_end.ogg — final calm background
- Each asset: metadata JSON entry {key, filename, duration, recommendedVolume, loopable:true|false, sampleRateHint}

**Ticketing (example per-ticket fields)**
- Title: short task title
- Description: implement details and APIs
- Dependencies: list other tickets
- Estimate: small/medium/large
- Acceptance Criteria: concrete checks (unit tests, manual flows)
- Owner: assignee placeholder

**Threading & runtime design for Pi**
- Use a single shared AudioContext on the main thread; offload decoding and TTS generation to Web Worker(s) (or Node worker for local server) to avoid blocking rendering.
- Worker responsibilities: fetch/stream audio files, decode via decodeAudioData, queue AudioBuffers back to main thread.
- TTS options:
  - Preferred offline Pi approach: pre-generate TTS WAVs using a lightweight TTS engine (espeak-ng or pico2wave) and store under assets/tts. Worker requests pre-generated file by key.
  - Alternative: run a small local Node service on Pi that invokes the TTS engine and returns audio; worker calls that endpoint.
- Audio scheduling: schedule playback using AudioContext.currentTime + small offset to maintain sync; use audio pooling to reduce GC.
- Visual effects: compute blur scheduling on main thread but offload heavy timing to requestAnimationFrame and small helper workers for RNG if needed. Keep DOM updates minimal.
- Resource limits: cap concurrent SFX (e.g., max 6) and reuse buffer sources.

**Verification**
1. Unit tests: AudioManager methods, BlurManager scheduling, RNG determinism.
2. E2E: Playthrough from name entry → tasks A–E automatically using test harness (Cypress), asserting state and visual/audio events.
3. Pi smoke-run: build and run script to fetch prebuilt assets and run in Chromium on target Pi; measure FPS and CPU.
4. Manual sensory validation: confirm sound layering, TTS naming correctness, blur cadence matches design.

**Decisions & assumptions**
- Use React + react-game-kit for 2D scene handling.
- Prefer pre-generated TTS on Pi for reliability and low CPU use.
- Use Web Audio API for mixing; fallback to HTMLAudioElement if unavailable.
- Asset licensing: developer must supply or source CC0/royalty-free clips for public use.

**Further considerations**
1. Target Raspberry Pi model and OS image?  Pi 4+ 
2. Offline-only requirement for TTS? Yes, offline only.
3. Languages/locales for TTS? German language and locale.
