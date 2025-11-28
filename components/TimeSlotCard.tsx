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
    <div className={`bg-[#1f1f1f] rounded-xl p-6 border ${
      slot.available 
        ? 'border-[#39ff14] glow-cyan' 
        : 'border-[#4a4a4a]'
    }`}>
      {/* 합주실 이름 */}
      <h4 className="text-xl font-bold text-[#00f5ff] mb-2">
        {slot.room.name}
      </h4>
      
      {/* 시간 */}
      <p className="text-3xl font-bold text-[#ff006e] mb-4">
        {slot.startTime} - {slot.endTime}
      </p>
      
      {/* 상태 뱃지 */}
      <div className="mb-4">
        {slot.available ? (
          <span className="inline-block bg-[#39ff14] text-black text-xs font-bold px-3 py-1 rounded-full">
            ✓ 예약 가능
          </span>
        ) : (
          <span className="inline-block bg-[#ff006e] text-black text-xs font-bold px-3 py-1 rounded-full">
            ✕ 예약됨 ({slot.teamName})
          </span>
        )}
      </div>
      
      {/* 버튼 */}
      <Button 
        variant={slot.available ? 'primary' : 'outline'} 
        onClick={handleReserve}
        disabled={!slot.available}
      >
        {slot.available ? '예약하기' : '예약 불가'}
      </Button>
    </div>
  );
}

