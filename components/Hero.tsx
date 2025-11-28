'use client';

import Button from './Button';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-8 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      <div className="max-w-5xl mx-auto text-center">
        {/* 메인 타이틀 */}
        <h1 className="text-6xl font-bold text-gradient-cyan-magenta mb-6 glow-cyan">
          팀 가능 시간 기반<br />
          합주실 스마트 예약
        </h1>
        
        {/* 설명 */}
        <p className="text-xl text-[#a0a0a0] mb-4 leading-relaxed">
          팀원들의 일정을 일일이 확인하고 합주실 예약 가능 시간을 찾느라 시간 낭비하셨나요?
        </p>
        <p className="text-lg text-[#808080] mb-10">
          팀별 가능 시간을 미리 등록하면, 빈 합주실을 한눈에 보고 클릭 한 번으로 예약할 수 있습니다.
        </p>
        
        {/* CTA 버튼 */}
        <div className="flex gap-4 justify-center">
          <Button 
            variant="primary" 
            onClick={() => alert('예약 페이지로 이동')}
          >
            지금 예약하기
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => alert('팀 설정 페이지로 이동')}
          >
            팀 가능 시간 설정
          </Button>
        </div>
      </div>
    </section>
  );
}

