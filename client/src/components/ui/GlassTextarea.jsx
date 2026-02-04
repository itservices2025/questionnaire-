import { forwardRef } from 'react'

const GlassTextarea = forwardRef(
  ({ label, error, helpText, className = '', rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-white/90 text-sm font-medium mb-1.5">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full bg-white/10 backdrop-blur-sm border rounded-lg px-4 py-2.5
            text-white placeholder-white/50 resize-none
            focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
            transition-all ${error ? 'border-red-400/50' : 'border-white/20'} ${className}`}
          {...props}
        />
        {helpText && !error && (
          <p className="mt-1 text-sm text-white/50">{helpText}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

GlassTextarea.displayName = 'GlassTextarea'

export default GlassTextarea
