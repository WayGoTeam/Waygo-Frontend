export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div 
      style={{ width: size, height: size }} 
      className="relative flex items-center justify-center shrink-0"
    >
      <img 
        src="/logo-mark.png" 
        alt="WayGo Logo" 
        style={{ width: size, height: size, objectFit: 'contain' }} 
        className="dark:hidden drop-shadow-sm transition-opacity"
      />
      <img 
        src="/logo-mark-dark.png" 
        alt="WayGo Logo" 
        style={{ width: size, height: size, objectFit: 'contain' }} 
        className="hidden dark:block drop-shadow-sm transition-opacity"
      />
    </div>
  )
}

