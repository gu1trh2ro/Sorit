"use client";

import { useState } from 'react';
import { Room } from '@/types';
import Link from 'next/link';

interface Props {
    initialRooms: Room[];
}

export default function RoomSearch({ initialRooms }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRooms = initialRooms.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.equipment.some(eq => eq.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="합주실 이름, 위치, 장비 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#00f5ff] transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <Link
                            href={`/detail/${room.id}`}
                            key={room.id}
                            className="block bg-[#1a1a1a] p-6 rounded-lg border border-[#333] hover:border-[#00f5ff] transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
                                    <p className="text-[#a0a0a0]">{room.location} | 수용인원 {room.capacity}명</p>
                                    <div className="mt-2 flex gap-2">
                                        {room.equipment.slice(0, 3).map((eq, i) => (
                                            <span key={i} className="text-xs bg-[#333] px-2 py-1 rounded text-[#a0a0a0]">
                                                {eq}
                                            </span>
                                        ))}
                                        {room.equipment.length > 3 && (
                                            <span className="text-xs bg-[#333] px-2 py-1 rounded text-[#a0a0a0]">
                                                +{room.equipment.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[#00f5ff]">상세보기 &rarr;</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-[#a0a0a0] py-8">검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
}
