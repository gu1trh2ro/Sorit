import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '소개 | 소리터',
    description: '부산대학교 밴드부 합주실 예약 시스템 소리터 소개',
};

export default function About() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <NavBar />

            <main className="pt-24 pb-12 px-8 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gradient-cyan-magenta">
                    소리터 소개
                </h1>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-[#00f5ff] mb-4">
                        프로젝트 개요
                    </h2>
                    <p className="text-[#a0a0a0] leading-relaxed mb-4">
                        소리터(Sorit)는 부산대학교 밴드부를 위한 합주실 예약 및 관리 시스템입니다.
                        기존의 불투명한 예약 시스템을 개선하여, 실시간으로 합주실 현황을 파악하고
                        효율적으로 예약할 수 있는 대시보드를 제공합니다.
                    </p>
                    <p className="text-[#a0a0a0] leading-relaxed">
                        이 프로젝트는 Next.js App Router와 Tailwind CSS를 사용하여 구축되었으며,
                        데이터 시각화와 인터랙티브한 사용자 경험을 목표로 합니다.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-[#00f5ff] mb-4">
                        주요 기능
                    </h2>
                    <ul className="list-disc list-inside text-[#a0a0a0] space-y-2">
                        <li>실시간 합주실 예약 현황 확인</li>
                        <li>합주실별 장비 및 수용 인원 상세 정보</li>
                        <li>직관적인 대시보드를 통한 데이터 시각화</li>
                        <li>빠른 검색 및 필터링 기능</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00f5ff] mb-4">
                        팀원
                    </h2>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                        <p className="font-bold text-white mb-2">개발자</p>
                        <p className="text-[#a0a0a0]">부산대학교 정보컴퓨터공학부</p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
