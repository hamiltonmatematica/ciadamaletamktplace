'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCategories, deleteCategory } from '@/lib/data';
import { Category } from '@/types/database';

export default function AdminCategoriasPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const cats = await getAllCategories();
            setCategories(cats);
            setLoading(false);
        }
        load();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) return;
        const ok = await deleteCategory(id);
        if (ok) setCategories(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="flex-1 p-4 lg:p-8 bg-slate-950 min-h-screen text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary transition-colors mb-2 lg:mb-3">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Voltar ao Dashboard
                    </Link>
                    <h1 className="text-2xl lg:text-3xl font-black text-white">Categorias</h1>
                    <p className="text-slate-400 mt-1 text-sm">{categories.length} categorias cadastradas</p>
                </div>
                <Link
                    href="/admin/categorias/nova"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nova Categoria
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-slate-800 rounded-2xl p-6 animate-pulse h-20" />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800 rounded-2xl p-4 lg:p-5 border border-slate-700 hover:border-primary/30 transition-all group gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary text-lg lg:text-xl">{cat.icon}</span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white text-sm lg:text-base truncate">{cat.name}</h3>
                                    <p className="text-xs lg:text-sm text-slate-400 truncate">/{cat.slug}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0">
                                <span className={`px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold ${cat.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {cat.active ? 'Ativa' : 'Inativa'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/admin/categorias/nova?id=${cat.id}`}
                                        className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(cat.id, cat.name)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
