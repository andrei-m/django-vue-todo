Django-Vue TODO
===============

Toy multi-tenant to-do app using Django and Vue. Conventions:

* Django defines the model and provides REST resources.
* Rendering is performed client-side using Vue. HTML and JS are delivered as static resources.
* Nginx serves all resources in a reverse-proxy configuration
* Persistent state in Postgres

More specific design [docs](./docs/design.md).

## Get started

**TODO**: describe how to obtain certificates and set DJANGO_ALLOWED_HOSTS

Start the stack in Docker Compose:

```bash
export DJANGO_ALLOWED_HOSTS=allowed.host
docker compose up -d --build
```

The application will be available at `https://localhost` (via Nginx).

## Backend

REST resources for todo-management. Start the server:

```bash
# in ./backend
source .venv/bin/activate
python manage.py runserver
```

### API Examples

**1. Sign Up**
```bash
curl -X POST http://localhost:8000/api/register/ \
     -H "Content-Type: application/json" \
     -d '{"username": "newuser", "password": "securepassword123"}'
```

**2. Login (Obtain JWT Cookie)**
```bash
# This will return the access token and set an HTTP-only 'access_token' cookie.
# The '-v' (verbose) flag allows you to see the response headers.
curl -v -X POST http://localhost:8000/api/login/ \
     -H "Content-Type: application/json" \
     -d '{"username": "newuser", "password": "securepassword123"}'

# Observe the cookie: Look for the 'set-cookie:' header in the output, e.g.:
# < set-cookie: access_token=...; HttpOnly; Path=/; SameSite=Lax
```

**3. Create a To-do**
```bash
# Note: Since the backend uses cookies, you would normally send the cookie.
# For testing with curl, you can also use the Bearer token from the login response.
curl -X POST http://localhost:8000/api/todos/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <access_token>" \
     -d '{"title": "My first todo", "description": "Finish the backend implementation"}'
```

**4. List To-dos**
```bash
curl -H "Authorization: Bearer <access_token>" http://localhost:8000/api/todos/
```

**5. Update a To-do**
```bash
curl -X PATCH http://localhost:8000/api/todos/<id>/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <access_token>" \
     -d '{"completed": true}'
```

**6. Delete a To-do**
```bash
curl -X DELETE http://localhost:8000/api/todos/<id>/ \
     -H "Authorization: Bearer <access_token>"
```