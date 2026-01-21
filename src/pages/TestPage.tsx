import { useState } from 'react'
import { Dropdown } from '../components'

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
  { label: '옵션 3', value: 'option-3' },
  { label: '옵션 4', value: 'option-4' },
  { label: '옵션 5', value: 'option-5' },
  { label: '옵션 6', value: 'option-6' },
]

function TestPage() {
  const [value, setValue] = useState<string | undefined>()

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#FAFAFB] p-10">
      <h1 className="text-2xl font-semibold text-black">Dropdown 테스트</h1>

      <div className="flex flex-col gap-4">
        <Dropdown options={options} value={value} onChange={setValue} />
        <Dropdown options={options} disabled />
      </div>
    </div>
  )
}

export default TestPage
