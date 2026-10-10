// Choix du navigateur pour les outils Playwright : variable CHROMIUM, sinon le navigateur de Playwright,
// sinon un Chromium déjà installé sur la machine (utile quand la version de Playwright n’a pas le sien).
import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';

const CANDIDATS = ['/opt/pw-browsers/chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'];

export function navigateurInstalle(): { executablePath?: string } {
  if (process.env.CHROMIUM) return { executablePath: process.env.CHROMIUM };
  if (existsSync(chromium.executablePath())) return {};
  const trouve = CANDIDATS.find(c => existsSync(c));
  return trouve ? { executablePath: trouve } : {};
}
