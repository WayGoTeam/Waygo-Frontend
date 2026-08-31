export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <img 
      src="/logo.jpg" 
      alt="WayGo Logo" 
      style={{ width: size, height: size, objectFit: 'contain' }} 
      className="rounded-lg shadow-sm"
    />
  )
}
