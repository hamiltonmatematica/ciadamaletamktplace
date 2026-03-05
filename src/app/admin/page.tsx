'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { getAllProducts, getAllCategories, deleteProduct } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types/database';

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState('products');

    useEffect(() => {
        async function load() {
            const [prods, cats] = await Promise.all([getAllProducts(), getAllCategories()]);
            setProducts(prods);
            setCategories(cats);
            setLoading(false);
        }
        load();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Excluir o produto "${name}"?`)) return;
        const ok = await deleteProduct(id);
        if (ok) setProducts(prev => prev.filter(p => p.id !== id));
    };

    const activeProducts = products.filter(p => p.status === 'active');
    const draftProducts = products.filter(p => p.status === 'draft');

    return (
        <div className="flex h-screen bg-background-dark text-slate-100">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <Logo size="sm" />
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { id: 'products', icon: 'inventory_2', label: 'Produtos', href: '/admin' },
                        { id: 'categories', icon: 'category', label: 'Categorias', href: '/admin/categorias' },
                        { id: 'settings', icon: 'settings', label: 'Configurações', href: '#' },
                    ].map(item => (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setActiveNav(item.id)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${activeNav === item.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                    <button
                        onClick={async () => {
                            const { error } = await supabase!.auth.signOut();
                            if (!error) {
                                window.location.href = '/admin/login';
                            }
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                    <h1 className="text-2xl font-black">Dashboard</h1>
                    <Link
                        href="/admin/produtos/novo"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Novo Produto
                    </Link>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">inventory_2</span>
                                </div>
                                <span className="text-sm text-slate-400 font-medium">Total Produtos</span>
                            </div>
                            <p className="text-3xl font-black">{products.length}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                                </div>
                                <span className="text-sm text-slate-400 font-medium">Ativos</span>
                            </div>
                            <p className="text-3xl font-black text-green-400">{activeProducts.length}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-yellow-400">category</span>
                                </div>
                                <span className="text-sm text-slate-400 font-medium">Categorias</span>
                            </div>
                            <p className="text-3xl font-black text-yellow-400">{categories.length}</p>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
                            <h2 className="font-bold text-lg">Produtos</h2>
                            <span className="text-sm text-slate-400">{products.length} resultados</span>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-slate-500">Carregando...</div>
                        ) : (
                            <div className="divide-y divide-slate-700/30">
                                {products.map((product) => {
                                    const img = product.images?.find(i => i.is_main)?.url || product.images?.[0]?.url || '';
                                    return (
                                        <div key={product.id} className="flex items-center gap-5 px-6 py-4 hover:bg-slate-800/50 transition-colors">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0">
                                                {img && <img src={img} alt={product.name} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white truncate">{product.name}</h3>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                                    {product.code && <span>{product.code}</span>}
                                                    {product.category && <span className="bg-slate-700/50 px-2 py-0.5 rounded">{product.category.name}</span>}
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-black text-primary">R$ {product.price.toFixed(2)}</p>
                                                <p className="text-xs text-slate-400">Qtd. min: {product.min_quantity}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {product.status === 'active' ? 'Ativo' : 'Rascunho'}
                                            </span>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <Link
                                                    href={`/admin/produtos/novo?id=${product.id}`}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
