import { GlassCheckbox } from '../ui'

export default function CheckboxQuestion({ question, value, onChange, error }) {
  return (
    <div className="w-full">
      <GlassCheckbox
        label={question.label}
        checked={value === true || value === 'true'}
        onChange={(e) => onChange(e.target.checked)}
      />
      {question.helpText && !error && (
        <p className="mt-2 text-sm text-white/50 ml-8">{question.helpText}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-400 ml-8">{error}</p>}
    </div>
  )
}
