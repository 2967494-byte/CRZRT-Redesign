<?php
declare(strict_types=1);

namespace Asmt;

use PDO;

final class Db
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }
        Config::load();
        $dsn = Config::require('ASMT_DB_DSN');
        $user = Config::require('ASMT_DB_USER');
        $pass = Config::get('ASMT_DB_PASS', '') ?? '';
        self::$pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return self::$pdo;
    }
}
