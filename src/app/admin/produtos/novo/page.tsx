'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProduct, updateProduct, getAllCategories, getAllProducts, uploadProductImage } from '@/lib/data';
import { Category, Product } from '@/types/database';

export default function NovoProdutoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const isEditing = !!productId;

    const [categories, setCategories] = useState<Category[]>([]);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [minQuantity, setMinQuantity] = useState('1');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState<'active' | 'draft'>('active');
    const [featured, setFeatured] = useState(false);
    const [tag, setTag] = useState('');
    const [productionTime, setProductionTime] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function load() {
            const cats = await getAllCategories();
            setCategories(cats);

            if (productId) {
                const products = await getAllProducts();
                const product = products.find(p => p.id === productId);
                if (product) {
                    setName(product.name);
                    setSlug(product.slug);
                    setCode(product.code || '');
                    setDescription(product.description || '');
                    setPrice(product.price.toString());
                    setMinQuantity(product.min_quantity.toString());
                    setCategoryId(product.category_id || '');
                    setStatus(product.status);
                    setFeatured(product.featured);
                    setTag(product.tag || '');
                    setProductionTime(product.production_time || '');
                    if (product.images && product.images.length > 0) {
                        setImageUrls(product.images.map(img => img.url));
                    }
                }
            }
        }
        load();
    }, [productId]);

    const generateSlug = (text: string) => {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (value: string) => {
        setName(value);
        setSlug(generateSlug(value));
        setErrorMsg('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...files]);

            // Criar URLs temporários para preview local
            const previews = files.map(file => URL.createObjectURL(file));
            setImageUrls(prev => [...prev, ...previews]);
        }
    };

    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSaving(true);
        setUploading(true);

        try {
            // Fazer upload de todas as imagens que são novas (File objects)
            const finalImageUrls: string[] = [];

            for (let i = 0; i < imageUrls.length; i++) {
                const url = imageUrls[i];
                // Se o URL começa com 'blob:', é um arquivo local que precisa de upload
                if (url.startsWith('blob:')) {
                    const file = imageFiles.find(f => URL.createObjectURL(f).split('/').pop() === url.split('/').pop()) || imageFiles[0]; // fallback heurístico simplificado
                    // Nota: A lógica acima de encontrar o arquivo exato pode falhar, 
                    // uma alternativa mais robusta:
                    const fileIndex = imageUrls.slice(0, i + 1).filter(u => u.startsWith('blob:')).length - 1;
                    const uploadedUrl = await uploadProductImage(imageFiles[fileIndex]);
                    if (uploadedUrl) finalImageUrls.push(uploadedUrl);
                } else {
                    // Já é um URL remoto (edição)
                    finalImageUrls.push(url);
                }
            }

            const productData = {
                name, slug, code: code || null, description: description || null,
                price: parseFloat(price) || 0, min_quantity: parseInt(minQuantity) || 1,
                category_id: categoryId || null, status, featured,
                tag: tag || null, production_time: productionTime || null,
                imageUrls: finalImageUrls
            };

            let result;
            if (isEditing && productId) {
                result = await updateProduct(productId, productData);
            } else {
                result = await createProduct(productData);
            }

            if (result) {
                router.push('/admin');
            } else {
                setErrorMsg(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} produto. Verifique se todos os campos estão corretos.`);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Erro inesperado ao processar imagens ou salvar produto.');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-950 min-h-screen text-white">
            <div className="mb-8">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors mb-4">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Voltar ao Dashboard
                </Link>
                <h1 className="text-3xl font-black text-white">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
            </div>

            {errorMsg && (
                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl font-medium">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {/* Informações Básicas */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Informações Básicas
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-300 mb-2">Nome do Produto *</label>
                            <input
                                type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                                placeholder="Ex: Convite Caixa com Visor"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Código</label>
                            <input
                                type="text" value={code} onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                                placeholder="Ex: CCX_022_30"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Slug (URL)</label>
                            <input
                                type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-300 mb-2">Descrição</label>
                            <textarea
                                value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors resize-none"
                                placeholder="Descreva o produto em detalhes..."
                            />
                        </div>
                    </div>
                </div>

                {/* Imagens do Produto */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">image</span>
                            Imagens do Produto
                        </h2>
                        <label className="cursor-pointer inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold transition-all">
                            <span className="material-symbols-outlined text-lg">add_a_photo</span>
                            Escolher Fotos
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <p className="text-xs text-slate-400">Arraste e solte ou escolha arquivos do seu computador. A primeira imagem será a principal.</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 hover:border-primary transition-all">
                                <img src={url} alt="Produto" className="w-full h-full object-cover" />
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-primary text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                                        Principal
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button" onClick={() => removeImage(index)}
                                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {imageUrls.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                                <p className="text-sm font-bold">Nenhuma foto adicionada</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preço e Quantidade */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">payments</span>
                        Preço e Quantidade
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Preço (R$) *</label>
                            <input
                                type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Qtd. Mínima</label>
                            <input
                                type="number" value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Prazo de Produção</label>
                            <input
                                type="text" value={productionTime} onChange={(e) => setProductionTime(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                                placeholder="Ex: 15 dias úteis"
                            />
                        </div>
                    </div>
                </div>

                {/* Classificação */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">label</span>
                        Classificação
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Categoria</label>
                            <select
                                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                            >
                                <option value="">Selecione...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Tag</label>
                            <input
                                type="text" value={tag} onChange={(e) => setTag(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors"
                                placeholder="Ex: Bestseller, Novo, Premium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                            <div className="flex gap-3">
                                <button
                                    type="button" onClick={() => setStatus('active')}
                                    className={`flex-1 rounded-xl px-4 py-3 font-bold text-sm transition-all ${status === 'active' ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30' : 'bg-slate-900 text-slate-400 border-2 border-slate-700'}`}
                                >Ativo</button>
                                <button
                                    type="button" onClick={() => setStatus('draft')}
                                    className={`flex-1 rounded-xl px-4 py-3 font-bold text-sm transition-all ${status === 'draft' ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/30' : 'bg-slate-900 text-slate-400 border-2 border-slate-700'}`}
                                >Rascunho</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Destaque</label>
                            <button
                                type="button" onClick={() => setFeatured(!featured)}
                                className={`w-full rounded-xl px-4 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 ${featured ? 'bg-primary/20 text-primary border-2 border-primary/30' : 'bg-slate-900 text-slate-400 border-2 border-slate-700'}`}
                            >
                                <span className="material-symbols-outlined text-lg">{featured ? 'star' : 'star_border'}</span>
                                {featured ? 'Em destaque' : 'Não destacado'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex gap-4">
                    <button
                        type="submit" disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">{saving ? 'hourglass_empty' : 'save'}</span>
                        {saving ? (uploading ? 'Enviando Fotos...' : 'Salvando...') : (isEditing ? 'Salvar Alterações' : 'Criar Produto')}
                    </button>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-700 px-8 py-3 text-slate-400 font-bold hover:border-slate-500 transition-all"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
