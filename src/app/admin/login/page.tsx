'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/logo';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock login
        if (email && password) {
            router.push('/admin');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <Logo className="h-12 w-auto justify-center" />
                    <h2 className="mt-6 text-3xl font-black text-slate-900 dark:text-white">Acesso Restrito</h2>
                    <p className="mt-2 text-slate-500 font-medium">Faça login para gerenciar seu catálogo</p>
                </div>

                <form className="mt-8 space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-primary/5" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="admin@ciadamaleta.com.br"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Senha</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                    >
                        Entrar no Painel
                    </button>

                    <div className="text-center">
                        <Link href="/" className="text-sm font-bold text-primary hover:underline">Voltar para o site</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Inline Link fallback if next/link not yet available in current thought but it is in package.json
function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
    return <a href={href} className={className}>{children}</a>
}
