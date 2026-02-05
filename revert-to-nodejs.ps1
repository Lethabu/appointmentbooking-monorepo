# 1. Re-enable all routes
$disabledFiles = Get-ChildItem -Recurse -Filter "*.disabled" apps/booking/app
foreach ($file in $disabledFiles) {
    $newName = $file.FullName.Replace(".disabled", "")
    if (Test-Path $newName) {
        Remove-Item $file.FullName -Force
    }
    else {
        Rename-Item $file.FullName $newName -Force
    }
    Write-Host "Enabled $($newName)"
}

# 2. Remove runtime = 'edge' from all pages and layouts
$tsFiles = Get-ChildItem -Recurse -Include "page.tsx", "layout.tsx" apps/booking/app
foreach ($file in $tsFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if ($content -match "export const runtime = 'edge'") {
        $content = $content -replace "export const runtime = 'edge';", ""
        $content = $content -replace "export const runtime\s*=\s*'edge'", ""
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Removed edge runtime from $($file.FullName)"
    }
}
