import Footer from '@/components/Footer';
import { rooms } from '@/data/mockData';
import RoomSearch from '@/components/features/RoomSearch';
import DashboardCharts from '@/components/features/DashboardCharts';
import ReservationCalendar from '@/components/features/ReservationCalendar';
import Link from 'next/link';
import Button from '@/components/Button';
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { TimeSlot } from '@/types';

export const metadata: Metadata = {
    title: '대시보드 | 소리터',
    description: '합주실 예약 현황과 통계를 한눈에 확인하세요.',
};

export const revalidate = 0; // Disable caching for real-time data

export default async function Dashboard() {
    const supabase = await createClient();
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    // 1. Fetch today's reservations for all rooms
    const { data: reservations } = await supabase
        .from('reservations')
        .select('*')
        .eq('date', dateString)
        .neq('status', 'cancelled');

    // 2. Generate TimeSlots based on real data
    // We'll generate slots for 10:00 - 24:00 for each room
    const todaySlots: TimeSlot[] = [];

    rooms.forEach(room => {
        // Skip external rooms for slot generation if needed, but for charts we might want to show them as unknown or empty?
        // For now, let's generate slots for Room 1 (Internal) only, or all if we want to show potential capacity.
        // Since we only have real data for Room 1, let's focus on Room 1 for accurate "Available Slots" count.
        // But the charts expect slots for all rooms to show "Availability by Room".
        // Let's generate slots for ALL rooms, but only mark Room 1 as booked based on DB. 
        // External rooms will appear fully available (which is technically true as we don't know).

        for (let hour = 10; hour < 24; hour++) {
            const startStr = `${hour.toString().padStart(2, '0')}:00`;
            const endStr = `${(hour + 1).toString().padStart(2, '0')}:00`;

            const isBooked = reservations?.some(res => {
                const resStart = res.start_time.slice(0, 5);
                const resEnd = res.end_time.slice(0, 5);
                return res.room_id.toString() === room.id &&
                    res.event_type === '합주' &&
                    (resStart < endStr) && (resEnd > startStr);
            });

            todaySlots.push({
                id: `${room.id}-${hour}`,
                room: room,
                date: dateString,
                startTime: startStr,
                endTime: endStr,
                available: !isBooked,
                teamName: isBooked ? 'Booked' : undefined
            });
        }
    });

    const totalRooms = rooms.length;
    // Only count slots for Room 1 as "Real" available slots for the top stat, 
    // or count all? Let's count all generated slots.
    const availableSlots = todaySlots.filter(slot => slot.available).length;
    const totalSlots = todaySlots.length;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <main className="pt-32 pb-12 px-8 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-black mb-4 text-black tracking-tighter">
                        DASHBOARD
                    </h1>
                    <p className="text-gray-500">Real-time studio status and analytics</p>
                </div>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Studios</h3>
                        <p className="text-5xl font-black text-black">{totalRooms}</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Available Slots (Today)</h3>
                        <p className="text-5xl font-black text-blue-600">{availableSlots} <span className="text-2xl text-gray-300 font-light">/ {totalSlots}</span></p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Operating Hours</h3>
                        <p className="text-3xl font-bold text-black">10:00 - 24:00</p>
                    </div>
                </section>

                {/* Reservation Calendar Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                        Reservation Calendar
                    </h2>
                    <ReservationCalendar />
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
            </main >

            <Footer />
        </div >
    );
}
