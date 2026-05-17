Data Model
==========

Create Django-conventional data models for these components. Each component should have a Python model and REST resources for required operations.

## User

A user logs in to the app to manage their to-dos. Each consists of:

* A unique username
* A hashed and salted credential using Django conventions for user management using a database directory

Required REST operations:

* Create (sign-up): create a new user records and record with random salt & persisted salted+hashed pw
* Log in: Exchange username/password credentials for a JWT token

## To-do item

Each to-do should include a representation of:

* A reference to a parent user
* An item title
* An item description (markdown supported)
* A due date
* A completed bit

Required REST operations:

* Create a new to-do
* Modify an existing to-do's title, description, due date, and/or completed bit
* Delete a to-do

## Design Questions

1. **Authentication/Authorization**: Should to-dos be private to a user, or is this a public shared list? (The current requirement doesn't mention Users).

    A: The mode is updated to describe users. To-dos are private to a user.

2. **REST Framework**: Should I use Django Rest Framework (DRF) for the API, or standard Django views? (DRF is standard for "REST resources" in Django).

    A: use DRF

3. **Markdown Rendering**: Should the backend handle markdown rendering to HTML, or just store the raw markdown for the frontend (Vue) to handle?

    A: Store RAW markdown

4. **JWT Storage**: For the frontend (Vue), should the JWT be returned in the response body or as an HTTP-only cookie? (Response body is more common for SPAs with DRF, but cookies are more secure against XSS).

    A: Use a response cookie. (Implemented using `access_token` cookie).
