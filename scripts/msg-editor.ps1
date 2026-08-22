# rebase message editor: remove "仿上交" wording from commit message
param([string]$Path)
$c = Get-Content $Path -Raw -Encoding UTF8
$c = $c -replace '页面历史仿上交（', '页面历史（'
$c = $c -replace '（仿上交结构）', ''
[System.IO.File]::WriteAllText($Path, $c, (New-Object System.Text.UTF8Encoding($true)))
