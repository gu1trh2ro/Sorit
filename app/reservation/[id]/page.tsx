
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { createClient } from '@/utils/supabase/client';
import VotingTimeGrid from '@/components/reservation/VotingTimeGrid';

const supabase = createClient();

type PollData = {
    id: string;
    title: string;
    event_type: string;
    headcount: number;
    dates: string[];
    is_closed: boolean;
};

type VoteData = {
    user_name: string;
    selected_slots: Record<string, string[]>;
};

export default function VotingPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params);

    const router = useRouter();
    const [poll, setPoll] = useState<PollData | null>(null);
    const [existingVotes, setExistingVotes] = useState<VoteData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [myName, setMyName] = useState('');
    const [mySlots, setMySlots] = useState<Record<string, string[]>>({});

    // Confirmation State
    const [confirmDate, setConfirmDate] = useState('');
    const [confirmTime, setConfirmTime] = useState('');

    // Helper to generate 30-minute intervals
    const generateTimeOptions = () => {
        const times = [];
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            times.push(`${hour}:00`);
            times.push(`${hour}:30`);
        }
        return times;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                // 0. Fetch User Session
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const userName = user.user_metadata.full_name || user.email?.split('@')[0];
                    if (userName) setMyName(userName);
                }

                // 1. Fetch Poll Info
                const { data: pollData, error: pollError } = await supabase
                    .from('scheduling_polls')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (pollError) throw pollError;
                setPoll(pollData);

                // 2. Fetch Existing Votes
                const { data: votesData, error: votesError } = await supabase
                    .from('scheduling_votes')
                    .select('*')
                    .eq('poll_id', id);

                if (votesError) throw votesError;
                setExistingVotes(votesData || []);

            } catch (error) {
                console.error('Error fetching poll:', error);
                alert('투표 정보를 불러오는데 실패했습니다.');
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    const handleSubmitVote = async () => {
        if (!myName.trim()) {
            alert('이름을 입력해주세요!');
            return;
        }
        if (Object.keys(mySlots).length === 0) {
            alert('가능한 시간을 최소 하나 이상 선택해주세요!');
            return;
        }

        try {
            const { error } = await supabase
                .from('scheduling_votes')
                .insert({
                    poll_id: id,
                    user_name: myName,
                    selected_slots: mySlots,
                });

            if (error) throw error;

            alert('투표가 완료되었습니다!');
            window.location.reload(); // Refresh to show new data

        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('투표 저장 중 오류가 발생했습니다.');
        }
    };

    const [confirmEndTime, setConfirmEndTime] = useState('');

    const checkConflict = async (date: string, start: string, end: string) => {
        // Only check conflicts if the new event is '합주' (Band Practice)
        // User Rule: '합주' vs '합주' is NOT allowed. '합주' vs '개인연습' IS allowed.
        if (poll?.event_type !== '합주') return false;

        const { data, error } = await supabase
            .from('reservations')
            .select('id')
            .eq('date', date)
            .eq('room_id', 1) // Default room
            .eq('event_type', '합주') // Only check against other Band Practices
            .neq('status', 'cancelled')
            .or(`and(start_time.lte.${start},end_time.gt.${start}),and(start_time.lt.${end},end_time.gte.${end}),and(start_time.gte.${start},end_time.lte.${end})`);

        if (error) {
            console.error('Error checking conflicts:', error);
            throw error;
        }

        return data.length > 0;
    };

    const handleConfirmReservation = async () => {
        if (!confirmDate || !confirmTime || !confirmEndTime) {
            alert('확정할 날짜와 시작/종료 시간을 모두 입력해주세요.');
            return;
        }
        if (confirmTime >= confirmEndTime) {
            alert('종료 시간은 시작 시간보다 늦어야 합니다.');
            return;
        }
        if (!poll) return;

        try {
            // 1. Check for conflicts
            const hasConflict = await checkConflict(confirmDate, confirmTime, confirmEndTime);
            if (hasConflict) {
                alert('해당 시간에 이미 다른 예약이 존재합니다! 다른 시간을 선택해주세요.');
                return;
            }

            // 2. Create Reservation
            const { error: reservationError } = await supabase
                .from('reservations')
                .insert({
                    room_id: 1, // Default to Room 1 for now
                    user_name: poll.title, // Use poll title as reservation name
                    date: confirmDate,
                    start_time: confirmTime,
                    end_time: confirmEndTime,
                    event_type: poll.event_type, // Save event type from poll
                    status: 'confirmed'
                });

            if (reservationError) throw reservationError;

            // 3. Close Poll (Optional)
            await supabase
                .from('scheduling_polls')
                .update({ is_closed: true })
                .eq('id', id);

            alert('예약이 확정되었습니다! 대시보드에서 확인할 수 있습니다.');
            router.push('/dashboard');

        } catch (error) {
            console.error('Error confirming reservation:', error);
            alert('예약 확정 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!poll) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                {poll.event_type}
                            </span>
                            <span className="text-sm text-gray-500">
                                {existingVotes.length}명 참여 중 / 목표 {poll.headcount}명
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">{poll.title}</h1>
                        <p className="text-gray-500">
                            가능한 시간을 모두 선택해주세요. 진한 색일수록 더 많은 멤버가 가능한 시간입니다.
                        </p>
                    </div>

                    <div className="p-8 space-y-12">
                        {/* Section 1: Vote */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">내 시간 투표하기</h2>

                            {/* Name Input */}
                            <div className="mb-6 max-w-md">
                                <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                                <input
                                    type="text"
                                    value={myName}
                                    onChange={(e) => setMyName(e.target.value)}
                                    placeholder="본인 이름을 입력하세요"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Time Grid */}
                            <div className="mb-6">
                                <VotingTimeGrid
                                    dates={poll.dates}
                                    existingVotes={existingVotes}
                                    mySlots={mySlots}
                                    onChange={setMySlots}
                                />
                            </div>

                            <Button
                                variant="primary"
                                onClick={handleSubmitVote}
                                className="w-full py-4 text-lg shadow-lg"
                            >
                                투표 완료하기
                            </Button>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Section 2: Recommendations (Best Time Slots) */}
                        <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <span className="text-2xl">💡</span> 추천 시간
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">가장 많은 멤버가 참여할 수 있는 시간을 추천해드려요.</p>

                            <div className="space-y-3">
                                {(() => {
                                    // Calculate best slots logic
                                    const allSlots: { date: string; time: string; count: number }[] = [];
                                    poll.dates.forEach(date => {
                                        const timeOptions = generateTimeOptions(); // 00:00 ~ 23:30
                                        timeOptions.forEach(time => {
                                            // Calculate vote count for this specific slot
                                            const count = existingVotes.reduce((acc, vote) => {
                                                const slots = vote.selected_slots[date] || [];
                                                return slots.includes(time) ? acc + 1 : acc;
                                            }, 0);
                                            if (count > 0) {
                                                allSlots.push({ date, time, count });
                                            }
                                        });
                                    });

                                    // Sort by count (desc) -> date (asc) -> time (asc)
                                    const bestSlots = allSlots.sort((a, b) => {
                                        if (b.count !== a.count) return b.count - a.count;
                                        if (a.date !== b.date) return a.date.localeCompare(b.date);
                                        return a.time.localeCompare(b.time);
                                    }).slice(0, 3); // Top 3

                                    if (bestSlots.length === 0) {
                                        return <p className="text-sm text-gray-400 italic">아직 투표된 시간이 없습니다.</p>;
                                    }

                                    return bestSlots.map((slot, idx) => (
                                        <div
                                            key={`${slot.date}-${slot.time}`}
                                            className="flex items-center justify-between bg-white p-4 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => {
                                                setConfirmDate(slot.date);
                                                setConfirmTime(slot.time);
                                                // Auto-set end time to +1 hour for convenience
                                                const [h, m] = slot.time.split(':').map(Number);
                                                const endDate = new Date();
                                                endDate.setHours(h + 1, m);
                                                const endTimeStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
                                                setConfirmEndTime(endTimeStr);
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">
                                                        {slot.date} <span className="text-blue-600 ml-1">{slot.time}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(slot.date).toLocaleDateString('ko-KR', { weekday: 'long' })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                    {slot.count}명 가능
                                                </span>
                                                <span className="text-gray-300 group-hover:text-blue-500 transition-colors">
                                                    선택 &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </section>

                        {/* Section 3: Confirm (Manager Only) */}
                        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">최종 시간 확정</h2>
                            <p className="text-sm text-gray-500 mb-6">모든 멤버의 투표가 끝나면 최종 시간을 확정해주세요.</p>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">날짜 (YYYY-MM-DD)</label>
                                    <input
                                        type="date"
                                        value={confirmDate}
                                        onChange={(e) => setConfirmDate(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">시작 시간</label>
                                    <select
                                        value={confirmTime}
                                        onChange={(e) => setConfirmTime(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none appearance-none bg-white"
                                    >
                                        <option value="">선택</option>
                                        {generateTimeOptions().map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">종료 시간</label>
                                    <select
                                        value={confirmEndTime}
                                        onChange={(e) => setConfirmEndTime(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none appearance-none bg-white"
                                    >
                                        <option value="">선택</option>
                                        {generateTimeOptions().map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleConfirmReservation}
                                className="w-full py-3 bg-white hover:bg-gray-50"
                            >
                                이 시간으로 예약 확정하기
                            </Button>
                        </section>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
