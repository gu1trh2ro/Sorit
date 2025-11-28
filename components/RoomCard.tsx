import { Room } from '@/types';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-[#1f1f1f] rounded-2xl border border-neon-cyan p-6 hover-lift hover-glow glow-cyan">
      {/* 합주실 이름 */}
      <h3 className="text-2xl font-bold text-[#00f5ff] mb-3">
        {room.name}
      </h3>
      
      {/* 위치 */}
      <p className="text-[#a0a0a0] text-sm mb-4">
        📍 {room.location}
      </p>
      
      {/* 기본 정보 */}
      <div className="flex gap-4 mb-4 text-sm">
        <span className="text-[#808080]">
          👥 수용 인원: <span className="text-white font-semibold">{room.capacity}명</span>
        </span>
        <span className="text-[#808080]">
          ⏰ {room.openAt} - {room.closeAt}
        </span>
      </div>
      
      {/* 장비 리스트 */}
      <div className="border-t border-[#333] pt-4">
        <strong className="text-[#ff006e] text-sm">장비:</strong>
        <ul className="mt-2 space-y-1">
          {room.equipment.map((item, index) => (
            <li key={index} className="text-sm text-[#a0a0a0] flex items-center gap-2">
              <span className="text-[#39ff14]">●</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

