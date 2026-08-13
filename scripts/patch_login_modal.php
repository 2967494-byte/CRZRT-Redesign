<?php
declare(strict_types=1);

/**
 * CLI: php scripts/patch_login_modal.php
 * Replaces #loginModal markup on portal HTML pages (two-block login per TZ §5.1.2).
 */

$root = dirname(__DIR__);
$newModal = <<<'HTML'
      <div id="loginModal" class="login-popover login-popover--split">
        <button id="closeLoginModal" class="btn-modal-close" aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 class="modal-title">Вход в систему</h2>
        <div class="login-split">
          <div class="login-split__block">
            <h3 class="login-split__heading">Администратор сайта</h3>
            <p class="login-split__hint">Вход в панель управления порталом</p>
            <div id="loginError" class="modal-error">Неверный e-mail или пароль</div>
            <form id="loginForm">
              <div class="form-group">
                <label for="loginEmail">E-mail</label>
                <input type="email" id="loginEmail" class="form-control" required placeholder="example@mail.ru" autocomplete="username">
              </div>
              <div class="form-group">
                <label for="loginPass">Пароль</label>
                <input type="password" id="loginPass" class="form-control" required placeholder="********" autocomplete="current-password">
              </div>
              <button type="submit" class="btn-save" style="width: 100%; margin-top: 12px;">Войти</button>
            </form>
          </div>
          <div class="login-split__divider" aria-hidden="true"></div>
          <div class="login-split__block">
            <h3 class="login-split__heading">Участник тестирования</h3>
            <p class="login-split__hint">Модуль Assessment (отдельный сервис)</p>
            <a id="asmtLoginLink" class="btn-asmt btn-asmt--primary" href="https://test.zakupki.tatar/login.html">Войти как участник</a>
            <a id="asmtRegisterLink" class="btn-asmt btn-asmt--ghost" href="https://test.zakupki.tatar/register.html">Регистрация</a>
          </div>
        </div>
      </div>
HTML;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)
);

$changed = 0;
$skipped = 0;
foreach ($iterator as $file) {
    /** @var SplFileInfo $file */
    if (!$file->isFile() || strtolower($file->getExtension()) !== 'html') {
        continue;
    }
    $path = $file->getPathname();
    // skip assessment app pages
    if (str_contains($path, DIRECTORY_SEPARATOR . 'assessment' . DIRECTORY_SEPARATOR)) {
        continue;
    }
    $html = file_get_contents($path);
    if ($html === false || !str_contains($html, 'id="loginModal"')) {
        continue;
    }
    $updated = preg_replace(
        '/<div id="loginModal" class="login-popover">.*?<\/div>\s*(?=\s*<\/div>\s*<\/div>\s*<\/header>)/s',
        $newModal,
        $html,
        1,
        $count
    );
    if (!$count) {
        // fallback: replace until closing of loginModal (non-greedy balance by marker)
        $updated = preg_replace(
            '/<div id="loginModal"[\s\S]*?<\/form>\s*<\/div>/',
            trim($newModal),
            $html,
            1,
            $count
        );
    }
    if (!$count || $updated === null) {
        fwrite(STDERR, "SKIP (pattern): {$path}\n");
        $skipped++;
        continue;
    }
    if ($updated === $html) {
        $skipped++;
        continue;
    }
    // Ensure asmt-portal-config.js is loaded near landing.js if present
    if (str_contains($updated, 'assets/js/landing.js') && !str_contains($updated, 'asmt-portal-config.js')) {
        $updated = str_replace(
            'assets/js/landing.js',
            'assets/js/asmt-portal-config.js"></script>' . "\n" . '<script src="assets/js/landing.js',
            $updated
        );
        // fix broken if path was relative differently
        if (substr_count($updated, 'asmt-portal-config.js') === 0) {
            // ignore
        }
    }
    // course pages may use ../assets — but current generator uses assets/ from rewrite; keep both
    if (str_contains($path, DIRECTORY_SEPARATOR . 'courses' . DIRECTORY_SEPARATOR)) {
        // ensure relative path works if no rewrite
        if (str_contains($updated, 'src="assets/js/asmt-portal-config.js"')
            && str_contains($updated, '../assets/js/landing.js')) {
            $updated = str_replace(
                'src="assets/js/asmt-portal-config.js"',
                'src="../assets/js/asmt-portal-config.js"',
                $updated
            );
        }
    }
    file_put_contents($path, $updated);
    echo "OK {$path}\n";
    $changed++;
}

echo "Changed: {$changed}, skipped: {$skipped}\n";
