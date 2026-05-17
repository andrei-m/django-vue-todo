UI
==

The to-do UI should follow single-page-app conventions rendered by Vue, consist of static resources served from an nginx location that is decoupled from `/backend` and integrate with `/backend` resources. Vue should handle routing client-side.

Additional requirements:

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

## Implementation Plan