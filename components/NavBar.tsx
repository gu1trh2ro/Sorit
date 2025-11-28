export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1acc] backdrop-blur-md border-b border-neon-cyan">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* 로고 */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-cyan-magenta">
            소리터
          </h1>
          <p className="text-xs text-[#a0a0a0]">합주실 예약 시스템</p>
        </div>

        {/* 메뉴 */}
        <ul className="flex gap-8">
          <li>
            <a
              href="/"
              className="text-white hover:text-[#00f5ff] transition-colors duration-300"
            >
              홈
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="text-white hover:text-[#00f5ff] transition-colors duration-300"
            >
              소개
            </a>
          </li>
          <li>
            <a
              href="/dashboard"
              className="text-white hover:text-[#00f5ff] transition-colors duration-300"
            >
              대시보드
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

