'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/ui/product-card';
import { getCategories, getProducts, getFeaturedProducts } from '@/lib/data';
import { Category, Product } from '@/types/database';

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [cats, prods] = await Promise.all([getCategories(), getFeaturedProducts()]);
            setCategories(cats);
            setProducts(prods);
            setLoading(false);
        }
        load();
    }, []);

    const handleCategoryClick = async (slug: string | null) => {
        setActiveCategory(slug);
        setLoading(true);
        const prods = slug ? await getProducts(slug) : await getFeaturedProducts();
        setProducts(prods);
        setLoading(false);
    };

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Categories */}
                <div className="w-full bg-white dark:bg-slate-900/50 shadow-sm sticky top-[73px] z-40">
                    <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto px-6 py-2 no-scrollbar">
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={`flex flex-shrink-0 items-center gap-2 py-3 border-b-2 transition-all font-bold text-sm ${activeCategory === null ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            Destaques
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.slug)}
                                className={`flex flex-shrink-0 items-center gap-2 py-3 border-b-2 transition-all font-bold text-sm ${activeCategory === cat.slug ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Hero Banner */}
                <section className="mx-auto max-w-7xl px-6 py-8">
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 aspect-[21/9] flex items-center justify-center text-center group">
                        <div className="absolute inset-0 z-0">
                            <img
                                className="h-full w-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
                                alt="Decoração de festa"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQBr6e9zxJ9OLTH29ldCNVaGvlPnBmLaicyrkdfkqHLZ0dhSzvFnuNLwujd-YDYWfUZXHWqU5YeYRmztf69k9D19l5s1w0Qr37wnbx24qCVuXhkh1GCu8MeMHu9Bm5bUcqVlOaoUzlLndrSwUh1aYesTYM8kl7ua3oY8EYkGwHk9-QQNWSAHOuh2HjWwn0ycljR6V-uH9_Xo1eZx7XD3k6QPTVlFSE1BJJpoYdKks5UmxUmaPBcJfLhviTCCsggv6KSjx-ignYf7EG"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent" />
                        </div>
                        <div className="relative z-10 max-w-2xl px-4">
                            <h2 className="mb-4 text-5xl font-black tracking-tight text-white lg:text-7xl">Festas Mágicas</h2>
                            <p className="mb-8 text-lg font-medium text-slate-200 lg:text-xl">
                                Descubra nossa coleção exclusiva de maletas e kits de festa personalizados para tornar cada celebração inesquecível.
                            </p>
                            <button className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all">
                                Ver Coleção
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="mx-auto max-w-7xl px-6 py-12">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h3 className="text-3xl font-extrabold tracking-tight">
                                {activeCategory ? categories.find(c => c.slug === activeCategory)?.name : 'Produtos em Destaque'}
                            </h3>
                            <p className="mt-2 text-slate-500 font-medium">
                                {activeCategory ? 'Explore nossos produtos nesta categoria' : 'Essenciais selecionados para o seu próximo grande evento'}
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="rounded-3xl bg-white dark:bg-slate-900 p-3 border border-primary/5">
                                    <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="mt-4 px-2 space-y-2">
                                        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">inventory_2</span>
                            <p className="text-slate-500 font-medium text-lg">Nenhum produto encontrado nesta categoria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>

            </main>

            <Footer />
        </div>
    );
}
