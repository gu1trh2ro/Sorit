'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function NavBarMenu({ user, children }: { user: User | null, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        { href: '/', label: 'HOME' },
        { href: '/about', label: 'ABOUT' },
        { href: '/dashboard', label: 'DASHBOARD' },
    ];

    return (
        <>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
                <ul className="flex gap-8">
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="text-gray-800 hover:text-[#00bcd4] font-medium transition-colors duration-300"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                {children}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden z-50 relative p-2"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
            >
                <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>

            {/* Mobile Menu Overlay (Backdrop) */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Side Drawer */}
            <div
                className={`fixed top-0 right-0 h-screen w-[280px] bg-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ backgroundColor: 'white' }} // Explicitly set background color to prevent transparency issues
            >
                <div className="flex flex-col h-full p-6">
                    {/* Close Button */}
                    <div className="flex justify-end mb-8">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-500 hover:text-black"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Menu Items */}
                    <ul className="flex flex-col gap-6">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-gray-900 hover:text-[#00bcd4] transition-colors block py-2 border-b border-gray-100"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Auth Section (Bottom) */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div onClick={() => setIsOpen(false)}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
