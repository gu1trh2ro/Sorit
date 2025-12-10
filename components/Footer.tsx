export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        {/* 3개 컬럼 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 소개 */}
          <div>
            <h3 className="text-black text-lg font-bold mb-3">
              SORIT
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              부산대학교 중앙동아리 소리터 합주 예약 시스템
            </p>
          </div>

          {/* 문의 */}
          <div>
            <h4 className="text-black text-lg font-bold mb-3">Contact</h4>
            <p className="text-gray-600 text-sm mb-1">
              📧 jsh4360@pusan.ac.kr
            </p>
            <p className="text-gray-600 text-sm">
              📞 -
            </p>
          </div>
        </div>

        {/* 저작권 */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 Pusan National University Band. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

