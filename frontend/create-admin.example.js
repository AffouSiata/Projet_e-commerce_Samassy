// Script exemple pour créer un compte ADMIN
// Utilisation: node create-admin.example.js
// Nécessite d'avoir Node.js installé

const API_BASE_URL = 'https://licences-api.onrender.com/api';

// 1. D'abord se connecter en tant que SUPER_ADMIN
async function loginAsSuperAdmin() {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-lang': 'fr'
    },
    body: JSON.stringify({
      email: 'superadmin@admin.com',
      password: 'admin123!'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Login failed: ${error.message}`);
  }

  const data = await response.json();
  console.log('✅ Connecté en tant que SUPER_ADMIN');
  return data.accessToken;
}

// 2. Créer un nouveau compte ADMIN
async function createAdmin(token, email, password, name) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-lang': 'fr'
    },
    body: JSON.stringify({
      email,
      password,
      name,
      role: 'ADMIN' // Seul un SUPER_ADMIN peut créer un ADMIN
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Create admin failed: ${error.message}`);
  }

  const data = await response.json();
  console.log('✅ Nouvel ADMIN créé:', data.admin);
  return data;
}

// Fonction principale
async function main() {
  try {
    console.log('🔐 Connexion en tant que SUPER_ADMIN...');
    const token = await loginAsSuperAdmin();

    console.log('\n👤 Création d\'un nouveau compte ADMIN...');
    await createAdmin(
      token,
      'admin@licensesale.com',  // Nouveau email
      'SecurePassword123!',      // Nouveau mot de passe
      'Admin License Sale'       // Nom
    );

    console.log('\n✅ Compte ADMIN créé avec succès!');
    console.log('Vous pouvez maintenant vous connecter avec:');
    console.log('  Email: admin@licensesale.com');
    console.log('  Password: SecurePassword123!');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}
