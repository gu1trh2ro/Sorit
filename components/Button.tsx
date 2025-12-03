'use client';

import { ButtonVariant } from '@/types';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  className = ''
}: ButtonProps) {
  // Variant별 스타일
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-500 to-blue-600
      text-white font-bold shadow-md
      hover:shadow-lg hover:-translate-y-0.5
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-white border-2 border-blue-500
      text-blue-600 font-bold
      hover:bg-blue-50
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    outline: `
      bg-transparent border border-gray-300
      text-gray-500 font-medium
      hover:bg-gray-50 hover:text-gray-700
      disabled:opacity-50 disabled:cursor-not-allowed
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg
        transition-all duration-300
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

