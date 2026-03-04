'use client';

import Link from 'next/link';
import { Product } from '@/types/database';
import { useQuoteCart } from '@/contexts/quote-cart-context';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useQuoteCart();
    const mainImage = product.images?.find(img => img.is_main)?.url || product.images?.[0]?.url || '';

    return (
        <Link
            href={`/produto/${product.slug}`}
            className="group relative flex flex-col gap-4 rounded-3xl bg-white dark:bg-slate-900 p-3 shadow-sm transition-all hover:shadow-2xl border border-primary/5 hover:border-primary/20 cursor-pointer"
        >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-background-light">
                <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={product.name}
                    src={mainImage}
                />
                {product.tag && (
                    <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                            {product.tag}
                        </span>
                    </div>
                )}
            </div>

            <div className="px-2 pb-2">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{product.name}</h4>
                <p className="text-sm text-slate-500 font-medium line-clamp-1">{product.description}</p>
                {product.code && (
                    <p className="text-xs text-slate-400 mt-1">Código: {product.code}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <span className="text-xl font-black text-primary">R$ {product.price.toFixed(2)}</span>
                        {product.min_quantity > 1 && (
                            <span className="text-xs text-slate-400 ml-1">/ cada</span>
                        )}
                    </div>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
                        className="rounded-full bg-primary/10 p-2.5 text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 relative z-10"
                        title="Incluir no orçamento"
                    >
                        <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                    </button>
                </div>
                {product.min_quantity > 1 && (
                    <p className="text-xs text-slate-400 mt-1">Qtd. mínima: {product.min_quantity}</p>
                )}
            </div>
        </Link>
    );
}
