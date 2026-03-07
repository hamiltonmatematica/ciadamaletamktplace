'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import AdminSidebar from '@/components/admin/sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        setIsSidebarOpen(false); // Fecha o sidebar ao mudar de rota
    }, [pathname]);

    useEffect(() => {
        if (isLoginPage) {
            setChecking(false);
            setAuthenticated(true);
            return;
        }

        if (!supabase) {
            setChecking(false);
            setAuthenticated(true);
            return;
        }

        const checkAuth = async () => {
            const { data: { session } } = await supabase!.auth.getSession();
            if (!session) {
                router.replace('/admin/login');
            } else {
                setAuthenticated(true);
            }
            setChecking(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
            if (!session && !isLoginPage) {
                router.replace('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [isLoginPage, router]);

    if (checking) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-slate-400 text-sm font-medium">Carregando...</div>
            </div>
        );
    }

    if (!authenticated) return null;

    if (isLoginPage) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="lg:hidden h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-40">
                <div className="text-primary font-bold">Admin Panel</div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-slate-400 hover:text-white"
                >
                    <span className="material-symbols-outlined">{isSidebarOpen ? 'close' : 'menu'}</span>
                </button>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <AdminSidebar />
            </div>

            <main className="flex-1 h-[calc(100vh-64px)] lg:h-screen overflow-y-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
