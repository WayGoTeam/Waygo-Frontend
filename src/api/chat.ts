import { api, API_BASE } from './client'

export const sendChatMessage = (message: string) =>
  api.post<{ reply: string }>('/chat', { message })

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

