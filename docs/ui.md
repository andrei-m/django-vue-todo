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

## Due Dates

* To-do tasks should be organized by date date in reverse-chronological order.
* Due dates should be presented as headings in `Jan 1st, YYYY` format. Tasks due on that date should be presented below the heading
* Tasks without a date should be presented under a general `No Due Date` heading at the end of the list of headings.
* Task create and edit should include an optional date picker Vuetify component that allows for setting a date.

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

### 6. Due Dates Implementation

* **Date vs. DateTime:** The backend uses `DateTimeField`. Should we stick to just a **Date** (YYYY-MM-DD) for simplicity, or should users specify a **Time**?

    A: Users should specify only a date. The backend can should set the 00:00:00 time to fit into the data model. Dates represent UTC days.

* **Timezone Handling:** Should we handle dates in **UTC** (ISO strings) and localize in the browser, or use "naive" dates for this toy app?

    A: UTC

* **Grouping & Sorting:** The docs specify reverse-chronological order. Should future dates appear at the top? How should "Completed" tasks be handled relative to their date groups?

    A: Future dates hould appear at the top. It's OK to include "Completed" tasks in their logical date groupings for now without any special handling.

* **Date Picker UX:** Should the `v-date-picker` be **Inline** or triggered via a **Menu/Dialog** from a text field?

    A: Inline - make it part of the TODO form.

* **Utility Libraries:** Is it okay to add **`date-fns`** or **`dayjs`** for formatting (e.g., `Jan 1st, YYYY`) and sorting logic?

    A: Yes, use your preferred choice.
