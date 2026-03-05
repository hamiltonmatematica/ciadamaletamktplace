'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/', icon: 'home' },
        { name: 'Categorias', href: '/catalogo', icon: 'grid_view' },
        { name: 'Favoritos', href: '/favoritos', icon: 'favorite' },
        { name: 'Contato', href: '/contato', icon: 'chat_bubble' }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex justify-between items-center px-6 py-3 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <span className={`material-symbols-outlined ${isActive ? 'material-symbols-outlined-fill' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
