'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createCategory, updateCategory, getAllCategories } from '@/lib/data';
import { Category } from '@/types/database';

export default function NovaCategoriaPage() {
    return (
        <Suspense fallback={<div className="flex-1 p-8 text-slate-400">Carregando...</div>}>
            <NovaCategoriaContent />
        </Suspense>
    );
}

function NovaCategoriaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [icon, setIcon] = useState('category');
    const [sortOrder, setSortOrder] = useState(0);
    const [active, setActive] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editId) {
            const loadCategory = async () => {
                const cats = await getAllCategories();
                const cat = cats.find(c => c.id === editId);
                if (cat) {
                    setName(cat.name);
                    setSlug(cat.slug);
                    setIcon(cat.icon);
                    setSortOrder(cat.sort_order);
                    setActive(cat.active);
                }
            };
            loadCategory();
        }
    }, [editId]);

    const generateSlug = (text: string) => {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (!editId) setSlug(generateSlug(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const data = { name, slug, icon, sort_order: sortOrder, active };

        if (editId) {
            await updateCategory(editId, data);
        } else {
            await createCategory(data);
        }

        router.push('/admin/categorias');
    };

    const ICONS = [
        'mail', 'card_giftcard', 'celebration', 'description', 'inventory_2', 'edit',
        'star', 'diamond', 'auto_awesome', 'palette', 'cake', 'favorite', 'local_florist',
        'music_note', 'photo_camera', 'restaurant', 'school', 'sports_soccer', 'toys'
    ];

    return (
        <div className="flex-1 p-8">
            <div className="mb-8">
                <Link href="/admin/categorias" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors mb-4">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Voltar para Categorias
                </Link>
                <h1 className="text-3xl font-black">{editId ? 'Editar Categoria' : 'Nova Categoria'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Nome da Categoria</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                            placeholder="Ex: Convites"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Slug (URL)</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                            placeholder="convites"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Ícone</label>
                        <div className="grid grid-cols-8 gap-2 mb-3">
                            {ICONS.map(ic => (
                                <button
                                    type="button"
                                    key={ic}
                                    onClick={() => setIcon(ic)}
                                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${icon === ic ? 'bg-primary text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <span className="material-symbols-outlined text-xl">{ic}</span>
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors text-sm"
                            placeholder="Nome do ícone Material Symbols"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Ordem</label>
                            <input
                                type="number"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                            <button
                                type="button"
                                onClick={() => setActive(!active)}
                                className={`w-full rounded-xl px-4 py-3 font-bold transition-all ${active ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30' : 'bg-red-500/20 text-red-400 border-2 border-red-500/30'}`}
                            >
                                {active ? 'Ativa' : 'Inativa'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">{saving ? 'hourglass_empty' : 'save'}</span>
                        {saving ? 'Salvando...' : (editId ? 'Atualizar' : 'Criar Categoria')}
                    </button>
                    <Link
                        href="/admin/categorias"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-700 px-8 py-3 text-slate-400 font-bold hover:border-slate-500 transition-all"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
