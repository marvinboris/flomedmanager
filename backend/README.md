# FloMedManager

Application web de gestion des médicaments pour pharmacie hospitalière.

## Fonctionnalités

- Gestion complète des médicaments (CRUD)
- Suivi des stocks avec alertes automatiques
- Mouvement de stock (entrées/sorties)
- Gestion des fournisseurs
- Commandes aux fournisseurs
- Système de rôles (Administrateur, Pharmacien, Magasinier)
- Rapports PDF et Excel
- Tableau de bord avec indicateurs clés

## Stack Technique

- **Backend**: Laravel 12 (PHP 8.5)
- **Frontend**: React 18 + Vite
- **Base de données**: SQLite (développement) / MySQL (production)
- **Authentification**: Laravel Sanctum (JWT)

## Installation Locale

### Prérequis

- PHP 8.5+
- Composer
- Node.js 18+
- npm

### Backend

```bash
# Aller dans le dossier backend
cd flomed-backend

# Installer les dépendances
composer install

# Copier le fichier de configuration
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Lancer les migrations
php artisan migrate

# Alimenter la base de données
php artisan db:seed

# Lancer le serveur
php artisan serve
```

Le backend sera accessible sur `http://localhost:8000`

### Frontend

```bash
# Aller dans le dossier frontend
cd flomed-frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | admin@flomed.com | password123 |
| Pharmacien | pharmacien@flomed.com | password123 |
| Magasinier | magasinier@flomed.com | password123 |

## Structure du projet

```
flomed-backend/
├── app/
│   ├── Http/Controllers/  # Contrôleurs API
│   ├── Models/            # Modèles Eloquent
│   └── Exports/           # Exports Excel
├── database/
│   ├── migrations/        # Migrations base de données
│   └── seeders/           # Données de test
├── routes/api.php         # Routes API
└── config/                # Configuration Laravel

flomed-frontend/
├── src/
│   ├── components/        # Composants React
│   ├── context/           # Context (Auth)
│   ├── pages/             # Pages
│   ├── services/          # Services API
│   └── App.jsx            # Routeur principal
└── vite.config.js         # Configuration Vite
```

## Déploiement Production

### Backend (Laravel)

1. Configurer MySQL dans `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flomed_manager
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

2. Commands de déploiement:
```bash
composer install --optimize-autoloader
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache
```

### Frontend (Vite)

```bash
# Build de production
npm run build

# Les fichiers seront dans le dossier dist/
```

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Utilisateur actuel

### Médicaments
- `GET /api/medicaments` - Liste
- `POST /api/medicaments` - Créer
- `GET /api/medicaments/{id}` - Détails
- `PUT /api/medicaments/{id}` - Modifier
- `DELETE /api/medicaments/{id}` - Supprimer
- `GET /api/medicaments/low-stock` - Stock critique
- `GET /api/medicaments/expiring-soon` - Expirant bientôt

### Stocks
- `GET /api/stocks` - Liste
- `POST /api/stocks/movement` - Mouvement (entrée/sortie)
- `GET /api/stocks/history` - Historique

### Fournisseurs
- `GET /api/fournisseurs` - Liste
- `POST /api/fournisseurs` - Créer
- `PUT /api/fournisseurs/{id}` - Modifier
- `DELETE /api/fournisseurs/{id}` - Supprimer

### Commandes
- `GET /api/commandes` - Liste
- `POST /api/commandes` - Créer
- `PUT /api/commandes/{id}` - Modifier (changer statut)

### Rapports
- `GET /api/rapports/stock/pdf` - PDF Stock
- `GET /api/rapports/stock/excel` - Excel Stock
- `GET /api/rapports/expired/pdf` - PDF Expirés

## License

MIT
