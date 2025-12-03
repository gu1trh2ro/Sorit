import { Room } from '@/types';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* 합주실 이름 */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {room.name}
      </h3>

      {/* 위치 */}
      <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
        📍 {room.location}
      </p>

      {/* 기본 정보 */}
      <div className="flex gap-4 mb-4 text-sm">
        <span className="text-gray-600 font-medium">
          👥 Capacity: <span className="text-black font-bold">{room.capacity}</span>
        </span>
        <span className="text-gray-600 font-medium">
          ⏰ {room.openAt} - {room.closeAt}
        </span>
      </div>

      {/* 장비 리스트 */}
      <div className="border-t border-gray-100 pt-4">
        <strong className="text-blue-500 text-xs font-bold uppercase tracking-wider">Equipment</strong>
        <ul className="mt-2 space-y-1">
          {room.equipment.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

