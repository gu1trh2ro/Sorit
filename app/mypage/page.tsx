import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default async function MyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch My Reservations (Assuming user_name matches or we add user_id later)
    // For now, let's try to fetch based on user_name matching the user's full name
    const userName = user.user_metadata.full_name || user.email?.split('@')[0];

    const { data: myReservations } = await supabase
        .from('reservations')
        .select('*')
        .ilike('user_name', `%${userName}%`) // Loose matching for now
        .order('date', { ascending: false });

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
                            My Reservations
                        </h2>

                        {myReservations && myReservations.length > 0 ? (
                            <div className="space-y-4">
                                {myReservations.map((res) => (
                                    <div key={res.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4 md:gap-0">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{res.event_type} - {res.user_name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {res.date} | {res.start_time} - {res.end_time}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {res.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p>No reservations found.</p>
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
