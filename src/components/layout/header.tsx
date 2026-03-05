'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { useQuoteCart } from '@/contexts/quote-cart-context';

export default function Header() {
    const { itemCount, setIsOpen } = useQuoteCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/95 backdrop-blur-md dark:bg-background-dark/95">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
                {/* Left side: Menu (Mobile) or Logo + Search (Desktop) */}
                <div className="flex items-center md:gap-10">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex md:hidden h-10 w-10 shrink-0 items-center justify-start text-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-3xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>

                    <div className="hidden md:flex items-center gap-10">
                        <Logo />
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <span className="material-symbols-outlined text-primary/60">search</span>
                            </div>
                            <input
                                className="block w-80 rounded-full border-0 bg-primary/5 py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all"
                                placeholder="Pesquisar produtos..."
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                {/* Center: Logo (Mobile) or Nav (Desktop) */}
                <div className="md:hidden flex-1 flex justify-center">
                    <Logo size="sm" />
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-semibold hover:text-primary transition-colors">Home</Link>
                    <Link href="/catalogo" className="text-sm font-semibold hover:text-primary transition-colors">Coleções</Link>
                    <Link href="/novidades" className="text-sm font-semibold hover:text-primary transition-colors">Novidades</Link>
                </nav>

                {/* Right side: Bag */}
                <div className="flex items-center justify-end w-10 shrink-0 md:w-auto">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 dark:bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px] sm:text-[22px]">shopping_bag</span>
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background-light animate-in zoom-in duration-200">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-primary/10 bg-white dark:bg-background-dark backdrop-blur-md px-4 py-4 space-y-1 animate-in slide-in-from-top duration-200">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">home</span>
                        Home
                    </Link>
                    <Link href="/catalogo" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">grid_view</span>
                        Coleções
                    </Link>
                    <Link href="/novidades" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">new_releases</span>
                        Novidades
                    </Link>
                    <Link href="/mais-vendidos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">trending_up</span>
                        Mais Vendidos
                    </Link>
                </div>
            )}
        </header>
    );
}
