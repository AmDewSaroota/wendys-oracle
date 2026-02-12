@echo off
echo ==========================================
echo   Meeting Recorder - WEnDyS
echo ==========================================
echo.

set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%
set TIMESTAMP=%TIMESTAMP: =0%
set OUTPUT=C:\Users\NDFlt02\ψ\learn\repo\github.com\AmDewSaroota\wendys-oracle\ψ\active\meeting_%TIMESTAMP%.wav

echo Recording to: %OUTPUT%
echo.
echo Mic: Microphone (Nubwo X700)
echo.
echo *** Press Q then Enter to stop recording ***
echo.

ffmpeg -f dshow -i audio="Microphone (Nubwo X700)" -ac 1 -ar 16000 -acodec pcm_s16le "%OUTPUT%"

echo.
echo Recording saved: %OUTPUT%
echo.
echo Next step: send file path to WEnDyS for transcription
pause
