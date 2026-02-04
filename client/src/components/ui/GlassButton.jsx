import { forwardRef } from 'react'

const GlassButton = forwardRef(
  ({ children, variant = 'default', className = '', disabled, ...props }, ref) => {
    const baseStyles =
      'rounded-lg px-6 py-2.5 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'

    const variants = {
      default:
        'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 active:bg-white/40',
      primary:
        'bg-purple-500/60 backdrop-blur-sm border border-purple-400/30 text-white hover:bg-purple-500/80 active:bg-purple-500/90',
      danger:
        'bg-red-500/60 backdrop-blur-sm border border-red-400/30 text-white hover:bg-red-500/80 active:bg-red-500/90',
      success:
        'bg-green-500/60 backdrop-blur-sm border border-green-400/30 text-white hover:bg-green-500/80 active:bg-green-500/90',
      ghost:
        'bg-transparent border border-transparent text-white/80 hover:bg-white/10 hover:text-white',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

GlassButton.displayName = 'GlassButton'

export default GlassButton
