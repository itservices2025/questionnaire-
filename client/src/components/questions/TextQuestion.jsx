import { GlassInput } from '../ui'

export default function TextQuestion({ question, value, onChange, error }) {
  return (
    <GlassInput
      label={question.label}
      placeholder={question.placeholder || 'Enter your answer'}
      helpText={question.helpText}
      required={question.required}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
    />
  )
}
