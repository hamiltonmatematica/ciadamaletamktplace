// Script para criar os usuários admin no Supabase
// Execute com: node create-admin-users.js
// Requer a SUPABASE_SERVICE_ROLE_KEY

const SUPABASE_URL = 'https://tkkxrsqniagdyafojdto.supabase.co';

// Pegue a service_role key no dashboard do Supabase:
// Settings > API > service_role key (a chave secreta, não a anon)
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'COLE_SUA_SERVICE_ROLE_KEY_AQUI';

const users = [
    { email: 'hamilton.vinicius@gmail.com', password: '01770722' },
    { email: 'cia@maleta.com', password: 'ciadamaleta2026' },
];

async function createUser(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({
            email,
            password,
            email_confirm: true, // Confirma o email automaticamente
        }),
    });

    const data = await res.json();

    if (res.ok) {
        console.log(`✅ Usuário criado: ${email}`);
    } else {
        console.log(`❌ Erro ao criar ${email}:`, data.msg || data.message || JSON.stringify(data));
    }
}

async function main() {
    if (SERVICE_ROLE_KEY === 'COLE_SUA_SERVICE_ROLE_KEY_AQUI') {
        console.log('⚠️  Execute com a service_role key:');
        console.log('   SUPABASE_SERVICE_ROLE_KEY=sua_key node create-admin-users.js');
        process.exit(1);
    }

    for (const user of users) {
        await createUser(user.email, user.password);
    }
}

main();
