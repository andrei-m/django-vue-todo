Filters
=======

## Completed

To-do items should be filterable by completed status. A filter checkbox (default unchecked) and associated label should be presented above the To-do item list.

Toggling the checkbox should result in a re-fetch of To-do items from the backend. Filtering should be implemented via query parameter fo the `GET /api/todos/` resource and further as a filter via database query.