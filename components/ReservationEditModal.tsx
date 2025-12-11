'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';

interface ReservationEditModalProps {
    reservation: any;
    onClose: () => void;
    onUpdate: () => void;
}

export default function ReservationEditModal({ reservation, onClose, onUpdate }: ReservationEditModalProps) {
    const [date, setDate] = useState(reservation.date);
    const [startTime, setStartTime] = useState(reservation.start_time.slice(0, 5));
    const [endTime, setEndTime] = useState(reservation.end_time.slice(0, 5));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const generateTimeOptions = () => {
        const times = [];
        for (let i = 0; i < 48; i++) { // 00:00 to 23:30
            const hour = Math.floor(i / 2);
            const minute = i % 2 === 0 ? '00' : '30';
            times.push(`${hour.toString().padStart(2, '0')}:${minute}`);
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const checkConflict = async (checkDate: string, checkStart: string, checkEnd: string) => {
        const supabase = createClient();

        // Only check conflicts if the current event is '합주'
        if (reservation.event_type !== '합주') return false;

        const { data, error } = await supabase
            .from('reservations')
            .select('id')
            .eq('date', checkDate)
            .eq('room_id', reservation.room_id)
            .eq('event_type', '합주') // Only conflict with other Band Practices
            .neq('id', reservation.id) // Exclude self
            .neq('status', 'cancelled')
            .or(`and(start_time.lte.${checkStart},end_time.gt.${checkStart}),and(start_time.lt.${checkEnd},end_time.gte.${checkEnd}),and(start_time.gte.${checkStart},end_time.lte.${checkEnd})`);

        if (error) {
            console.error('Error checking conflicts:', error);
            throw error;
        }

        return data.length > 0;
    };

    const handleSave = async () => {
        setError('');
        if (!date || !startTime || !endTime) {
            setError('모든 정보를 입력해주세요.');
            return;
        }
        if (startTime >= endTime) {
            setError('종료 시간은 시작 시간보다 늦어야 합니다.');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Conflict Check
            const hasConflict = await checkConflict(date, startTime, endTime);
            if (hasConflict) {
                setError('해당 시간에 이미 다른 합주 예약이 있습니다.');
                setIsLoading(false);
                return;
            }

            // 2. Update
            const supabase = createClient();
            const { error: updateError } = await supabase
                .from('reservations')
                .update({
                    date,
                    start_time: startTime,
                    end_time: endTime,
                })
                .eq('id', reservation.id);

            if (updateError) throw updateError;

            alert('예약이 수정되었습니다.');
            onUpdate();
            onClose();

        } catch (err) {
            console.error('Update failed:', err);
            setError('예약 수정 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
                <h2 className="text-xl font-bold text-gray-900 mb-4">예약 시간 변경</h2>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">날짜</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">시작 시간</label>
                            <select
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white"
                            >
                                {timeOptions.map(t => (
                                    <option key={`start-${t}`} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">종료 시간</label>
                            <select
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white"
                            >
                                {timeOptions.map(t => (
                                    <option key={`end-${t}`} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">
                            ⚠️ {error}
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 py-3"
                    >
                        취소
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 py-3"
                    >
                        {isLoading ? '저장 중...' : '변경 저장'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
