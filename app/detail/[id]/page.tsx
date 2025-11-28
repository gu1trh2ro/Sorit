import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { rooms } from '@/data/mockData';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const room = rooms.find((r) => r.id === id);

    if (!room) {
        return {
            title: '합주실을 찾을 수 없습니다',
        };
    }

    return {
        title: `${room.name} 상세 정보 | 소리터`,
        description: `${room.name} - ${room.location}, 수용인원 ${room.capacity}명`,
    };
}

export default async function RoomDetail({ params }: Props) {
    const { id } = await params;
    const room = rooms.find((r) => r.id === id);

    if (!room) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <NavBar />

            <main className="pt-24 pb-12 px-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gradient-cyan-magenta mb-4">
                        {room.name}
                    </h1>
                    <p className="text-xl text-[#a0a0a0]">{room.location}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#333]">
                        <h2 className="text-2xl font-bold text-[#00f5ff] mb-6">기본 정보</h2>
                        <ul className="space-y-4 text-[#e0e0e0]">
                            <li className="flex justify-between">
                                <span className="text-[#a0a0a0]">수용 인원</span>
                                <span>{room.capacity}명</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-[#a0a0a0]">운영 시간</span>
                                <span>{room.openAt} - {room.closeAt}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#333]">
                        <h2 className="text-2xl font-bold text-[#00f5ff] mb-6">보유 장비</h2>
                        <ul className="space-y-2">
                            {room.equipment.map((item, index) => (
                                <li key={index} className="flex items-center text-[#e0e0e0]">
                                    <span className="w-2 h-2 bg-[#00f5ff] rounded-full mr-3"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="text-center">
                    <a
                        href="/dashboard"
                        className="inline-block px-8 py-3 bg-[#1a1a1a] border border-[#00f5ff] text-[#00f5ff] rounded hover:bg-[#00f5ff] hover:text-black transition-colors font-bold"
                    >
                        목록으로 돌아가기
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
