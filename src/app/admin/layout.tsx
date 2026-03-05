'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const isLoginPage = pathname === '/admin/login';

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
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/admin/login');
            } else {
                setAuthenticated(true);
            }
            setChecking(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
            {children}
        </div>
    );
}
