import { api } from './client'

export const sendChatMessage = (message: string) =>
  api.post<{ reply: string }>('/chat', { message })
