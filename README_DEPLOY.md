# Déploiement sur Render

Ce guide explique comment préparer le projet pour déploiement sur Render et comment utiliser les workflows GitHub Actions.

## 1. Services Render à créer

- Backend : service Web Python
- Frontend : static site
- Base de données : PostgreSQL (ou `DATABASE_URL` externe)

## 2. Configuration Render

Pour le service backend :
- `DJANGO_SECRET_KEY` : secret de production
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS` : votre-backend.onrender.com
- `DJANGO_CORS_ALLOW_ALL_ORIGINS=False`
- `DJANGO_CORS_ALLOWED_ORIGINS` : https://your-frontend.onrender.com
- `DATABASE_URL` : depuis la base PostgreSQL Render ou externe

Pour le static site frontend :
- `VITE_API_BASE_URL` : https://your-backend.onrender.com/api

## 3. Fichier `render.yaml`

Le dépôt contient déjà `render.yaml` pour un déploiement Render automatisé. Remplacez les valeurs de service et d'hôte par vos propres noms Render.

## 4. GitHub Actions

### `ci.yml`
Exécute :
- installation Python
- installation des dépendances backend
- migrations, `manage.py check` et tests Django
- build frontend Vite

### `deploy-render.yml`
Permet de déclencher un déploiement Render via l'API lorsque les secrets GitHub sont définis.

Secrets attendus :
- `RENDER_API_KEY`
- `RENDER_BACKEND_SERVICE_ID`
- `RENDER_FRONTEND_SERVICE_ID`
- optionnel : `VITE_API_BASE_URL`

## 5. Remarques importantes

- `VITE_API_BASE_URL` est injecté au moment du build du frontend. Si l’URL du backend change, rebuild le frontend.
- Ne commitez jamais vos clés secrètes ou `DJANGO_SECRET_KEY` en clair.
- Si vous utilisez la connexion GitHub intégrée Render, vous pouvez également laisser Render gérer les déploiements automatiques.
