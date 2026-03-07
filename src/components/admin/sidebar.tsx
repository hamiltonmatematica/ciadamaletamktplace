'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/logo';
import { supabase } from '@/lib/supabase';

export default function AdminSidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        window.location.href = '/admin/login';
    };

    const navItems = [
        { id: 'products', icon: 'inventory_2', label: 'Produtos', href: '/admin' },
        { id: 'categories', icon: 'category', label: 'Categorias', href: '/admin/categorias' },
        { id: 'settings', icon: 'settings', label: 'Configurações', href: '#' },
    ];

    return (
        <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0 overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
                <Logo size="sm" />
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(item => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                    }}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all mt-4"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Sair
                </button>
            </nav>
            <div className="p-4 border-t border-slate-800">
                <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
                    <span className="material-symbols-outlined text-xl">storefront</span>
                    Ver Catálogo
                </Link>
            </div>
        </aside>
    );
}
