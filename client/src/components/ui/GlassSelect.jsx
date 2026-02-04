import { forwardRef } from 'react'

const GlassSelect = forwardRef(
  ({ label, error, helpText, options = [], className = '', placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-white/90 text-sm font-medium mb-1.5">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-white/10 backdrop-blur-sm border rounded-lg px-4 py-2.5
            text-white appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
            transition-all ${error ? 'border-red-400/50' : 'border-white/20'} ${className}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25rem',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-slate-800 text-white/50">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-slate-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        {helpText && !error && (
          <p className="mt-1 text-sm text-white/50">{helpText}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

GlassSelect.displayName = 'GlassSelect'

export default GlassSelect
