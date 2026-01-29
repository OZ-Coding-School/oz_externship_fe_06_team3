import { useFormContext } from 'react-hook-form'
import cn from '@/lib/cn'
import type { SignupFormData } from '@/schemas/auth'

export function GenderField() {
  const { watch, setValue } = useFormContext<SignupFormData>()
  const value = watch('gender')

  const maleActive = value === 'male'
  const femaleActive = value === 'female'

  const base =
    'h-[42px] w-[84px] rounded-full border text-base font-semibold transition-colors whitespace-nowrap'

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setValue('gender', 'male', { shouldValidate: true })}
        className={cn(
          base,
          maleActive
            ? 'border-primary bg-primary-100 text-primary'
            : 'border-[#CECECE] bg-[#F2F2F2] text-[#666666] hover:bg-gray-200'
        )}
      >
        남
      </button>

      <button
        type="button"
        onClick={() => setValue('gender', 'female', { shouldValidate: true })}
        className={cn(
          base,
          femaleActive
            ? 'border-primary bg-primary-100 text-primary'
            : 'border-[#CECECE] bg-[#F2F2F2] text-[#666666] hover:bg-gray-200'
        )}
      >
        여
      </button>
    </div>
  )
}
