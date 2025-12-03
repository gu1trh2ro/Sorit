'use client';

import { TimeSlot } from '@/types';
import Button from './Button';

interface TimeSlotCardProps {
  slot: TimeSlot;
}

export default function TimeSlotCard({ slot }: TimeSlotCardProps) {
  const handleReserve = () => {
    if (slot.available) {
      alert(`${slot.room.name} ${slot.startTime}-${slot.endTime} 예약하기`);
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 border transition-all duration-300 ${slot.available
        ? 'border-green-400 shadow-md hover:shadow-lg hover:border-green-500'
        : 'border-gray-200 opacity-75'
      }`}>
      {/* 합주실 이름 */}
      <h4 className="text-xl font-bold text-gray-900 mb-2">
        {slot.room.name}
      </h4>

      {/* 시간 */}
      <p className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
        {slot.startTime} <span className="text-gray-400 font-light">-</span> {slot.endTime}
      </p>

      {/* 상태 뱃지 */}
      <div className="mb-4">
        {slot.available ? (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span> Booked ({slot.teamName})
          </span>
        )}
      </div>

      {/* 버튼 */}
      <Button
        variant={slot.available ? 'primary' : 'outline'}
        onClick={handleReserve}
        disabled={!slot.available}
        className="w-full"
      >
        {slot.available ? 'Book Now' : 'Unavailable'}
      </Button>
    </div>
  );
}

