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
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <main className="pt-32 pb-12 px-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-5xl font-black text-black mb-2 tracking-tighter">
                        {room.name}
                    </h1>
                    <p className="text-xl text-gray-500 flex items-center gap-2">
                        📍 {room.location}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                            Basic Info
                        </h2>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-400 font-medium">Capacity</span>
                                <span className="font-bold text-black">{room.capacity} People</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-400 font-medium">Hours</span>
                                <span className="font-bold text-black">{room.openAt} - {room.closeAt}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                            Equipment
                        </h2>
                        <ul className="space-y-3">
                            {room.equipment.map((item, index) => (
                                <li key={index} className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="text-center">
                    <a
                        href="/dashboard"
                        className="inline-block px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold shadow-sm hover:shadow-md"
                    >
                        &larr; Back to Dashboard
                    </a>
                </div>
            </main >

            <Footer />
        </div >
    );
}
