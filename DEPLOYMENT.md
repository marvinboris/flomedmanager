# Guide de déploiement - FloMed Manager

## Prérequis serveur

- PHP 8.2+ avec extensions (mbstring, xml, curl, mysql, zip, gd)
- Composer
- Node.js 18+
- MySQL/MariaDB
- Serveur web Apache ou Nginx

---

## 1. Préparer le serveur

```bash
# Créer la base de données MySQL
mysql -u root -p -e "CREATE DATABASE flomed_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 2. Déployer le Backend (Laravel)

```bash
cd backend

# Installer les dépendances PHP
composer install --optimize-autoloader --no-dev

# Configurer l'environnement
cp .env.example .env
```

Éditer `.env` avec les valeurs de production :

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=flomed_manager
DB_USERNAME=votre_user
DB_PASSWORD=votre_mot_de_passe
```

```bash
# Générer la clé d'application
php artisan key:generate

# Lancer les migrations et le seeding
php artisan migrate --force
php artisan db:seed --force

# Optimiser pour la production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Permissions des dossiers
chmod -R 775 storage bootstrap/cache
```

## 3. Déployer le Frontend (React/Vite)

```bash
cd frontend

# Installer les dépendances
npm install

# Builder pour la production
npm run build
# → Les fichiers sont générés dans frontend/dist/
```

## 4. Configurer le serveur web (Nginx)

### Backend API

```nginx
server {
    listen 80;
    server_name api.votre-domaine.com;
    root /chemin/vers/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Frontend SPA

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /chemin/vers/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api.votre-domaine.com;
    }
}
```

## 5. Sécuriser pour la production

- **CORS** : Restreindre `allowed_origins` dans `backend/config/cors.php` (actuellement `'*'`)
- **HTTPS** : Configurer un certificat SSL (Let's Encrypt)
- **Variables sensibles** : Vérifier que `.env` n'est pas exposé publiquement

## 6. Lancer les services annexes

```bash
# Démarrer le worker de queue (pour les tâches asynchrones)
php artisan queue:work --daemon

# Optionnel : configurer un supervisor pour garder le worker actif
```

## 7. Vérifier le déploiement

- Accéder à `https://votre-domaine.com` → page de login
- Tester la connexion avec : `admin@flomed.com` / `password123`
- Vérifier le dashboard, les stocks, et la génération de rapports PDF/Excel

---

> **Note** : Le projet n'inclut pas de Docker. Pour un déploiement conteneurisé, il faudrait créer un `Dockerfile` et un `docker-compose.yml`.
