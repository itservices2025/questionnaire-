import { forwardRef } from 'react'

const GlassRadio = forwardRef(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-start gap-3 cursor-pointer group ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="radio"
            className="peer sr-only"
            {...props}
          />
          <div
            className="w-5 h-5 rounded-full bg-white/10 border border-white/30
            peer-checked:border-purple-400/50
            peer-focus:ring-2 peer-focus:ring-purple-400/50
            transition-all flex items-center justify-center"
          >
            <div
              className="w-2.5 h-2.5 rounded-full bg-purple-400
              scale-0 peer-checked:scale-100 transition-transform"
            />
          </div>
        </div>
        {label && (
          <span className="text-white/90 text-sm group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  }
)

GlassRadio.displayName = 'GlassRadio'

export default GlassRadio
