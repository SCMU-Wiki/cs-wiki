# docx2md.ps1 - 将已解压的 docx (document.xml) 转换为结构化 Markdown
# 用法: powershell -ExecutionPolicy Bypass -File docx2md.ps1 <extract_dir> <output_md> <images_dir>
param(
    [Parameter(Mandatory=$true)][string]$ExtractDir,
    [Parameter(Mandatory=$true)][string]$OutMd,
    [Parameter(Mandatory=$true)][string]$ImagesDir
)

$ErrorActionPreference = "Stop"

$xmlPath = Join-Path $ExtractDir "word\document.xml"
$relsPath = Join-Path $ExtractDir "word\_rels\document.xml.rels"

$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::UTF8)
$relsXml = [System.IO.File]::ReadAllText($relsPath, [System.Text.Encoding]::UTF8)

# rId -> Target 映射
$rels = @{}
[regex]::Matches($relsXml, '<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"') | ForEach-Object {
    $rels[$_.Groups[1].Value] = $_.Groups[2].Value
}

# 按段落拆分
$paraPattern = '<w:p(?=[ >]).*?</w:p>|<w:p(?=[ >])[^>]*/>'
$paragraphs = [regex]::Matches($xml, $paraPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)

$lines = New-Object System.Collections.Generic.List[string]
$imgCount = 0

foreach ($p in $paragraphs) {
    $pText = $p.Value

    # 段落样式
    $style = ""
    $sm = [regex]::Match($pText, '<w:pStyle w:val="([^"]+)"')
    if ($sm.Success) { $style = $sm.Groups[1].Value }

    # 跳过目录
    if ($style -match '^TOC') { continue }

    # 把硬换行和 tab 变成文本节点，便于统一提取
    $pText = $pText -replace '<w:br\s*/>', '</w:t><w:t>'
    $pText = $pText -replace '<w:tab\s*/>', '</w:t><w:t>    </w:t><w:t>'

    # 提取文本
    $texts = [regex]::Matches($pText, '<w:t[^>]*>([^<]*)</w:t>')
    $text = ($texts | ForEach-Object { $_.Groups[1].Value }) -join ""
    $text = $text -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&apos;', "'"

    # 跳过“目录”占位段落
    if ($text.Trim() -eq '目录') { continue }

    # 提取图片引用
    $imgRefs = New-Object System.Collections.Generic.List[string]
    foreach ($m in [regex]::Matches($pText, 'r:embed="([^"]+)"')) {
        $rId = $m.Groups[1].Value
        if ($rels.ContainsKey($rId)) {
            $fname = [System.IO.Path]::GetFileName($rels[$rId])
            $src = Join-Path $ExtractDir ("word\media\" + $fname)
            $dst = Join-Path $ImagesDir $fname
            if (-not (Test-Path $dst)) {
                Copy-Item $src $dst -Force
            }
            $imgRefs.Add("![图片]($fname)")
            $imgCount++
        }
    }

    # 标题层级
    $level = 0
    if ($style -match '^\d+$') { $level = [int]$style }

    if ($level -ge 1 -and $level -le 5) {
        $hashes = '#' * $level
        $clean = $text.Trim()
        if ($clean) {
            $lines.Add("")
            $lines.Add("$hashes $clean")
            $lines.Add("")
        }
    }
    else {
        $trimmed = $text.Trim()
        $hasContent = $trimmed -ne "" -or $imgRefs.Count -gt 0
        if ($hasContent) {
            if ($imgRefs.Count -gt 0) {
                if ($trimmed) { $lines.Add($trimmed) }
                foreach ($ir in $imgRefs) { $lines.Add($ir) }
                $lines.Add("")
            }
            else {
                $lines.Add($trimmed)
                $lines.Add("")
            }
        }
    }
}

$out = $lines -join "`n"
$outDir = Split-Path $OutMd -Parent
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
[System.IO.File]::WriteAllText($OutMd, $out, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "done: $OutMd (images: $imgCount)"
