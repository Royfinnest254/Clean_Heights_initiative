# Clean Heights website: upload and content guide

This guide is for using cPanel in a web browser. It does not require a terminal.

## 1. Upload the website ZIP in cPanel File Manager

Do this only after the website's Node.js application and database have already been created. The ZIP is the application files; uploading it does not create the database or configure the Node.js app by itself.

1. Sign in to Namecheap, open **Hosting List**, then click **Go to cPanel** for this hosting plan.
2. In cPanel search, open **Setup Node.js App**. Find the Clean Heights app and note the exact **Application root** shown there (for example, `clean_heights_app`). Do not guess this folder.
3. In cPanel search, open **File Manager**. In the left folder list, open the folder matching that **Application root**. It is commonly under your account's home folder, outside `public_html`. Use `public_html` only if Setup Node.js App explicitly shows that as the application root.
4. Before replacing anything, keep a backup of the current application files. In File Manager, select the app files and use **Compress** to make a ZIP, or keep the Home Directory backup you previously downloaded in a safe place.
5. Click **Upload** at the top of File Manager, then **Select File**. On your computer choose the updated Clean Heights ZIP from **Downloads**. Wait for the upload progress to reach 100%.
6. Return to the application-root folder. Select the uploaded ZIP and click **Extract**. Confirm the destination is the same application-root folder. If asked whether to overwrite the app's code files, choose **Overwrite**.
7. Keep the app's existing environment variables in cPanel. Keep the existing `storage` folder because that is where CMS-uploaded images are stored. Do not import `database/schema.sql` again if the live CMS database already has data.
8. In cPanel search, open **Setup Node.js App**, open the Clean Heights app, use **Run NPM Install** if cPanel shows it, then click **Restart**. Wait for the restart to finish.
9. In a new browser tab open `https://cleanheightsinitiative.org/api/health/live`. It should show JSON containing `"ok":true`. Then open `https://cleanheightsinitiative.org/api/health`; the database should show as connected. If either page shows a LiteSpeed 503 or an error, stop there and share a screenshot with passwords and environment-variable values hidden.

**Important:** if this cPanel app is also connected to GitHub, a later **Deploy HEAD Commit** can replace files uploaded manually. Keep the GitHub `main` branch in sync with the ZIP before using Git deployment again. The ZIP does not contain your database password, admin password, environment variables, `node_modules`, or previously uploaded `storage` media.

## 2. Open the content portal

- In a browser, open `https://cleanheightsinitiative.org/admin`.
- If you have already created your administrator, enter its email and password and click **Sign in**.
- If you have not created the first administrator yet, open `https://cleanheightsinitiative.org/admin/setup` once. Enter the temporary setup key from the Node app's `CMS_SETUP_KEY` environment variable, your display name, the email you want to use to sign in, and a unique password. Click **Create first administrator**. After that succeeds, remove `CMS_SETUP_KEY` from the cPanel Node app environment variables and restart the app. Then sign in at `/admin`.
- The email entered on `/admin/setup` is the **administrator login email**. It does not change the public contact email displayed on the website. The public contact email is currently fixed in the page content and is not an editable CMS field.

## 3. Add a program and place activities inside it

1. Sign in at `/admin` and select **Programs**.
2. Click **New program**.
3. Fill in the title, a short summary, and a clear description. The URL slug can be left blank; it is generated from the title. Add start and end dates when known.
4. For a cover image, first go to **Images & slots**, upload the picture, and give it useful alternative text. Return to **Programs** and choose that image in **Cover image**.
5. Leave **Publication** as **Draft** while preparing the page. Click **Save program**. Edit it later to make corrections.
6. When the program is ready, choose **Published** and save it. A published parent program is needed for its activities to appear publicly.
7. On the program's card in the Programs list, click **+ Add activity**. The portal opens the Activities form with that program already selected as the parent.
8. Enter the activity title, date, location, short summary, and a fuller description. If you want a photo, upload it first in **Images & slots**, then select it under **Image**.
9. Choose **Published** and click **Save activity**. Repeat **+ Add activity** for each activity in the same program. Visitors see these grouped under that program, and can click **Read activity details** to expand each activity.

To publish an activity on its own, open **Activities**, click **New activity**, and keep **Parent program** set to **Standalone activity**. Then fill it in and publish it.

## 4. Update a program, activity, or image

- **Edit text/dates:** open **Programs** or **Activities**, find its card, click **Edit program** or **Edit**, change the fields, and click the save button.
- **Change a program/activity image:** upload the replacement in **Images & slots**, then edit the relevant program or activity and choose the new image.
- **Replace a wired site image:** open **Images & slots**, upload the image, choose the matching **Public image slot**, choose the replacement from **Image**, then click **Save slot**. This applies only to image slots connected to the page. It does not currently replace every news or milestone-gallery photograph.
- **Delete:** click **Delete** beside the item and confirm. Deleting a program detaches its activities; review them under Activities afterward.
- **Sign out:** click **Sign out** in the top-right corner of the content portal.

## What the current portal does not edit

The portal manages programs, activities, uploaded media, and the image slots wired into page templates. It does not yet manage the public contact email, all news/blog story text and photos, or every milestone-gallery photo. Those remain fixed in the website files. Do not change an environment variable or database record to try to edit those items.

The privacy, cookies, terms, and accessibility pages are drafts that need review against the organisation's actual practices and Kenyan legal requirements. This guide cannot guarantee legal compliance or search rankings.
