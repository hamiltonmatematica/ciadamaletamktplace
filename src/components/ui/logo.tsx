'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
    const sizes = {
        sm: { width: 80, height: 30 },
        md: { width: 110, height: 40 },
        lg: { width: 150, height: 50 },
    };

    const s = sizes[size];

    return (
        <Link href="/" className={`flex items-center group ${className}`}>
            <Image
                src="/brand/C TRANSP 1.png"
                alt="Cia da Maleta"
                width={s.width}
                height={s.height}
                className="object-contain"
                priority
            />
        </Link>
    );
}
