import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ReservationItem from '@/components/ReservationItem';

export const revalidate = 0; // Disable caching to show latest status

export default async function MyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch My Reservations
    const userName = user.user_metadata.full_name || user.email?.split('@')[0];

    // Fix: Use KST (Korea Standard Time) for current date/time
    const now = new Date();
    const kstDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const dateString = kstDate.getFullYear() + '-' +
        String(kstDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(kstDate.getDate()).padStart(2, '0');

    // Format time as HH:MM:SS
    const timeString = String(kstDate.getHours()).padStart(2, '0') + ':' +
        String(kstDate.getMinutes()).padStart(2, '0') + ':' +
        String(kstDate.getSeconds()).padStart(2, '0');

    const { data: allReservations } = await supabase
        .from('reservations')
        .select('*')
        .ilike('user_name', `%${userName}%`)
        .gte('date', dateString) // Fetch from today onwards
        .neq('status', 'cancelled') // Hide cancelled ones
        .order('date', { ascending: true });

    // Filter out today's past events (e.g. if now is 20:00, hide 18:00 event)
    const myReservations = allReservations?.filter(res => {
        if (res.date > dateString) return true;
        if (res.date === dateString) {
            return res.end_time > timeString;
        }
        return false;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-black text-black mb-8 tracking-tighter">MY PAGE</h1>

                    {/* Profile Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        {user.user_metadata.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className="w-20 h-20 rounded-full border-2 border-gray-100"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                {userName?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    {/* Reservations Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                            My Upcoming Reservations
                        </h2>

                        {myReservations && myReservations.length > 0 ? (
                            <div className="space-y-4">
                                {myReservations.map((res) => (
                                    <ReservationItem key={res.id} reservation={res} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p>No upcoming reservations found.</p>
                                <Link href="/dashboard" className="text-blue-500 hover:underline mt-2 inline-block">
                                    Go to Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
