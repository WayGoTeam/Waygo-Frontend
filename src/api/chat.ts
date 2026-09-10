import { api, API_BASE } from './client'

export type ChatLang = 'az' | 'en'

/** `lang` pins the assistant's reply language to the UI locale (audit L09). */
export const sendChatMessage = (message: string, lang: ChatLang = 'az') =>
  api.post<{ reply: string }>('/chat', { message, lang })

export const sendChatMessageStream = async (message: string, lang: ChatLang = 'az') => {
  return fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang,
      ...((localStorage.getItem('waygo_token') 
          ? { Authorization: `Bearer ${localStorage.getItem('waygo_token')}` } 
          : {}) as Record<string, string>)
    },
    body: JSON.stringify({ message, lang }),
  })
}

export const sendChatVoiceMessage = async (message: string): Promise<Blob> => {
  const token = localStorage.getItem('waygo_token')
  const res = await fetch(`${API_BASE}/chat/voice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) throw new Error('Voice request failed')
  return res.blob()
}

export const fetchTTS = async (text: string, lang: string = 'az'): Promise<Blob> => {
  const token = localStorage.getItem('waygo_token')
  const res = await fetch(`${API_BASE}/navigation/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ text, lang }),
  })
  if (!res.ok) throw new Error('TTS request failed')
  return res.blob()
}

