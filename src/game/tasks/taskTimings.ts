export const timings = {
  spreadsheet: {
    doorKnock: { minMs: 3500, maxMs: 8000 },
    doorKnockFast: { minMs: 1600, maxMs: 3200 },
    blur: { minDelayMs: 900, maxDelayMs: 2000, minDurationMs: 600, maxDurationMs: 1400, minBlur: 2, maxBlur: 5 },
    blurFast: { minDelayMs: 500, maxDelayMs: 1200, minDurationMs: 700, maxDurationMs: 1600, minBlur: 4, maxBlur: 8 }
  },
  spellcheck: {
    phoneRing: { minMs: 3000, maxMs: 6500 },
    blur: { minDelayMs: 700, maxDelayMs: 1700, minDurationMs: 700, maxDurationMs: 1600, minBlur: 3, maxBlur: 7 }
  },
  bossAlert: {
    whisper: { minMs: 2600, maxMs: 5200 },
    phoneRing: { minMs: 2600, maxMs: 5200 }
  }
}
