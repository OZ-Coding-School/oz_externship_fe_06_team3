import clsx from "clsx";

const MyPageQuiz = () => {
  const currentTab: "all" | "done" | "todo" = "all";

  return (
    <div className="space-y-6">
      <h1 className="font-['Pretendard'] font-bold text-[32px] leading-[140%] tracking-[-0.03em] text-[#121212]">쪽지시험</h1>
      {/* 상단 탭 */}
      <div className="flex gap-6 border-b">
        {[
          { key: "all", label: "전체보기" },
          { key: "done", label: "응시완료" },
          { key: "todo", label: "미응시" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={clsx(
              "pb-3 transition-colors",
              currentTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500 hover:text-blue-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 카드 리스트 */}

    </div>
  );
};

export default MyPageQuiz;