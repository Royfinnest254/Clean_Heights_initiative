# CMS and Namecheap deployment

The public site remains a React/Vite build served from the domain's document root. The CMS API runs as a Node.js application and stores editable programs, activities, image records, administrator accounts, and sessions in the MySQL/MariaDB database. Uploaded images are converted to WebP and stored in the application `storage/media` directory, outside the public build output.

## What the CMS supports

- Email/password administrator login, with hashed passwords, eight-hour secure sessions, CSRF checks, and throttling after repeated failed sign-ins.
- Programs with dates, publication status, description, and cover photo.
- Multiple activities attached to a program, plus standalone activities.
- Draft/published visibility; only published items are returned by the public API.
- Image upload, resize/format conversion, alternative text, and image slot assignments.
- HTML revalidation and fingerprinted bundle caching. New uploads receive unique paths, so old image cache entries do not mask replacements.

The first delivery wires CMS image slots to the brand logo and homepage hero; program/activity cover images are directly editable. Additional fixed images on the existing pages need their slot keys wired into the corresponding page components before they can be replaced in the portal.

## First-time setup in cPanel

1. In **cPanel → Domains**, note the document root for `cleanheightsinitiative.org`. Back up that directory and the current database before changing deployment.
2. In **cPanel → MySQL Database Wizard**, create a database and a database user. Assign the user **ALL PRIVILEGES** for this database. Keep these values private.
3. Open **cPanel → phpMyAdmin**, select the new database, choose **Import**, and import `database/schema.sql` from the Git checkout.
4. In **cPanel → Git Version Control**, clone `https://github.com/Royfinnest254/Clean_Heights_initiative.git` to a repository path outside the public document root, for example `~/clean_heights`. Do not put the Git working tree or `.git` directory inside `public_html`.
5. Open **cPanel → Setup Node.js App → Create Application**. Select Node.js 20 or newer, Production mode, use the Git checkout as the application root, and set the startup file to `dist/index.js`. Save the port shown in the app details. The app must be started for CMS API calls to work.
6. Add these values in the Node.js app settings, or create a private `.env` file in the repository root outside the web document root, using the names shown in `.env.example`: `NODE_ENV=production`, `DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME=...`, `DB_USER=...`, and `DB_PASSWORD=...`. The file is ignored by Git. Never add these secrets to GitHub. If using File Manager, make sure the repository path is outside the domain document root.
7. In **cPanel → Terminal**, activate the Node application environment using the command shown by **Setup Node.js App**, go to the repository root, and run `npm ci --legacy-peer-deps`. The flag is required because one existing development plugin declares an older Vite peer range than the Vite version already used by the site. The Git deploy script runs the build and copies the public output. If you change dependencies later, run `npm ci --legacy-peer-deps` again before deployment.
8. Confirm that `$HOME/public_html` is the document root from step 1. If the domain uses a different folder, edit the destination in `.cpanel.yml` before deploying. The deployment copies new files over existing files and does not delete the current document root. It preserves the existing `.htaccess` so the API port setting survives future deployments.
9. After creating the Node application, copy the two proxy rules from `client/public/.htaccess.cms-proxy.example` into the deployed `public_html/.htaccess`. Replace `12345` with the port shown by cPanel. Keep the rules after the HTTPS redirect and before the SPA fallback. This forwards `/api/` and `/media/` to the Node service while leaving static files and the PHP contact form served by Apache/PHP.
10. In **cPanel → Terminal**, activate the Node application environment using the exact command shown by **Setup Node.js App**, go to the repository root, and run `npm run cms:create-admin`. The command reads the ignored `.env` file or exported environment values, then prompts for administrator email, display name, and a unique password of at least 14 characters. The password is stored as a scrypt hash in the database, not in the repository.
11. Restart the Node application. Check `https://cleanheightsinitiative.org/api/programs` (empty JSON data is expected before publishing a program), then sign in at `https://cleanheightsinitiative.org/admin`.

## Updating the site after this connection

1. Push reviewed changes to the repository's `main` branch.
2. In **cPanel → Git Version Control**, use **Update from Remote** for this checkout. Build from the activated Node environment if needed, then select **Deploy HEAD Commit**. The repository's `.cpanel.yml` overlays compiled website files into the configured document root and preserves the configured `.htaccess`.
3. Restart the Node application from **Setup Node.js App** after a server/API code update. Content publishing from `/admin` does not require a Git deployment.

Namecheap's Git tool uses an explicit **Update from Remote** and **Deploy HEAD Commit** workflow; a GitHub push by itself does not guarantee that shared hosting has fetched the new commit. Verify the exact document root and Node app settings in your cPanel before the first deployment.

## Important launch checks

- Keep `storage/media` writable by the Node process and backed up separately; it is intentionally not version controlled.
- Verify the app is available over HTTPS so the administrator cookie can be marked `Secure`.
- Confirm cPanel's Node runtime version and memory/process limits for the purchased plan. Node app availability is plan/server specific.
- This is a first CMS slice: image slots only affect components already wired to a slot key. Team, news, and all remaining fixed page images need their slot keys migrated before the portal controls every picture.
- The privacy, cookie, terms, and accessibility pages are a working draft based on the code inspected in this repository. The organization should verify its actual retention practices, ODPC registration, vendor terms, lawful bases, and child-media permissions, and obtain Kenyan legal review before treating them as final legal documents.
