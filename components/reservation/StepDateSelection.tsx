'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';

interface StepDateSelectionProps {
    selectedDates: string[];
    onChange: (dates: string[]) => void;
    onNext: () => void;
}

type Reservation = {
    id: string;
    room_id: number;
    user_name: string;
    date: string;
    start_time: string;
    end_time: string;
    event_type?: string;
    status: string;
};

export default function StepDateSelection({ selectedDates, onChange, onNext }: StepDateSelectionProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Fetch reservations for the displayed month
    useEffect(() => {
        const fetchReservations = async () => {
            const startStr = format(startDate, 'yyyy-MM-dd');
            const endStr = format(endDate, 'yyyy-MM-dd');

            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .gte('date', startStr)
                .lte('date', endStr)
                .neq('status', 'cancelled');

            if (error) {
                console.error('Error fetching reservations:', error);
            } else {
                setReservations(data || []);
            }
        };

        fetchReservations();
    }, [currentMonth]);

    const toggleDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

        if (isPast) return;

        if (selectedDates.includes(dateStr)) {
            onChange(selectedDates.filter(d => d !== dateStr));
        } else {
            onChange([...selectedDates, dateStr].sort());
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up">
            {/* Calendar Section */}
            <div className="flex-1">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-xl font-bold text-gray-900">날짜를 선택해주세요</h2>
                    <p className="text-gray-500 text-sm">합주가 가능한 날짜를 모두 선택해주세요</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600">
                            ←
                        </button>
                        <span className="text-lg font-bold text-gray-900">
                            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600">
                            →
                        </button>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 mb-2">
                        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                            <div key={day} className={`text-center text-xs font-bold mb-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}`}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const isSelected = selectedDates.includes(dateStr);
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isTodayDate = isToday(day);
                            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                            // Check if day has reservations
                            const hasReservations = reservations.some(res => res.date === dateStr);

                            return (
                                <button
                                    key={day.toString()}
                                    onClick={() => toggleDate(day)}
                                    disabled={isPast}
                                    className={`
                                        relative aspect-square rounded-full flex flex-col items-center justify-center transition-all
                                        ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                                        ${isPast ? 'text-gray-200 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}
                                        ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform scale-105' : ''}
                                        ${isTodayDate && !isSelected ? 'ring-2 ring-blue-600 ring-inset' : ''}
                                    `}
                                >
                                    <span className={`text-sm font-medium ${isTodayDate && !isSelected ? 'text-blue-600 font-bold' : ''}`}>
                                        {format(day, 'd')}
                                    </span>
                                    {/* Dot indicator for reservations */}
                                    {hasReservations && !isSelected && !isPast && (
                                        <span className="absolute bottom-2 w-1 h-1 bg-gray-300 rounded-full"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Dates Summary */}
                <div className="mt-6 bg-gray-50 rounded-xl p-4">
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

            {/* Daily Schedule Side Panel */}
            <div className="w-full lg:w-80 bg-gray-50 rounded-3xl p-6 border border-gray-100 h-fit">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    선택한 날짜의 합주 일정
                </h3>

                <div className="space-y-3">
                    {selectedDates.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            날짜를 선택하면<br />기존 합주 일정을 볼 수 있어요
                        </div>
                    ) : (
                        (() => {
                            // Filter reservations for all selected dates and only '합주' type
                            const relevantReservations = reservations
                                .filter(res => selectedDates.includes(res.date) && res.event_type === '합주')
                                .sort((a, b) => {
                                    // Sort by date first, then time
                                    if (a.date !== b.date) return a.date.localeCompare(b.date);
                                    return a.start_time.localeCompare(b.start_time);
                                });

                            if (relevantReservations.length === 0) {
                                return (
                                    <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
                                        선택한 날짜에<br />잡힌 합주 일정이 없습니다
                                    </div>
                                );
                            }

                            return relevantReservations.map(res => (
                                <div key={res.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs font-bold text-gray-500 mb-1">
                                        {format(parseISO(res.date), 'M월 d일 (E)', { locale: ko })}
                                    </div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-900 text-sm">{res.user_name}</span>
                                        <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                            Room {res.room_id}
                                        </span>
                                    </div>
                                    <div className="mb-1">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                            {res.event_type || '예약'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {res.start_time} - {res.end_time}
                                    </div>
                                </div>
                            ));
                        })()
                    )}
                </div>
            </div>
        </div>
    );
}
