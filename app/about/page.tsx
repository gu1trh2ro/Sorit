import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '소개 | 소리터',
    description: '부산대학교 밴드부 합주실 예약 시스템 소리터 소개',
};

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <main className="pt-32 pb-12 px-8 max-w-4xl mx-auto">
                <h1 className="text-5xl font-black mb-8 text-black tracking-tighter">
                    ABOUT SORIT
                </h1>

                <section className="mb-12 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                        Project Overview
                    </h2 >
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Sorit is a smart reservation system designed for the Pusan National University Band.
                        We aim to solve the inefficiency of traditional booking methods by providing real-time availability and instant reservations.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Built with Next.js App Router and Tailwind CSS, focusing on a clean, modern, and vibrant user experience.
                    </p>
                </section >

                <section className="mb-12 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-8 bg-purple-500 rounded-full"></span>
                        Key Features
                    </h2>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                        <li>Real-time studio availability check</li>
                        <li>Detailed equipment and capacity information</li>
                        <li>Interactive dashboard with data visualization</li>
                        <li>Fast search and filtering</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-8 bg-green-500 rounded-full"></span>
                        Team
                    </h2>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="font-bold text-black mb-1">Developer</p>
                        <p className="text-gray-500">Dept. of CSE, Pusan National University</p>
                    </div>
                </section>
            </main >

            <Footer />
        </div >
    );
}
