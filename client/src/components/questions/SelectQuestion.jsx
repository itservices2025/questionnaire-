import { GlassSelect } from '../ui'

export default function SelectQuestion({ question, value, onChange, error }) {
  const options = (question.options || []).map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )

  return (
    <GlassSelect
      label={question.label}
      placeholder={question.placeholder || 'Select an option'}
      helpText={question.helpText}
      required={question.required}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      options={options}
    />
  )
}
