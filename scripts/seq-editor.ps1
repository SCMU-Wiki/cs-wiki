# rebase sequence editor: mark target commits as reword
param([string]$Path)
$c = Get-Content $Path -Raw -Encoding UTF8
$c = $c -replace '^pick (fa5c6e9|969d5e3)', 'reword $1'
[System.IO.File]::WriteAllText($Path, $c, (New-Object System.Text.UTF8Encoding($true)))
