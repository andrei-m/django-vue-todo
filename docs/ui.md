UI
==

The to-do UI should follow single-page-app conventions rendered by Vue, consist of static resources served from an nginx location that is decoupled from `/backend` and integrate with `/backend` resources. Vue should handle routing client-side.

Additional requirements:

* Use TypeScript
* Use vite to build, test, and bundle the client-side app
* Distribute the static resource bundle via a simple/minimal web server provided by a Docker image
* Configure nginx in the docker-compose workflow to serve the UI app from a container alongside 'backend'

## Initial flows

Initially, the goal of the app is to support user registration, login, and token refresh.

1. If there is no active JWT session (missing cookie), present a "register or login" page.
2. If there is a JWT session, but the token is invalid, attempt to refresh it. If still invalid, present a "register or login" page.
3. If there is a active JWT session, attempt to list to-dos.
4. The register or login page should present those two options
   * Registering successfully should navigate back to the login page (with a successful registration banner)
   * Logging in successfully should persist the JWT token cookie & refresh token.

## Design Questions

### 1. State Management
For handling authentication state and the to-do list, should I:

    A: Use Composition API

### 2. Styling & Layout
To achieve a "modern and polished" look:

    A: Use Vuetify

### 3. Nginx UI Path & SPA Routing
* Should the UI be served from the root (`/`) while the backend stays at `/backend/`?

    A: Yes

* How should we handle SPA fallback in Nginx (routing all non-file requests to `index.html`)?

    A: Route unknown requests to the to-do list. Unauthenticated or expired sessions should redirect to the register / log-in page.

### 4. Authentication Integration
The backend uses Cookie-based JWT.
* Should the UI check for session validity by attempting a "fetch todos" or "fetch user" call on mount?

    A: Yes, fetch to-dos via list and present the register or login page if the token cannot be refreshed.

* Do you want a dedicated "Auth Guard" in the router to redirect unauthenticated users?

    A: Yes, redirect to register / login

### 5. Project Structure
Since we're using Vite:
* Should the UI live in a new `frontend/` directory at the project root?

    A: The UI should live in a new `ui/` directory

* Should I include a basic suite of Vitest/Vue Test Utils tests from the start?

    A: Yes
