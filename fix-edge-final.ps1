
# Disable remaining edge runtime files
$targetFiles = @(
    "apps/booking/app/api/auth/[...nextauth]/route.ts",
    "apps/booking/app/api/bookings/[id]/route.ts",
    "apps/booking/app/api/bookings/[id]/reschedule/route.ts",
    "apps/booking/app/api/bookings/[id]/cancel/route.ts"
)

foreach ($file in $targetFiles) {
    if (Test-Path -LiteralPath $file) {
        Write-Host "Disabling $file"
        $dest = "$file.disabled"
        Move-Item -LiteralPath $file -Destination $dest -Force
    }
    else {
        Write-Host "File not found: $file"
    }
}

# Also cleanup the accidental '(' directory if not needed
# Let's check what's inside first to be safe, but it looks like a duplicate
if (Test-Path -LiteralPath "apps/booking/app/(") {
    Write-Host "Found accidental '(' directory. Checking contents..."
    Get-ChildItem -LiteralPath "apps/booking/app/(" -Recurse
    # For now just disable the routes inside it if any
    $more = Get-ChildItem -Path "apps/booking/app/(" -Recurse -Filter "route.ts"
    foreach ($m in $more) {
        Move-Item -LiteralPath $m.FullName -Destination "$($m.FullName).disabled" -Force
    }
}
