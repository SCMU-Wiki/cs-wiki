# 批量压缩站点图片（GitHub Pages 国内访问优化）
Add-Type -AssemblyName System.Drawing

$base = Split-Path $PSScriptRoot -Parent
$imgDir = Join-Path $base "docs\public\images"

function Compress-Jpeg([string]$path, [int]$maxSide, [long]$quality) {
    $img = [System.Drawing.Image]::FromFile($path)
    $w = $img.Width; $h = $img.Height
    $scale = [Math]::Min(1.0, $maxSide / [Math]::Max($w, $h))
    $nw = [int]($w * $scale); $nh = [int]($h * $scale)
    if ($scale -lt 1.0) {
        $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $nw, $nh)
        $g.Dispose()
    } else {
        $bmp = New-Object System.Drawing.Bitmap($img)
    }
    $enc = [System.Drawing.Imaging.EncoderParameters]::new(1)
    $enc.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, $quality)
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $tmp = "$env:TEMP\tmp-img.jpg"
    $bmp.Save($tmp, $codec, $enc)
    $bmp.Dispose(); $img.Dispose()
    Copy-Item $tmp $path -Force
    return (Get-Item $path).Length
}

function Compress-Logo([string]$path, [int]$size) {
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $size, $size)
    $g.Dispose(); $img.Dispose()
    $tmp = "$env:TEMP\tmp-logo.png"
    $bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Copy-Item $tmp $path -Force
    return (Get-Item $path).Length
}

Write-Output "=== compress logos ==="
$logo = Join-Path $imgDir "logo.png"
$before = (Get-Item $logo).Length
$after = Compress-Logo $logo 420
Write-Output ("logo.png: " + [math]::Round($before/1KB) + "KB -> " + [math]::Round($after/1KB) + "KB")

Write-Output "=== compress jpegs ==="
Get-ChildItem $imgDir -Include "*.jpeg","*.jpg" -Recurse | ForEach-Object {
    $before = $_.Length
    $after = Compress-Jpeg $_.FullName 1200 80
    Write-Output ("{0}: {1}KB -> {2}KB" -f $_.Name, [math]::Round($before/1KB), [math]::Round($after/1KB))
}
