export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#333] border-t-[#00f5ff] rounded-full animate-spin mb-4 mx-auto"></div>
                <p className="text-[#a0a0a0]">데이터를 불러오는 중입니다...</p>
            </div>
        </div>
    );
}
