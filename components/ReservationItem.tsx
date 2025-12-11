'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ReservationEditModal from './ReservationEditModal';

interface ReservationItemProps {
    reservation: any; // Replace with proper type if available
}

export default function ReservationItem({ reservation }: ReservationItemProps) {
    const router = useRouter();
    const [isCancelling, setIsCancelling] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleCancel = async () => {
        if (!confirm('정말로 예약을 취소하시겠습니까?')) return;

        setIsCancelling(true);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from('reservations')
                .update({ status: 'cancelled' })
                .eq('id', reservation.id);

            if (error) throw error;

            alert('예약이 취소되었습니다.');
            router.refresh(); // Refresh server component to update list
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('예약 취소 중 오류가 발생했습니다.');
        } finally {
            setIsCancelling(false);
        }
    };

    const handleUpdate = () => {
        router.refresh();
    };

    const isCancelled = reservation.status === 'cancelled';

    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4 md:gap-0">
                <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {reservation.event_type} - {reservation.user_name}
                        {isCancelled && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">취소됨</span>}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {reservation.date} | {reservation.start_time.slice(0, 5)} - {reservation.end_time.slice(0, 5)}
                    </p>
                </div>

                {!isCancelled && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-white border border-gray-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                            시간 변경
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                        >
                            {isCancelling ? '처리중...' : '예약 취소'}
                        </button>
                    </div>
                )}
            </div>

            {isEditing && (
                <ReservationEditModal
                    reservation={reservation}
                    onClose={() => setIsEditing(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
}
