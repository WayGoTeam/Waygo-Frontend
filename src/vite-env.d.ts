/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the WayGo REST API. Defaults to "/api/v1" (proxied in dev, see vite.config.ts). */
  readonly VITE_API_BASE_URL?: string
  /** Base URL for the Netty Socket.IO server (separate port from the REST API — see SocketIoConfiguration). */
  readonly VITE_SOCKET_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
