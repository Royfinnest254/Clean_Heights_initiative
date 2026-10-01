# Namecheap cPanel deployment

This is the current deployment approach for Clean Heights Initiative. Build the website ZIP on a computer, then upload and extract it in the domain's document root using cPanel File Manager. The public website uses static files and a PHP/MySQL CMS API; no cPanel terminal, Node app, or server-side `npm install` is needed to serve the public website.

Follow the beginner-friendly, click-by-click instructions in [NAMECHEAP-PHP-DEPLOYMENT.md](NAMECHEAP-PHP-DEPLOYMENT.md). Do not follow older Node.js deployment instructions for this release.

To produce the upload ZIP from this repository, install the project dependencies on a computer and run `npm run build:namecheap-php`. The generated file is `namecheap-php/Clean_Heights_Namecheap_Upload.zip`. The ZIP intentionally does not contain the live database password or `cms-config.php`; enter database credentials privately in cPanel File Manager after extraction.
