// Script para popular o banco de dados com dados modelo
// Execute com: node seed.js
// Requer as variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
    { name: 'Convites', slug: 'convites', icon: 'mail', sort_order: 0, active: true },
    { name: 'Lembrancinhas', slug: 'lembrancinhas', icon: 'card_giftcard', sort_order: 1, active: true },
    { name: 'Decoração', slug: 'decoracao', icon: 'celebration', sort_order: 2, active: true },
    { name: 'Papelaria', slug: 'papelaria', icon: 'description', sort_order: 3, active: true },
    { name: 'Kits Festa', slug: 'kits-festa', icon: 'inventory_2', sort_order: 4, active: true },
    { name: 'Personalizados', slug: 'personalizados', icon: 'edit', sort_order: 5, active: true },
];

const products = [
    {
        name: 'Convite Caixa com Visor', slug: 'convite-caixa-visor', code: 'CCX_022_30',
        description: 'Convite em formato de caixa com visor transparente, shaker e miçangas. Personalizado com o tema da festa. Acabamento premium com impressão de alta qualidade.',
        price: 95.0, min_quantity: 30, status: 'active', featured: true, tag: 'Bestseller',
        production_time: 'Disponível'
    },
    {
        name: 'Kit Festa Starlight', slug: 'kit-festa-starlight', code: 'KFS_015_10',
        description: 'Kit completo para festa com tema celestial. Inclui convites, decoração de mesa, lembrancinhas e embalagens personalizadas.',
        price: 89.0, min_quantity: 10, status: 'active', featured: true, tag: null,
        production_time: '15 dias úteis'
    },
    {
        name: 'Lembrancinha Caixa Dourada', slug: 'lembrancinha-caixa-dourada', code: 'LCD_008_20',
        description: 'Caixa de lembrancinha com acabamento dourado premium. Personalizada com nome e data do evento. Ideal para festas elegantes.',
        price: 149.0, min_quantity: 20, status: 'active', featured: true, tag: 'Novo',
        production_time: 'Disponível'
    }
];

async function seed() {
    console.log('🚀 Iniciando seed...');

    // 1. Inserir Categorias
    console.log('📦 Inserindo categorias...');
    for (const cat of categories) {
        const { data, error } = await supabase
            .from('categories')
            .upsert(cat, { onConflict: 'slug' })
            .select()
            .single();
        
        if (error) {
            console.error(`❌ Erro ao inserir categoria ${cat.name}:`, error.message);
        } else {
            console.log(`✅ Categoria inserida/atualizada: ${data.name}`);
            
            // Tentar associar um produto se for relevante
            if (cat.slug === 'convites') {
                const p = products[0];
                const { error: pErr } = await supabase.from('products').upsert({ ...p, category_id: data.id }, { onConflict: 'slug' });
                if (pErr) console.error(`❌ Erro ao inserir produto ${p.name}:`, pErr.message);
                else console.log(`✅ Produto inserido: ${p.name}`);
            } else if (cat.slug === 'kits-festa') {
                const p = products[1];
                const { error: pErr } = await supabase.from('products').upsert({ ...p, category_id: data.id }, { onConflict: 'slug' });
                if (pErr) console.error(`❌ Erro ao inserir produto ${p.name}:`, pErr.message);
                else console.log(`✅ Produto inserido: ${p.name}`);
            } else if (cat.slug === 'lembrancinhas') {
                const p = products[2];
                const { error: pErr } = await supabase.from('products').upsert({ ...p, category_id: data.id }, { onConflict: 'slug' });
                if (pErr) console.error(`❌ Erro ao inserir produto ${p.name}:`, pErr.message);
                else console.log(`✅ Produto inserido: ${p.name}`);
            }
        }
    }

    console.log('✨ Seed finalizado!');
}

seed().catch(err => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
