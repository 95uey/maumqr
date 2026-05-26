export interface Profile {
  id: string
  custom_id: string
  name: string
  role: string
  bio: string
  photo_url: string | null
  created_at: string
}

export interface Message {
  id: string
  text: string
  time_ago: string
}

export interface ProfileWithMessages extends Profile {
  recent_messages: Message[]
}

export const PRESET_MESSAGES = [
  { key: 'thank_you', text: '친절한 서비스 감사해요' },
  { key: 'come_again', text: '또 올게요' },
  { key: 'cheer', text: '응원합니다' },
] as const

export type MessageKey = typeof PRESET_MESSAGES[number]['key']

export const PRESET_AMOUNTS = [10000, 50000] as const
