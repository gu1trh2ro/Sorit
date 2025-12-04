'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

// Step Components
import StepEventInfo from '@/components/reservation/StepEventInfo';
import StepDateSelection from '@/components/reservation/StepDateSelection';
import StepTimeGrid from '@/components/reservation/StepTimeGrid';
import StepConfirmation from '@/components/reservation/StepConfirmation';

export type ReservationState = {
    step: number;
    eventInfo: {
        title: string;
        type: string;
        headcount: number;
    };
    dates: string[];
    selectedSlots: Record<string, string[]>; // "YYYY-MM-DD": ["13:00", "13:30"]
};

export default function ReservationPage() {
    const [state, setState] = useState<ReservationState>({
        step: 1,
        eventInfo: { title: '', type: '합주', headcount: 4 },
        dates: [],
        selectedSlots: {},
    });

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
            <NavBar />

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
