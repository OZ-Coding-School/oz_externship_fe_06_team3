import { useState } from "react";
import clsx from "clsx";

type TabKey = "all" | "done" | "todo";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "전체보기" },
  { key: "done", label: "응시완료" },
  { key: "todo", label: "미응시" },
];

const MyPageQuiz = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>("all");

  const getTabClass = (tabKey: TabKey) =>
    clsx(
      "pb-3 transition-colors text-[18px] font-pretendard",                  // 공통 스타일
      currentTab === tabKey
        ? "border-b-2 border-[#6201E0] text-[#6201E0] font-semibold"     // Active일 때 스타일
        : "text-[#9D9D9D] hover:text-[#6201E0]"                          // Inactive일 때 스타일
    );

  return (
    <div className="space-y-6">
      <h1 className="font-pretendard font-bold text-[32px] leading-[140%] tracking-[-0.03em] text-[#121212]">
        쪽지시험
      </h1>

      {/* 상단 탭 */}
      <div className="flex gap-6 border-b border-gray-100">
        {TABS.map((tab) => (
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
