# 批量给 md 加 frontmatter group 字段（侧边栏分组名，用于页顶显示）
$docs = "C:\Users\ASUS\Desktop\2025迎新群问题\cs-wiki\docs"
$files = @()
$files += Get-ChildItem "$docs\guide" -Recurse -Filter "*.md"
$files += Get-ChildItem "$docs" -Filter "navigation.md"

$count = 0
foreach ($f in $files) {
  $rel = $f.FullName.Replace($docs + '\', '').Replace('\', '/')
  $group = $null
  if ($rel -match '^guide/welcome\.md$' -or $rel -eq 'navigation.md') { $group = '指南总览' }
  elseif ($rel -match '^guide/admission/') { $group = '入学必看' }
  elseif ($rel -match '^guide/living/') { $group = '生活指南' }
  elseif ($rel -match '^guide/academic/') { $group = '学业' }
  elseif ($rel -match '^guide/organizations/') { $group = '学生组织' }
  if (-not $group) { continue }

  $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  if ($c -match '(?s)^---\r?\n(.*?)\r?\n---') {
    $fm = $Matches[1]
    if ($fm -match '(?m)^group:') { continue }  # 已有 group 跳过
    # 在 title 行后插入 group（若无 title 则插在开头）
    if ($fm -match '(?m)^title:.*$') {
      $line = $Matches[0]
      $newFm = $fm.Replace($line, $line + "`r`ngroup: $group")
    } else {
      $newFm = "group: $group`r`n" + $fm
    }
    $newC = $c.Replace("---`r`n" + $fm + "`r`n---", "---`r`n" + $newFm + "`r`n---")
    if ($newC -ne $c) {
      [System.IO.File]::WriteAllText($f.FullName, $newC, (New-Object System.Text.UTF8Encoding($false)))
      $count++
      Write-Output ("+ $rel -> $group")
    }
  }
}
Write-Output ("done, updated: $count")
