import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import clsx from "clsx";

import main_banner from "@/assets/LandingPage_img/main_banner.png";
import main_exam from "@/assets/LandingPage_img/main_exam.png";
import main_qna from "@/assets/LandingPage_img/main_qna.png";
import main_community from "@/assets/LandingPage_img/main_community.png";

const TABS = [
  { id: "exam", label: "쪽지시험", image: main_exam },
  { id: "qna", label: "질의응답", image: main_qna },
  { id: "community", label: "커뮤니티", image: main_community },
] as const;

type TabType = (typeof TABS)[number]["id"];

function LandingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("exam");
  const [displayTab, setDisplayTab] = useState<TabType>("exam");
  const [isFadingOut, setIsFadingOut] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const currentTab = useMemo(
    () => TABS.find((t) => t.id === displayTab) ?? TABS[0],
    [displayTab]
  );

  const handleTabClick = (next: TabType) => {
    if (next === activeTab) return;

    setActiveTab(next);
    setIsFadingOut(true);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setDisplayTab(next);
      setIsFadingOut(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col items-center">
        <div className="w-full bg-[#FAFAFB]">
          <div
            className={clsx(
              "mx-auto w-full max-w-[1200px] px-5",
              "min-h-[calc(100dvh-var(--header-offset,100px))]",
              "flex flex-col justify-center",
              "py-8",
              "scroll-mt-[var(--header-offset,100px)]",
              "overflow-hidden"
            )}
          >
            <h1 className="text-center font-bold leading-snug text-3xl sm:text-4xl lg:text-5xl">
              쪽지 시험으로 <br />
              실력을 차곡차곡 쌓아보세요
            </h1>

            <div className="mx-auto my-6 sm:my-10 w-fit rounded-full bg-white px-2 py-2 shadow-sm border border-gray-100">
              <div className="flex flex-wrap justify-center gap-2">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabClick(tab.id)}
                      aria-pressed={isActive}
                      className={clsx(
                        "px-5 sm:px-6 py-2 rounded-full transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6201E0] focus-visible:ring-offset-2",
                        isActive
                          ? "bg-[#6201E0] text-white shadow-md"
                          : "bg-white text-black hover:bg-gray-50"
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div
                className={clsx(
                  "w-full transition-all duration-300 ease-out",
                  isFadingOut ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                )}
              >
                <img
                  src={currentTab.image}
                  alt={`${currentTab.label} 화면 미리보기`}
                  className="w-full h-auto object-contain max-h-[45dvh] sm:max-h-[52dvh] lg:max-h-[58dvh]"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="py-16 sm:py-24 lg:py-40 w-full">
          <div className="mx-auto w-full max-w-[1200px] px-5">
            <Link
              to="/qna"
              className="block overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={main_banner}
                alt="Q&A 페이지 바로가기"
                className="w-full h-auto"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
