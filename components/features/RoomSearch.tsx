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
                    placeholder="Search by name, location, or equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <Link
                            href={`/detail/${room.id}`}
                            key={room.id}
                            className="block bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{room.name}</h3>
                                    <p className="text-gray-500 text-sm">{room.location} | Capacity {room.capacity}</p>
                                    <div className="mt-3 flex gap-2">
                                        {room.equipment.slice(0, 3).map((eq, i) => (
                                            <span key={i} className="text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-medium border border-gray-200">
                                                {eq}
                                            </span>
                                        ))}
                                        {room.equipment.length > 3 && (
                                            <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-medium border border-gray-200">
                                                +{room.equipment.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-blue-500 font-bold group-hover:translate-x-1 transition-transform">View Details &rarr;</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-400 py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">No studios found matching your search.</p>
                )}
            </div>
        </div>
    );
}
