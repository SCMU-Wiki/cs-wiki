# 给所有 md 页面顶部加一级标题（H1 = frontmatter title），已有 H1 则替换
$root = "C:\Users\ASUS\Desktop\2025迎新群问题\cs-wiki\docs"
$files = Get-ChildItem $root -Recurse -Filter "*.md" | Where-Object { $_.Name -ne 'index.md' }
$changed = 0

foreach ($f in $files) {
  $lines = [System.IO.File]::ReadAllLines($f.FullName, [System.Text.Encoding]::UTF8)
  # 提取 frontmatter title
  $title = $null
  foreach ($line in $lines) {
    if ($line -match '^title:\s*(.+?)\s*$') { $title = $Matches[1]; break }
  }
  if (-not $title) { continue }

  # 找到 frontmatter 结束位置（第二个 --- 行）
  $fmEnd = -1
  $dashes = 0
  for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i].Trim() -eq '---') {
      $dashes++
      if ($dashes -eq 2) { $fmEnd = $i; break }
    }
  }
  if ($fmEnd -lt 0) { continue }

  $rest = $lines[($fmEnd + 1)..($lines.Length - 1)]
  # 跳过开头的空行
  $firstContent = -1
  for ($j = 0; $j -lt $rest.Length; $j++) {
    if ($rest[$j].Trim() -ne '') { $firstContent = $j; break }
  }
  if ($firstContent -lt 0) { continue }

  $h1 = "# $title"
  $changedThis = $false
  if ($rest[$firstContent] -match '^#\s') {
    # 已有 H1：替换
    if ($rest[$firstContent] -ne $h1) {
      $rest[$firstContent] = $h1
      $changedThis = $true
    }
  } else {
    # 无 H1：在 frontmatter 后插入
    $rest = @($h1, '') + $rest
    $changedThis = $true
  }

  if ($changedThis) {
    $newLines = $lines[0..$fmEnd] + $rest
    [System.IO.File]::WriteAllLines($f.FullName, $newLines, (New-Object System.Text.UTF8Encoding($false)))
    $changed++
    Write-Output ("updated: " + $f.Name + " -> " + $h1)
  }
}
Write-Output ("total updated: " + $changed)
