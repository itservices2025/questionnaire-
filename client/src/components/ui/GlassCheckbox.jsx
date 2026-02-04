import { forwardRef } from 'react'

const GlassCheckbox = forwardRef(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-start gap-3 cursor-pointer group ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div
            className="w-5 h-5 rounded bg-white/10 border border-white/30
            peer-checked:bg-purple-500/60 peer-checked:border-purple-400/50
            peer-focus:ring-2 peer-focus:ring-purple-400/50
            transition-all flex items-center justify-center"
          >
            <svg
              className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
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

GlassCheckbox.displayName = 'GlassCheckbox'

export default GlassCheckbox
