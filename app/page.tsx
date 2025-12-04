import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import RoomCard from '@/components/RoomCard';
import TimeSlotCard from '@/components/TimeSlotCard';
import Footer from '@/components/Footer';
import { rooms, todaySlots } from '@/data/mockData';

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavBar />

      <main>
        <Hero />

        {/* 합주실 소개 섹션 */}
        <section className="py-20 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center text-black mb-4 tracking-tighter">
              STUDIOS
            </h2>
            <p className="text-center text-gray-500 mb-12">
              Professional Equipment & Perfect Acoustics
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </section>

        {/* 오늘의 빈 슬롯 미리보기 섹션 */}
        <section className="py-20 px-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center text-black mb-4 tracking-tighter">
              AVAILABLE NOW
            </h2>
            <p className="text-center text-gray-500 mb-12">
              Book your session instantly
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {todaySlots
                .filter(slot => slot.room.id === '1') // 외부 합주실 제외 (실시간 데이터 연동 불가)
                .map((slot) => (
                  <TimeSlotCard key={slot.id} slot={slot} />
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
