'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { useQuoteCart } from '@/contexts/quote-cart-context';

export default function Header() {
    const { itemCount, setIsOpen } = useQuoteCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
                <div className="flex items-center gap-6 lg:gap-10">
                    <Logo size="sm" className="md:hidden" />
                    <Logo className="hidden md:flex" />
                    <div className="hidden lg:flex">
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

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-semibold hover:text-primary transition-colors">Home</Link>
                    <Link href="/catalogo" className="text-sm font-semibold hover:text-primary transition-colors">Coleções</Link>
                    <Link href="/novidades" className="text-sm font-semibold hover:text-primary transition-colors">Novidades</Link>
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px] sm:text-[22px]">shopping_bag</span>
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background-light animate-in zoom-in duration-200">
                                {itemCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex md:hidden h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-primary/10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-4 space-y-1 animate-in slide-in-from-top duration-200">
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
                    <div className="pt-3 px-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <span className="material-symbols-outlined text-primary/60 text-lg">search</span>
                            </div>
                            <input
                                className="block w-full rounded-full border-0 bg-primary/5 py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all"
                                placeholder="Pesquisar produtos..."
                                type="text"
                            />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
