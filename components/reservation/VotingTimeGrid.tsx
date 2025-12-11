'use client';

import { useState, useEffect } from 'react';

interface VotingTimeGridProps {
    dates: string[];
    existingVotes: { user_name: string; selected_slots: Record<string, string[]> }[];
    mySlots: Record<string, string[]>;
    onChange: (slots: Record<string, string[]>) => void;
    occupiedSlots: Record<string, string[]>; // [NEW]
}

const TIME_SLOTS = Array.from({ length: 30 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9; // Start from 09:00
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
}).filter(time => parseInt(time.split(':')[0]) < 24); // End at 23:30

export default function VotingTimeGrid({ dates, existingVotes, mySlots, onChange, occupiedSlots }: VotingTimeGridProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
    const [hoveredSlot, setHoveredSlot] = useState<{ date: string; time: string; voters: string[] } | null>(null);

    // Calculate vote counts for heatmap
    const getVoteCount = (date: string, time: string) => {
        return existingVotes.reduce((count, vote) => {
            const slots = vote.selected_slots[date] || [];
            return slots.includes(time) ? count + 1 : count;
        }, 0);
    };

    const getVoters = (date: string, time: string) => {
        return existingVotes
            .filter(vote => (vote.selected_slots[date] || []).includes(time))
            .map(vote => vote.user_name);
    };

    const maxVotes = existingVotes.length || 1; // Avoid division by zero

    const toggleSlot = (date: string, time: string) => {
        if (occupiedSlots[date]?.includes(time)) return; // [NEW] Block if occupied

        const currentSlots = mySlots[date] || [];
        const isSelected = currentSlots.includes(time);

        let newSlots;
        if (isSelected) {
            newSlots = currentSlots.filter(t => t !== time);
        } else {
            newSlots = [...currentSlots, time].sort();
        }

        onChange({
            ...mySlots,
            [date]: newSlots
        });
    };

    const handleMouseDown = (date: string, time: string) => {
        if (occupiedSlots[date]?.includes(time)) return; // [NEW] Block if occupied

        setIsDragging(true);
        const isSelected = (mySlots[date] || []).includes(time);
        setDragMode(isSelected ? 'deselect' : 'select');
        toggleSlot(date, time);
    };

    const handleMouseEnter = (date: string, time: string) => {
        // Update hover info
        const voters = getVoters(date, time);
        setHoveredSlot({ date, time, voters });

        if (!isDragging) return;
        if (occupiedSlots[date]?.includes(time)) return; // [NEW] Block if occupied

        const currentSlots = mySlots[date] || [];
        const isSelected = currentSlots.includes(time);

        if (dragMode === 'select' && !isSelected) {
            toggleSlot(date, time);
        } else if (dragMode === 'deselect' && isSelected) {
            toggleSlot(date, time);
        }
    };

    const handleMouseLeaveSlot = () => {
        // Optional: Clear hover if needed, but keeping it might be better for reading
        // setHoveredSlot(null); 
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: Grid */}
            <div className="flex-1 w-full overflow-x-auto pb-4 select-none">
                <div className="flex gap-4 min-w-max">
                    {/* Time Labels Column - Sticky */}
                    <div className="flex flex-col gap-1 pt-10 sticky left-0 bg-white z-10 pr-2">
                        {TIME_SLOTS.map(time => (
                            <div key={time} className="h-8 flex items-center justify-end text-xs text-gray-400">
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Date Columns */}
                    {dates.map(date => (
                        <div key={date} className="flex flex-col gap-1 w-24">
                            <div className="text-center mb-2">
                                <div className="text-xs text-gray-500">{date.split('-')[1]}/{date.split('-')[2]}</div>
                                <div className="text-sm font-bold text-gray-900">
                                    {new Date(date).toLocaleDateString('ko-KR', { weekday: 'short' })}
                                </div>
                            </div>

                            {TIME_SLOTS.map(time => {
                                const isOccupied = occupiedSlots[date]?.includes(time); // [NEW]
                                const voteCount = getVoteCount(date, time);
                                const intensity = voteCount / maxVotes; // 0.0 to 1.0
                                const isMySelected = (mySlots[date] || []).includes(time);

                                return (
                                    <div
                                        key={`${date}-${time}`}
                                        onMouseDown={() => handleMouseDown(date, time)}
                                        onMouseEnter={() => handleMouseEnter(date, time)}
                                        onMouseLeave={handleMouseLeaveSlot}
                                        className={`
                                            relative h-8 rounded-md transition-all border border-gray-100 group
                                            ${isOccupied ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                        `}
                                        style={!isOccupied ? {
                                            backgroundColor: `rgba(34, 197, 94, ${intensity * 0.8})`, // Green with opacity
                                        } : {}}
                                        title={isOccupied ? '이미 예약된 시간입니다' : ''}
                                    >
                                        {/* My Selection Overlay (Blue Border/Fill) */}
                                        {isMySelected && !isOccupied && (
                                            <div className="absolute inset-0 border-2 border-blue-600 bg-blue-500/30 rounded-md z-10 pointer-events-none" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500/20 border border-gray-100"></div>
                        <span>가능한 사람 적음</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500 border border-gray-100"></div>
                        <span>가능한 사람 많음</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-blue-600 bg-blue-500/30"></div>
                        <span>내 선택</span>
                    </div>
                </div>
            </div>

            {/* Right: Info Panel (Sticky on Desktop) */}
            <div className="w-full md:w-64 md:sticky md:top-32 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit min-h-[200px]">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                    상세 정보
                </h3>

                {hoveredSlot ? (
                    <div className="animate-fade-in">
                        <div className="mb-4 pb-4 border-b border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">선택한 시간</p>
                            <p className="text-xl font-black text-gray-900">
                                {hoveredSlot.date.split('-')[1]}/{hoveredSlot.date.split('-')[2]} <span className="text-base font-normal text-gray-400">({new Date(hoveredSlot.date).toLocaleDateString('ko-KR', { weekday: 'short' })})</span>
                            </p>
                            <p className="text-2xl font-black text-blue-600">{hoveredSlot.time}</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-bold text-gray-700">가능한 멤버</p>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    {hoveredSlot.voters.length}명
                                </span>
                            </div>

                            {hoveredSlot.voters.length > 0 ? (
                                <ul className="space-y-1">
                                    {hoveredSlot.voters.map((voter, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {voter}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400 italic">가능한 멤버가 없습니다.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-8">
                        <p className="text-4xl mb-2">👆</p>
                        <p className="text-sm">시간을 클릭하거나<br />마우스를 올려보세요</p>
                    </div>
                )}
            </div>
        </div>
    );
}
