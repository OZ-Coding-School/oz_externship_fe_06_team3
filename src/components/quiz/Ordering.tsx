import { useState, useEffect, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

interface OrderingProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string[] | null
  onAnswerChange: (questionId: number, answer: string[]) => void
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const

interface DraggableLabelProps {
  id: string
  label: string
  item: string
  isUsed: boolean
}

function DraggableLabel({ id, label, item, isUsed }: DraggableLabelProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: isUsed,
    data: { item, label },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : isUsed ? 0.4 : 1,
    padding: '3px',
  }

  return (
    <span
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-[4px] bg-[#EFE6FC] text-[18px] font-normal text-[#6201E0] ${
        isUsed ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {label}
    </span>
  )
}

interface DroppableSlotProps {
  id: string
  index: number
  label: string | null
  onRemove: () => void
}

function DroppableSlot({ id, index, label, onRemove }: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`w-[62px] h-[62px] p-[3px] rounded-[4px] bg-[#F2F3F5] flex items-center justify-center transition-colors ${
        isOver ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      {label ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs bg-white rounded-full border border-gray-300"
          >
            ×
          </button>
          <span className="text-[18px] font-normal text-[#6201E0] bg-[#EFE6FC] w-8 h-8 flex items-center justify-center rounded-[4px]">
            {label}
          </span>
        </div>
      ) : (
        <span className="text-[#F2F3F5] text-sm font-medium">{index + 1}</span>
      )}
    </div>
  )
}

export default function Ordering({ question, answer, onAnswerChange }: OrderingProps) {
  const options = question.options || []
  const optionLabels = useMemo(
    () => OPTION_LABELS.slice(0, options.length),
    [options.length]
  )

  const initializeSlots = (): (string | null)[] => {
    const initialSlots = Array(options.length).fill(null)
    if (answer && answer.length > 0) {
      answer.forEach((item, idx) => {
        if (idx < initialSlots.length) {
          const index = options.findIndex((opt) => opt === item)
          if (index !== -1) {
            initialSlots[idx] = optionLabels[index]
          }
        }
      })
    }
    return initialSlots
  }

  const [slots, setSlots] = useState<(string | null)[]>(initializeSlots)

  useEffect(() => {
    const newSlots = Array(options.length).fill(null)
    if (answer && answer.length > 0) {
      answer.forEach((item, idx) => {
        if (idx < newSlots.length) {
          const index = options.findIndex((opt) => opt === item)
          if (index !== -1) {
            newSlots[idx] = optionLabels[index]
          }
        }
      })
    }
    setSlots(newSlots)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, options.length])

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const convertLabelsToAnswers = (labels: (string | null)[]): string[] => {
    return labels
      .filter((label): label is string => label !== null)
      .map((label) => {
        const labelIndex = optionLabels.findIndex((l) => l === label)
        return labelIndex !== -1 ? options[labelIndex] : ''
      })
      .filter((val) => val !== '')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const draggedLabel = (active.id as string).replace('label-', '')
    const slotIndex = parseInt((over.id as string).replace('slot-', ''), 10)

    const newSlots = [...slots]
    const existingSlotIndex = newSlots.findIndex((label) => label === draggedLabel)

    if (existingSlotIndex !== -1) {
      newSlots[existingSlotIndex] = null
    }

    newSlots[slotIndex] = draggedLabel
    setSlots(newSlots)
    onAnswerChange(question.questionId, convertLabelsToAnswers(newSlots))
  }

  const handleRemoveFromSlot = (index: number) => {
    const newSlots = [...slots]
    newSlots[index] = null
    setSlots(newSlots)
    onAnswerChange(question.questionId, convertLabelsToAnswers(newSlots))
  }

  const isLabelUsed = (label: string) => slots.includes(label)

  const renderOptions = () => (
    <div className="space-y-[18px]">
      {options.map((item, index) => (
        <div key={`option-${index}`} className="flex items-center gap-3">
          <DraggableLabel
            id={`label-${optionLabels[index]}`}
            label={optionLabels[index]}
            item={item}
            isUsed={isLabelUsed(optionLabels[index])}
          />
          <span className="text-[16px] font-normal text-[#222222]">{item}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="mb-20">
      {/* 문제 헤더 */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[20px] font-bold text-[#121212]">
          {question.number}. {question.question}
        </span>
        <span className="bg-[#ECECEC] rounded-[2px] text-[12px] font-normal text-[#121212] px-2 py-[2px]">
          {question.point}점
        </span>
        <span className="bg-[#ECECEC] rounded-[2px] text-[12px] font-normal text-[#121212] px-2 py-[2px]">
          순서배열
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* 지문 및 옵션 박스 */}
        {question.prompt ? (
          <div className="w-[648px] min-h-[228px] bg-[#F2F3F5]/50 p-[20px] rounded-lg mb-4 ml-6">
            <p className="text-[16px] font-normal text-[#222222] mb-[18px]">
              {question.prompt}
            </p>
            {renderOptions()}
          </div>
        ) : (
          options.length > 0 && (
            <div className="w-[648px] min-h-[228px] bg-[#F2F3F5]/50 p-[20px] rounded-lg mb-4 ml-6">
              {renderOptions()}
            </div>
          )
        )}

        {/* 빈칸 영역 */}
        <div className="ml-6 mt-4">
          <div className="flex gap-[10px]">
            {slots.map((label, index) => (
              <DroppableSlot
                key={`slot-${index}`}
                id={`slot-${index}`}
                index={index}
                label={label}
                onRemove={() => handleRemoveFromSlot(index)}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  )
}
