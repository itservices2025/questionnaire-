import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiMove, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { GlassButton } from './ui'
import { QUESTION_TYPES } from './questions'

export default function SortableQuestion({ question, index, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const typeInfo = QUESTION_TYPES.find((t) => t.value === question.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-glass"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="p-2 text-white/40 hover:text-white/80 hover:bg-white/10 rounded cursor-grab active:cursor-grabbing transition-colors"
        >
          <FiMove className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
              {typeInfo?.icon} {typeInfo?.label || question.type}
            </span>
            {question.required && (
              <span className="text-xs font-medium text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
                Required
              </span>
            )}
          </div>
          <p className="text-white font-medium">{question.label}</p>
          {question.helpText && (
            <p className="text-white/50 text-sm mt-1">{question.helpText}</p>
          )}
          {question.options && question.options.length > 0 && (
            <p className="text-white/40 text-xs mt-2">
              Options: {question.options.join(', ')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <GlassButton
            variant="ghost"
            className="p-2"
            onClick={onEdit}
          >
            <FiEdit2 className="w-4 h-4" />
          </GlassButton>
          <GlassButton
            variant="ghost"
            className="p-2 text-red-400 hover:bg-red-500/20"
            onClick={onDelete}
          >
            <FiTrash2 className="w-4 h-4" />
          </GlassButton>
        </div>
      </div>
    </div>
  )
}
