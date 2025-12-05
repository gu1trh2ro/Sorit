import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import AuthButton from './AuthButton';
import NavBarMenu from './NavBarMenu';

export default async function NavBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* 로고 */}
        <Link href="/" className="z-50 relative">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-black">
              SORIT
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-widest">BAND STUDIO</p>
          </div>
        </Link>

        {/* 데스크탑 메뉴 & 모바일 메뉴 토글 */}
        <NavBarMenu user={user}>
          <AuthButton user={user} />
        </NavBarMenu>
      </div>
    </nav>
  );
}

