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
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const activeProducts = products.filter(p => p.status === 'active');
    const draftProducts = products.filter(p => p.status === 'draft');

    return (
        <main className="flex-1 flex flex-col overflow-hidden bg-background-dark text-slate-100 min-h-screen">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-8 py-5 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm gap-4">
                <h1 className="text-xl lg:text-2xl font-black">Dashboard</h1>
                <Link
                    href="/admin/produtos/novo"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Novo Produto
                </Link>
            </header>

            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="bg-slate-800/50 rounded-2xl p-5 lg:p-6 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">inventory_2</span>
                            </div>
                            <span className="text-sm text-slate-400 font-medium">Total Produtos</span>
                        </div>
                        <p className="text-2xl lg:text-3xl font-black">{products.length}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-5 lg:p-6 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-400">check_circle</span>
                            </div>
                            <span className="text-sm text-slate-400 font-medium">Ativos</span>
                        </div>
                        <p className="text-2xl lg:text-3xl font-black text-green-400">{activeProducts.length}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-5 lg:p-6 border border-slate-700/50 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-yellow-400">category</span>
                            </div>
                            <span className="text-sm text-slate-400 font-medium">Categorias</span>
                        </div>
                        <p className="text-2xl lg:text-3xl font-black text-yellow-400">{categories.length}</p>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 lg:px-6 py-4 border-b border-slate-700/50 bg-slate-800/50 gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <h2 className="font-bold text-lg text-white">Produtos</h2>
                            <span className="text-xs font-bold bg-primary/20 text-primary px-3 py-1 rounded-full">{filteredProducts.length} itens</span>
                        </div>

                        <div className="relative w-full sm:w-80 group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Buscar por nome ou código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-primary focus:ring-0 transition-colors outline-none"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Carregando...</div>
                    ) : (
                        <div className="divide-y divide-slate-700/30 overflow-x-auto">
                            <div className="min-w-[600px] sm:min-w-0">
                                {filteredProducts.length === 0 ? (
                                    <div className="py-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">search_off</span>
                                        <p>Nenhum produto encontrado para "{searchTerm}"</p>
                                    </div>
                                ) : (
                                    filteredProducts.map((product) => {
                                        const img = product.images?.find(i => i.is_main)?.url || product.images?.[0]?.url || '';
                                        return (
                                            <div key={product.id} className="flex items-center gap-3 lg:gap-5 px-4 lg:px-6 py-4 hover:bg-slate-800/80 transition-colors cursor-default">
                                                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0">
                                                    {img ? <img src={img} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><span className="material-symbols-outlined">image</span></div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-sm lg:text-base text-white truncate group-hover:text-primary transition-colors">{product.name}</h3>
                                                    <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-slate-400 mt-1">
                                                        {product.code && <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 truncate">{product.code}</span>}
                                                        {product.category && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded truncate font-medium">{product.category.name}</span>}
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0 px-4">
                                                    <p className="font-black text-sm lg:text-base text-white whitespace-nowrap">R$ {product.price.toFixed(2)}</p>
                                                    <p className="text-[10px] lg:text-xs text-slate-400 font-medium">Qtd Mín: {product.min_quantity}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 hidden sm:inline-block border-2 ${product.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    }`}>
                                                    {product.status === 'active' ? 'Ativo' : 'Rascunho'}
                                                </span>
                                                <div className="flex items-center gap-2 flex-shrink-0 border-l border-slate-700/50 pl-4">
                                                    <Link
                                                        href={`/admin/produtos/novo?id=${product.id}`}
                                                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary hover:bg-primary transition-all shadow-sm"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500 hover:bg-red-500 transition-all shadow-sm"
                                                        title="Excluir"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
