CLEAN HEIGHTS INITIATIVE — FULL WEBSITE UPDATE

Before uploading, read FILE-MANAGER-AND-CMS-GUIDE.md. It gives the beginner cPanel File Manager steps and the complete CMS content-entry instructions.

The ZIP must be extracted into the Application Root shown for this site in cPanel → Setup Node.js App. Do not assume that public_html is the Application Root. Back up the current app files first, keep the existing cPanel environment variables and storage folder, then restart the Node.js app after extraction.

Do not import database/schema.sql over a live database that already contains CMS data. The ZIP does not contain .env secrets, uploaded storage/media, node_modules, or Git history.

After restart, check https://cleanheightsinitiative.org/api/health/live and https://cleanheightsinitiative.org/api/health. The first must return JSON with ok:true and the second must report the database connected. A LiteSpeed 503 means the Node app has not started or Passenger is not reaching it; the ZIP alone cannot fix that hosting state.
