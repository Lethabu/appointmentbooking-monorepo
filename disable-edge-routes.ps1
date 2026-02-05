
$files = Get-ChildItem -Path "apps/booking/app/api" -Recurse -Filter "route.ts"
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    if ($content -match "export const runtime = 'edge'") {
        Write-Host "Disabling $($file.FullName)"
        git mv "$($file.FullName)" "$($file.FullName).disabled"
    }
}
