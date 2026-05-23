Django-Vue TODO
===============

Toy multi-tenant to-do app using Django and Vue. Conventions:

* Django defines the model and provides REST resources.
* Rendering is performed client-side using Vue. HTML and JS are delivered as static resources.
* Nginx serves all resources in a reverse-proxy configuration
* Persistent state in Postgres

More specific design [docs](./docs/design.md).

## Setup & Getting Started

### 1. Configure Hostname

To use a custom domain like `todo.local` for local development, add it to your system's hosts file:

*   **Linux/macOS:** Edit `/etc/hosts` (requires `sudo`)
*   **Windows:** Edit `C:\Windows\System32\drivers\etc\hosts` (requires Administrator)

Add the following line:
```text
127.0.0.1   todo.local
```

Alternatively, for production, set up an `A` or `CNAME` record in your DNS provider pointing to your server's IP.

### 2. Generate SSL Certificates

The Nginx configuration requires three files in `./nginx/certs/`: `cert.pem`, `key.pem`, and `issuer.pem`.

#### Option A: Self-Signed (Local Development)
Use OpenSSL to generate a quick self-signed certificate:
```bash
mkdir -p nginx/certs
openssl req -x509 -newkey rsa:4096 -keyout nginx/certs/key.pem -out nginx/certs/cert.pem -sha256 -days 365 -nodes -subj "/CN=todo.local"
cp nginx/certs/cert.pem nginx/certs/issuer.pem
```

#### Option B: Let's Encrypt with `lego`
If you have a public domain and want real certificates, use [lego](https://github.com/go-acme/lego):
```bash
# Example using HTTP challenge
lego --email="your@email.com" --domains="yourdomain.com" --http run
# Map the output to the expected filenames
cp .lego/certificates/yourdomain.com.crt nginx/certs/cert.pem
cp .lego/certificates/yourdomain.com.key nginx/certs/key.pem
cp .lego/certificates/yourdomain.com.issuer.crt nginx/certs/issuer.pem
```

### 3. Start the Stack

```bash
export DJANGO_ALLOWED_HOSTS=todo.local
docker compose up -d --build
```

The application will be available at `https://todo.local` (via Nginx).

## Backend

REST resources for todo-management. For local development without Docker:

```bash
# in ./backend
source .venv/bin/activate
python manage.py runserver
```

## UI

Vue.js frontend using Vite and Vuetify. To run the development server and connect it to a local Django backend:

```bash
# in ./ui
npm install
npm run dev
```

By default, the development server points to `http://localhost:8000/api` (configured in `ui/.env.development`). 

**Note on CORS:** The backend is pre-configured to allow requests from `http://localhost:5173` during local development.

### API Examples (using Docker/Nginx)

**1. Sign Up**
```bash
curl -X POST https://todo.local/backend/api/register/ \
     -k -H "Content-Type: application/json" \
     -d '{"username": "newuser", "password": "securepassword123"}'
```

**2. Login (Obtain JWT Cookie)**
```bash
curl -v -X POST https://todo.local/backend/api/login/ \
     -k -H "Content-Type: application/json" \
     -d '{"username": "newuser", "password": "securepassword123"}'
```

**3. Create a To-do**
```bash
curl -X POST https://todo.local/backend/api/todos/ \
     -k -H "Content-Type: application/json" \
     -H "Authorization: Bearer <access_token>" \
     -d '{"title": "My first todo", "description": "Finish the backend implementation"}'
```

**4. List To-dos**
```bash
curl -k -H "Authorization: Bearer <access_token>" https://todo.local/backend/api/todos/
```

**5. Update a To-do**
```bash
curl -X PATCH https://todo.local/backend/api/todos/<id>/ \
     -k -H "Content-Type: application/json" \
     -H "Authorization: Bearer <access_token>" \
     -d '{"completed": true}'
```

**6. Delete a To-do**
```bash
curl -X DELETE https://todo.local/backend/api/todos/<id>/ \
     -k -H "Authorization: Bearer <access_token>"
```