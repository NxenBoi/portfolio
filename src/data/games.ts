/**
 * Games you worked on: just paste the Roblox game link.
 *
 * At build time (on Vercel, every deploy) the site fetches each game's
 * thumbnail, title, description, visits, likes and favorites from Roblox's
 * public APIs. Redeploy to refresh the numbers.
 *
 * Each game becomes its own stop in the 3D world. Add, remove or reorder freely.
 *
 * Optional overrides, if you don't like what Roblox returns:
 *   title:       replaces the game name (update tags like "[UPDATE 1]" are
 *                already stripped automatically)
 *   description: replaces the auto-shortened Roblox description
 */
export interface GameEntry {
  url: string;
  title?: string;
  description?: string;
}

export const games: GameEntry[] = [
  { url: 'https://www.roblox.com/games/100576592245399/1-Swim-Speed-Every-Step' },
  { url: 'https://www.roblox.com/games/99341262710950/Dont-Wake-Verity' },
  { url: 'https://www.roblox.com/games/74168329160622/Steal-A-Sweet' },
  { url: 'https://www.roblox.com/games/106989368526728/Destroy-a-Planet' },
];
