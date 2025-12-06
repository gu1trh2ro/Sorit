'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton({ user }: { user: User | null }) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return user ? (
        <div className="flex items-center gap-4">
            <Link href="/mypage" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {user.user_metadata.avatar_url && (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border border-gray-200"
                    />
                )}
                <span className="text-sm font-medium text-gray-700">
                    {user.user_metadata.full_name || user.email?.split('@')[0]}
                </span>
            </Link>
            <button
                onClick={handleSignOut}
                className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
            >
                Logout
            </button>
        </div>
    ) : (
        <Link
            href="/login"
            className="px-4 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
        >
            Login
        </Link>
    );
}
