import { useState } from "react";
import clsx from "clsx";

type TabKey = "all" | "done" | "todo";

const Tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "전체보기" },
  { key: "done", label: "응시완료" },
  { key: "todo", label: "미응시" },
];

const MyPageQuiz = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>("all");

const getTabClass = (tabKey: TabKey) =>
    clsx(
      // 공통 스타일
      "pb-3 transition-colors font-pretendard font-bold text-[20px] leading-[140%] tracking-[-0.03em]",
      currentTab === tabKey
        ? // Active 스타일
          "text-[#721AE3] border-b-[3px] border-[#721AE3]"
        : // Inactive 스타일
          "text-[#9D9D9D] border-b-[3px] border-transparent" 
    );

  return (
    <div className="space-y-6">
      <h1 className="font-pretendard font-bold text-[32px] leading-[140%] tracking-[-0.03em] text-[#121212]">
        쪽지시험
      </h1>

      {/* 상단 탭 */}
      <div className="flex gap-10 border-b-2 border-[#E5E5E5] w-full">
        {Tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={getTabClass(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 카드 리스트 영역 */}
      
    </div>
  );
};

export default MyPageQuiz;
