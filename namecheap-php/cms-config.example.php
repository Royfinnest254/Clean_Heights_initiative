<?php
/*
 * Copy to the website document root as cms-config.php and fill in the
 * cPanel MySQL settings. Never commit real hosting credentials to GitHub.
 */
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'REPLACE_WITH_FULL_CPANEL_DATABASE_NAME',
    'db_user' => 'REPLACE_WITH_FULL_CPANEL_DATABASE_USERNAME',
    'db_password' => 'REPLACE_WITH_DATABASE_PASSWORD',
    // Keeps existing uploaded CMS pictures in the current cPanel Node app's storage folder.
    'media_directory' => dirname(__DIR__) . '/clean_heights_app/storage/media',
    'setup_key' => 'REPLACE_WITH_A_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS',
    'site_origin' => 'https://cleanheightsinitiative.org',
];
