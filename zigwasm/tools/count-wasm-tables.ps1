param(
  [Parameter(Mandatory=$true)][string]$WasmPath
)

$bytes = [IO.File]::ReadAllBytes($WasmPath)
if ($bytes.Length -lt 8) { Write-Output "invalid wasm"; exit 1 }
if (-not ($bytes[0] -eq 0 -and $bytes[1] -eq 97 -and $bytes[2] -eq 115 -and $bytes[3] -eq 109)) { Write-Output "bad magic"; exit 1 }

function ReadU32([ref]$i) {
  $result = 0
  $shift = 0
  while ($true) {
    $b = $bytes[$i.Value]
    $i.Value++
    $result = $result -bor (($b -band 0x7F) -shl $shift)
    if (($b -band 0x80) -eq 0) { break }
    $shift += 7
  }
  return $result
}

# Skip 8 bytes header (magic + version)
$i = 8
$tableCount = -1
while ($i -lt $bytes.Length) {
  $id = $bytes[$i]
  $i++
  $idx = [ref]$i
  $size = ReadU32([ref]$i)
  # After ReadU32, $i 已经被推进，无需再赋值
  if ($id -eq 4) {
    $tableCount = ReadU32([ref]$i)
    break
  } else {
    $i += $size
  }
}

if ($tableCount -ge 0) {
  Write-Output "table_count=$tableCount"
} else {
  Write-Output "no table section"
}