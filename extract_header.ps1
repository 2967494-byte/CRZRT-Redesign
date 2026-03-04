$files = Get-ChildItem -Filter *.html
foreach ($file in $files) {
    if ($file.Name -eq 'header.html') { continue }
    $content = Get-Content $file.FullName -Raw
    
    if ($content -match '(?s)(<header class="header">.*?</header>)') {
        $newContent = [regex]::Replace($content, '(?s)<header class="header">.*?</header>', '<div id="global-header"></div>`n    <script src="header.js"></script>')
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Replaced header in $($file.Name)"
    }
}
