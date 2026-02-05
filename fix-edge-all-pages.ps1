$pages = Get-ChildItem -Recurse -Filter "page.tsx" apps/booking/app
foreach ($page in $pages) {
    $content = [System.IO.File]::ReadAllText($page.FullName)
    if ($content -notmatch "export const runtime = 'edge'") {
        $content = $content + "`nexport const runtime = 'edge';`n"
        [System.IO.File]::WriteAllText($page.FullName, $content)
        Write-Host "Updated $($page.FullName)"
    }
}
