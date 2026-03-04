'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
    const sizes = {
        sm: { icon: 'h-8 w-8', text: 'text-base', img: 28 },
        md: { icon: 'h-10 w-10', text: 'text-lg', img: 32 },
        lg: { icon: 'h-12 w-12', text: 'text-xl', img: 40 },
    };

    const s = sizes[size];

    return (
        <Link href="/" className={`flex items-center gap-3 group ${className}`}>
            <div className={`relative ${s.icon} overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-300`}>
                <Image
                    src="/brand/C TRANSP 1.png"
                    alt="Cia da Maleta"
                    width={s.img}
                    height={s.img}
                    className="object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
                />
            </div>
            <span className={`${s.text} font-display font-black tracking-tight`}>
                <span className="text-primary">Cia da </span>
                <span className="text-slate-900 dark:text-white">Maleta</span>
            </span>
        </Link>
    );
}
