import clsx from 'clsx'

type TabKey = 'all' | 'done' | 'todo'

export const Tabs: { key: TabKey; label: string; status: 'all' | 'done' | 'pending' }[] = [
  { key: 'all', label: '전체보기', status: 'all' },
  { key: 'done', label: '응시완료', status: 'done' },
  { key: 'todo', label: '미응시', status: 'pending' },
]

interface QuizTabsProps {
  currentTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export default function QuizTabs({ currentTab, onTabChange }: QuizTabsProps) {
  const getTabClass = (tabKey: TabKey) =>
    clsx(
      'pb-3 transition-colors title-l-b',
      currentTab === tabKey
        ? 'text-[#721AE3] border-b-[3px] border-[#721AE3]'
        : 'text-[#9D9D9D]'
    )

  return (
    <div className="flex gap-10 border-b-2 border-[#E5E5E5]">
      {Tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={getTabClass(tab.key)}
          aria-pressed={currentTab === tab.key}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
