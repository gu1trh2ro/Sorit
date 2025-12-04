'use client';

import { useState, useEffect } from 'react';

interface VotingTimeGridProps {
    dates: string[];
    existingVotes: { user_name: string; selected_slots: Record<string, string[]> }[];
    mySlots: Record<string, string[]>;
    onChange: (slots: Record<string, string[]>) => void;
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9; // Start from 09:00
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
}).filter(time => parseInt(time.split(':')[0]) < 22); // End at 22:00

export default function VotingTimeGrid({ dates, existingVotes, mySlots, onChange }: VotingTimeGridProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');

    // Calculate vote counts for heatmap
    const getVoteCount = (date: string, time: string) => {
        return existingVotes.reduce((count, vote) => {
            const slots = vote.selected_slots[date] || [];
            return slots.includes(time) ? count + 1 : count;
        }, 0);
    };

    const maxVotes = existingVotes.length || 1; // Avoid division by zero

    const toggleSlot = (date: string, time: string) => {
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
        setIsDragging(true);
        const isSelected = (mySlots[date] || []).includes(time);
        setDragMode(isSelected ? 'deselect' : 'select');
        toggleSlot(date, time);
    };

    const handleMouseEnter = (date: string, time: string) => {
        if (!isDragging) return;

        const currentSlots = mySlots[date] || [];
        const isSelected = currentSlots.includes(time);

        if (dragMode === 'select' && !isSelected) {
            toggleSlot(date, time);
        } else if (dragMode === 'deselect' && isSelected) {
            toggleSlot(date, time);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    return (
        <div className="overflow-x-auto pb-4 select-none">
            <div className="flex gap-4 min-w-max justify-center">
                {/* Time Labels Column */}
                <div className="flex flex-col gap-1 pt-10">
                    {TIME_SLOTS.map(time => (
                        <div key={time} className="h-8 flex items-center justify-end text-xs text-gray-400 pr-2">
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
                            const voteCount = getVoteCount(date, time);
                            const intensity = voteCount / maxVotes; // 0.0 to 1.0
                            const isMySelected = (mySlots[date] || []).includes(time);

                            // Calculate background color based on intensity (Green heatmap)
                            // Base: White, Max: Green-500 (#22c55e)
                            // We'll use rgba for simple opacity-based heatmap or predefined classes
                            // Let's use opacity on a green background for smoother gradient

                            return (
                                <div
                                    key={`${date}-${time}`}
                                    onMouseDown={() => handleMouseDown(date, time)}
                                    onMouseEnter={() => handleMouseEnter(date, time)}
                                    className="relative h-8 rounded-md cursor-pointer transition-all border border-gray-100 group"
                                    style={{
                                        backgroundColor: `rgba(34, 197, 94, ${intensity * 0.8})`, // Green with opacity
                                    }}
                                >
                                    {/* Hover Tooltip (Vote Count) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-gray-700 bg-white/80 px-1 rounded shadow-sm">
                                            {voteCount}명
                                        </span>
                                    </div>

                                    {/* My Selection Overlay (Blue Border/Fill) */}
                                    {isMySelected && (
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
    );
}
