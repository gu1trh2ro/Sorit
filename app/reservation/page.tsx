'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

// Step Components
import StepEventInfo from '@/components/reservation/StepEventInfo';
import StepDateSelection from '@/components/reservation/StepDateSelection';
import StepTimeGrid from '@/components/reservation/StepTimeGrid';
import StepConfirmation from '@/components/reservation/StepConfirmation';

export type ReservationState = {
    step: number;
    roomId: string; // [NEW] Added roomId
    eventInfo: {
        title: string;
        type: string;
        headcount: number;
    };
    dates: string[];
    selectedSlots: Record<string, string[]>; // "YYYY-MM-DD": ["13:00", "13:30"]
};

function ReservationContent() {
    const searchParams = useSearchParams();
    const [state, setState] = useState<ReservationState>({
        step: 1,
        roomId: '1', // Default to Room 1
        eventInfo: { title: '', type: '합주', headcount: 4 },
        dates: [],
        selectedSlots: {},
    });

    // Initialize state from query params if available
    useEffect(() => {
        const roomIdParam = searchParams.get('roomId');
        if (roomIdParam) {
            setState(prev => ({ ...prev, roomId: roomIdParam }));
        }

        const dateParam = searchParams.get('date');
        const startTimeParam = searchParams.get('startTime');
        const endTimeParam = searchParams.get('endTime');

        if (dateParam && startTimeParam && endTimeParam) {
            // Calculate 30-min slots between startTime and endTime
            const slots: string[] = [];
            let current = startTimeParam;

            // Simple loop to generate slots (assuming HH:MM format and 30 min intervals)
            // This is a basic implementation. For robust handling, date-fns or similar is better.
            // But for now, let's just add the start time and maybe one more if it's 1 hour.
            // Actually, let's just add the start time as a selected slot for now, 
            // or try to cover the range.

            // Let's assume the mock data slots are 1 hour long (e.g. 18:00-19:00)
            // So we need 18:00 and 18:30.

            const startHour = parseInt(startTimeParam.split(':')[0]);
            const startMin = parseInt(startTimeParam.split(':')[1]);
            const endHour = parseInt(endTimeParam.split(':')[0]);
            const endMin = parseInt(endTimeParam.split(':')[1]);

            let currentHour = startHour;
            let currentMin = startMin;

            while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
                const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
                slots.push(timeStr);

                currentMin += 30;
                if (currentMin >= 60) {
                    currentHour++;
                    currentMin = 0;
                }
            }

            setState(prev => ({
                ...prev,
                dates: [dateParam],
                selectedSlots: {
                    [dateParam]: slots
                }
            }));
        }
    }, [searchParams]);

    const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
    const prevStep = () => setState(prev => ({ ...prev, step: prev.step - 1 }));

    const updateEventInfo = (info: Partial<ReservationState['eventInfo']>) => {
        setState(prev => ({ ...prev, eventInfo: { ...prev.eventInfo, ...info } }));
    };

    const updateDates = (dates: string[]) => {
        setState(prev => ({ ...prev, dates }));
    };

    const updateSlots = (selectedSlots: Record<string, string[]>) => {
        setState(prev => ({ ...prev, selectedSlots }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Progress Bar */}
                    <div className="bg-gray-100 h-2 w-full">
                        <div
                            className="bg-blue-600 h-full transition-all duration-500 ease-out"
                            style={{ width: `${(state.step / 4) * 100}%` }}
                        />
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Step Header */}
                        <div className="mb-8 text-center">
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider mb-3">
                                STEP {state.step} OF 4
                            </span>
                            <h1 className="text-3xl font-black text-gray-900">
                                {state.step === 1 && "어떤 약속인가요?"}
                                {state.step === 2 && "날짜를 선택해주세요"}
                                {state.step === 3 && "시간을 선택해주세요"}
                                {state.step === 4 && "예약 확인"}
                            </h1>
                        </div>

                        {/* Step Content */}
                        <div className="min-h-[300px]">
                            {state.step === 1 && (
                                <StepEventInfo
                                    info={state.eventInfo}
                                    onChange={updateEventInfo}
                                    onNext={nextStep}
                                />
                            )}
                            {state.step === 2 && (
                                <StepDateSelection
                                    selectedDates={state.dates}
                                    onChange={updateDates}
                                    onNext={nextStep}
                                />
                            )}
                            {state.step === 3 && (
                                <StepTimeGrid
                                    dates={state.dates}
                                    selectedSlots={state.selectedSlots}
                                    onChange={updateSlots}
                                    onNext={nextStep}
                                    eventType={state.eventInfo.type}
                                />
                            )}
                            {state.step === 4 && (
                                <StepConfirmation state={state} />
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ReservationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReservationContent />
        </Suspense>
    );
}
