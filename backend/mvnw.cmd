@echo off
rem ----------------------------------------------------------------------------
rem Maven Wrapper - Windows
rem This script will download the maven-wrapper.jar if it's missing then invoke it
rem ----------------------------------------------------------------------------
setlocal
set SCRIPT_DIR=%~dp0
set WRAPPER_DIR=%SCRIPT_DIR%\.mvn\wrapper
set WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar

if not exist "%WRAPPER_DIR%" (
  mkdir "%WRAPPER_DIR%"
)

if not exist "%WRAPPER_JAR%" (
  echo maven-wrapper.jar not found, downloading...
  powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar' -OutFile '%WRAPPER_JAR%'"
  if errorlevel 1 (
    echo Failed to download maven-wrapper.jar. Please download it manually to %WRAPPER_JAR%
    exit /b 1
  )
)

java -jar "%WRAPPER_JAR%" %*
