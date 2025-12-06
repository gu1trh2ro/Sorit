'use client';

import Link from 'next/link';
import { Room } from '@/types';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const CardContent = (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group">
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
          👥 수용 인원: <span className="text-black font-bold">{room.capacity}명</span>
        </span>
        <span className="text-gray-600 font-medium">
          ⏰ {room.openAt} - {room.closeAt}
        </span>
      </div>

      {/* 장비 리스트 */}
      <div className="border-t border-gray-100 pt-4">
        <strong className="text-blue-500 text-xs font-bold uppercase tracking-wider">장비 목록</strong>
        <ul className="mt-2 space-y-1">
          {room.equipment.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer: External Link Button or Internal View Details Text */}
      {room.externalLink ? (
        <div className="mt-6">
          <a
            href={room.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-4 bg-gray-900 text-white text-center rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            예약 현황 확인하기 ↗
          </a>
        </div>
      ) : (
        <div className="mt-6 text-right">
          <span className="text-blue-500 font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">
            예약 현황 확인하기 &rarr;
          </span>
        </div>
      )}
    </div>
  );

  if (room.externalLink) {
    return CardContent;
  }

  return (
    <Link href={`/detail/${room.id}`} className="block h-full">
      {CardContent}
    </Link>
  );
}

