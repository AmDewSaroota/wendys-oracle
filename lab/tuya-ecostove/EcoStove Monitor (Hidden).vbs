Set WshShell = CreateObject("WScript.Shell")
WshShell.Run """" & Replace(WScript.ScriptFullName, WScript.ScriptName, "") & "EcoStove Monitor.bat""", 0, False
