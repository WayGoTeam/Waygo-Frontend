import { useEffect, useRef, useState } from 'react'
import { Bot, MessageCircle, Send, X, Mic, Trash2 } from 'lucide-react'
import { sendChatMessageStream, sendChatVoiceMessage, fetchTTS } from '@/api/chat'
import { useLocale } from '@/i18n/LocaleContext'
import { useSocket } from '@/context/SocketContext'
import type { ChatMessage } from '@/types/api'

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
}

export function ChatWidget() {
  const { s, locale } = useLocale()
  const { connected } = useSocket()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending, open])

  useEffect(() => {
    // Initialize Web Speech API for Speech-to-Text
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = locale === 'az' ? 'az-AZ' : 'en-US'
      recognition.interimResults = false
      recognition.continuous = false
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        submit(transcript)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }
      
      recognition.onend = () => {
        setIsRecording(false)
      }
      
      recognitionRef.current = recognition
    }
  }, [locale])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(locale === 'az' ? "Sizin brauzeriniz səsli daxil etməni dəstəkləmir (Chrome istifadə edin)." : "Speech recognition not supported in this browser.")
      return
    }
    
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function submit(text: string, voice = false) {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setInput('')
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', text: trimmed, createdAt: Date.now() }])
    setSending(true)
    try {
      const msgId = makeId()
      setMessages((prev) => [
        ...prev,
        { id: msgId, role: 'assistant', text: '', createdAt: Date.now() },
      ])
      const res = await sendChatMessageStream(trimmed)
      if (!res.ok) throw new Error('Stream failed')
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader')
      const decoder = new TextDecoder()
      
      let fullText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data:')) {
            let text = line.substring(5)
            if (text.startsWith(' ')) text = text.substring(1)
            if (text) {
              fullText += text
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === msgId ? { ...m, text: m.text + text } : m
                )
              )
            }
          }
        }
      }

      // Always play Azure Neural TTS via Backend Gateway
      // Remove markdown asterisks for better speech
      const cleanText = fullText.replace(/\*\*/g, '')
      
      try {
          const blob = await fetchTTS(cleanText, locale)
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audio.play().catch(e => console.warn('Azure TTS Play failed (autoplay blocked):', e))
      } catch (e) {
          console.error('Azure TTS fetch failed:', e)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: 'assistant', text: s.chat.errorReply, createdAt: Date.now() },
      ])
    } finally {
      setSending(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label={s.chat.open}
        className="fixed bottom-24 right-5 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-float transition hover:bg-brand-700 active:scale-95 sm:right-6"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 right-5 z-[1000] flex h-[min(30rem,70vh)] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-float animate-fade-up sm:right-6">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <Bot className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">{s.chat.title}</p>
          <p className="truncate text-[11px] text-slate-400">{s.chat.subtitle}</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          {connected ? s.chat.online : s.chat.offline}
        </span>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            aria-label={s.chat.clear}
            title={s.chat.clear}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-600 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => setOpen(false)}
          aria-label={s.chat.close}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-3.5">
        <ChatBubble role="assistant" text={s.chat.greeting} />
        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role} text={m.text} />
        ))}
        {sending && <ChatBubble role="assistant" text={s.chat.thinking} muted />}

        {messages.length === 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            {s.chat.quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => submit(prompt)}
                className="rounded-xl bg-brand-50 px-3 py-2 text-left text-xs font-medium text-brand-700 transition hover:bg-brand-100"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void submit(input)
        }}
        className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={s.chat.inputPlaceholder}
          className="min-w-0 flex-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-brand-300 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="button"
          onClick={toggleRecording}
          disabled={sending}
          aria-label="Send as Voice"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${
            isRecording 
              ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Mic className="h-4 w-4" />
        </button>
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label={s.chat.title}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

function renderTextWithBold(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function ChatBubble({ role, text, muted }: { role: 'user' | 'assistant'; text: string; muted?: boolean }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-brand-600 text-white'
            : `rounded-bl-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ${muted ? 'italic text-slate-400' : ''}`
        }`}
      >
        {renderTextWithBold(text)}
      </div>
    </div>
  )
}
