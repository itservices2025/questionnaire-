import { useRef, useState } from 'react'
import { FiUpload, FiX, FiFile, FiAlertCircle } from 'react-icons/fi'
import { GlassButton } from '../ui'
import api from '../../api/client'
import axios from 'axios'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export default function FileQuestion({ question, value, onChange, error }) {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size exceeds 50MB limit')
      return
    }

    setFileName(file.name)
    setUploadError('')
    setUploading(true)
    setProgress(0)

    try {
      // Request presigned upload URL
      const { data } = await api.post('/upload/presign', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })

      // Upload directly to R2 via presigned URL
      await axios.put(data.uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded / e.total) * 100))
          }
        },
      })

      // Store file metadata (not the file itself)
      onChange({
        fileKey: data.fileKey,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })
    } catch (err) {
      const msg = err.response?.data?.error || 'Upload failed. Please try again.'
      setUploadError(msg)
      setFileName('')
      onChange(null)
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setFileName('')
    setUploadError('')
    setProgress(0)
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
          <span className="text-xs text-white/40">Max 50MB</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
            <FiFile className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-white truncate block">{fileName}</span>
              {uploading && (
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/50 mt-1">{progress}%</span>
                </div>
              )}
            </div>
            {!uploading && (
              <GlassButton
                type="button"
                variant="ghost"
                onClick={handleClear}
                className="p-2"
              >
                <FiX className="w-4 h-4" />
              </GlassButton>
            )}
          </div>
        </div>
      )}
      {uploadError && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <FiAlertCircle className="w-4 h-4" />
          {uploadError}
        </p>
      )}
      {question.helpText && !error && !uploadError && (
        <p className="mt-2 text-sm text-white/50">{question.helpText}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
