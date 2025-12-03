export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* 로고 */}
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-black">
            SORIT
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-widest">BAND STUDIO</p>
        </div>

        {/* 메뉴 */}
        <ul className="flex gap-8">
          <li>
            <a
              href="/"
              className="text-gray-800 hover:text-[#00bcd4] font-medium transition-colors duration-300"
            >
              HOME
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="text-gray-800 hover:text-[#00bcd4] font-medium transition-colors duration-300"
            >
              ABOUT
            </a>
          </li>
          <li>
            <a
              href="/dashboard"
              className="text-gray-800 hover:text-[#00bcd4] font-medium transition-colors duration-300"
            >
              DASHBOARD
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

