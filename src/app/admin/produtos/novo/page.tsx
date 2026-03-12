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
    // Imagens agora são objetos para manter a relação URL/Arquivo e permitir ordenação
    const [images, setImages] = useState<{ url: string; file?: File }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [processingImages, setProcessingImages] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function load() {
            const cats = await getAllCategories();
            setCategories(cats);

            if (productId) {
                const results = await getAllProducts();
                const product = results.find(p => p.id === productId);
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
                        setImages(product.images.sort((a, b) => a.sort_order - b.sort_order).map(img => ({ url: img.url })));
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProcessingImages(true);
            setErrorMsg('');
            const files = Array.from(e.target.files);
            const newMedia: { url: string; file: File; type: 'image' | 'video' }[] = [];

            for (let file of files) {
                try {
                    const isVideo = file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mov') || file.name.toLowerCase().endsWith('.mp4');
                    
                    if (isVideo) {
                        newMedia.push({
                            url: URL.createObjectURL(file),
                            file,
                            type: 'video'
                        });
                        continue;
                    }

                    // 1. Converter HEIC se necessário
                    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';
                    
                    if (isHeic) {
                        try {
                            const heic2any = (await import('heic2any')).default;
                            const convertedBlob = await heic2any({
                                blob: file,
                                quality: 0.7
                            });
                            const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                            const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
                            file = new File([blobToUse], newName, { type: 'image/jpeg' });
                        } catch (convErr) {
                            console.error('Erro na conversão HEIC:', convErr);
                            // Se falhar a conversão de um HEIC, não adicionamos para evitar erro de upload posterior
                            continue;
                        }
                    }

                    // 2. Redimensionar/Comprimir imagens muito grandes (> 1.5MB ou > 2000px)
                    // Isso ajuda MUITO no upload pelo celular
                    if (file.size > 1024 * 1024 || isHeic) {
                         const compressed = await compressImage(file);
                         file = compressed;
                    }

                    newMedia.push({
                        url: URL.createObjectURL(file),
                        file,
                        type: 'image'
                    });
                } catch (err) {
                    console.error('Erro ao processar imagem:', err);
                }
            }

            if (newMedia.length === 0 && files.length > 0) {
                setErrorMsg('Não foi possível processar os arquivos selecionados.');
            }

            setImages(prev => [...prev, ...newMedia as any]);
            setProcessingImages(false);
        }
    };

    // Função auxiliar para compressão de imagem no cliente
    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_SIZE = 1600; // Tamanho máximo razoável para web

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            resolve(newFile);
                        } else {
                            resolve(file);
                        }
                    }, 'image/jpeg', 0.8);
                };
                img.onerror = () => resolve(file);
            };
            reader.onerror = () => resolve(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const item = prev[index];
            if (item.url.startsWith('blob:')) {
                URL.revokeObjectURL(item.url);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const moveImage = (index: number, direction: 'left' | 'right') => {
        const newImages = [...images];
        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= images.length) return;

        [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
        setImages(newImages);
    };

    const formatDescription = (text: string) => {
        return text.split('\n').map(line => {
            const trimmed = line.trim();
            if (trimmed.length === 0) return line;
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        }).join('\n');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSaving(true);
        setUploading(true);

        try {
            const finalImageUrls: string[] = [];
            const formattedDescription = formatDescription(description);

            for (const img of images) {
                if (img.file) {
                    const { publicUrl, error: uploadErr } = await uploadProductImage(img.file);
                    if (publicUrl) {
                        finalImageUrls.push(publicUrl);
                    } else {
                        throw new Error(`Erro no upload da foto: ${uploadErr || 'Verifique se o bucket "products" existe no Supabase.'}`);
                    }
                } else {
                    finalImageUrls.push(img.url);
                }
            }

            const productData = {
                name, slug, code: code || null, description: formattedDescription || null,
                price: parseFloat(price) || 0, min_quantity: parseInt(minQuantity) || 1,
                category_id: categoryId || null, status, featured,
                tag: tag || null, production_time: productionTime || null,
                imageUrls: finalImageUrls
            };

            const { data: result, error } = isEditing && productId
                ? await updateProduct(productId, productData)
                : await createProduct(productData);

            if (result && !error) {
                router.push('/admin');
            } else {
                setErrorMsg(error || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} produto.`);
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || 'Erro inesperado ao processar imagens ou salvar produto.');
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
                <div className="mb-6 bg-red-500/20 border-2 border-red-500/50 text-red-500 px-6 py-4 rounded-2xl font-bold flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    <div>
                        <p className="text-sm opacity-70">Não foi possível salvar:</p>
                        <p>{errorMsg}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {/* Informações Básicas */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Informações Básicas
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-300 mb-2">Nome do Produto *</label>
                            <input
                                type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors outline-none"
                                placeholder="Ex: Convite Caixa com Visor"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Código</label>
                            <input
                                type="text" value={code} onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors outline-none"
                                placeholder="Ex: CCX_022_30"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Slug (URL)</label>
                            <input
                                type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors outline-none"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-300 mb-2">Descrição</label>
                            <textarea
                                value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors resize-none outline-none"
                                placeholder="Descreva o produto em detalhes..."
                            />
                        </div>
                    </div>
                </div>

                {/* Imagens do Produto */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">image</span>
                            Imagens do Produto
                        </h2>
                        <label className={`cursor-pointer inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-sm text-white font-bold transition-all shadow-lg shadow-primary/20 ${processingImages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}>
                            <span className="material-symbols-outlined text-lg">{processingImages ? 'hourglass_empty' : 'add_a_photo'}</span>
                            {processingImages ? 'Processando (HEIC -> JPG)...' : 'Escolher Fotos'}
                            <input
                                type="file"
                                accept="image/*,video/*,image/heic,image/heif,.heic,.heif,.mov,.mp4"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={processingImages}
                            />
                        </label>
                    </div>

                    <p className="text-xs text-slate-400">Arraste para organizar. A primeira foto à esquerda será a principal.</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 hover:border-primary transition-all shadow-md">
                             {(img as any).type === 'video' || img.url.toLowerCase().includes('.mov') || img.url.toLowerCase().includes('.mp4') ? (
                                    <video src={img.url} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                )}

                                {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-primary text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider text-white">
                                        Principal
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                    <div className="flex gap-2">
                                        <button
                                            type="button" onClick={() => moveImage(index, 'left')}
                                            disabled={index === 0}
                                            className="w-8 h-8 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                                        >
                                            <span className="material-symbols-outlined text-base">arrow_back</span>
                                        </button>
                                        <button
                                            type="button" onClick={() => moveImage(index, 'right')}
                                            disabled={index === images.length - 1}
                                            className="w-8 h-8 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                                        >
                                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                                        </button>
                                    </div>
                                    <button
                                        type="button" onClick={() => removeImage(index)}
                                        className="w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {images.length === 0 && (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 bg-slate-900/50">
                                <span className="material-symbols-outlined text-5xl mb-3 opacity-30">add_photo_alternate</span>
                                <p className="text-sm font-bold opacity-50">Nenhuma foto adicionada</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preço e Quantidade */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">payments</span>
                        Preço e Quantidade
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Preço (R$) *</label>
                            <input
                                type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Qtd. Mínima</label>
                            <input
                                type="number" value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Prazo de Produção</label>
                            <input
                                type="text" value={productionTime} onChange={(e) => setProductionTime(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors outline-none"
                                placeholder="Ex: 15 dias úteis"
                            />
                        </div>
                    </div>
                </div>

                {/* Classificação */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">label</span>
                        Classificação
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Categoria</label>
                            <select
                                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors outline-none"
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
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-colors outline-none"
                                placeholder="Ex: Bestseller, Novo, Premium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                            <div className="flex gap-3">
                                <button
                                    type="button" onClick={() => setStatus('active')}
                                    className={`flex-1 rounded-xl px-4 py-3 font-bold text-sm transition-all shadow-md ${status === 'active' ? 'bg-green-600 text-white border-2 border-green-500' : 'bg-slate-900 text-slate-400 border-2 border-slate-700 opacity-50'}`}
                                >Ativo</button>
                                <button
                                    type="button" onClick={() => setStatus('draft')}
                                    className={`flex-1 rounded-xl px-4 py-3 font-bold text-sm transition-all shadow-md ${status === 'draft' ? 'bg-yellow-600 text-white border-2 border-yellow-500' : 'bg-slate-900 text-slate-400 border-2 border-slate-700 opacity-50'}`}
                                >Rascunho</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Destaque</label>
                            <button
                                type="button" onClick={() => setFeatured(!featured)}
                                className={`w-full rounded-xl px-4 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${featured ? 'bg-orange-600 text-white border-2 border-orange-500' : 'bg-slate-900 text-slate-400 border-2 border-slate-700 opacity-50'}`}
                            >
                                <span className="material-symbols-outlined text-lg">{featured ? 'stars' : 'star_border'}</span>
                                {featured ? 'Em destaque' : 'Não destacado'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex gap-4 pt-6 pb-20">
                    <button
                        type="submit" disabled={saving}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-white font-black text-lg hover:bg-primary/90 transition-all disabled:opacity-50 shadow-xl shadow-primary/30"
                    >
                        <span className="material-symbols-outlined">{saving ? 'hourglass_empty' : 'save'}</span>
                        {saving ? (uploading ? 'Enviando Fotos...' : 'Salvando...') : (isEditing ? 'Salvar Alterações' : 'Criar Produto')}
                    </button>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-700 px-8 py-4 text-slate-400 font-bold hover:border-slate-500 transition-all"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
