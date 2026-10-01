# Clean Heights on Namecheap: one-time setup and simple updates

This release uses the existing React website as static files and a small PHP API connected to the existing cPanel MySQL database. cPanel serves the public pages and runs each PHP request directly. It does not need a Node.js application, Passenger startup file, terminal, npm install, or a database reset.

## What stays and what changes

- Keep the current domain, hosting plan, database, and all CMS program/activity/media rows.
- The PHP API creates only missing CMS tables with `CREATE TABLE IF NOT EXISTS`; it never empties or replaces existing tables.
- The administrator page manages programs with activities, standalone activities, news stories, uploaded media, and replacement photos for the public site. Contact, legal pages, cookie notice, mobile navigation, page SEO, dynamic news metadata, sitemap, and robots file ship in the release.
- Public photographs are resized and optimized to WebP during the release build. Original photos remain in the Git repository. Existing CMS uploads stay in the old app's `storage/media` folder and keep their current URLs.
- The old Node app is stopped so it no longer intercepts normal cPanel website requests. Keep its files until the PHP site is confirmed working.

## First deployment

1. **Back up first.** In cPanel, open **Backup**, download a Home Directory backup, then use **phpMyAdmin → select the existing Clean Heights database → Export → Quick → SQL → Export**. Keep both downloaded files.
2. In cPanel, open **Domains** and note the **Document Root** for `cleanheightsinitiative.org`. This is where the new website files go. It is often `public_html`, but follow the path cPanel shows.
3. Open **Setup Node.js App**, find the Clean Heights app, and click **Stop App**. Do not delete its files or database. The new `.htaccess` routes the domain to PHP and static files; keep the old app folder because it contains existing CMS photos.
4. In **File Manager**, open the Document Root from step 2. Upload `Clean_Heights_Namecheap_Upload.zip` and choose **Extract** in this folder. Allow the archive’s website files and `.htaccess` to overwrite the old website files. Extraction does not delete unlisted files or folders.
5. In that folder, select `cms-config.example.php`, click **Copy**, set the destination to the same Document Root, and name the copy `cms-config.php`.
6. Select `cms-config.php`, click **Edit**, and replace the database name, database username, database password, and setup key with the exact values from cPanel. Keep `db_host` as `localhost`, `db_port` as `3306`, and `site_origin` as `https://cleanheightsinitiative.org`. The setup key must be a new random secret at least 32 characters long. Save the file. It is blocked from public web access by `.htaccess`.
7. Open `https://cleanheightsinitiative.org/api/health/live`. It should show `{"ok":true,"service":"clean-heights"}`. Then open `https://cleanheightsinitiative.org/api/health`; it should show `"database":"connected"`. The first PHP request creates only missing tables and imports the repository's existing blog stories once; existing CMS programs, activities, users, and media records are not deleted.
8. Open `https://cleanheightsinitiative.org/admin/setup`. Enter the setup key, administrator name and email, and a new private password of 14–72 characters. If an administrator row already exists, this resets the first admin account and keeps its CMS content. After the success message, edit `cms-config.php` and set `setup_key` to an empty string. Then sign in at `https://cleanheightsinitiative.org/admin`.
9. In the content portal, open **News** to manage stories and **Images & site photos** to upload replacements and choose which existing website photo to replace. Programs can have multiple activities; small standalone activities can be added separately.
10. Check the home, About, Team, Programs & Activities, News, Contact, Privacy, Cookies, Terms, and Accessibility pages on a phone and desktop. Do not import `database/schema.sql` over the live database.

## Each future update

1. Download the new `Clean_Heights_Namecheap_Upload.zip` release.
2. In File Manager, open the same Document Root, upload the ZIP, choose **Extract**, and allow files to be overwritten.
3. **Do not replace or rename `cms-config.php` or delete `clean_heights_app/storage/media`.** New releases contain `cms-config.example.php`; the live credentials file and uploaded photos are not part of the ZIP.
4. Refresh the website. Static HTML always revalidates; fingerprinted Vite assets receive long cache lifetimes, and each release changes their fingerprint.

## If you need to restore

Use your downloaded backup and contact Namecheap Support if cPanel does not offer a restore action for your plan. Keep the previous `clean_heights_app` folder and downloaded ZIP; the old folder also stores the existing CMS photos used by the new PHP site.

## Security and legal-content note

The CMS uses an HttpOnly, SameSite session cookie, CSRF tokens, password hashing, sign-in throttling, prepared SQL statements, image MIME checks, upload-size limits, and a protected configuration file. The Privacy, Cookies, Terms, and Accessibility pages are organizational drafts; have a Kenyan legal professional review them against the actual services and practices before treating them as legal advice or a guarantee against claims.
