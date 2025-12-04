'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';

interface StepTimeGridProps {
    dates: string[];
    selectedSlots: Record<string, string[]>;
    onChange: (slots: Record<string, string[]>) => void;
    onNext: () => void;
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9; // Start from 09:00
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
}).filter(time => parseInt(time.split(':')[0]) < 22); // End at 22:00

export default function StepTimeGrid({ dates, selectedSlots, onChange, onNext }: StepTimeGridProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');

    const toggleSlot = (date: string, time: string) => {
        const currentSlots = selectedSlots[date] || [];
        const isSelected = currentSlots.includes(time);

        let newSlots;
        if (isSelected) {
            newSlots = currentSlots.filter(t => t !== time);
        } else {
            newSlots = [...currentSlots, time].sort();
        }

        onChange({
            ...selectedSlots,
            [date]: newSlots
        });
    };

    const handleMouseDown = (date: string, time: string) => {
        setIsDragging(true);
        const isSelected = (selectedSlots[date] || []).includes(time);
        setDragMode(isSelected ? 'deselect' : 'select');
        toggleSlot(date, time);
    };

    const handleMouseEnter = (date: string, time: string) => {
        if (!isDragging) return;

        const currentSlots = selectedSlots[date] || [];
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

    const totalSelectedCount = Object.values(selectedSlots).reduce((acc, slots) => acc + slots.length, 0);

    return (
        <div className="space-y-8 animate-fade-in-up select-none">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">시간을 선택해주세요</h2>
                <p className="text-gray-500 text-sm">드래그하여 가능한 시간을 모두 선택해주세요</p>
            </div>

            {/* Time Grid */}
            <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
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
                        <div key={date} className="flex flex-col gap-1 w-20">
                            <div className="text-center mb-2">
                                <div className="text-xs text-gray-500">{date.split('-')[1]}/{date.split('-')[2]}</div>
                                <div className="text-sm font-bold text-gray-900">
                                    {new Date(date).toLocaleDateString('ko-KR', { weekday: 'short' })}
                                </div>
                            </div>

                            {TIME_SLOTS.map(time => {
                                const isSelected = (selectedSlots[date] || []).includes(time);
                                return (
                                    <div
                                        key={`${date}-${time}`}
                                        onMouseDown={() => handleMouseDown(date, time)}
                                        onMouseEnter={() => handleMouseEnter(date, time)}
                                        className={`
                      h-8 rounded-md cursor-pointer transition-colors border border-gray-100
                      ${isSelected
                                                ? 'bg-blue-500 border-blue-600 shadow-sm'
                                                : 'bg-gray-50 hover:bg-gray-100'}
                    `}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary & Next Button */}
            <div className="pt-4 space-y-4">
                <div className="text-center text-sm text-gray-500">
                    총 <span className="font-bold text-blue-600">{totalSelectedCount}</span>개의 시간대가 선택되었습니다
                </div>
                <Button
                    variant="primary"
                    onClick={onNext}
                    disabled={totalSelectedCount === 0}
                    className={`w-full py-4 text-lg shadow-lg ${totalSelectedCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
