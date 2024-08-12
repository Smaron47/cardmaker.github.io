@echo off
REM Set the path to your Chrome executable
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"

REM Set the path to your HTML file (relative path)
set "HTML_FILE=%~dp0main.html"

REM Open Chrome with CORS disabled and load the HTML file
start "" "%CHROME_PATH%" --disable-web-security --user-data-dir="%TEMP%\chrome_dev" "%HTML_FILE%"
