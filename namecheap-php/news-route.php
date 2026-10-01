<?php
declare(strict_types=1);
$root = __DIR__;
$origin = 'https://cleanheightsinitiative.org';
$title = 'News and Community Stories | Clean Heights Initiative';
$description = 'Updates and stories from Clean Heights Initiative community environmental work in Kenya.';
$image = $origin . '/hero-bg.webp';
try {
    $configFile = $root . '/cms-config.php';
    if (is_file($configFile)) {
        $config = require $configFile;
        if (is_array($config) && !empty($config['db_name']) && !str_starts_with((string)$config['db_name'], 'REPLACE_')) {
            $pdo = new PDO('mysql:host=' . ($config['db_host'] ?? 'localhost') . ';port=' . (int)($config['db_port'] ?? 3306) . ';dbname=' . $config['db_name'] . ';charset=utf8mb4', (string)$config['db_user'], (string)$config['db_password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
            $slug = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($_GET['slug'] ?? ''));
            $stmt = $pdo->prepare("SELECT title,excerpt,image_path FROM cms_news_posts WHERE slug=? AND status='published' LIMIT 1");
            $stmt->execute([$slug]);
            $story = $stmt->fetch();
            if ($story) {
                $title = (string)$story['title'] . ' | Clean Heights Initiative';
                $description = (string)$story['excerpt'] ?: $description;
                if (!empty($story['image_path'])) $image = str_starts_with($story['image_path'], 'http') ? $story['image_path'] : $origin . '/' . ltrim((string)$story['image_path'], '/');
            }
        }
    }
} catch (Throwable $error) { error_log('News metadata lookup failed: ' . $error->getMessage()); }
$html = @file_get_contents($root . '/index.html');
if ($html === false) { http_response_code(503); exit('Website temporarily unavailable.'); }
$escape = static fn(string $text): string => htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$canonical = $origin . '/news/' . rawurlencode((string)($_GET['slug'] ?? ''));
$tags = '<title>' . $escape($title) . '</title>'
    . '<meta name="description" content="' . $escape($description) . '">'
    . '<link rel="canonical" href="' . $escape($canonical) . '">'
    . '<meta property="og:type" content="article"><meta property="og:site_name" content="Clean Heights Initiative">'
    . '<meta property="og:title" content="' . $escape($title) . '"><meta property="og:description" content="' . $escape($description) . '">'
    . '<meta property="og:url" content="' . $escape($canonical) . '"><meta property="og:image" content="' . $escape($image) . '">'
    . '<meta name="twitter:card" content="summary_large_image">';
$jsonLd = json_encode([
    '@context' => 'https://schema.org',
    '@type' => 'NewsArticle',
    'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $canonical],
    'headline' => $title,
    'description' => $description,
    'image' => [$image],
    'publisher' => ['@type' => 'Organization', 'name' => 'Clean Heights Initiative', 'url' => $origin, 'logo' => ['@type' => 'ImageObject', 'url' => $origin . '/chi-logo.svg']],
], JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
$html = preg_replace('/<title>[\s\S]*?<\/title>/i', '', $html, 1) ?? $html;
$html = preg_replace('/<meta\s+name=["\']description["\'][^>]*>/i', '', $html) ?? $html;
$html = preg_replace('/<link\s+rel=["\']canonical["\'][^>]*>/i', '', $html) ?? $html;
$html = preg_replace('/<meta\s+property=["\']og:[^>]*>/i', '', $html) ?? $html;
$html = str_replace('</head>', $tags . '<script type="application/ld+json">' . $jsonLd . '</script>' . "\n</head>", $html);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
echo $html;
