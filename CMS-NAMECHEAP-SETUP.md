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
3. Select **Node.js 22** if available and **Production** mode.
4. Enter `clean_heights_app` as **Application root**. It must exactly match the repository path above.
5. For **Application URL**, choose the domain `cleanheightsinitiative.org` and an unused path such as `cms-engine` if the form requires a path. This is the Node app's cPanel route; the public API will be connected separately in step G.
6. Enter `startup.js` as the **Application startup file**. This small file starts the built server after the first deployment.
7. Click **Create**. Leave the app details page open.

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

On that same Node app page, click **Run NPM Install**. Wait for it to finish. The repository includes an `.npmrc` setting that handles the older dependency peer range, so there should be no extra command to type. If cPanel displays a red error, stop and send a screenshot with secrets hidden.

## G. Deploy the website and connect the API

1. Return to **Git Version Control** in cPanel.
2. Find `clean_heights_app` and click **Manage**.
3. Open **Pull or Deploy**.
4. Click **Update from Remote**, wait for completion, then click **Deploy HEAD Commit**.
5. If cPanel says deployment failed, stop and send a screenshot; do not try random commands.
6. Open **File Manager**. In its settings enable **Show Hidden Files** if `.htaccess` is not visible.
7. Open `public_html/.htaccess` and make a copy/download before editing. Keep the existing contents.
8. Open the repository file `client/public/.htaccess.cms-proxy.example` in GitHub. Copy these two rules into `public_html/.htaccess` after the HTTPS redirect and before the SPA fallback. Replace `12345` with the port displayed in **Setup Node.js App**:

   ```apache
   RewriteCond %{REQUEST_URI} ^/(api|media)(/|$)
   RewriteRule ^(api|media)(/.*)?$ http://127.0.0.1:12345/$1$2 [P,L]
   ```

9. Save `.htaccess`. Return to **Setup Node.js App** and click **Restart** for this app.

## H. Create your administrator in the browser

1. Open `https://cleanheightsinitiative.org/admin/setup`.
2. Enter the exact temporary `CMS_SETUP_KEY` you added in step F.
3. Enter your display name, email, and a new password of at least 14 characters. Retype the password and click **Create first administrator**.
4. Return to **Setup Node.js App**, remove the `CMS_SETUP_KEY` environment variable, save, and restart the app. The one-time setup is also locked after the first administrator exists.
5. Open `https://cleanheightsinitiative.org/admin` and sign in with the email and password you just created.

## After the setup

For a future code update: I push it to GitHub, then you click **Update from Remote** and **Deploy HEAD Commit** in cPanel Git Version Control. Restart the Node app if the update changes the server. Publishing a program or uploading an image in `/admin` does not require a Git deployment.

The privacy, cookie, terms, and accessibility pages are drafts and need review against the organisation's actual practices and Kenyan legal requirements. The image manager currently controls its wired page slots and program/activity images; news and milestone gallery images still need to be connected to those controls.
