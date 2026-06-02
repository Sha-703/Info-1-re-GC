Deployment checklist for the backend

1. Set environment variables (Render / provider env):

   - `DATABASE_URL` (postgres://USER:PASS@HOST:PORT/DBNAME)
   - `DJANGO_SECRET_KEY` (secure random string)
   - `DJANGO_DEBUG=False`
   - `DJANGO_ALLOWED_HOSTS` (comma-separated hostnames)
   - `DJANGO_CORS_ALLOW_ALL_ORIGINS=False`
   - `DJANGO_CORS_ALLOWED_ORIGINS` (comma-separated frontend origins)

2. Install dependencies and run migrations (Render build/start already handles these):

```bash
pip install -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput
```

3. On Render: ensure `render.yaml` references the database resource and `envVars` include `DATABASE_URL` or use Render's managed DB binding.

4. Backups: enable automatic backups for the managed Postgres instance.

5. Media: if your app accepts file uploads, configure object storage (S3, Supabase Storage) and set `DEFAULT_FILE_STORAGE` accordingly.
