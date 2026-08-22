# rebase sequence editor: mark target commits as reword (single-letter 'r')
param([string]$Path)
$c = Get-Content $Path -Raw -Encoding UTF8
$c = $c -replace '^pick (fa5c6e9|969d5e3)', 'r $1'
[System.IO.File]::WriteAllText($Path, $c, (New-Object System.Text.UTF8Encoding($true)))
