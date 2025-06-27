@echo off
echo ====================================================
echo   TRIQ AI Trading Platform - GitHub Push Script
echo ====================================================
echo.

echo Configuring Git with your credentials...
git config user.email "anuragmishra3407@gmail.com"
git config user.name "Anurag Mishra"

echo.
echo Current Git Status:
git status

echo.
echo Checking remote repository:
git remote -v

echo.
echo Recent commits:
git log --oneline -3

echo.
echo Attempting to push to GitHub...
echo Note: You may be prompted for GitHub authentication

git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Code pushed to GitHub successfully!
    echo.
    echo Your repository is now available at:
    echo https://github.com/anurag3407/TriqDuplicate
    echo.
) else (
    echo.
    echo ❌ Push failed. This usually means authentication is needed.
    echo.
    echo Please try one of these solutions:
    echo.
    echo 1. GitHub Desktop (Recommended):
    echo    - Download from: https://desktop.github.com/
    echo    - Sign in with your GitHub account
    echo    - Add this repository and publish
    echo.
    echo 2. Personal Access Token:
    echo    - Go to GitHub.com → Settings → Developer settings → Personal access tokens
    echo    - Generate new token with 'repo' permissions
    echo    - Run: git remote set-url origin https://YOUR_TOKEN@github.com/anurag3407/TriqDuplicate.git
    echo    - Run: git push origin main
    echo.
    echo 3. GitHub CLI:
    echo    - Install GitHub CLI from: https://cli.github.com/
    echo    - Run: gh auth login
    echo    - Run: git push origin main
    echo.
)

echo.
echo Press any key to exit...
pause >nul
