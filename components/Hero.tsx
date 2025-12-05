'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from './Button';

const BACKGROUND_IMAGES = [
  "/images/KakaoTalk_20251203_155817460.jpg",
  "/images/KakaoTalk_20251203_155817460_01.jpg",
  "/images/KakaoTalk_20251203_155817460_02.jpg",
  "/images/KakaoTalk_20251203_155817460_03.jpg",
  "/images/KakaoTalk_20251203_155817460_04.jpg",
  "/images/KakaoTalk_20251203_155817460_05.jpg",
  "/images/KakaoTalk_20251203_155817460_06.jpg",
  "/images/KakaoTalk_20251203_155817460_07.jpg",
  "/images/KakaoTalk_20251203_155817460_08.jpg",
  "/images/KakaoTalk_20251203_160044925.jpg",
  "/images/KakaoTalk_20251203_160044925_01.jpg"
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10"></div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {BACKGROUND_IMAGES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Band Background ${index + 1}`}
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out
              ${index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
            `}
          />
        ))}
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        {/* Main Title */}
        {/* Main Title */}
        <h1 className="text-6xl md:text-[150px] font-black leading-none tracking-tighter text-white drop-shadow-2xl mb-6 animate-fade-in-up mix-blend-overlay">
          SORIT
        </h1>

        <p className="text-lg md:text-3xl text-white/90 font-light tracking-wide mb-12 max-w-2xl mx-auto drop-shadow-md px-4">
          The Perfect Space for Your <span className="font-bold text-white">Masterpiece</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
          <Link href="/reservation" className="w-full md:w-auto">
            <Button
              variant="primary"
              className="w-full md:w-auto shadow-xl hover:shadow-2xl hover:scale-105 border-none bg-white text-black hover:bg-gray-100"
            >
              BOOK NOW
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => alert('팀 설정 페이지로 이동')}
            className="w-full md:w-auto border-2 border-white text-white bg-transparent hover:bg-white/20 hover:text-white hover:border-white backdrop-blur-sm"
          >
            MANAGE TEAM
          </Button>
        </div>
      </div>
    </section>
  );
}
