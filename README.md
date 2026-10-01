# Clean Heights Initiative

This repository contains the public website, browser content portal, PHP/MySQL deployment for Namecheap shared hosting, and local development source.

## Namecheap deployment

The recommended production deployment is a static React build plus a small PHP API connected to the existing cPanel MySQL database. It does not require a public Node.js process or terminal access in cPanel. The API creates missing CMS tables without deleting existing program, activity, administrator, or media records. It also imports the repository's legacy blog stories once.

Follow [NAMECHEAP-PHP-DEPLOYMENT.md](NAMECHEAP-PHP-DEPLOYMENT.md) for the click-by-click File Manager guide. `CMS-NAMECHEAP-SETUP.md` links to the same guide. The release is generated with `npm run build:namecheap-php` and written to `namecheap-php/Clean_Heights_Namecheap_Upload.zip`. It intentionally excludes live database credentials and `cms-config.php`.

## Main features

- Programs with dates, descriptions, draft/published status and multiple child activities.
- Standalone activities for one-off events and small projects.
- News articles, separate story pages, photo galleries, Open Graph metadata and a database-backed news sitemap.
- An image library with WebP upload optimization and a selector for replacing photos already used across the site.
- Privacy, cookies, terms and accessibility pages, plus a cookie/browser-storage notice.

## Local development

Run `npm install`, create a local MySQL/MariaDB database using `database/schema.sql`, copy `.env.example` to `.env`, and use `npm run dev` with `npm run dev:api` in separate terminals. These local development commands do not form part of the Namecheap upload process.

## Legal content

The privacy, cookies, terms and accessibility text is an organizational draft, not a promise of legal immunity. Review the actual data services and practices with a Kenyan legal professional before relying on it as final legal advice. The privacy contact uses `info@cleanheightsinitiative.org`; no postal address is invented.
