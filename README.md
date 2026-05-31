# Application éducative Info 1ère GC

Projet React + Django pour une application éducative de la section première commerciale de gestion.

## Backend Django

1. Aller dans le dossier backend
   ```bash
   cd backend
   ```
1.1. Copier le modèle `.env.example` si vous voulez gérer les variables locales
   ```bash
   copy .env.example .env
   ```
2. Créer un environnement virtuel
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Installer les dépendances
   ```bash
   pip install -r requirements.txt
   ```
4. Créer les migrations
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Créer un compte administrateur si besoin
   ```bash
   python manage.py createsuperuser
   ```
6. Lancer le serveur
   ```bash
   python manage.py runserver
   ```

## Frontend React

1. Aller dans le dossier frontend
   ```bash
   cd frontend
   ```
1.1. Copier le modèle `.env.example` pour définir `VITE_API_BASE_URL`
   ```bash
   copy .env.example .env
   ```
2. Installer les dépendances
   ```bash
   npm install
   ```
3. Lancer le projet
   ```bash
   npm run dev
   ```

## Notes

- L’API Django est exposée sur `http://localhost:8000/api` en local
- Le frontend utilise `VITE_API_BASE_URL` pour récupérer les données (par défaut `http://localhost:8000/api`)
- Les enseignants peuvent créer des contenus via l’admin Django ou les endpoints API

