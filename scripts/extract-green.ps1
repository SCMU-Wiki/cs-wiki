# 绿色提取：只保留图中的绿色像素（双子塔/底座），其余全部透明
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;

public static class GreenExtractor {
    public static void Extract(string src, string dst, int size) {
        using (var orig = new Bitmap(src)) {
            using (var bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
                using (var g = Graphics.FromImage(bmp)) {
                    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    g.DrawImage(orig, 0, 0, size, size);
                }
                int kept = 0;
                for (int y = 0; y < size; y++) {
                    for (int x = 0; x < size; x++) {
                        Color c = bmp.GetPixel(x, y);
                        // green: G notably higher than R and B (deep green to bright green)
                        bool isGreen = c.G > 60 && (c.G - c.R) > 20 && (c.G - c.B) > 10;
                        if (!isGreen) {
                            bmp.SetPixel(x, y, Color.FromArgb(0, c.R, c.G, c.B));
                        } else {
                            kept++;
                        }
                    }
                }
                Console.WriteLine("kept green px: " + kept);
                bmp.Save(dst, ImageFormat.Png);
            }
        }
    }
}
"@ -ReferencedAssemblies "System.Drawing"

$base = Split-Path $PSScriptRoot -Parent
$src = Join-Path $base "docs\public\images\logo.png"
$dst = Join-Path $base "docs\public\images\logo-green.png"
$tmpSrc = Join-Path $env:TEMP "logo-src.png"
Copy-Item $src $tmpSrc -Force
[GreenExtractor]::Extract($tmpSrc, $dst, 1024)

# 验证
$chk = New-Object System.Drawing.Bitmap($dst)
$c1 = $chk.GetPixel(5, 5); $c2 = $chk.GetPixel(512, 512); $c3 = $chk.GetPixel(512, 300)
Write-Output ("corner A=" + $c1.A + " center A=" + $c2.A + " mid A=" + $c3.A)
$chk.Dispose()
Write-Output ("saved: " + (Get-Item $dst).Length + " bytes")
