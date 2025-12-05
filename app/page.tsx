import Hero from '@/components/Hero';
import RoomCard from '@/components/RoomCard';
import TimeSlotCard from '@/components/TimeSlotCard';
import Footer from '@/components/Footer';
import { rooms } from '@/data/mockData';
import { createClient } from '@/utils/supabase/server';
import { TimeSlot } from '@/types';

export const revalidate = 0; // Disable caching for real-time data

export default async function Home() {
  const supabase = await createClient();
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  const currentHour = today.getHours();

  // 1. Fetch today's reservations for Room 1
  const { data: reservations } = await supabase
    .from('reservations')
    .select('*')
    .eq('room_id', 1)
    .eq('date', dateString)
    .neq('status', 'cancelled');

  // 2. Calculate available slots (Next 3 available 1-hour slots)
  const targetRoom = rooms.find(r => r.id === '1')!;
  const availableSlots: TimeSlot[] = [];

  // Start checking from next hour, up to 23:00
  let checkHour = currentHour + 1;
  if (checkHour < 10) checkHour = 10; // Open at 10:00

  while (availableSlots.length < 3 && checkHour < 24) {
    const startStr = `${checkHour.toString().padStart(2, '0')}:00`;
    const endStr = `${(checkHour + 1).toString().padStart(2, '0')}:00`;

    // Check conflict
    // Rule: Only '합주' (Band Practice) blocks the slot for general view.
    // '개인연습' (Personal Practice) does not block new bookings (assuming new booking could be Personal or Band).
    // Actually, if we assume 'Available Now' is for 'Band Practice' (primary use case), then only 'Band Practice' blocks it.
    const isBooked = reservations?.some(res => {
      const resStart = res.start_time.slice(0, 5); // HH:MM
      const resEnd = res.end_time.slice(0, 5);     // HH:MM
      return (res.event_type === '합주') && (resStart < endStr) && (resEnd > startStr);
    });

    if (!isBooked) {
      availableSlots.push({
        id: `slot-${checkHour}`,
        room: targetRoom,
        date: dateString,
        startTime: startStr,
        endTime: endStr,
        available: true,
      });
    } else {
      // Optional: Show booked slots too? 
      // For "Available Now", we usually prioritize available ones, 
      // but if we want to fill the grid, we might include booked ones if we run out of available ones.
      // Let's stick to showing *next* slots, whether booked or not, to show schedule?
      // The original design was "Available Now", implying we show what IS available.
      // But if everything is booked, it might be empty.
      // Let's show the immediate next 3 slots regardless of status, so users see the schedule.
      const bookedRes = reservations?.find(res => (res.start_time < endStr) && (res.end_time > startStr));
      availableSlots.push({
        id: `slot-${checkHour}`,
        room: targetRoom,
        date: dateString,
        startTime: startStr,
        endTime: endStr,
        available: false,
        teamName: bookedRes?.user_name || 'Booked'
      });
    }

    checkHour++;
  }

  return (
    <div className="min-h-screen">
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
              Real-time schedule for {targetRoom.name}
            </p>

            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableSlots.map((slot) => (
                  <TimeSlotCard key={slot.id} slot={slot} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <p>No more slots available today.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
