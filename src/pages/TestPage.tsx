import React from "react";

export default function StyleTestPage() {
  return (
    <div className="p-10 space-y-12 bg-gray-50 min-h-screen">
      {/* Title Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Title Styles</h2>
        <div className="space-y-2">
          <p className="title-xl">Title XL - 32px Bold</p>
          <p className="title-l">Title L - 20px Semibold</p>
          <p className="title-m-a">Title M A - 18px Bold (로그인 페이지용)</p>
          <p className="title-m-b">Title M B - 18px Semibold (마이/쪽지/비번 페이지용)</p>
        </div>
      </section>

      {/* Placeholder Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Placeholder Styles</h2>
        <div className="space-y-4 max-w-sm">
          <input
            className="placeholder-a border p-2 w-full"
            placeholder="로그인 페이지용 placeholder (14px)"
          />
          <input
            className="placeholder-b border p-2 w-full"
            placeholder="마이/쪽지/비번변경 페이지용 placeholder (16px)"
          />
        </div>
      </section>

      {/* Layout Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">flex-center</h2>
        <div className="h-32 bg-white border flex-center">
          <span className="title-m-b"> h-32 bg-white border flex-center</span>
        </div>
      </section>
    </div>
  );
}
