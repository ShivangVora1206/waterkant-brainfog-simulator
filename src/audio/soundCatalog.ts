const sfxUrl = (fileName: string) => new URL(`../../assets/sounds/sfx/${fileName}`, import.meta.url).href

export const soundCatalog = {
  doorKnock1: sfxUrl('door_knock_01.ogg'),
  doorKnock2: sfxUrl('door_knock_02.ogg'),
  phoneRingShort: sfxUrl('phoneRingShort.ogg'),
  phoneRingLong: sfxUrl('phoneRingLong.ogg'),
  whisper1: sfxUrl('whisper1.ogg'),
  whisper2: sfxUrl('whisper2.ogg'),
  alertBoss: sfxUrl('alertBoss.ogg'),
  submitClick: sfxUrl('submitClick.ogg'),
  ambientOffice: sfxUrl('ambientOffice.ogg')
}

export type SoundKey = keyof typeof soundCatalog
