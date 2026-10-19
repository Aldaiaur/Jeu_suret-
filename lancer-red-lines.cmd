@echo off
chcp 65001 >nul
title Red Lines
cd /d "%~dp0"

echo.
echo  === RED LINES ===
echo.
echo  [1/3] Récupération des dernières modifications (branche dev)...
git pull origin dev
if errorlevel 1 (
  echo.
  echo  Le pull a échoué : modifications locales ou pas de connexion.
  echo  Le jeu va démarrer avec la version actuelle du dossier.
  echo.
)

echo.
echo  [2/3] Mise à jour des dépendances...
call npm.cmd install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo  L'installation des dépendances a échoué. Voir le message ci-dessus.
  pause
  exit /b 1
)

echo.
echo  [3/3] Lancement du jeu : le navigateur va s'ouvrir.
echo  Pour arrêter le jeu, fermez cette fenêtre.
echo.
call npm.cmd run dev -- --open
pause
