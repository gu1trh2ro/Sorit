import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { rooms, todaySlots } from '@/data/mockData';
import RoomSearch from '@/components/features/RoomSearch';
import DashboardCharts from '@/components/features/DashboardCharts';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '대시보드 | 소리터',
    description: '합주실 예약 현황과 통계를 한눈에 확인하세요.',
};

export default function Dashboard() {
    const totalRooms = rooms.length;
    const availableSlots = todaySlots.filter(slot => slot.available).length;
    const totalSlots = todaySlots.length;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <NavBar />

            <main className="pt-32 pb-12 px-8 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-black mb-4 text-black tracking-tighter">
                        DASHBOARD
                    </h1>
                    <p className="text-gray-500">Real-time studio status and analytics</p>
                </div>

                {/* Stats Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Studios</h3>
                        <p className="text-5xl font-black text-black">{totalRooms}</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Available Slots</h3>
                        <p className="text-5xl font-black text-blue-600">{availableSlots} <span className="text-2xl text-gray-300 font-light">/ {totalSlots}</span></p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Operating Hours</h3>
                        <p className="text-3xl font-bold text-black">10:00 - 24:00</p>
                    </div>
                </section>

                {/* Charts Section */}
                <DashboardCharts rooms={rooms} todaySlots={todaySlots} />

                {/* Room List Section */}
                <section>
                    <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                        Search Studios
                    </h2>
                    <RoomSearch initialRooms={rooms} />
                </section>
            </main>

            <Footer />
        </div>
    );
}
