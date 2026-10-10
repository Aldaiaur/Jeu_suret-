// Mesure d'équilibre par le robot prudent. Ignoré par défaut ; lancé par tools/equilibre.ts (ROBOT=1).
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { jouerPrudent } from './bot-prudent';

it.skipIf(!process.env.ROBOT)('robot prudent', () => {
  const r = jouerPrudent(Number(process.env.ROBOT_PARTIES || 45), ['facile', 'normal', 'difficile']);
  writeFileSync(process.env.ROBOT_SORTIE || 'robot.json', JSON.stringify(r));
}, 600000);
