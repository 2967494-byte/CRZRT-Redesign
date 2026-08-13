<?php
declare(strict_types=1);

// CLI bootstrap (scripts/*.php)
spl_autoload_register(static function (string $class): void {
    if (!str_starts_with($class, 'Asmt\\')) {
        return;
    }
    $rel = str_replace('Asmt\\', '', $class);
    $path = __DIR__ . '/lib/' . str_replace('\\', '/', $rel) . '.php';
    if (is_file($path)) {
        require_once $path;
    }
});

\Asmt\Config::load(dirname(__DIR__));
