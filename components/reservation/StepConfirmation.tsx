'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';

interface StepConfirmationProps {
    state: {
        roomId: string;
        eventInfo: { title: string; type: string; headcount: number };
        dates: string[];
        selectedSlots: Record<string, string[]>;
    };
}

export default function StepConfirmation({ state }: StepConfirmationProps) {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pollId, setPollId] = useState<string | null>(null);
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    // Fetch user on mount
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    const handleCreatePoll = async () => {
        setIsLoading(true);
        try {
            // 1. Create Poll
            const { data: poll, error: pollError } = await supabase
                .from('scheduling_polls')
                .insert({
                    title: state.eventInfo.title,
                    // [HACK] Embed roomId in event_type to pass it to voting page without schema change
                    // Format: "Type_RoomId" (e.g. "합주_2")
                    event_type: `${state.eventInfo.type}_${state.roomId}`,
                    headcount: state.eventInfo.headcount,
                    dates: state.dates,
                })
                .select()
                .single();

            if (pollError) throw pollError;

            // 2. Insert Creator's Vote (if any slots selected)
            if (Object.keys(state.selectedSlots).length > 0) {
                // Determine user name:
                // If '합주', use logged-in user's name.
                // If '개인연습'/'휴식', title is the name.
                // Fallback to '개설자' if no user found.
                let creatorName = '개설자';
                if (state.eventInfo.type === '합주') {
                    if (user) {
                        creatorName = user.user_metadata.full_name || user.email?.split('@')[0] || '개설자';
                    }
                } else {
                    creatorName = state.eventInfo.title;
                }

                const { error: voteError } = await supabase
                    .from('scheduling_votes')
                    .insert({
                        poll_id: poll.id,
                        user_name: creatorName,
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
        for (const [date, times] of Object.entries(state.selectedSlots)) {
            if (times.length === 0) continue;

            const sortedTimes = [...times].sort();

            if (sortedTimes.length > 0) {
                const startTime = sortedTimes[0];
                const endTimeSlot = sortedTimes[sortedTimes.length - 1];
                const [h, m] = endTimeSlot.split(':').map(Number);
                const endDateObj = new Date();
                endDateObj.setHours(h, m + 30);
                const endTime = `${endDateObj.getHours().toString().padStart(2, '0')}:${endDateObj.getMinutes().toString().padStart(2, '0')}`;

                reservationsToInsert.push({
                    room_id: parseInt(state.roomId) || 1, // Use roomId from state
                    user_name: state.eventInfo.title, // Use event title as user name
                    date: date,
                    start_time: startTime,
                    end_time: endTime,
                    event_type: state.eventInfo.type, // Save event type
                    status: 'confirmed',
                    // poll_id: pollId // Schema check needed, omitting for now
                });
            }
        }

        const { error } = await supabase
            .from('reservations')
            .insert(reservationsToInsert);

        if (error) throw error;
    };

    const copyToClipboard = () => {
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            alert('링크가 복사되었습니다!');
        }
    };

    const handleShareNow = () => {
        if (pollId) {
            window.location.href = `/reservation/${pollId}`;
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

                <div className="space-y-3">
                    <Button
                        variant="primary"
                        onClick={handleShareNow}
                        className="w-full py-4 text-lg shadow-lg"
                    >
                        지금 바로 투표하기
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 text-lg border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                        홈으로 이동
                    </Button>
                </div>
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
