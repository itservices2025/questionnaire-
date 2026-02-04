import { GlassInput } from '../ui'

export default function EmailQuestion({ question, value, onChange, error }) {
  return (
    <GlassInput
      type="email"
      label={question.label}
      placeholder={question.placeholder || 'email@example.com'}
      helpText={question.helpText}
      required={question.required}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
    />
  )
}
