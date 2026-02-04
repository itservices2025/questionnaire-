import { useState } from 'react'
import { FiStar } from 'react-icons/fi'

export default function RatingQuestion({ question, value, onChange, error }) {
  const [hovered, setHovered] = useState(0)
  const validation = question.validation || {}
  const maxStars = validation.max || 5
  const currentValue = parseInt(value) || 0

  return (
    <div className="w-full">
      <label className="block text-white/90 text-sm font-medium mb-3">
        {question.label}
        {question.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="flex gap-1">
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded"
          >
            <FiStar
              className={`w-8 h-8 transition-colors ${
                star <= (hovered || currentValue)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-white/30'
              }`}
            />
          </button>
        ))}
      </div>
      {question.helpText && !error && (
        <p className="mt-2 text-sm text-white/50">{question.helpText}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
