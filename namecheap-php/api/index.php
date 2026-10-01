<?php
declare(strict_types=1);

/* Clean Heights CMS API for Namecheap shared hosting (PHP + MySQL). */
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store, private');

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = preg_replace('#/+#', '/', $path);
if ($path === '/api/health/live' && $method === 'GET') respond(200, ['ok' => true, 'service' => 'clean-heights']);

$root = dirname(__DIR__);
$configFile = $root . '/cms-config.php';
if (!is_file($configFile)) {
    respond(503, ['error' => 'CMS configuration is missing. Follow the setup guide to add cms-config.php.']);
}
$config = require $configFile;
if (!is_array($config) || str_starts_with((string)($config['db_name'] ?? ''), 'REPLACE_') || str_starts_with((string)($config['db_user'] ?? ''), 'REPLACE_')) {
    respond(503, ['error' => 'CMS database settings are incomplete.']);
}
$root = dirname(__DIR__);
if ($method === 'GET' && preg_match('#^/media/([A-Za-z0-9._-]{1,180})$#', $path, $mediaMatch)) {
    $base = realpath((string)($config['media_directory'] ?? ($root . '/media')));
    $file = $base ? realpath($base . DIRECTORY_SEPARATOR . $mediaMatch[1]) : false;
    if (!$base || !$file || !str_starts_with($file, $base . DIRECTORY_SEPARATOR) || !is_file($file)) respond(404, ['error' => 'Image not found.']);
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file);
    if (!in_array($mime, ['image/jpeg','image/png','image/webp','image/avif'], true)) respond(404, ['error' => 'Image not found.']);
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string)filesize($file));
    header('Cache-Control: public, max-age=604800, must-revalidate');
    readfile($file); exit;
}

try {
    $pdo = new PDO(
        'mysql:host=' . ($config['db_host'] ?? 'localhost') . ';port=' . (int)($config['db_port'] ?? 3306) . ';dbname=' . $config['db_name'] . ';charset=utf8mb4',
        (string)$config['db_user'],
        (string)$config['db_password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false]
    );
    ensure_schema($pdo);
} catch (Throwable $error) {
    error_log('Clean Heights CMS database connection failed: ' . $error->getMessage());
    respond(503, ['error' => 'The CMS database is unavailable. Check the database settings and permissions.']);
}

$body = [];
$cookieName = 'chi_admin';
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($config['site_origin'] ?? '') !== '' && str_starts_with((string)$config['site_origin'], 'https://'));

try {
    $body = request_body();
    if ($path === '/api/health' && $method === 'GET') {
        $pdo->query('SELECT 1');
        respond(200, ['ok' => true, 'database' => 'connected']);
    }
    if ($path === '/api/admin/setup-status' && $method === 'GET') {
        $count = (int)$pdo->query('SELECT COUNT(*) FROM cms_admins')->fetchColumn();
        respond(200, ['available' => strlen((string)($config['setup_key'] ?? '')) >= 32]);
    }
    if ($path === '/api/admin/setup' && $method === 'POST') {
        setup_admin($pdo, $config, $body);
    }
    if ($path === '/api/admin/login' && $method === 'POST') {
        login_admin($pdo, $body, $cookieName, $secure);
    }
    if ($path === '/api/admin/me' && $method === 'GET') {
        $session = require_admin($pdo, $cookieName);
        respond(200, ['user' => ['id' => (int)$session['user_id'], 'email' => $session['email'], 'displayName' => $session['display_name']], 'csrfToken' => $session['csrf_token']]);
    }
    if ($path === '/api/admin/logout' && $method === 'POST') {
        $session = require_admin($pdo, $cookieName, true);
        $token = request_cookie($cookieName);
        $stmt = $pdo->prepare('DELETE FROM cms_sessions WHERE token_hash=?');
        $stmt->execute([hash('sha256', $token)]);
        setcookie($cookieName, '', ['expires' => time() - 3600, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict']);
        respond(200, ['ok' => true]);
    }

    if ($path === '/api/admin/programs' && $method === 'GET') {
        require_admin($pdo, $cookieName);
        $programs = array_map(fn($row) => cast_ids($row, ['id']), $pdo->query('SELECT id,slug,title,summary,description,status,starts_on,ends_on,hero_image,updated_at FROM cms_programs ORDER BY starts_on DESC,id DESC')->fetchAll());
        $activities = array_map(fn($row) => cast_ids($row, ['id','program_id']), $pdo->query('SELECT id,program_id,title,activity_date,location,summary,description,status,image_path,updated_at FROM cms_activities ORDER BY activity_date DESC,id DESC')->fetchAll());
        respond(200, ['programs' => $programs, 'activities' => $activities]);
    }
    if ($path === '/api/admin/programs' && $method === 'POST') {
        require_admin($pdo, $cookieName, true);
        $row = program_values($body);
        $stmt = $pdo->prepare('INSERT INTO cms_programs(slug,title,summary,description,status,starts_on,ends_on,hero_image) VALUES(?,?,?,?,?,?,?,?)');
        $stmt->execute(array_values($row));
        respond(201, ['id' => (int)$pdo->lastInsertId()]);
    }
    if (preg_match('#^/api/admin/programs/(\d+)$#', $path, $match)) {
        require_admin($pdo, $cookieName, $method !== 'GET');
        $id = (int)$match[1];
        if ($method === 'PUT') {
            $row = program_values($body);
            $stmt = $pdo->prepare('UPDATE cms_programs SET slug=?,title=?,summary=?,description=?,status=?,starts_on=?,ends_on=?,hero_image=? WHERE id=?');
            $stmt->execute([...array_values($row), $id]);
            if ($stmt->rowCount() === 0 && !record_exists($pdo, 'cms_programs', $id)) respond(404, ['error' => 'Program not found.']);
            respond(200, ['ok' => true]);
        }
        if ($method === 'DELETE') {
            $stmt = $pdo->prepare('DELETE FROM cms_programs WHERE id=?');
            $stmt->execute([$id]);
            respond(200, ['ok' => true]);
        }
    }
    if ($path === '/api/admin/activities' && $method === 'POST') {
        require_admin($pdo, $cookieName, true);
        $row = activity_values($body);
        $stmt = $pdo->prepare('INSERT INTO cms_activities(program_id,title,activity_date,location,summary,description,status,image_path) VALUES(?,?,?,?,?,?,?,?)');
        $stmt->execute(array_values($row));
        respond(201, ['id' => (int)$pdo->lastInsertId()]);
    }
    if (preg_match('#^/api/admin/activities/(\d+)$#', $path, $match)) {
        require_admin($pdo, $cookieName, $method !== 'GET');
        $id = (int)$match[1];
        if ($method === 'PUT') {
            $row = activity_values($body);
            $stmt = $pdo->prepare('UPDATE cms_activities SET program_id=?,title=?,activity_date=?,location=?,summary=?,description=?,status=?,image_path=? WHERE id=?');
            $stmt->execute([...array_values($row), $id]);
            if ($stmt->rowCount() === 0 && !record_exists($pdo, 'cms_activities', $id)) respond(404, ['error' => 'Activity not found.']);
            respond(200, ['ok' => true]);
        }
        if ($method === 'DELETE') {
            $stmt = $pdo->prepare('DELETE FROM cms_activities WHERE id=?');
            $stmt->execute([$id]);
            respond(200, ['ok' => true]);
        }
    }
    if ($path === '/api/admin/media' && $method === 'GET') {
        require_admin($pdo, $cookieName);
        $media = array_map(fn($row) => cast_ids($row, ['id','width','height','bytes']), $pdo->query('SELECT id,original_name,path,alt_text,width,height,bytes,created_at FROM cms_media ORDER BY id DESC')->fetchAll());
        respond(200, ['media' => $media]);
    }
    if ($path === '/api/admin/media' && $method === 'POST') {
        require_admin($pdo, $cookieName, true);
        upload_media($pdo, $root, $config);
    }
    if (preg_match('#^/api/admin/media/(\d+)$#', $path, $match) && $method === 'PUT') {
        require_admin($pdo, $cookieName, true);
        $stmt = $pdo->prepare('UPDATE cms_media SET alt_text=? WHERE id=?');
        $stmt->execute([clean_text($body['altText'] ?? '', 300), (int)$match[1]]);
        respond(200, ['ok' => true]);
    }
    if ($path === '/api/admin/image-slots' && $method === 'GET') {
        require_admin($pdo, $cookieName);
        $slots = array_map(fn($row) => cast_ids($row, ['media_id']), $pdo->query('SELECT slot_key,media_id,alt_text FROM cms_image_slots ORDER BY slot_key')->fetchAll());
        respond(200, ['slots' => $slots]);
    }
    if (preg_match('#^/api/admin/image-slots/([^/]+)$#', $path, $match) && $method === 'PUT') {
        require_admin($pdo, $cookieName, true);
        $key = rawurldecode($match[1]);
        if (!preg_match('/^[a-z0-9][a-z0-9._-]{0,119}$/', $key)) respond(400, ['error' => 'Invalid image slot.']);
        $mediaId = !empty($body['mediaId']) ? (int)$body['mediaId'] : null;
        $stmt = $pdo->prepare('INSERT INTO cms_image_slots(slot_key,media_id,alt_text) VALUES(?,?,?) ON DUPLICATE KEY UPDATE media_id=VALUES(media_id),alt_text=VALUES(alt_text)');
        $stmt->execute([$key, $mediaId, clean_text($body['altText'] ?? '', 300)]);
        respond(200, ['ok' => true]);
    }
    if ($path === '/api/admin/site-assets' && $method === 'GET') {
        require_admin($pdo, $cookieName);
        $manifestFile = $root . '/site-image-manifest.json';
        $manifest = is_file($manifestFile) ? json_decode((string)file_get_contents($manifestFile), true) : [];
        $rows = $pdo->query('SELECT o.source_path,o.media_id,o.alt_text,m.path AS media_path FROM cms_asset_overrides o LEFT JOIN cms_media m ON m.id=o.media_id')->fetchAll();
        $overrides = [];
        foreach ($rows as $row) $overrides[$row['source_path']] = $row;
        foreach ($manifest as &$asset) {
            $override = $overrides[$asset['path']] ?? null;
            $asset['media_id'] = $override ? (int)$override['media_id'] : null;
            $asset['media_path'] = $override['media_path'] ?? null;
            $asset['alt_text'] = $override['alt_text'] ?? '';
        }
        unset($asset);
        respond(200, ['assets' => $manifest]);
    }
    if ($path === '/api/admin/site-assets' && $method === 'PUT') {
        require_admin($pdo, $cookieName, true);
        $sourcePath = clean_text($body['sourcePath'] ?? '', 500);
        $mediaId = !empty($body['mediaId']) ? (int)$body['mediaId'] : null;
        if (!str_starts_with($sourcePath, '/') || str_contains($sourcePath, '..') || !preg_match('/\.(jpe?g|png|webp|avif)$/i', $sourcePath)) throw new HttpError(400, 'Choose a photo from the site photo list.');
        $stmt = $pdo->prepare('INSERT INTO cms_asset_overrides(source_path,media_id,alt_text) VALUES(?,?,?) ON DUPLICATE KEY UPDATE media_id=VALUES(media_id),alt_text=VALUES(alt_text)');
        $stmt->execute([$sourcePath,$mediaId,clean_text($body['altText'] ?? '',300)]);
        respond(200, ['ok' => true]);
    }
    if ($path === '/api/admin/news' && $method === 'GET') {
        require_admin($pdo, $cookieName);
        $posts = $pdo->query('SELECT id,slug,title,excerpt,content,author,display_date,category,image_path,status,created_at,updated_at FROM cms_news_posts ORDER BY id DESC')->fetchAll();
        foreach ($posts as &$post) {
            $post['id'] = (int)$post['id'];
            $stmt = $pdo->prepare('SELECT image_path FROM cms_news_gallery WHERE post_id=? ORDER BY position,id');
            $stmt->execute([$post['id']]);
            $post['gallery'] = array_column($stmt->fetchAll(), 'image_path');
        }
        unset($post);
        respond(200, ['posts' => $posts]);
    }
    if ($path === '/api/admin/news' && $method === 'POST') {
        require_admin($pdo, $cookieName, true);
        $values = news_values($body);
        save_news($pdo, $values, null);
    }
    if (preg_match('#^/api/admin/news/(\d+)$#', $path, $match)) {
        require_admin($pdo, $cookieName, true);
        $id = (int)$match[1];
        if ($method === 'PUT') {
            $values = news_values($body);
            save_news($pdo, $values, $id);
        }
        if ($method === 'DELETE') {
            $stmt = $pdo->prepare('DELETE FROM cms_news_posts WHERE id=?'); $stmt->execute([$id]);
            respond(200, ['ok' => true]);
        }
    }
    if ($path === '/api/programs' && $method === 'GET') {
        header('Cache-Control: no-cache, must-revalidate');
        $programs = array_map(fn($row) => cast_ids($row, ['id']), $pdo->query("SELECT p.id,p.slug,p.title,p.summary,p.description,p.starts_on,p.ends_on,p.hero_image,m.alt_text AS hero_alt FROM cms_programs p LEFT JOIN cms_media m ON m.path=p.hero_image WHERE p.status='published' ORDER BY p.starts_on DESC,p.id DESC")->fetchAll());
        $activities = array_map(fn($row) => cast_ids($row, ['id','program_id']), $pdo->query("SELECT a.id,a.program_id,a.title,a.activity_date,a.location,a.summary,a.description,a.image_path,m.alt_text AS image_alt FROM cms_activities a LEFT JOIN cms_media m ON m.path=a.image_path WHERE a.status='published' ORDER BY a.activity_date DESC,a.id DESC")->fetchAll());
        foreach ($programs as &$program) $program['activities'] = array_values(array_filter($activities, fn($a) => $a['program_id'] !== null && (int)$a['program_id'] === (int)$program['id']));
        unset($program);
        respond(200, ['programs' => $programs, 'standaloneActivities' => array_values(array_filter($activities, fn($a) => $a['program_id'] === null))]);
    }
    if ($path === '/api/site-images' && $method === 'GET') {
        header('Cache-Control: no-cache, must-revalidate');
        $rows = $pdo->query('SELECT s.slot_key,m.path,s.alt_text FROM cms_image_slots s JOIN cms_media m ON m.id=s.media_id')->fetchAll();
        $images = [];
        foreach ($rows as $row) $images[$row['slot_key']] = ['src' => $row['path'], 'alt' => $row['alt_text']];
        $assetRows = $pdo->query('SELECT o.source_path,m.path,o.alt_text FROM cms_asset_overrides o JOIN cms_media m ON m.id=o.media_id')->fetchAll();
        $assets = [];
        foreach ($assetRows as $row) $assets[$row['source_path']] = ['src' => $row['path'], 'alt' => $row['alt_text']];
        respond(200, ['images' => $images, 'assets' => $assets]);
    }
    if ($path === '/api/news' && $method === 'GET') {
        header('Cache-Control: no-cache, must-revalidate');
        $limit = max(1, min(30, (int)($_GET['limit'] ?? 30)));
        $stmt = $pdo->prepare("SELECT id,slug,title,excerpt,author,display_date AS date,category,image_path AS image FROM cms_news_posts WHERE status='published' ORDER BY id DESC LIMIT ?");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT); $stmt->execute();
        $posts = array_map(fn($row) => cast_ids($row, ['id']), $stmt->fetchAll());
        respond(200, ['posts' => $posts]);
    }
    if (preg_match('#^/api/news/([^/]+)$#', $path, $match) && $method === 'GET') {
        header('Cache-Control: no-cache, must-revalidate');
        $stmt = $pdo->prepare("SELECT id,slug,title,excerpt,content,author,display_date AS date,category,image_path AS image FROM cms_news_posts WHERE slug=? AND status='published' LIMIT 1");
        $stmt->execute([clean_text($match[1],180)]); $post = $stmt->fetch();
        if (!$post) respond(404, ['error' => 'Story not found.']);
        $post['id'] = (int)$post['id'];
        $gallery = $pdo->prepare('SELECT image_path FROM cms_news_gallery WHERE post_id=? ORDER BY position,id'); $gallery->execute([$post['id']]);
        $post['gallery'] = array_column($gallery->fetchAll(), 'image_path');
        respond(200, ['post' => $post]);
    }
    respond(404, ['error' => 'API route not found.']);
} catch (HttpError $error) {
    respond($error->status, ['error' => $error->getMessage()]);
} catch (Throwable $error) {
    error_log('Clean Heights API error at ' . $path . ': ' . $error->getMessage());
    respond(500, ['error' => 'The request could not be completed. Try again, and contact the site administrator if it continues.']);
}

function respond(int $status, array $data): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function ensure_schema(PDO $pdo): void {
    // Non-destructive bootstrap: only create missing tables; existing rows stay.
    $required = ['cms_admins','cms_sessions','cms_login_attempts','cms_programs','cms_activities','cms_media','cms_image_slots','cms_asset_overrides','cms_news_posts','cms_news_gallery','cms_system_settings'];
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME IN (' . implode(',', array_fill(0, count($required), '?')) . ')');
    $stmt->execute($required);
    if ((int)$stmt->fetchColumn() === count($required)) { import_news_seed($pdo, dirname(__DIR__) . '/data/news-import.json'); return; }
    $statements = [
        "CREATE TABLE IF NOT EXISTS cms_admins (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,email VARCHAR(254) NOT NULL UNIQUE,display_name VARCHAR(160) NOT NULL,password_hash VARCHAR(180) NOT NULL,active TINYINT(1) NOT NULL DEFAULT 1,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_sessions (token_hash CHAR(64) NOT NULL PRIMARY KEY,user_id BIGINT UNSIGNED NOT NULL,csrf_token CHAR(43) NOT NULL,expires_at DATETIME NOT NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,INDEX cms_sessions_expiry(expires_at),CONSTRAINT cms_sessions_admin_fk FOREIGN KEY(user_id) REFERENCES cms_admins(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_login_attempts (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,email_hash CHAR(64) NOT NULL,ip_hash CHAR(64) NOT NULL,succeeded TINYINT(1) NOT NULL DEFAULT 0,attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,INDEX cms_login_rate(email_hash,ip_hash,succeeded,attempted_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_programs (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,slug VARCHAR(150) NOT NULL UNIQUE,title VARCHAR(180) NOT NULL,summary VARCHAR(500) NOT NULL DEFAULT '',description MEDIUMTEXT NOT NULL,status ENUM('draft','published') NOT NULL DEFAULT 'draft',starts_on DATE NULL,ends_on DATE NULL,hero_image VARCHAR(500) NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,INDEX cms_program_publication(status,starts_on)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_activities (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,program_id BIGINT UNSIGNED NULL,title VARCHAR(180) NOT NULL,activity_date DATE NULL,location VARCHAR(180) NOT NULL DEFAULT '',summary VARCHAR(500) NOT NULL DEFAULT '',description MEDIUMTEXT NOT NULL,status ENUM('draft','published') NOT NULL DEFAULT 'draft',image_path VARCHAR(500) NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,INDEX cms_activity_program(program_id,status,activity_date),INDEX cms_activity_publication(status,activity_date),CONSTRAINT cms_activity_program_fk FOREIGN KEY(program_id) REFERENCES cms_programs(id) ON DELETE SET NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_media (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,original_name VARCHAR(240) NOT NULL,path VARCHAR(500) NOT NULL UNIQUE,alt_text VARCHAR(300) NOT NULL DEFAULT '',width INT UNSIGNED NOT NULL,height INT UNSIGNED NOT NULL,bytes INT UNSIGNED NOT NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_image_slots (slot_key VARCHAR(120) NOT NULL PRIMARY KEY,media_id BIGINT UNSIGNED NULL,alt_text VARCHAR(300) NOT NULL DEFAULT '',updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,CONSTRAINT cms_image_slot_media_fk FOREIGN KEY(media_id) REFERENCES cms_media(id) ON DELETE SET NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_asset_overrides (source_path VARCHAR(500) NOT NULL PRIMARY KEY,media_id BIGINT UNSIGNED NULL,alt_text VARCHAR(300) NOT NULL DEFAULT '',updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,CONSTRAINT cms_asset_override_media_fk FOREIGN KEY(media_id) REFERENCES cms_media(id) ON DELETE SET NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_news_posts (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,slug VARCHAR(180) NOT NULL UNIQUE,title VARCHAR(180) NOT NULL,excerpt VARCHAR(600) NOT NULL DEFAULT '',content MEDIUMTEXT NOT NULL,author VARCHAR(160) NOT NULL DEFAULT '',display_date VARCHAR(80) NOT NULL DEFAULT '',category VARCHAR(100) NOT NULL DEFAULT '',image_path VARCHAR(500) NULL,status ENUM('draft','published') NOT NULL DEFAULT 'draft',created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,INDEX cms_news_publication(status,created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_news_gallery (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,post_id BIGINT UNSIGNED NOT NULL,image_path VARCHAR(500) NOT NULL,position SMALLINT UNSIGNED NOT NULL DEFAULT 0,INDEX cms_news_gallery_order(post_id,position),CONSTRAINT cms_news_gallery_post_fk FOREIGN KEY(post_id) REFERENCES cms_news_posts(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS cms_system_settings (setting_key VARCHAR(120) NOT NULL PRIMARY KEY,setting_value TEXT NOT NULL,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    ];
    foreach ($statements as $sql) $pdo->exec($sql);
    import_news_seed($pdo, dirname(__DIR__) . '/data/news-import.json');
}
function import_news_seed(PDO $pdo, string $seedPath): void {
    if ((string)$pdo->query("SELECT setting_value FROM cms_system_settings WHERE setting_key='legacy_news_seed_imported'")->fetchColumn() === '1') return;
    if (!is_file($seedPath) || (int)$pdo->query('SELECT COUNT(*) FROM cms_news_posts')->fetchColumn() > 0) {
        $pdo->exec("INSERT INTO cms_system_settings(setting_key,setting_value) VALUES('legacy_news_seed_imported','1') ON DUPLICATE KEY UPDATE setting_value='1'");
        return;
    }
    $items = json_decode((string)file_get_contents($seedPath), true);
    if (!is_array($items)) return;
    $insert = $pdo->prepare('INSERT IGNORE INTO cms_news_posts(slug,title,excerpt,content,author,display_date,category,image_path,status) VALUES(?,?,?,?,?,?,?,?,?)');
    $galleryInsert = $pdo->prepare('INSERT INTO cms_news_gallery(post_id,image_path,position) VALUES(?,?,?)');
    foreach ($items as $item) {
        if (!is_array($item) || empty($item['title'])) continue;
        $title = clean_text($item['title'], 180);
        $slug = slugify(clean_text($item['slug'] ?? $title, 180));
        if ($slug === '') continue;
        $insert->execute([$slug,$title,clean_text($item['excerpt'] ?? '',600),clean_text($item['content'] ?? ''),clean_text($item['author'] ?? '',160),clean_text($item['date'] ?? '',80),clean_text($item['category'] ?? '',100),legacy_blog_image(clean_text($item['image'] ?? '',500)) ?: null,'published']);
        $postId = (int)$pdo->lastInsertId();
        if ($postId && is_array($item['gallery'] ?? null)) foreach (array_slice($item['gallery'],0,20) as $position=>$image) $galleryInsert->execute([$postId,legacy_blog_image(clean_text($image,500)),$position]);
    }
    $pdo->exec("INSERT INTO cms_system_settings(setting_key,setting_value) VALUES('legacy_news_seed_imported','1') ON DUPLICATE KEY UPDATE setting_value='1'");
}
function request_body(): array {
    if (str_starts_with(strtolower((string)($_SERVER['CONTENT_TYPE'] ?? '')), 'multipart/form-data')) return [];
    $raw = file_get_contents('php://input') ?: '';
    if (strlen($raw) > 1048576) throw new HttpError(413, 'Request is too large.');
    if ($raw === '') return [];
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) throw new HttpError(400, 'Invalid JSON request.');
    return $decoded;
}
function clean_text(mixed $value, int $max = 20000): string {
    $text = trim((string)($value ?? ''));
    return function_exists('mb_substr') ? mb_substr($text, 0, $max, 'UTF-8') : substr($text, 0, $max);
}
function cast_ids(array $row, array $fields): array { foreach ($fields as $key) if (array_key_exists($key, $row) && $row[$key] !== null) $row[$key] = (int)$row[$key]; return $row; }
function request_cookie(string $key): string { return (string)($_COOKIE[$key] ?? ''); }
function require_admin(PDO $pdo, string $cookieName, bool $requireCsrf = false): array {
    $token = request_cookie($cookieName);
    if ($token === '' || strlen($token) > 200) throw new HttpError(401, 'Please sign in to continue.');
    $stmt = $pdo->prepare('SELECT s.user_id,s.csrf_token,u.display_name,u.email FROM cms_sessions s JOIN cms_admins u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP() AND u.active=1 LIMIT 1');
    $stmt->execute([hash('sha256', $token)]);
    $session = $stmt->fetch();
    if (!$session) throw new HttpError(401, 'Please sign in to continue.');
    if ($requireCsrf && !hash_equals((string)$session['csrf_token'], (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''))) throw new HttpError(403, 'The security token expired. Refresh the page and try again.');
    return $session;
}
function setup_admin(PDO $pdo, array $config, array $body): never {
    $setupKey = (string)($config['setup_key'] ?? '');
    $supplied = (string)($body['setupKey'] ?? '');
    $ipHash = hash('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $setupHash = hash('sha256', 'clean-heights-admin-setup');
    $rate = $pdo->prepare('SELECT COUNT(*) FROM cms_login_attempts WHERE email_hash=? AND ip_hash=? AND succeeded=0 AND attempted_at>UTC_TIMESTAMP()-INTERVAL 15 MINUTE');
    $rate->execute([$setupHash, $ipHash]);
    if ((int)$rate->fetchColumn() >= 5) throw new HttpError(429, 'Too many setup attempts. Wait 15 minutes before trying again.');
    if (strlen($setupKey) < 32 || strlen($supplied) > 256 || !hash_equals($setupKey, $supplied)) {
        $failed = $pdo->prepare('INSERT INTO cms_login_attempts(email_hash,ip_hash,succeeded) VALUES(?,?,0)');
        $failed->execute([$setupHash, $ipHash]);
        throw new HttpError(403, 'The setup key does not match the key in cms-config.php.');
    }
    $email = strtolower(clean_text($body['email'] ?? '', 254));
    $name = clean_text($body['displayName'] ?? '', 160);
    $password = (string)($body['password'] ?? '');
    $nameLength = function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $nameLength < 2 || strlen($password) < 14 || strlen($password) > 72) throw new HttpError(400, 'Enter a valid email, name of at least 2 characters, and password between 14 and 72 characters.');
    $pdo->beginTransaction();
    try {
        $users = $pdo->query('SELECT id,email FROM cms_admins ORDER BY id')->fetchAll();
        if (!$users) {
            $stmt = $pdo->prepare('INSERT INTO cms_admins(email,display_name,password_hash,active) VALUES(?,?,?,1)');
            $stmt->execute([$email, $name, password_hash($password, PASSWORD_DEFAULT)]);
        } else {
            $existing = null;
            foreach ($users as $user) if (strtolower($user['email']) === $email) $existing = $user;
            // A private, high-entropy setup key permits account recovery while
            // preserving the existing admin row and all CMS content.
            if (!$existing) $existing = $users[0];
            $stmt = $pdo->prepare('UPDATE cms_admins SET email=?,display_name=?,password_hash=?,active=1 WHERE id=?');
            $stmt->execute([$email, $name, password_hash($password, PASSWORD_DEFAULT), $existing['id']]);
            $stmt = $pdo->prepare('DELETE FROM cms_sessions WHERE user_id=?');
            $stmt->execute([$existing['id']]);
        }
        $pdo->commit();
        $pdo->exec("DELETE FROM cms_login_attempts WHERE attempted_at<UTC_TIMESTAMP()-INTERVAL 2 DAY");
    } catch (Throwable $error) { if ($pdo->inTransaction()) $pdo->rollBack(); throw $error; }
    respond(201, ['ok' => true, 'message' => 'Administrator password saved. Remove the setup key from cms-config.php after setup, then sign in.']);
}
function login_admin(PDO $pdo, array $body, string $cookieName, bool $secure): never {
    $email = strtolower(clean_text($body['email'] ?? '', 254));
    $password = (string)($body['password'] ?? '');
    if ($email === '' || $password === '' || strlen($password) > 1024) throw new HttpError(400, 'Enter your email and password.');
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $emailHash = hash('sha256', $email);
    $ipHash = hash('sha256', $ip);
    $limit = $pdo->prepare('SELECT COUNT(*) FROM cms_login_attempts WHERE email_hash=? AND ip_hash=? AND succeeded=0 AND attempted_at>UTC_TIMESTAMP()-INTERVAL 15 MINUTE');
    $limit->execute([$emailHash, $ipHash]);
    if ((int)$limit->fetchColumn() >= 8) throw new HttpError(429, 'Too many sign-in attempts. Wait 15 minutes and try again.');
    $stmt = $pdo->prepare('SELECT id,email,display_name,password_hash FROM cms_admins WHERE email=? AND active=1 LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    $valid = $user && password_verify($password, (string)$user['password_hash']);
    $attempt = $pdo->prepare('INSERT INTO cms_login_attempts(email_hash,ip_hash,succeeded) VALUES(?,?,?)');
    $attempt->execute([$emailHash, $ipHash, $valid ? 1 : 0]);
    if (!$valid) throw new HttpError(401, 'Email or password is incorrect.');
    $token = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
    $csrf = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
    $expires = gmdate('Y-m-d H:i:s', time() + 28800);
    $stmt = $pdo->prepare('INSERT INTO cms_sessions(token_hash,user_id,csrf_token,expires_at) VALUES(?,?,?,?)');
    $stmt->execute([hash('sha256', $token), $user['id'], $csrf, $expires]);
    setcookie($cookieName, $token, ['expires' => time() + 28800, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict']);
    respond(200, ['user' => ['email' => $user['email'], 'displayName' => $user['display_name']], 'csrfToken' => $csrf]);
}
function program_values(array $body): array {
    $title = clean_text($body['title'] ?? '', 180);
    $slug = slugify(clean_text($body['slug'] ?? $title, 180));
    $start = empty($body['startsOn']) ? null : (string)$body['startsOn'];
    $end = empty($body['endsOn']) ? null : (string)$body['endsOn'];
    if ($title === '' || $slug === '' || !valid_date($start) || !valid_date($end) || ($start && $end && $end < $start)) throw new HttpError(400, 'Enter a title, valid dates, and an end date after the start date.');
    return ['slug'=>$slug,'title'=>$title,'summary'=>clean_text($body['summary'] ?? '',500),'description'=>clean_text($body['description'] ?? ''),'status'=>($body['status'] ?? '') === 'published' ? 'published' : 'draft','startsOn'=>$start,'endsOn'=>$end,'heroImage'=>clean_text($body['heroImage'] ?? '',500) ?: null];
}
function activity_values(array $body): array {
    $title = clean_text($body['title'] ?? '',180);
    $date = empty($body['activityDate']) ? null : (string)$body['activityDate'];
    $programId = empty($body['programId']) ? null : (int)$body['programId'];
    if ($title === '' || !valid_date($date) || ($programId !== null && $programId < 1)) throw new HttpError(400, 'Enter a title and valid date/program.');
    return ['programId'=>$programId,'title'=>$title,'activityDate'=>$date,'location'=>clean_text($body['location'] ?? '',180),'summary'=>clean_text($body['summary'] ?? '',500),'description'=>clean_text($body['description'] ?? ''),'status'=>($body['status'] ?? '') === 'published' ? 'published' : 'draft','imagePath'=>clean_text($body['imagePath'] ?? '',500) ?: null];
}
function news_values(array $body): array {
    $title = clean_text($body['title'] ?? '',180); $slug = slugify(clean_text($body['slug'] ?? $title,180));
    if ($title === '' || $slug === '') throw new HttpError(400, 'Enter a story title.');
    $gallery = is_array($body['gallery'] ?? null) ? array_slice(array_values(array_unique(array_filter(array_map(fn($v) => clean_text($v,500), $body['gallery'])))), 0, 20) : [];
    return ['slug'=>$slug,'title'=>$title,'excerpt'=>clean_text($body['excerpt'] ?? '',600),'content'=>clean_text($body['content'] ?? ''),'author'=>clean_text($body['author'] ?? '',160),'date'=>clean_text($body['date'] ?? '',80),'category'=>clean_text($body['category'] ?? '',100),'image'=>clean_text($body['image'] ?? '',500) ?: null,'status'=>($body['status'] ?? '') === 'published' ? 'published' : 'draft','gallery'=>$gallery];
}
function save_news(PDO $pdo, array $values, ?int $id): never {
    $pdo->beginTransaction();
    try {
        if ($id === null) {
            $stmt = $pdo->prepare('INSERT INTO cms_news_posts(slug,title,excerpt,content,author,display_date,category,image_path,status) VALUES(?,?,?,?,?,?,?,?,?)');
            $stmt->execute([$values['slug'],$values['title'],$values['excerpt'],$values['content'],$values['author'],$values['date'],$values['category'],$values['image'],$values['status']]);
            $id = (int)$pdo->lastInsertId();
        } else {
            $stmt = $pdo->prepare('UPDATE cms_news_posts SET slug=?,title=?,excerpt=?,content=?,author=?,display_date=?,category=?,image_path=?,status=? WHERE id=?');
            $stmt->execute([$values['slug'],$values['title'],$values['excerpt'],$values['content'],$values['author'],$values['date'],$values['category'],$values['image'],$values['status'],$id]);
            if ($stmt->rowCount() === 0 && !record_exists($pdo,'cms_news_posts',$id)) throw new HttpError(404,'Story not found.');
            $stmt = $pdo->prepare('DELETE FROM cms_news_gallery WHERE post_id=?'); $stmt->execute([$id]);
        }
        $gallery = $pdo->prepare('INSERT INTO cms_news_gallery(post_id,image_path,position) VALUES(?,?,?)');
        foreach ($values['gallery'] as $position => $image) $gallery->execute([$id,$image,$position]);
        $pdo->commit();
    } catch (Throwable $error) { if ($pdo->inTransaction()) $pdo->rollBack(); throw $error; }
    respond($id && isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST' ? 201 : 200, ['ok'=>true,'id'=>$id]);
}
function valid_date(?string $date): bool {
    if ($date === null || $date === '') return true;
    $d = DateTime::createFromFormat('!Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}
function slugify(string $text): string {
    $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text) ?: $text;
    return substr(trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($ascii)) ?? '', '-'), 0, 140);
}
function legacy_blog_image(string $image): string {
    if (preg_match('#^images/[a-zA-Z0-9._-]+$#', $image)) return 'https://blog.cleanheightsinitiative.org/' . $image;
    return $image;
}
function record_exists(PDO $pdo, string $table, int $id): bool {
    if (!in_array($table, ['cms_programs','cms_activities','cms_news_posts'], true)) return false;
    $stmt = $pdo->prepare("SELECT 1 FROM $table WHERE id=? LIMIT 1"); $stmt->execute([$id]); return (bool)$stmt->fetchColumn();
}
function upload_media(PDO $pdo, string $root, array $config): never {
    $file = $_FILES['image'] ?? null;
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) throw new HttpError(400, 'Choose an image up to 8 MB to upload.');
    if ((int)$file['size'] > 8 * 1024 * 1024) throw new HttpError(413, 'Images must be 8 MB or smaller.');
    $finfo = new finfo(FILEINFO_MIME_TYPE); $mime = $finfo->file($file['tmp_name']);
    $allowed = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/avif'=>'avif'];
    if (!isset($allowed[$mime])) throw new HttpError(415, 'Upload a JPEG, PNG, WebP, or AVIF image.');
    $size = @getimagesize($file['tmp_name']);
    if (!$size || ($size[0] * $size[1]) > 40000000) throw new HttpError(400, 'The image is invalid or too large to process.');
    $dir = (string)($config['media_directory'] ?? ($root . '/media')); if (!is_dir($dir) && !mkdir($dir, 0755, true)) throw new HttpError(500, 'The image storage folder could not be created.');
    $id = bin2hex(random_bytes(16)); $extension = $allowed[$mime]; $path = '/media/' . $id . '.' . $extension; $target = rtrim($dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $id . '.' . $extension;
    $width = (int)$size[0]; $height = (int)$size[1];
    if (class_exists('Imagick')) {
        try {
            $image = new Imagick($file['tmp_name']);
            if (method_exists($image, 'autoOrient')) $image->autoOrient();
            $image->thumbnailImage(2400, 1800, true, true);
            if ($mime !== 'image/avif') { $image->setImageFormat('webp'); $image->setImageCompressionQuality(82); $path = '/media/' . $id . '.webp'; $target = rtrim($dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $id . '.webp'; }
            $width = $image->getImageWidth(); $height = $image->getImageHeight(); $image->writeImage($target); $image->clear(); $image->destroy();
        } catch (Throwable $error) { error_log('Clean Heights image optimization failed: ' . $error->getMessage()); if (!move_uploaded_file($file['tmp_name'], $target)) throw new HttpError(500, 'The image could not be saved.'); }
    } elseif (!move_uploaded_file($file['tmp_name'], $target)) throw new HttpError(500, 'The image could not be saved.');
    $bytes = is_file($target) ? (int)filesize($target) : 0;
    $original = basename((string)$file['name']);
    $stmt = $pdo->prepare('INSERT INTO cms_media(original_name,path,alt_text,width,height,bytes) VALUES(?,?,?,?,?,?)');
    $stmt->execute([clean_text($original,240),$path,clean_text($_POST['altText'] ?? '',300),$width,$height,$bytes]);
    respond(201, ['id'=>(int)$pdo->lastInsertId(),'path'=>$path,'width'=>$width,'height'=>$height]);
}
class HttpError extends RuntimeException { public function __construct(public int $status, string $message) { parent::__construct($message); } }
