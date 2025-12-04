'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';

interface StepConfirmationProps {
    state: {
        eventInfo: { title: string; type: string; headcount: number };
        dates: string[];
        selectedSlots: Record<string, string[]>;
    };
}

export default function StepConfirmation({ state }: StepConfirmationProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [pollId, setPollId] = useState<string | null>(null);
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    const handleCreatePoll = async () => {
        setIsLoading(true);
        try {
            // 1. Create Poll
            const { data: poll, error: pollError } = await supabase
                .from('scheduling_polls')
                .insert({
                    title: state.eventInfo.title,
                    event_type: state.eventInfo.type,
                    headcount: state.eventInfo.headcount,
                    dates: state.dates,
                })
                .select()
                .single();

            if (pollError) throw pollError;

            // 2. Insert Creator's Vote (if any slots selected)
            if (Object.keys(state.selectedSlots).length > 0) {
                const { error: voteError } = await supabase
                    .from('scheduling_votes')
                    .insert({
                        poll_id: poll.id,
                        user_name: '개설자', // TODO: Replace with real user name if auth exists
                        selected_slots: state.selectedSlots,
                    });

                if (voteError) throw voteError;
            }

            // 3. Generate Share URL
            const url = `${window.location.origin}/reservation/${poll.id}`;

            // [NEW] If single person, create reservation immediately
            if (state.eventInfo.headcount === 1) {
                await createSinglePersonReservation(poll.id);
            }

            setPollId(poll.id);
            setShareUrl(url);

        } catch (error) {
            console.error('Error creating poll:', error);
            alert('약속 생성 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to create reservation for single person
    const createSinglePersonReservation = async (pollId: string) => {
        const reservationsToInsert = [];

        // Iterate over selected slots to create reservation records
        // Assuming selectedSlots is { "2024-12-05": ["13:00", "13:30", ...] }
        for (const [date, times] of Object.entries(state.selectedSlots)) {
            if (times.length === 0) continue;

            // Simple logic: Create one reservation per continuous block or just one per slot?
            // The current schema seems to support start_time/end_time.
            // For simplicity in this MVP, let's create one record per 30min slot OR 
            // try to merge them. Let's just create one record per slot for now to be safe and simple,
            // or better: just pick the first and last time if they are continuous?
            // Let's stick to the simplest: One reservation entry per selected time slot is probably bad for the DB.
            // Let's try to group them.

            // Grouping logic:
            const sortedTimes = [...times].sort();
            // For now, let's just insert them as individual 30min blocks if the DB allows, 
            // OR just insert one big block if they are continuous.
            // Given the user said "13:00 to 18:00", that's a lot of slots.
            // Let's just insert one record for the whole range for simplicity of the "Dashboard" view.

            if (sortedTimes.length > 0) {
                const startTime = sortedTimes[0];
                // Calculate end time: last slot + 30 mins
                // This is a bit complex to do perfectly without date-fns here, but let's approximate.
                // Actually, let's just insert each slot as a separate row for now to ensure "Heatmap" logic works if it uses rows.
                // Wait, ReservationCalendar uses "start_time" and "end_time".
                // If I insert 10 rows, the calendar will show 10 items. That's annoying.
                // Let's try to just take the min and max.

                const endTimeSlot = sortedTimes[sortedTimes.length - 1];
                // Add 30 mins to end time string (e.g. "13:00" -> "13:30")
                const [h, m] = endTimeSlot.split(':').map(Number);
                const endDateObj = new Date();
                endDateObj.setHours(h, m + 30);
                const endTime = `${endDateObj.getHours().toString().padStart(2, '0')}:${endDateObj.getMinutes().toString().padStart(2, '0')}`;

                reservationsToInsert.push({
                    room_id: 1, // Default room
                    user_name: state.eventInfo.title, // Use event title as user name
                    date: date,
                    start_time: startTime,
                    end_time: endTime,
                    event_type: state.eventInfo.type, // Save event type
                    status: 'confirmed',
                    poll_id: pollId // Link back to poll if needed (schema might not have this, let's check)
                });
            }
        }

        // Check if schema has poll_id in reservations? 
        // The schema file I viewed might have it or not. 
        // Let's assume NOT for now based on standard fields, but I should check.
        // Actually, I'll just omit poll_id from reservation insert to be safe, or check schema.
        // The user didn't ask for linking.

        const { error } = await supabase
            .from('reservations')
            .insert(reservationsToInsert.map(({ poll_id, ...rest }) => rest));

        if (error) throw error;
    };

    const copyToClipboard = () => {
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            alert('링크가 복사되었습니다!');
        }
    };

    if (pollId && shareUrl) {
        // Single user: Show completion message without share link
        if (state.eventInfo.headcount === 1) {
            return (
                <div className="text-center space-y-8 animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">✅</span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-gray-900">예약이 완료되었습니다!</h2>
                        <p className="text-gray-500">개인 연습 일정이 성공적으로 저장되었습니다.</p>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 text-lg shadow-lg"
                    >
                        홈으로 돌아가기
                    </Button>
                </div>
            );
        }

        return (
            <div className="text-center space-y-8 animate-fade-in-up">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎉</span>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900">약속 링크가 생성되었어요!</h2>
                    <p className="text-gray-500">친구들에게 공유하고 일정을 조율해보세요.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 bg-transparent text-gray-600 text-sm outline-none"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="text-blue-600 font-bold text-sm hover:underline"
                    >
                        복사
                    </button>
                </div>

                <Button
                    variant="primary"
                    onClick={copyToClipboard}
                    className="w-full py-4 text-lg shadow-lg"
                >
                    지금 공유할게요
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">마지막으로 확인해주세요</h2>
                <p className="text-gray-500 text-sm">입력하신 정보가 맞나요?</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-left">
                <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-500">약속 이름</span>
                    <span className="font-bold text-gray-900">{state.eventInfo.title}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-500">종류</span>
                    <span className="font-bold text-gray-900">{state.eventInfo.type}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-500">인원</span>
                    <span className="font-bold text-gray-900">{state.eventInfo.headcount}명</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">날짜</span>
                    <span className="font-bold text-gray-900">{state.dates.length}일 선택됨</span>
                </div>
            </div>

            <Button
                variant="primary"
                onClick={handleCreatePoll}
                disabled={isLoading}
                className="w-full py-4 text-lg shadow-lg"
            >
                {isLoading ? '생성 중...' : '완료하기'}
            </Button>
        </div>
    );
}
