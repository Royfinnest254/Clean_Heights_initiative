# Beginner setup: Clean Heights on Namecheap cPanel

This guide uses the cPanel buttons and browser screens. It does not require Terminal. Take one stage at a time. Do not deploy until you have made backups and confirmed that the domain document root shown in cPanel is `public_html`; the deployment file currently copies the built site there.

## What happens once

You will make a files backup, export any existing database, create a new CMS database, clone the GitHub repository in cPanel, create a Node.js app, install the packages with the cPanel button, and deploy. You will then create your administrator on the protected `/admin/setup` page. You do not need to share passwords with anyone.

## A. Back up your current site

1. Sign in to Namecheap.
2. In the left menu click **Hosting List**.
3. Find the hosting plan for this website. On the right side click **Go to cPanel**.
4. In cPanel's search box type **Backup** and click **Backup** under **Files**.
5. Click **Download a Home Directory Backup**. Leave **Home Directory** selected and click **Generate Backup**.
6. When cPanel says it has finished, click the backup filename to download it to your computer. Keep it somewhere safe.
7. Also make a database export if this site already uses a database: search cPanel for **phpMyAdmin**, open it, select the current website database on the left, click **Export**, leave **Quick** and **SQL** selected, and click **Export**. Save the downloaded `.sql` file.

Namecheap's basic Stellar plan cannot restore a full cPanel backup itself; contact Namecheap Support if restoration is ever needed. Keep a local copy before deployment.

## B. Check the needed cPanel features

Use cPanel search and make sure these appear: **Git Version Control**, **Setup Node.js App**, **MySQL Database Wizard**, **phpMyAdmin**, and **File Manager**. This process does not use Terminal. If a required item is missing, stop and ask Namecheap Support whether it is enabled for this hosting account.

In cPanel search **Domains**, click the result, and find `cleanheightsinitiative.org`. Read the **Document Root** column. It must say `public_html` for the deployment file as currently configured. If it shows a different folder, stop here and ask me before deploying; the deployment target needs to be changed first.

## C. Create the new CMS database

1. Search cPanel for **MySQL Database Wizard** and open it.
2. At **Create Database**, enter a short name such as `chi_cms`, then click **Next Step**.
3. Create a database username and a strong unique password. Click **Create User**.
4. On the privileges page select **All Privileges**, then click **Next Step**.
5. Save the full database name and username shown by cPanel, including any cPanel prefix, plus the password. Do not put these in GitHub or send them in chat.
6. To prepare the empty CMS tables, download [database/schema.sql](https://raw.githubusercontent.com/Royfinnest254/Clean_Heights_initiative/main/database/schema.sql). Search cPanel for **phpMyAdmin**, select the new CMS database on the left, click **Import**, choose the downloaded file, scroll down, and click **Import** or **Go**. Look for the green success message.

## D. Clone the repository in cPanel

1. Search cPanel for **Git Version Control** and open it.
2. Click **Create**.
3. Turn on **Clone a Repository**.
4. For **Clone URL**, enter `https://github.com/Royfinnest254/Clean_Heights_initiative.git`.
5. For **Repository Path**, enter `clean_heights_app`. Keep this outside `public_html`.
6. For **Repository Name**, enter `clean_heights_app` if requested. Keep the branch as `main`.
7. Click **Create** or **Clone** and wait for cPanel to finish.

## E. Create the Node.js app

1. Search cPanel for **Setup Node.js App** and open it.
2. Click **Create Application**.
3. Select **Node.js 22** (22.12 or newer) if available and **Production** mode. Vite 7 cannot build on the Node 18 version shown in the `.htaccess` text you shared.
4. Enter `clean_heights_app` as **Application root**. It must exactly match the repository path above.
5. For **Application URL**, choose `cleanheightsinitiative.org` at the root (leave the path empty if cPanel allows it). Your current Passenger configuration attaches the Node app to `/`, so do not put it under a subfolder.
6. Enter `startup.js` as the **Application startup file**. This small file starts the built server after the first deployment.
7. Click **Create**. Leave the app details page open.

If you already created this app using Node 18, return to the **Setup Node.js App** list, click the pencil/edit icon on the `clean_heights_app` row, change **Node.js version** to **22**, and click **Save**. cPanel updates its Passenger settings automatically. Do not type over the generated Passenger block in `.htaccess`.

## F. Add settings and install packages using cPanel

On the Node app's details page, find **Add Variable** or **Environment Variables**. Add each row below, using your real database values from step C:

| Name | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_NAME` | Full database name from step C |
| `DB_USER` | Full database username from step C |
| `DB_PASSWORD` | Database password from step C |
| `CMS_SETUP_KEY` | A unique random password/key at least 32 characters long |

Use a password manager to make the setup key. Save it privately for the next step; do not send it to me or put it in GitHub. Click **Save** if shown.

Before installing, fetch the fixed project version: search cPanel for **Git Version Control**, open **Manage** for `clean_heights_app`, click **Pull or Deploy**, then click **Update from Remote**. After it finishes, return to **Setup Node.js App** and click **Run NPM Install**. Wait for it to finish. The incompatible development-only Vite plugin has been removed, so npm can resolve the project normally. If cPanel displays a red error, stop and send a screenshot with secrets hidden.

## G. Deploy the website

1. Return to **Git Version Control** in cPanel.
2. Find `clean_heights_app` and click **Manage**.
3. Open **Pull or Deploy**.
4. Click **Update from Remote**, wait for completion, then click **Deploy HEAD Commit**.
5. If cPanel says deployment failed, stop and send a screenshot; do not try random commands.
6. **Do not find or edit `.htaccess`.** The text you shared already contains cPanel's `PassengerBaseURI "/"` block for this Node app. That block routes requests for the whole site, including the CMS API, to the app. There is no proxy snippet to add.
7. The block is managed by cPanel. To change its Node version, use the **Setup Node.js App** screen; do not edit the generated Passenger lines in File Manager.
8. Return to **Setup Node.js App** and click **Restart** for this app after install and deployment.

## H. Create your administrator in the browser

1. Open `https://cleanheightsinitiative.org/admin/setup`.
2. Enter the exact temporary `CMS_SETUP_KEY` you added in step F.
3. Enter your display name, email, and a new password of at least 14 characters. Retype the password and click **Create first administrator**.
4. Return to **Setup Node.js App**, remove the `CMS_SETUP_KEY` environment variable, save, and restart the app. The one-time setup is also locked after the first administrator exists.
5. Open `https://cleanheightsinitiative.org/admin` and sign in with the email and password you just created.

## After the setup

For a future code update: I push it to GitHub, then you click **Update from Remote** and **Deploy HEAD Commit** in cPanel Git Version Control. Restart the Node app if the update changes the server. Publishing a program or uploading an image in `/admin` does not require a Git deployment.

The privacy, cookie, terms, and accessibility pages are drafts and need review against the organisation's actual practices and Kenyan legal requirements. The image manager currently controls its wired page slots and program/activity images; news and milestone gallery images still need to be connected to those controls.

## If the site shows “503 Service Unavailable”

Use these two browser checks after a deployment and app restart:

1. Open `https://cleanheightsinitiative.org/api/health/live`.
   - **JSON with `"ok":true`** means the Node app started and Passenger is reaching it.
   - A **LiteSpeed 503 page** means this is still an app startup, Passenger mapping, or deployment problem. Database settings are not the next thing to change.
2. If the liveness URL returns JSON, open `https://cleanheightsinitiative.org/api/health`.
   - **JSON with `"database":"connected"`** means both app and database are reachable.
   - **JSON with `"database":"unavailable"`** means the app is running, so check the database name, username, password, host, privileges, and whether `database/schema.sql` was imported.

If the liveness URL gives a LiteSpeed page, open **cPanel → Metrics → Errors** immediately after refreshing it. Also open **Setup Node.js App** and verify that the application named `clean_heights_app` is set to Node.js **22**, application root `clean_heights_app`, startup file `startup.js`, and URL at the domain root. The Node version must match the Passenger path that cPanel generated in `.htaccess`; do not edit that block manually. In **Git Version Control → Manage → Pull or Deploy**, confirm **Update from Remote** and **Deploy HEAD Commit** both report success. The deployment must create `dist/index.js`; the deployment script now fails if that output or the built website is missing.

The browser-visible search results for filenames such as `undici-types/errors...` are package files, not application logs. Do not change database credentials based on those filenames. Share only the text of the relevant cPanel error entry or a screenshot with passwords and environment variable values hidden.
