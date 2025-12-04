'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import Button from '@/components/Button';

interface StepDateSelectionProps {
    selectedDates: string[];
    onChange: (dates: string[]) => void;
    onNext: () => void;
}

export default function StepDateSelection({ selectedDates, onChange, onNext }: StepDateSelectionProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const toggleDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        if (selectedDates.includes(dateStr)) {
            onChange(selectedDates.filter(d => d !== dateStr));
        } else {
            onChange([...selectedDates, dateStr].sort());
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">날짜를 선택해주세요</h2>
                <p className="text-gray-500 text-sm">합주가 가능한 날짜를 모두 선택해주세요</p>
            </div>

            {/* Calendar UI */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        ←
                    </button>
                    <span className="text-lg font-bold text-gray-900">
                        {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        →
                    </button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-4">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                        <div key={day} className={`text-center text-sm font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}`}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isSelected = selectedDates.includes(dateStr);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isTodayDate = isToday(day);

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => toggleDate(day)}
                                className={`
                  aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${!isCurrentMonth ? 'text-gray-300' : ''}
                  ${isSelected
                                        ? 'bg-blue-600 text-white shadow-md scale-105'
                                        : 'hover:bg-gray-100 text-gray-700'}
                  ${isTodayDate && !isSelected ? 'ring-2 ring-blue-100 text-blue-600' : ''}
                `}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Dates Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-bold text-gray-700 mb-2">선택된 날짜 ({selectedDates.length}일)</div>
                <div className="flex flex-wrap gap-2">
                    {selectedDates.length > 0 ? (
                        selectedDates.map(date => (
                            <span key={date} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm">
                                {date}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400">날짜를 선택해주세요</span>
                    )}
                </div>
            </div>

            {/* Next Button */}
            <div className="pt-4">
                <Button
                    variant="primary"
                    onClick={onNext}
                    disabled={selectedDates.length === 0}
                    className={`w-full py-4 text-lg shadow-lg ${selectedDates.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
