import clsx from "clsx";
import { NavLink, Outlet } from "react-router";

const sideNavClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    // 공통 스타일
    "w-[180px] h-[32px] flex items-center pl-4",
    "font-pretendard font-semibold text-[18px] leading-[140%] tracking-[-0.03em]",
    "transition-colors",

    // 활성 / 비활성 구분 스타일
    isActive
      ? "border-l-[3px] border-[#6201E0] text-[#6201E0]"
      : "text-[#9D9D9D]"
  );


const MyPage = () => {
  return (
    <div className="px-90 py-20">
      <div className="flex">
        {/* 좌측 nav */}
        <aside className="pt-2">
          <nav className="space-y-4">
            <NavLink to="quiz" className={sideNavClass}>
              쪽지시험
            </NavLink>
            <NavLink to="profile" className={sideNavClass}>
              내 정보
            </NavLink>
            <NavLink to="password" className={sideNavClass}>
              비밀번호 변경
            </NavLink>
          </nav>
        </aside>

        {/* 우측 콘텐츠 */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MyPage;