# 用 C# 实现 flood fill 抠图（PowerShell 数组/性能太坑）
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;

public static class BgStripper {
    public static void Strip(string src, string dst, int size) {
        using (var orig = new Bitmap(src)) {
            using (var bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
                using (var g = Graphics.FromImage(bmp)) {
                    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    g.DrawImage(orig, 0, 0, size, size);
                }
                var visited = new bool[size, size];
                var queue = new Queue<int>();
                for (int x = 0; x < size; x++) { queue.Enqueue(x); queue.Enqueue(x + size * (size - 1)); }
                for (int y = 0; y < size; y++) { queue.Enqueue(size * y); queue.Enqueue(size - 1 + size * y); }
                int removed = 0;
                while (queue.Count > 0) {
                    int idx = queue.Dequeue();
                    int px = idx % size, py = idx / size;
                    if (visited[px, py]) continue;
                    visited[px, py] = true;
                    Color c = bmp.GetPixel(px, py);
                    bool bg = (c.R > 235 && c.G > 235 && c.B > 235)
                           || (c.R >= 178 && c.R <= 222 && c.G >= 178 && c.G <= 222 && c.B >= 178 && c.B <= 222);
                    if (!bg) continue;
                    bmp.SetPixel(px, py, Color.FromArgb(0, c.R, c.G, c.B));
                    removed++;
                    if (px > 0) queue.Enqueue(idx - 1);
                    if (px < size - 1) queue.Enqueue(idx + 1);
                    if (py > 0) queue.Enqueue(idx - size);
                    if (py < size - 1) queue.Enqueue(idx + size);
                }
                Console.WriteLine("removed bg px: " + removed);
                bmp.Save(dst, ImageFormat.Png);
            }
        }
    }
}
"@ -ReferencedAssemblies "System.Drawing"

$base = Split-Path $PSScriptRoot -Parent; $src = Join-Path $base "docs\public\images\logo.png"
$dst = Join-Path $base "docs\public\images\logo-clean.png"
# 原文件可能被预览进程锁定，先复制到临时文件处理
$tmpSrc = Join-Path $env:TEMP "logo-src.png"
Copy-Item $src $tmpSrc -Force
[BgStripper]::Strip($tmpSrc, $dst, 1024)

# 验证
Add-Type -AssemblyName System.Drawing
$chk = New-Object System.Drawing.Bitmap($dst)
$c1 = $chk.GetPixel(5, 5)
$c2 = $chk.GetPixel(512, 5)
$c3 = $chk.GetPixel(512, 512)
Write-Output ("corner A=" + $c1.A + " topmid A=" + $c2.A + " center A=" + $c3.A)
$chk.Dispose()
Write-Output ("saved: " + (Get-Item $dst).Length + " bytes")
