$ErrorActionPreference = "Stop"

$taskName = "vibe2026-servers-autostart"
$scriptPath = "e:\evan\Desktop\vibe2026\scripts\start-servers.ps1"
$userId = "$env:USERDOMAIN\$env:USERNAME"

if (!(Test-Path $scriptPath)) {
  throw "Startup script not found: $scriptPath"
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""
$triggerAtLogOn = New-ScheduledTaskTrigger -AtLogOn -User $userId
$triggerAtStartup = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

try {
  Register-ScheduledTask -TaskName $taskName -Action $action -Trigger @($triggerAtLogOn, $triggerAtStartup) -Principal $principal -Settings $settings -Force | Out-Null
}
catch {
  Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $triggerAtLogOn -Principal $principal -Settings $settings -Force | Out-Null
}
Start-ScheduledTask -TaskName $taskName

Write-Output "Scheduled task installed and started: $taskName"
