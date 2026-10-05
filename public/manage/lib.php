<?php
declare(strict_types=1);

function content_dir(): string
{
    return dirname(__DIR__) . '/content';
}

function seed_dir(): string
{
    return __DIR__ . '/seed';
}

function config_path(): string
{
    return __DIR__ . '/config.php';
}

function ensure_content(): void
{
    $dir = content_dir();
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    foreach (['admissions', 'info', 'eligibility', 'notices', 'site-texts'] as $name) {
        $target = "$dir/$name.json";
        $source = seed_dir() . "/$name.json";
        if (!file_exists($target) && file_exists($source)) {
            copy($source, $target);
        }
    }
}

function load_json(string $name, array $default = []): array
{
    $path = content_dir() . "/$name.json";
    if (!file_exists($path)) {
        return $default;
    }
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) ? $data : $default;
}

function save_json(string $name, array $data): void
{
    $path = content_dir() . "/$name.json";
    $tmp = $path . '.tmp';
    file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n", LOCK_EX);
    rename($tmp, $path);
}

function h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function check_csrf(): void
{
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) {
        http_response_code(400);
        exit('অবৈধ অনুরোধ। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
    }
}

function valid_date(string $value): bool
{
    if ($value === '') {
        return true;
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        return false;
    }
    return checkdate((int) substr($value, 5, 2), (int) substr($value, 8, 2), (int) substr($value, 0, 4));
}

function nullable(string $value): ?string
{
    $value = trim($value);
    return $value === '' ? null : $value;
}

function nullable_number(string $value): ?float
{
    $value = trim($value);
    return $value === '' ? null : (float) $value;
}

function text_lines(string $value): array
{
    $lines = preg_split('/\r\n|\r|\n/', $value) ?: [];
    return array_values(array_filter(array_map('trim', $lines), fn($line) => $line !== ''));
}

function valid_id(string $value): bool
{
    return (bool) preg_match('/^[a-z0-9-]+$/', $value);
}

/** Returns the accounts map: username => ['hash' => ..., 'role' => 'admin'|'editor']. */
function load_users(): array
{
    if (!file_exists(config_path())) {
        return [];
    }
    $config = require config_path();
    if (isset($config['username'], $config['hash'])) {
        return [$config['username'] => ['hash' => $config['hash'], 'role' => 'admin']];
    }
    return $config['users'] ?? [];
}

function save_users(array $users): void
{
    $config = "<?php\nreturn " . var_export(['users' => $users], true) . ";\n";
    file_put_contents(config_path(), $config, LOCK_EX);
}

function log_action(string $user, string $text): void
{
    $line = date('Y-m-d H:i:s') . " $user $text\n";
    file_put_contents(__DIR__ . '/activity.log', $line, FILE_APPEND | LOCK_EX);
}
