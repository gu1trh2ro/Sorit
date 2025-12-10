'use client';


import { useState, useEffect } from 'react';
import { rooms } from '@/data/mockData';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

type Reservation = {
    id: number;
    room_id: number;
    user_name: string;
    date: string;
    start_time: string;
    end_time: string;
    event_type?: string;
    status: string;
};

interface Props {
    roomId?: string;
}

export default function ReservationCalendar({ roomId }: Props) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Fetch reservations for the displayed month range
    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true);
            const startStr = format(startDate, 'yyyy-MM-dd');
            const endStr = format(endDate, 'yyyy-MM-dd');

            let query = supabase
                .from('reservations')
                .select('*')
                .gte('date', startStr)
                .lte('date', endStr)
                .eq('status', 'confirmed');

            if (roomId) {
                query = query.eq('room_id', roomId);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching reservations:', error);
            } else {
                setReservations(data || []);
            }
            setIsLoading(false);
        };

        fetchReservations();
    }, [currentMonth, roomId]);

    // Filter reservations for the selected date
    const selectedDateReservations = reservations.filter(res =>
        isSameDay(parseISO(res.date), selectedDate)
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Calendar Section */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                {/* Header */}
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
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);

                        const dayReservations = reservations.filter(res => res.date === dateStr);
                        const hasReservations = dayReservations.length > 0;

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                  relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all
                  ${!isCurrentMonth ? 'text-gray-300 bg-gray-50/50' : 'bg-white hover:bg-gray-50'}
                  ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 z-10' : 'border border-gray-100'}
                `}
                            >
                                <span className={`text-sm font-medium ${isTodayDate ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                                    {format(day, 'd')}
                                </span>

                                {/* Reservation Dots */}
                                {hasReservations && (
                                    <div className="flex gap-1 mt-1">
                                        {dayReservations.slice(0, 3).map((_, i) => (
                                            <div key={i} className="w-1 h-1 rounded-full bg-blue-500" />
                                        ))}
                                        {dayReservations.length > 3 && (
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-80 bg-gray-50 rounded-3xl p-6 border border-gray-100 h-fit">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {format(selectedDate, 'M월 d일 (E)', { locale: ko })} 일정
                </h3>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-400 text-sm">로딩 중...</div>
                    ) : selectedDateReservations.length > 0 ? (
                        selectedDateReservations.map(res => (
                            <div key={res.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">


                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-900 text-sm">{res.user_name}</span>
                                    <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                        {rooms.find(r => r.id === String(res.room_id))?.name || `Room ${res.room_id}`}
                                    </span>
                                </div>
                                {/* Event Type Badge */}
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
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
                            예약된 일정이 없습니다
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
