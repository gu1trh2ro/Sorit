export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-neon-cyan py-12 px-8">
      <div className="max-w-7xl mx-auto">
        {/* 3개 컬럼 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 소개 */}
          <div>
            <h3 className="text-[#00f5ff] text-lg font-bold mb-3">
              소리터 합주실 예약
            </h3>
            <p className="text-[#a0a0a0] text-sm leading-relaxed">
              부산대학교 밴드부 합주실 스마트 예약 시스템
            </p>
          </div>
          
          {/* 문의 */}
          <div>
            <h4 className="text-[#00f5ff] text-lg font-bold mb-3">문의</h4>
            <p className="text-[#a0a0a0] text-sm mb-1">
              📧 soritter@pusan.ac.kr
            </p>
            <p className="text-[#a0a0a0] text-sm">
              📞 051-510-XXXX
            </p>
          </div>
          
          {/* 운영 시간 */}
          <div>
            <h4 className="text-[#00f5ff] text-lg font-bold mb-3">운영 시간</h4>
            <p className="text-[#a0a0a0] text-sm mb-1">
              평일: 10:00 - 24:00
            </p>
            <p className="text-[#a0a0a0] text-sm">
              주말: 10:00 - 22:00
            </p>
          </div>
        </div>
        
        {/* 저작권 */}
        <div className="border-t border-[#333] pt-6 text-center">
          <p className="text-[#666] text-sm">
            &copy; 2025 부산대학교 밴드부. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

