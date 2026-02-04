export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-glass ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
