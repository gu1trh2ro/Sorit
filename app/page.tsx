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
        <section className="py-20 px-8 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gradient-purple-cyan mb-4">
              운영 중인 합주실
            </h2>
            <p className="text-center text-[#a0a0a0] mb-12">
              소리터의 모든 합주실은 최신 장비로 구비되어 있습니다
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </section>

        {/* 오늘의 빈 슬롯 미리보기 섹션 */}
        <section className="py-20 px-8 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gradient-cyan-magenta mb-4">
              오늘의 예약 가능 시간
            </h2>
            <p className="text-center text-[#a0a0a0] mb-12">
              지금 바로 예약할 수 있는 시간대를 확인하세요
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {todaySlots.map((slot) => (
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
