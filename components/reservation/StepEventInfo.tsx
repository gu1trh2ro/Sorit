'use client';

import Button from '@/components/Button';

interface StepEventInfoProps {
    info: {
        title: string;
        type: string;
        headcount: number;
    };
    onChange: (info: Partial<{ title: string; type: string; headcount: number }>) => void;
    onNext: () => void;
}

const EVENT_TYPES = ['합주', '개인연습', '휴식'];

export default function StepEventInfo({ info, onChange, onNext }: StepEventInfoProps) {
    // Auto-fill for simple types
    const handleTypeChange = (type: string) => {
        if (type === '개인연습' || type === '휴식') {
            onChange({
                type,
                title: '', // Clear title so user can enter name
                headcount: 1 // Headcount fixed to 1
            });
        } else {
            onChange({ type, title: '', headcount: 4 }); // Reset for band practice
        }
    };

    const isSimpleType = info.type === '개인연습' || info.type === '휴식';
    const isValid = info.title.trim().length > 0 && info.headcount > 0;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Event Type Selection */}
            <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">예약 목적을 선택해주세요</label>
                <div className="flex flex-wrap gap-2">
                    {EVENT_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${info.type === type
                                    ? 'bg-blue-600 text-white shadow-md scale-105'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
              `}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-8 animate-fade-in-up">
                {/* Event Title Input */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">
                        {isSimpleType ? '예약자 이름을 알려주세요' : '약속 이름을 알려주세요'}
                    </label>
                    <input
                        type="text"
                        value={info.title}
                        onChange={(e) => onChange({ title: e.target.value })}
                        placeholder={isSimpleType ? "예: 홍길동" : "예: 프리텐더 합주"}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium text-gray-900 placeholder-gray-400"
                    />
                </div>

                {/* Headcount Input (Only show for band practice) */}
                {!isSimpleType && (
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">약속 참여 인원을 알려주세요</label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onChange({ headcount: Math.max(1, info.headcount - 1) })}
                                className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-2xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            >
                                -
                            </button>
                            <div className="flex-1 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-900 bg-gray-50">
                                {info.headcount}명
                            </div>
                            <button
                                onClick={() => onChange({ headcount: info.headcount + 1 })}
                                className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-2xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Next Button */}
            <div className="pt-4">
                <Button
                    variant="primary"
                    onClick={onNext}
                    disabled={!isValid}
                    className={`w-full py-4 text-lg shadow-lg ${!isValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
