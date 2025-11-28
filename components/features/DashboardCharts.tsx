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
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                <h3 className="text-xl font-bold text-[#00f5ff] mb-6">합주실 수용 인원</h3>
                <div className="space-y-4">
                    {rooms.map(room => (
                        <div key={room.id}>
                            <div className="flex justify-between text-sm text-[#a0a0a0] mb-1">
                                <span>{room.name}</span>
                                <span>{room.capacity}명</span>
                            </div>
                            <div className="w-full bg-[#333] h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[#00f5ff] to-[#7000ff] h-full"
                                    style={{ width: `${(room.capacity / maxCapacity) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Availability Chart */}
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                <h3 className="text-xl font-bold text-[#00f5ff] mb-6">오늘의 예약 현황</h3>
                <div className="space-y-4">
                    {availabilityByRoom.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm text-[#a0a0a0] mb-1">
                                <span>{item.name}</span>
                                <span>{item.available} / {item.total} 슬롯</span>
                            </div>
                            <div className="w-full bg-[#333] h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${item.percentage > 50 ? 'bg-[#00f5ff]' : item.percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-[#a0a0a0] justify-end">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#00f5ff] rounded-full"></span> 여유
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> 보통
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span> 혼잡
                    </div>
                </div>
            </div>
        </div>
    );
}
