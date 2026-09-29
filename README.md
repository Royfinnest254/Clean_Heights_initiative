# Clean Heights Initiative website

This repository contains the React and TypeScript public website and the Node.js + MySQL/MariaDB content API intended for Namecheap cPanel hosting.

## Current application layout

- `client/` — public React single-page website, legal pages, cookie notice, public programs page, and `/admin` content portal.
- `server/index.ts` — Express API, administrator sessions, media processing, cache headers, and static fallback for local/runtime use.
- `database/schema.sql` — initial MariaDB/MySQL schema.
- `scripts/create-admin.mjs` — interactive one-time administrator creation/reset; never stores the password in source.
- `client/public/.htaccess` — HTTPS, SPA, security and cache rules. On Namecheap, the cPanel-managed Passenger block routes the root site to the Node app; keep that generated block intact.
- `.cpanel.yml` and [CMS-NAMECHEAP-SETUP.md](CMS-NAMECHEAP-SETUP.md) — cPanel Git deployment and first-time setup instructions.

## CMS content structure

Programs have descriptions, dates, publication status and a cover image. Each program can contain many activities. Activities may instead have no parent program and display as standalone actions or smaller projects. The CMS separately stores uploaded media and named image slots; public components use a slot override when they have been wired to that key. Current public wiring includes the brand logo and homepage hero. Program and activity cover images are independently editable.

The portal is available at `/admin`. It uses email/password login, scrypt password hashes, an HttpOnly/Secure/SameSite session cookie in production, CSRF tokens, and database-backed throttling for repeated failed sign-ins. Draft content is private; public API responses include published records only.

## Local development

1. Install dependencies with `pnpm install`.
2. Create a local MySQL/MariaDB database, import `database/schema.sql`, and copy `.env.example` to `.env` with local database credentials.
3. Run `pnpm run cms:create-admin` and create a local administrator account.
4. Start the API with `pnpm run dev:api` and the frontend with `pnpm run dev`. The Vite server proxies `/api` and `/media` to the API on port 3001.
5. Use `pnpm run check` for TypeScript checking and `pnpm run build` to create the production website and API bundle.

## Deploy to Namecheap

Follow [CMS-NAMECHEAP-SETUP.md](CMS-NAMECHEAP-SETUP.md). In summary, create a cPanel MySQL database, import the schema, clone this repo outside the public document root, configure a Node.js app, set its database configuration privately, install packages with the cPanel app button, create the first administrator in the protected browser setup page, and deploy the compiled public files through Git Version Control. No Terminal is required.

The site deploys by pushing changes to GitHub, using **Update from Remote** and **Deploy HEAD Commit** in cPanel Git Version Control, then restarting the Node app when backend code changes. CMS content edits are published from the browser and do not require a Git deployment.

## Legal and privacy content

Privacy, cookie, terms-of-use, and accessibility pages are provided as a practical starting draft based on the current repository. They do not guarantee immunity from legal claims. Before public use, verify the actual data flows, retention periods, processor arrangements, ODPC registration and child-media permissions, then obtain Kenyan legal review. The privacy contact currently uses `info@cleanheightsinitiative.org`; no postal address is invented in the text.
