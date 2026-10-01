<?php
declare(strict_types=1);
$origin = 'https://cleanheightsinitiative.org';
$routes = ['/', '/about', '/team', '/milestones', '/programs', '/news', '/contact', '/ecotourism', '/privacy', '/cookies', '/terms', '/accessibility'];
$stories = [];
try {
    $configFile = __DIR__ . '/cms-config.php';
    if (is_file($configFile)) {
        $config = require $configFile;
        if (is_array($config) && !empty($config['db_name']) && !str_starts_with((string)$config['db_name'], 'REPLACE_')) {
            $pdo = new PDO('mysql:host=' . ($config['db_host'] ?? 'localhost') . ';port=' . (int)($config['db_port'] ?? 3306) . ';dbname=' . $config['db_name'] . ';charset=utf8mb4', (string)$config['db_user'], (string)$config['db_password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
            $stories = $pdo->query("SELECT slug,image_path FROM cms_news_posts WHERE status='published' ORDER BY id DESC LIMIT 500")->fetchAll();
        }
    }
} catch (Throwable $error) { error_log('Sitemap news lookup failed: ' . $error->getMessage()); }
$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";
$e = static fn(string $value): string => htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
foreach ($routes as $route) $xml .= '<url><loc>' . $e($origin . ($route === '/' ? '/' : $route)) . '</loc></url>' . "\n";
foreach ($stories as $story) {
    $url = $origin . '/news/' . rawurlencode((string)$story['slug']);
    $xml .= '<url><loc>' . $e($url) . '</loc>';
    if (!empty($story['image_path'])) {
        $image = str_starts_with((string)$story['image_path'], 'http') ? (string)$story['image_path'] : $origin . '/' . ltrim((string)$story['image_path'], '/');
        $xml .= '<image:image><image:loc>' . $e($image) . '</image:loc></image:image>';
    }
    $xml .= '</url>' . "\n";
}
$xml .= '</urlset>';
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
echo $xml;
