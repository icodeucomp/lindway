@echo off
setlocal enabledelayedexpansion

echo Looking for PNG files matching "people (*).png"...

for /f "tokens=1,2 delims=()" %%a in ('dir /b "people (*).png"') do (
    set "filename=%%a"
    set "number=%%b"
    rem Remove the .png extension from the number
    set "number=!number:.png=!"
    echo Renaming "people (!number!).png" to "people-!number!.png"
    ren "people (!number!).png" "people-!number!.png"
)

echo Files renamed successfully!