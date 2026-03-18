Set WshShell = CreateObject("WScript.Shell")
WshShell.Run """" & Replace(WScript.ScriptFullName, WScript.ScriptName, "") & "BiomassStove Monitor.bat""", 0, False
