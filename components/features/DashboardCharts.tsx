"use client";

import { Room, TimeSlot } from '@/types';

interface Props {
    rooms: Room[];
    todaySlots: TimeSlot[];
}

export default function DashboardCharts({ rooms, todaySlots }: Props) {
    // Chart 1: Room Capacity (Bar Chart)
    const maxCapacity = Math.max(...rooms.map(r => r.capacity));

    // Chart 2: Availability by Room (Pie/Bar representation)
    const availabilityByRoom = rooms.map(room => {
        const roomSlots = todaySlots.filter(s => s.room.id === room.id);
        const availableCount = roomSlots.filter(s => s.available).length;
        const totalCount = roomSlots.length;
        return {
            name: room.name,
            available: availableCount,
            total: totalCount,
            percentage: totalCount > 0 ? (availableCount / totalCount) * 100 : 0
        };
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Capacity Chart */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-black mb-6">합주실 수용 인원</h3>
                <div className="space-y-6">
                    {rooms.map(room => (
                        <div key={room.id}>
                            <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
                                <span>{room.name}</span>
                                <span>{room.capacity}명</span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                                    style={{ width: `${(room.capacity / maxCapacity) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Availability Chart */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-black mb-6">오늘의 예약 현황</h3>
                <div className="space-y-6">
                    {availabilityByRoom.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
                                <span>{item.name}</span>
                                <span>{item.available} / {item.total} 타임</span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${item.percentage > 50 ? 'bg-green-500' : item.percentage > 20 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex gap-6 text-xs text-gray-500 justify-end font-medium">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span> 여유
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span> 보통
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span> 혼잡
                    </div>
                </div>
            </div>
        </div>
    );
}
