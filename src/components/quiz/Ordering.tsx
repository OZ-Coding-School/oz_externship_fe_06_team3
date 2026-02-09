import { useState, useEffect, useRef, useMemo } from 'react'
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
import { Button } from '@/components/common/Button'
import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'
import QuizResultExplanation from './QuizResultExplanation'
import QuestionHeader from './QuestionHeader'

interface OrderingProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string[] | null
  onAnswerChange: (questionId: number, answer: string[]) => void
  isResult?: boolean
  correctAnswer?: string[] | null
  isCorrect?: boolean
  explanation?: string | null
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const

// 슬롯 초기화 헬퍼 함수
function initializeSlots(
  options: string[],
  answer: string[] | null,
  optionLabels: readonly string[]
): (string | null)[] {
  const slots = Array(options.length).fill(null)
  if (answer && answer.length > 0) {
    answer.forEach((item, idx) => {
      if (idx < slots.length) {
        const index = options.findIndex((opt) => opt === item)
        if (index !== -1) {
          slots[idx] = optionLabels[index]
        }
      }
    })
  }
  return slots
}

interface DraggableLabelProps {
  id: string
  label: string
  item: string
  isUsed: boolean
  isResult?: boolean
}

function DraggableLabel({
  id,
  label,
  item,
  isUsed,
  isResult,
}: DraggableLabelProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: isUsed || isResult,
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
      className={`inline-flex h-8 w-8 items-center justify-center rounded-[4px] bg-primary-100 text-primary text-[18px] font-normal ${
        isUsed || isResult
          ? 'cursor-not-allowed'
          : 'cursor-grab active:cursor-grabbing'
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
  isResult?: boolean
  isSlotCorrect?: boolean
}

function DroppableSlot({
  id,
  index,
  label,
  onRemove,
  isResult,
  isSlotCorrect,
}: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: isResult })

  const slotBorderClass =
    !isResult && isOver ? 'ring-2 ring-primary ring-offset-2' : ''

  const getLabelInnerClass = () => {
    if (!isResult || isSlotCorrect === undefined) {
      return 'text-primary bg-primary-100 text-[18px] font-normal w-8 h-8 flex items-center justify-center rounded-[4px]'
    }
    return isSlotCorrect
      ? 'text-success text-[20px] font-bold bg-surface w-10 h-10 flex items-center justify-center rounded-[4px]'
      : 'text-warning text-[20px] font-bold bg-surface w-10 h-10 flex items-center justify-center rounded-[4px]'
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex h-[62px] w-[62px] items-center justify-center rounded-[4px] bg-surface p-[3px] transition-colors ${slotBorderClass}`}
    >
      {label ? (
        <div className="relative flex h-full w-full items-center justify-center">
          {!isResult && (
            <Button
              type="button"
              variant="link"
              size="auto"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="absolute -top-1 -right-1 flex h-4 w-4 min-w-0 items-center justify-center rounded-full border border-gray-300 bg-white p-0 text-xs text-gray-400 hover:text-gray-600 hover:no-underline"
              aria-label="제거"
            >
              ×
            </Button>
          )}
          <span className={getLabelInnerClass()}>{label}</span>
        </div>
      ) : (
        <span className="text-mono-600 text-sm font-medium">{index + 1}</span>
      )}
    </div>
  )
}

export default function Ordering({
  question,
  answer,
  onAnswerChange,
  isResult = false,
  correctAnswer = null,
  isCorrect = false,
  explanation = null,
}: OrderingProps) {
  const options = useMemo(() => question.options || [], [question.options])
  const optionLabels = useMemo(
    () => OPTION_LABELS.slice(0, options.length),
    [options.length]
  )

  const [slots, setSlots] = useState<(string | null)[]>(() =>
    initializeSlots(options, answer, optionLabels)
  )

  // 부모에서 넘긴 answer와 동기화. questionId, options 길이, answer 값(직렬화)만으로 동기화 여부 판단.
  const prevSyncKey = useRef<string | null>(null)
  useEffect(() => {
    const syncKey = `${question.questionId}:${options.length}:${JSON.stringify(answer)}`
    if (prevSyncKey.current === syncKey) return
    prevSyncKey.current = syncKey
    setSlots(initializeSlots(options, answer, optionLabels))
  }, [question.questionId, answer, options, optionLabels])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: isResult ? 9999 : 5 },
    }),
    useSensor(KeyboardSensor)
  )

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

    // 슬롯이 아닌 곳(예: 다른 라벨 위)에 드롭한 경우 무시
    const overId = over.id as string
    if (!overId.startsWith('slot-')) return
    const slotIndex = parseInt(overId.replace('slot-', ''), 10)
    if (Number.isNaN(slotIndex) || slotIndex < 0 || slotIndex >= slots.length)
      return

    const draggedLabel = (active.id as string).replace('label-', '')
    const newSlots = [...slots]
    const existingSlotIndex = newSlots.findIndex(
      (label) => label === draggedLabel
    )

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

  const getSlotCorrectness = (index: number): boolean | undefined => {
    if (!isResult || !correctAnswer || correctAnswer.length === 0)
      return undefined
    const submittedOrder = convertLabelsToAnswers(slots)
    return submittedOrder[index] === correctAnswer[index]
  }

  const renderOptions = () => (
    <div className="space-y-[18px]">
      {options.map((item, index) => (
        <div key={`option-${index}`} className="flex items-center gap-3">
          <DraggableLabel
            id={`label-${optionLabels[index]}`}
            label={optionLabels[index]}
            item={item}
            isUsed={isLabelUsed(optionLabels[index])}
            isResult={isResult}
          />
          <span className="text-foreground-secondary text-[16px] font-normal">{item}</span>
        </div>
      ))}
    </div>
  )

  const containerClass = isResult ? 'mb-[100px]' : 'mb-20'

  return (
    <div className={containerClass}>
      {/* 문제 헤더 */}
      <QuestionHeader
        number={question.number}
        title={question.question}
        point={question.point}
        typeLabel="순서배열"
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* 옵션 박스 */}
        {options.length > 0 && (
          <div className="mb-4 ml-6 min-h-[228px] w-[648px] rounded-lg bg-surface/50 p-[20px]">
            {renderOptions()}
          </div>
        )}

        {/* 빈칸 영역 */}
        <div className="mt-4 ml-6">
          <div className="flex gap-[10px]">
            {slots.map((label, index) => (
              <DroppableSlot
                key={`slot-${index}`}
                id={`slot-${index}`}
                index={index}
                label={label}
                onRemove={() => handleRemoveFromSlot(index)}
                isResult={isResult}
                isSlotCorrect={getSlotCorrectness(index)}
              />
            ))}
          </div>
        </div>
      </DndContext>

      {isResult && explanation && (
        <div className="mt-5 ml-6">
          <QuizResultExplanation
            explanation={explanation}
            isCorrect={isCorrect}
          />
        </div>
      )}
    </div>
  )
}
