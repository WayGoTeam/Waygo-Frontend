export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="waygo-logo-g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1447E6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#waygo-logo-g)" />
      <circle cx="32" cy="32" r="20" stroke="white" strokeOpacity="0.35" strokeWidth="3" />
      <circle cx="32" cy="32" r="12" stroke="white" strokeOpacity="0.6" strokeWidth="3" />
      <circle cx="32" cy="32" r="5.5" fill="white" />
    </svg>
  )
}
