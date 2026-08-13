<?php
declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
    if (!str_starts_with($class, 'Asmt\\')) {
        return;
    }
    $rel = str_replace('Asmt\\', '', $class);
    $path = dirname(__DIR__, 2) . '/api/lib/' . str_replace('\\', '/', $rel) . '.php';
    if (is_file($path)) {
        require_once $path;
    }
});

\Asmt\Config::load(dirname(__DIR__, 2));
\Asmt\Auth::startSession();
