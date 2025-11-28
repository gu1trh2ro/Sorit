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
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <NavBar />

            <main className="pt-24 pb-12 px-8 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gradient-cyan-magenta">
                    대시보드
                </h1>

                {/* Stats Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                        <h3 className="text-[#a0a0a0] mb-2">총 합주실</h3>
                        <p className="text-4xl font-bold text-[#00f5ff]">{totalRooms}개</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                        <h3 className="text-[#a0a0a0] mb-2">오늘 예약 가능</h3>
                        <p className="text-4xl font-bold text-[#00f5ff]">{availableSlots} / {totalSlots}</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                        <h3 className="text-[#a0a0a0] mb-2">운영 시간</h3>
                        <p className="text-2xl font-bold text-white">10:00 - 24:00</p>
                    </div>
                </section>

                {/* Charts Section */}
                <DashboardCharts rooms={rooms} todaySlots={todaySlots} />

                {/* Room List Section */}
                <section>
                    <h2 className="text-2xl font-bold text-[#00f5ff] mb-6">
                        합주실 검색
                    </h2>
                    <RoomSearch initialRooms={rooms} />
                </section>
            </main>

            <Footer />
        </div>
    );
}
