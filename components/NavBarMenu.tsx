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

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-all duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <ul className="flex flex-col gap-8 text-center mb-12">
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-black text-gray-900 hover:text-[#00bcd4] transition-colors"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div
                    onClick={() => setIsOpen(false)}
                    className="pt-8 border-t border-gray-100 w-full flex justify-center"
                >
                    <div className="scale-110">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
