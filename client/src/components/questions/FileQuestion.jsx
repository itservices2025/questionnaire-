import { useRef, useState } from 'react'
import { FiUpload, FiX, FiFile } from 'react-icons/fi'
import { GlassButton } from '../ui'

export default function FileQuestion({ question, value, onChange, error }) {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onload = () => {
        onChange({
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClear = () => {
    setFileName('')
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <label className="block text-white/90 text-sm font-medium mb-2">
        {question.label}
        {question.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept={question.validation?.accept}
      />
      {!fileName ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full p-6 border-2 border-dashed border-white/20 rounded-lg
            hover:border-white/40 hover:bg-white/5 transition-all
            flex flex-col items-center gap-2 text-white/60 hover:text-white/80"
        >
          <FiUpload className="w-8 h-8" />
          <span className="text-sm">Click to upload a file</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
          <FiFile className="w-6 h-6 text-purple-400" />
          <span className="flex-1 text-white truncate">{fileName}</span>
          <GlassButton
            type="button"
            variant="ghost"
            onClick={handleClear}
            className="p-2"
          >
            <FiX className="w-4 h-4" />
          </GlassButton>
        </div>
      )}
      {question.helpText && !error && (
        <p className="mt-2 text-sm text-white/50">{question.helpText}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
