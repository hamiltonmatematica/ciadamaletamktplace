import { Category, Product, ProductImage } from '@/types/database';

// Dados mock para funcionar sem Supabase configurado
// Substituir por queries reais quando o banco estiver pronto

export const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Convites', slug: 'convites', icon: 'mail', sort_order: 0, active: true, created_at: new Date().toISOString() },
    { id: '2', name: 'Lembrancinhas', slug: 'lembrancinhas', icon: 'card_giftcard', sort_order: 1, active: true, created_at: new Date().toISOString() },
    { id: '3', name: 'Decoração', slug: 'decoracao', icon: 'celebration', sort_order: 2, active: true, created_at: new Date().toISOString() },
    { id: '4', name: 'Papelaria', slug: 'papelaria', icon: 'description', sort_order: 3, active: true, created_at: new Date().toISOString() },
    { id: '5', name: 'Kits Festa', slug: 'kits-festa', icon: 'inventory_2', sort_order: 4, active: true, created_at: new Date().toISOString() },
    { id: '6', name: 'Personalizados', slug: 'personalizados', icon: 'edit', sort_order: 5, active: true, created_at: new Date().toISOString() },
];

export const MOCK_IMAGES: ProductImage[] = [
    { id: 'img1a', product_id: '1', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFO6qxaod8dck8q4Fbk5yaGXr3u0OQld0wVRDyGBfOSnA-QNlgQIYMffTKsnvUTjk0dW3ZmtImt_NmCvpYUju1tuSOJIzdRoXLof0zz5T8vPcDNT1-aC452arxrCK7cFMPMERlqcOfOzAS4CM_-l_gEhsIfWYp2eK7XgxTJnIr7KCc-ewn6eWgLhqVTDm9fnHVcVRqtbStKi2aCY83eu2Ytt4BLIhGeT4Bd_qEMtb6RsKmKHKm-LTZDnDC0Ce73V0-eDyxAbmnfCK2', sort_order: 0, is_main: true },
    { id: 'img2a', product_id: '2', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZFO7MRuRSzoTp2cOEkq1kFrxk_Gepzd4O5UAF-TMdk2F88mAfRZFBwQTBlizLJirycUfT2uhDwKda4JsZFTz4rDYgoREjzkobCYwdQJfArjL6sN0L8wKaJuxgWHFU8TcjXRjwhtTRKhxKHZi9Oqh6LFtlqmi5vOVrcghRujK45fUMMJMJKQ2D3iDihv_uPxHrqpOl4SdLg77fYlZvo06ISQ94FDH0Gsh0c0oaKV8i2Xgtq_vHuFFs8r0dzVZ0_Mcz9txOPAZEIxrW', sort_order: 0, is_main: true },
    { id: 'img3a', product_id: '3', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6P__qS1MJAFcr0xOX6LDEQsgvS9ax8mFoQTmUXcQjIU-B5Fn5Aunvr8dE2b1unGhG-Cr2D6qbZ9pMWQbFE0j3dzqrGxvsMT_JQ4L88f7AS0mKlGPm69VMAD3dRqTYxMvTTLyprDHIft6iBolvyktjbXpyUk_VZHpV8rBbcDhDT2vq8rgkf7-7SpHWcD9wNWQpLCXd2xf5CckkHo2Gk6HfG9VqpOYUkHb8NZr1gsZdVyqj0NbAxGmv1FV9KJfYGuTXgSk1x32z_Uge', sort_order: 0, is_main: true },
    { id: 'img4a', product_id: '4', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWXUovuLFTPuL6AWDW0VwTUkz7ISXYAbMOnz3yMn34yA8vuUHmJVkCVNcxXMSO8b6snLHhE2xO53YV7DbNlztHvr8J_5O59-4WNKH0fHc_Jn5RDKaQvj9PcSFPS8GM5jvCwSa1G5dwcvYRrm5M03xznXL3-XgGk_I8wwZ9KX3LFW1Xt57u__9Wu1OWOyshB3EKil8erdtvg6O0Cr9obBLeJiozSr_A78LrEBzsgWc7k-_e7Ck3K_mtC-EPs_XonrOkxvCHSKoXHWaH', sort_order: 0, is_main: true },
    { id: 'img5a', product_id: '5', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvqpzyGfLUwbd5r3RLVlevrurfNXZFScd510MY1rhg-Q_b91wv0DHXef3zgq91YuZPAmvR-TVu0HNsd7lOBC_vsOGOkjDdIGH06bMmXpugd65UUkTDVnfDH7sMjLommqY7IN5WkWyi5WZjo0qUb8tZfI2Vm4XmfrjbKBxB2Ac445tmhRlRvtwT5f_W4qcEE_wL70Hw4FVsL8zwfY80MogZdNEMUz4ps1oBUonLouYjPFRyhI0U5BHQxXa5ZRAjJNha_ays2ID9LxXU', sort_order: 0, is_main: true },
    { id: 'img6a', product_id: '6', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQBr6e9zxJ9OLTH29ldCNVaGvlPnBmLaicyrkdfkqHLZ0dhSzvFnuNLwujd-YDYWfUZXHWqU5YeYRmztf69k9D19l5s1w0Qr37wnbx24qCVuXhkh1GCu8MeMHu9Bm5bUcqVlOaoUzlLndrSwUh1aYesTYM8kl7ua3oY8EYkGwHk9-QQNWSAHOuh2HjWwn0ycljR6V-uH9_Xo1eZx7XD3k6QPTVlFSE1BJJpoYdKks5UmxUmaPBcJfLhviTCCsggv6KSjx-ignYf7EG', sort_order: 0, is_main: true },
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1', name: 'Convite Caixa com Visor', slug: 'convite-caixa-visor', code: 'CCX_022_30',
        description: 'Convite em formato de caixa com visor transparente, shaker e miçangas. Personalizado com o tema da festa. Acabamento premium com impressão de alta qualidade.',
        price: 95.0, min_quantity: 30, category_id: '1', status: 'active', featured: true, tag: 'Bestseller',
        production_time: 'Disponível', click_count: 45, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: MOCK_CATEGORIES[0],
        images: [MOCK_IMAGES[0]],
    },
    {
        id: '2', name: 'Kit Festa Starlight', slug: 'kit-festa-starlight', code: 'KFS_015_10',
        description: 'Kit completo para festa com tema celestial. Inclui convites, decoração de mesa, lembrancinhas e embalagens personalizadas.',
        price: 89.0, min_quantity: 10, category_id: '5', status: 'active', featured: true, tag: null,
        production_time: '15 dias úteis', click_count: 32, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: MOCK_CATEGORIES[4],
        images: [MOCK_IMAGES[1]],
    },
    {
        id: '3', name: 'Lembrancinha Caixa Dourada', slug: 'lembrancinha-caixa-dourada', code: 'LCD_008_20',
        description: 'Caixa de lembrancinha com acabamento dourado premium. Personalizada com nome e data do evento. Ideal para festas elegantes.',
        price: 149.0, min_quantity: 20, category_id: '2', status: 'active', featured: true, tag: 'Novo',
        production_time: 'Disponível', click_count: 28, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: MOCK_CATEGORIES[1],
        images: [MOCK_IMAGES[2]],
    },
    {
        id: '4', name: 'Papelaria Personalizada', slug: 'papelaria-personalizada', code: 'PPR_003_50',
        description: 'Kit de papelaria completo personalizado com a identidade visual do seu evento. Inclui rótulos, tags e adesivos.',
        price: 75.0, min_quantity: 50, category_id: '4', status: 'active', featured: false, tag: null,
        production_time: '10 dias úteis', click_count: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: MOCK_CATEGORIES[3],
        images: [MOCK_IMAGES[3]],
    },
    {
        id: '5', name: 'Decoração Completa Premium', slug: 'decoracao-completa-premium', code: 'DCP_001_01',
        description: 'Pacote completo de decoração personalizada para festa infantil. Painéis, balões, centro de mesa e muito mais.',
        price: 299.0, min_quantity: 1, category_id: '3', status: 'active', featured: true, tag: 'Premium',
        production_time: '20 dias úteis', click_count: 52, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: MOCK_CATEGORIES[2],
        images: [MOCK_IMAGES[4]],
    },
    {
        id: '6', name: 'Convite Digital Animado', slug: 'convite-digital-animado', code: 'CDA_010_01',
        description: 'Convite digital animado em vídeo com música. Personalizado com fotos e informações do evento. Entrega em 48h.',
        price: 120.0, min_quantity: 1, category_id: '1', status: 'active', featured: false, tag: null,
        production_time: '48 horas', click_count: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        category: MOCK_CATEGORIES[0],
        images: [MOCK_IMAGES[5]],
    },
];
