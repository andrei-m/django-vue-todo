Docker
======

The app should be runnable in a production-like configuration using one Docker compose command:

```bash
docker compouse up -d --build
```

Compose should be configurable with important environment variables:

* Django JWT issuer secrets
* CORS allowed domains
* Django debug mode
* Any other Django conventions that differ between development and production or between environments more generally

The Django app should be served through nginx in a reverse-proxy configuration. Nginx should provide its service over HTTPS on the conventional port :443.

Persistent state remains in sqlite for the moment. A separate Postgres database configuration will be introduced later on.

## Design Questions

### 1. Web Server & Entrypoint
The `docker-compose.yml` currently lacks a command for the `backend` service. For a production-like environment, should I:

    A: Use Gunicorn

### 2. Dependency Management
There is no `requirements.txt` or `Pipfile` in the `backend/` directory.

    A: Yes, generate requirements.txt. Introduce production dependencies like gunicorn as you need them alongside dependencies required by the Django app.

### 3. Static & Media Files
Django currently isn't configured for production static file serving.

    A: Serve only the resourcs Django is currently configured to serve (REST endpoints; admin service)

### 4. Database Persistence
The `docs/docker.md` specifies using SQLite for now.

    A: No, for now, each new container will have a fresh DB. This will be replaced by a Postgres DB in a later work phase.

### 5. Environment Variables
To align with the "configurability" requirement, I plan to refactor `settings.py` to use `os.getenv`.

    A: Directly in docker-compose.yml